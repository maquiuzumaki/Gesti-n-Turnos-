# Uzumaki — Gestión operativa

Primer MVP navegable basado en `Directivas.md` y la documentación de `docs/`, con una identidad visual cálida en naranja y amarillo.

## Cómo abrirlo

La aplicación usa módulos JavaScript y persiste datos en un archivo JSON local mediante el servidor incluido:

```bash
python3 server.py
```

Luego abrir `http://127.0.0.1:53123`.

No requiere instalar dependencias ni ejecutar un proceso de compilación.

## Accesos de demostración

El acceso usa la contraseña `demo123`:

| Usuario | Perfil |
| --- | --- |
| `maqui` | Maqui Uzumaki · Creadora y encargada del turno mañana |

## Estructura del servicio

La estructura oficial documentada del servicio está compuesta por **16 personas**:

- 13 empleados operativos.
- 2 encargadas/nutricionistas.
- 1 supervisora general.

Los perfiles administrativos se mantienen con nombres genéricos: encargada turno mañana, encargada turno tarde y supervisora.

## Funciones incluidas

- Inicio de sesión y navegación adaptada por rol.
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
- Respaldo automático en el navegador mediante `localStorage` si el servidor no está disponible.
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

Esta versión es un prototipo con servidor local: los datos se guardan en `data/uzumaki-db.json` cuando se abre con `python3 server.py`. Si se abre como sitio estático sin ese servidor, la app conserva un respaldo en `localStorage`, pero no puede modificar archivos del proyecto. Para producción, el próximo paso es incorporar autenticación segura, base de datos real, almacenamiento de documentos y contraseñas cifradas.
