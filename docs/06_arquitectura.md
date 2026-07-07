# 06. Arquitectura del proyecto

## 1. Objetivo

Definir la arquitectura real del MVP de Uzumaki de forma simple, clara y mantenible.

La primera versión es una aplicación frontend construida con HTML, CSS y JavaScript. Utiliza datos mockeados y persistencia local para validar el producto, la experiencia de usuario y las reglas del servicio antes de incorporar infraestructura de producción.

## 2. Principios técnicos

- Priorizar claridad y simplicidad.
- Mantener separadas la interfaz, los datos, la persistencia y los permisos.
- Usar módulos nativos de JavaScript.
- Evitar dependencias y procesos de compilación innecesarios.
- Representar las reglas operativas sin automatizaciones no validadas.
- Conservar una estructura que pueda evolucionar sin anticipar complejidad.

## 3. Stack actual del MVP

- HTML para la estructura y el punto de entrada.
- CSS para el sistema visual y el diseño responsive.
- JavaScript con módulos ES para la interfaz y el comportamiento.
- Datos mockeados para empleados, catálogos, francos y usuarios de demostración.
- `localStorage` para persistencia local del estado del MVP.
- `sessionStorage` para conservar la sesión demostrativa en la pestaña actual.
- Servidor HTTP local sin proceso de build.

El MVP no utiliza frameworks de interfaz, tipado adicional, gestor de estado externo ni bundler.

## 4. Estructura actual del proyecto

```text
index.html
Directivas.md
README.md
src/
  app.js
  data/
    mockData.js
  services/
    store.js
    permissions.js
  styles/
    app.css
docs/
  01_vision.md
  02_mvp.md
  03_reglas_de_negocio.md
  04_usuarios_y_permisos.md
  05_experiencia_de_usuario_y_pantallas.md
  06_arquitectura.md
  07_modelo_de_datos.md
```

## 5. Responsabilidad de cada archivo

### `index.html`

Es el punto de entrada de la aplicación. Define la estructura mínima del documento, carga los estilos y ejecuta el módulo principal.

### `src/app.js`

Contiene la composición de las pantallas, la navegación, los formularios y el manejo de eventos de la interfaz.

En esta etapa se mantiene como un único módulo principal. Su división deberá evaluarse más adelante cuando el crecimiento real de la aplicación lo justifique.

### `src/data/mockData.js`

Contiene los catálogos y datos iniciales simulados. No debe incluir cálculos automáticos ni decisiones de negocio.

Los datos operativos reales sólo pueden modificarse con validación expresa. Los datos administrativos ficticios pueden utilizarse para demostración siempre que no contradigan las directivas.

### `src/services/store.js`

Administra la creación, carga, guardado y restablecimiento del estado local. Centraliza el acceso a `localStorage` para evitar que la interfaz dependa directamente del mecanismo de persistencia.

### `src/services/permissions.js`

Centraliza las reglas simples de acceso por rol del sistema.

### `src/styles/app.css`

Contiene los tokens visuales, componentes, distribución responsive y estados de interacción de la interfaz.

## 6. Flujo de datos

El flujo general del MVP es:

```text
mockData.js → store.js → app.js → interfaz
                    ↑         |
                    └─────────┘
                     persistencia local
```

1. `mockData.js` proporciona el estado inicial.
2. `store.js` combina ese estado con los datos guardados localmente.
3. `app.js` representa la interfaz y procesa las acciones del usuario.
4. Los cambios autorizados vuelven a guardarse mediante `store.js`.
5. `permissions.js` determina qué acciones están disponibles para cada rol.

## 7. Módulos funcionales representados

### Dashboard

Muestra el estado general de la demostración, métricas derivadas de los datos disponibles y accesos a los módulos principales.

### Grilla operativa

Contempla una vista oficial y un borrador. La carga de una grilla real y las automatizaciones de cobertura no forman parte de esta consolidación documental.

### Personal

Muestra los perfiles, roles, turnos habituales, sectores, pisos y francos iniciales.

### Solicitudes

Representa el ingreso y seguimiento básico de solicitudes. El flujo operativo completo deberá respetar las reglas definidas en los documentos funcionales.

### Notificaciones y auditoría

Registran avisos internos y acciones relevantes dentro de la demostración local.

## 8. Límites de la primera versión

El MVP actual no incluye:

- backend real,
- base de datos real,
- autenticación segura para producción,
- almacenamiento real de archivos,
- notificaciones externas,
- integración con WhatsApp,
- automatización completa de francos,
- generación automática definitiva de grillas,
- motor automático de coberturas,
- módulo disciplinario avanzado,
- liquidación de sueldos.

## 9. Reglas de mantenimiento

- Leer `Directivas.md` antes de modificar código o datos operativos.
- Mantener los sectores limitados a Cocina y Pisos.
- Mantener los roles operativos limitados a Cocinero, Peón de cocina, Camarera, Franquera y Nutricionista.
- No incorporar reglas de negocio no validadas.
- Evitar asociaciones por posición dentro de arreglos; utilizar identificadores estables.
- Mantener textos operativos legibles y la interfaz responsive.
- Actualizar la documentación cuando cambie una decisión oficial.
- No mezclar datos concretos con reglas generales si pueden mantenerse separados.

## 10. Riesgos técnicos

1. Concentrar demasiada responsabilidad en `app.js` a medida que crezca el MVP.
2. Confundir datos demostrativos con reglas operativas oficiales.
3. Depender de nombres visibles en lugar de identificadores estables.
4. Introducir automatizaciones antes de validar las reglas de cobertura.
5. Tratar `localStorage` como si fuera una base de datos de producción.
6. Desalinear los datos mockeados respecto de las directivas.

## 11. Evolución futura

Una migración futura a React y, eventualmente, a TypeScript podrá evaluarse si la complejidad, el tamaño del equipo o las necesidades de mantenimiento lo justifican.

Esa migración será una evolución posterior y requerirá una decisión técnica específica. No forma parte del stack ni de la arquitectura del MVP actual.

Otras evoluciones posibles son:

- dividir `app.js` por módulos funcionales,
- incorporar un backend y una base de datos,
- agregar autenticación y autorización reales,
- almacenar documentos de forma segura,
- versionar grillas en persistencia permanente,
- incorporar pruebas automatizadas.

## Recomendación general

Mantener el MVP con HTML, CSS y JavaScript mientras se validan la operación y la experiencia de uso. La siguiente decisión arquitectónica deberá responder a una necesidad comprobada y no anticiparse al crecimiento real del producto.
