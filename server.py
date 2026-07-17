from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import tempfile
from threading import Lock


ROOT = Path(__file__).resolve().parent
DB_PATH = ROOT / "data" / "uzumaki-db.json"
STATE_WRITE_LOCK = Lock()


class UzumakiHandler(SimpleHTTPRequestHandler):
    def _send_json(self, status, payload):
        body = json.dumps(payload, ensure_ascii=False, indent=2).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path == "/api/state":
            if not DB_PATH.exists():
                return self._send_json(404, {"error": "Base JSON no creada"})
            try:
                with STATE_WRITE_LOCK:
                    payload = json.loads(DB_PATH.read_text(encoding="utf-8"))
                return self._send_json(200, payload)
            except json.JSONDecodeError:
                return self._send_json(500, {"error": "Base JSON inválida"})
        return super().do_GET()

    def do_PUT(self):
        if self.path != "/api/state":
            return self._send_json(404, {"error": "Endpoint no encontrado"})
        try:
            length = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
        except (ValueError, json.JSONDecodeError):
            return self._send_json(400, {"error": "JSON inválido"})

        with STATE_WRITE_LOCK:
            try:
                current = json.loads(DB_PATH.read_text(encoding="utf-8")) if DB_PATH.exists() else {}
            except json.JSONDecodeError:
                return self._send_json(500, {"error": "Base JSON inválida"})

            current_revision = current.get("stateRevision", 0)
            expected_revision = payload.get("stateRevision")
            if not isinstance(expected_revision, int) or expected_revision != current_revision:
                return self._send_json(409, {
                    "error": "stateConflict",
                    "message": "El estado cambió desde que esta pestaña lo cargó.",
                    "currentRevision": current_revision,
                    "currentUpdatedAt": current.get("stateUpdatedAt"),
                })

            payload["stateRevision"] = current_revision + 1
            payload["stateUpdatedAt"] = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
            DB_PATH.parent.mkdir(parents=True, exist_ok=True)
            with tempfile.NamedTemporaryFile("w", encoding="utf-8", dir=DB_PATH.parent, delete=False) as tmp:
                json.dump(payload, tmp, ensure_ascii=False, indent=2)
                tmp.write("\n")
                tmp_path = Path(tmp.name)
            tmp_path.replace(DB_PATH)

        return self._send_json(200, {
            "ok": True,
            "path": str(DB_PATH.relative_to(ROOT)),
            "stateRevision": payload["stateRevision"],
            "stateUpdatedAt": payload["stateUpdatedAt"],
        })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "53123"))
    server = ThreadingHTTPServer(("127.0.0.1", port), UzumakiHandler)
    print(f"Uzumaki corriendo en http://127.0.0.1:{port}")
    print(f"Base JSON: {DB_PATH}")
    server.serve_forever()
