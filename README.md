# Uzumaki — Gestión de turnos

Aplicación web para planificar turnos, gestionar personal y procesar solicitudes operativas. PostgreSQL es la fuente de verdad; el JSON histórico no forma parte del repositorio ni de la operación normal.

## Desarrollo local

1. Crear `.env` con `DATABASE_URL` o `DATABASE_PUBLIC_URL` de PostgreSQL.
2. Instalar dependencias y preparar la base:

```bash
python3 -m pip install -r requirements.txt
python3 scripts/migrate_postgres.py
python3 scripts/import_json_to_postgres.py # sólo para la primera carga histórica
python3 scripts/diagnose_postgres.py # conexión, latencia, esquema e índices
LOG_LEVEL=INFO python3 -u server.py
```

Abrir `http://127.0.0.1:53123`.

La terminal muestra logs JSON de inicio, peticiones HTTP, duración, usuario
autenticado, operaciones de planificación y rechazos de validación. Usá
`LOG_LEVEL=DEBUG` durante diagnóstico; `INFO` es el valor recomendado.

## Arquitectura

```text
server.py       API HTTP, autenticación y archivos estáticos
database.py     transacciones, permisos y reglas de persistencia PostgreSQL
migrations/     esquema versionado y consultas de validación
scripts/        migración, importación y prueba de conexión
src/            interfaz JavaScript y estilos
docs/           operación y plan de evolución
```

Las acciones críticas se comunican mediante comandos de API: crear semanas, asignar personal, cargar francos y gestionar solicitudes. La API valida permisos y la versión de la semana para evitar sobrescribir cambios concurrentes.

## Railway

En Railway, configurá `DATABASE_URL` con la URL privada del servicio PostgreSQL. El contenedor aplica las migraciones pendientes antes de iniciar la API; un bloqueo PostgreSQL evita carreras entre réplicas. Si una migración falla, el servicio no inicia con un esquema incompleto. Para ejecutar desde una computadora, usá la URL pública con `sslmode=require`. Consultá [docs/postgres-operations.md](docs/postgres-operations.md) para migración, validaciones y endpoints.

Variables útiles de diagnóstico:

- `LOG_LEVEL=INFO`: eventos HTTP y operativos.
- `DATABASE_LOG_ALL=true`: resumen de cada operación PostgreSQL.
- `DATABASE_SLOW_QUERY_MS=250`: umbral para advertencias de queries lentas.
- `DATABASE_SLOW_OPERATION_MS=750`: umbral para operaciones lentas, incluida espera del pool.
- `HTTP_SLOW_REQUEST_MS=1000`: umbral para requests HTTP lentos.

No publiques `.env`, respaldos ni datos personales. Rotá las credenciales de base de datos antes de producción.
