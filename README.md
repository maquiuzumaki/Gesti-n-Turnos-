# Uzumaki — Gestión operativa

Primer MVP navegable basado en `Directivas.md` y la documentación de `docs/`, con una identidad visual cálida en naranja y amarillo.

## Cómo abrirlo

La aplicación usa módulos JavaScript, por lo que conviene servirla desde un servidor local:

```bash
python3 -m http.server 4173
```

Luego abrir `http://localhost:4173`.

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
- Persistencia local en el navegador mediante `localStorage`.
- Diseño responsive para escritorio y celular.

## Estructura

```text
index.html
src/
  app.js                 # Interfaz y eventos
  data/mockData.js       # Datos iniciales
  services/store.js      # Persistencia local
  services/permissions.js# Reglas de acceso por rol
  styles/app.css         # Sistema visual responsive
docs/                    # Definición funcional del producto
```

## Alcance técnico

Esta versión es un prototipo frontend: la autenticación, los datos y los archivos adjuntos son simulados. Para producción, el próximo paso es incorporar backend, base de datos, almacenamiento real de documentos y contraseñas seguras.
