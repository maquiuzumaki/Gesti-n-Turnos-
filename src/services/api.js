const CSRF_COOKIE = "uzumaki_csrf";
const DEFAULT_TIMEOUT_MS = 15_000;

export const isHttpApp = () => window.location.protocol.startsWith("http");

const csrfToken = () => document.cookie
  .split(";")
  .map((item) => item.trim())
  .find((item) => item.startsWith(`${CSRF_COOKIE}=`))
  ?.slice(CSRF_COOKIE.length + 1) || "";

export const csrfHeaders = () => {
  const token = csrfToken();
  return token ? { "X-CSRF-Token": token } : {};
};

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

// Cliente único para comandos de la app. Mantiene CSRF, caché y mensajes de
// error consistentes sin repartir fetch() por las pantallas.
export async function requestApi(path, { method = "GET", payload, headers = {}, timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  const controller = new AbortController();
  const startedAt = performance.now();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  console.info("[api] request_started", { method, path, timeoutMs });
  try {
    const response = await fetch(path, {
      method,
      cache: "no-store",
      credentials: "same-origin",
      signal: controller.signal,
      headers: {
        ...(payload !== undefined ? { "Content-Type": "application/json" } : {}),
        ...csrfHeaders(),
        ...headers,
      },
      body: payload === undefined ? undefined : JSON.stringify(payload),
    });
    const result = await readJson(response);
    const requestId = response.headers.get("X-Request-Id");
    const durationMs = Math.round(performance.now() - startedAt);
    console.info("[api] request_completed", { method, path, status: response.status, durationMs, requestId });
    if (!response.ok) {
      const error = new Error(result.message || "No se pudo completar la operación.");
      error.code = result.error;
      error.status = response.status;
      error.requestId = requestId;
      error.durationMs = durationMs;
      throw error;
    }
    return result;
  } catch (error) {
    const durationMs = Math.round(performance.now() - startedAt);
    if (error.name === "AbortError") {
      const timeoutError = new Error("La operación tardó demasiado. Revisá la conexión e intentá nuevamente.");
      timeoutError.code = "requestTimeout";
      timeoutError.status = 0;
      timeoutError.durationMs = durationMs;
      console.error("[api] request_timeout", { method, path, durationMs });
      throw timeoutError;
    }
    console.error("[api] request_failed", {
      method,
      path,
      status: error.status || 0,
      code: error.code || "networkError",
      durationMs,
      requestId: error.requestId || null,
    });
    if (error instanceof TypeError && !error.status) {
      const networkError = new Error("No se pudo conectar con el servidor. Verificá Railway y la conexión a internet.");
      networkError.code = "networkError";
      networkError.status = 0;
      networkError.durationMs = durationMs;
      throw networkError;
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function authenticate(username, password) {
  if (!isHttpApp()) throw new Error("Abrí la app desde server.py para iniciar sesión.");
  const result = await requestApi("/api/auth/login", { method: "POST", payload: { username, password } });
  return result.user;
}

export async function endSession() {
  if (!isHttpApp()) return;
  try {
    await requestApi("/api/auth/logout", { method: "POST" });
  } catch (error) {
    if (error.status !== 401) throw error;
  }
}
