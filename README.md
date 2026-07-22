# Uzumaki — Gestión operativa

Primer MVP navegable basado en `Directivas.md` y la documentación de `docs/`, con una identidad visual cálida en naranja y amarillo.

## Cómo abrirlo

La aplicación usa módulos JavaScript y persiste datos en un archivo JSON local mediante el servidor incluido:

```bash
python3 server.py
```

Luego abrir `http://127.0.0.1:53123`.

No requiere instalar dependencias ni ejecutar un proceso de compilación.

## Acceso

El servidor inicia sesión contra los usuarios almacenados en `data/uzumaki-db.json`, guarda sus contraseñas como hashes PBKDF2 y crea una sesión HTTP. Las credenciales ya no se envían al navegador junto con la base operativa.

## Estructura del servicio

La estructura oficial documentada del servicio está compuesta por **16 personas**:

- 13 empleados operativos.
- 2 encargadas/nutricionistas.
- 1 supervisora general.

Los perfiles administrativos se mantienen con nombres genéricos: encargada turno mañana, encargada turno tarde y supervisora.

## Funciones incluidas

- Inicio de sesión con sesión HTTP y navegación adaptada por rol.
- Dashboard administrativo y resumen personal.
- Grilla semanal oficial y borrador editable.
- Semana real de referencia del 29 de junio al 5 de julio de 2026, cargada sólo como ejemplo visual y funcional.
- Publicación de nuevas versiones de grilla.
- Estructura oficial de 16 personas: 13 empleados operativos, 2 encargadas/nutricionistas y 1 supervisora.
- Creación, filtrado, aprobación y rechazo de solicitudes.
- Carga opcional de certificados en el formulario de solicitud.
- Notificaciones internas y marcado como leído.
- Historial de auditoría.
- Identidad visual Uzumaki consistente en naranja y amarillo.
- Persistencia en archivo JSON local mediante `data/uzumaki-db.json`.
- Exportación e importación manual del estado completo en un archivo JSON.
- Alta y baja de perfiles de personal desde la app.
- Alta y baja de usuarios de acceso desde la app.
- Diseño responsive para escritorio y celular.

## Estructura

```text
index.html
server.py              # Servidor local con API para escribir la base JSON
data/
  uzumaki-db.json      # Base de datos local persistente
src/
  app.js                 # Interfaz y eventos
  data/mockData.js       # Datos iniciales
  services/store.js      # Persistencia local y respaldo JSON
  services/permissions.js# Reglas de acceso por rol
  styles/app.css         # Sistema visual responsive
docs/                    # Definición funcional del producto
```

## Alcance técnico

Esta versión guarda los datos en `data/uzumaki-db.json`. El servidor protege la sesión, no devuelve hashes ni contraseñas al frontend y bloquea el acceso web directo a la base de datos y a archivos internos.

## Publicar en un servidor

La aplicación incluye una configuración con Docker Compose y Caddy. Caddy entrega HTTPS automático y reenvía el tráfico a la aplicación, que queda aislada de Internet. Es adecuada para una instancia única del MVP.

Antes de publicar necesitás:

- Un servidor Linux con Docker Engine y Docker Compose Plugin.
- Un dominio propio cuyo registro `A` (y `AAAA`, si corresponde) apunte a la IP del servidor.
- Los puertos TCP `80` y `443` abiertos en el firewall y en el proveedor del servidor.
- Copiar el proyecto al servidor sin publicar el archivo `.env` ni los respaldos de `data/backups/`.

En el servidor:

```bash
cp .env.example .env
# Editar .env y reemplazar DOMAIN por el dominio real.
docker compose up -d --build
docker compose logs -f
```

Al iniciar, Caddy solicita y renueva el certificado HTTPS. El volumen `./data:/app/data` mantiene `uzumaki-db.json` al actualizar los contenedores. Hacé una copia de `data/uzumaki-db.json` antes de cada actualización y guardala fuera del servidor.

Para desarrollo local se mantiene el comando original:

```bash
python3 server.py
```

La variable `HOST` permite elegir la interfaz de escucha; localmente queda restringida a `127.0.0.1`. En Docker se usa `0.0.0.0`, pero sólo Caddy accede al puerto interno. `COOKIE_SECURE=true` se activa en el despliegue para que la cookie de sesión sólo viaje mediante HTTPS.

## Pendientes antes de operar en producción

- Reemplazar la base JSON por PostgreSQL y crear migraciones. Un archivo JSON sirve para una sola instancia y no permite consultas, respaldos ni recuperación con el nivel de una base de datos real.
- Mover las sesiones de memoria a Redis o a la base de datos. Actualmente se invalidan cuando la aplicación se reinicia y no se puede escalar a varias instancias.
- Dividir `PUT /api/state` en recursos y permisos específicos. Hoy la interfaz envía el estado completo; funciona para el MVP, pero dificulta auditoría fina, validaciones y concurrencia.
- Añadir recuperación/restablecimiento de contraseña, verificación de identidad, límites de intentos de inicio de sesión y registro de eventos de seguridad.
- Incorporar pruebas automáticas (API, permisos, planificación y flujo de login), chequeo de dependencias y un pipeline de despliegue.
- Definir copias de seguridad automáticas, retención, restauración probada y monitoreo (disco, disponibilidad, errores y vencimiento del dominio/certificado).
- Revisar legalmente el tratamiento de datos personales y certificados adjuntos: control de acceso, cifrado en reposo, plazos de retención y política de privacidad.
