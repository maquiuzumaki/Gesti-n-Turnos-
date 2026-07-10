# Planning Design: ejecución del frontend profesional de Uzumaki

## 1. Propósito

Este documento transforma las decisiones de `docs/planing_arquitect.md` y las recomendaciones de `docs/13_plan_frontend_profesional.md` en un plan de trabajo concreto para el frontend.

El objetivo es evolucionar la interfaz V0 hacia un frontend profesional, accesible, modular y preparado para consumir la API de V2, sin perder la grilla cargada ni modificar las reglas operativas ya validadas.

Este documento define:

- orden de implementación;
- dependencias con V1 y V2;
- módulos y componentes a crear;
- pantallas a rediseñar;
- elementos que deben retirarse;
- criterios de aceptación;
- estrategia de pruebas visuales, responsive y de accesibilidad;
- preparación para autenticación, API y concurrencia.

## 2. Alcance

### Incluido

- arquitectura técnica del frontend;
- sistema de diseño;
- navegación y layouts por rol;
- dashboard administrativo y personal;
- grilla operativa en escritorio y celular;
- solicitudes;
- directorio de personal;
- notificaciones y auditoría;
- formularios, modales, confirmaciones y feedback;
- accesibilidad;
- responsive;
- estados de carga, guardado, error y conflicto;
- integración progresiva con repositorios locales y API;
- pruebas de frontend.

### Fuera de alcance

- nuevas reglas del Motor de Planificación;
- cambio de franco automático;
- vacaciones automáticas;
- cálculo F1/F2;
- selección automática de reemplazos;
- cambios en empleados o francos base;
- modificación de `mockData.js` como parte del rediseño;
- backend, base de datos o autenticación implementados desde el frontend;
- aplicación móvil nativa;
- integración con WhatsApp, correo o RRHH.

## 3. Condiciones obligatorias

1. La grilla cargada actualmente no se elimina, reinicia ni transforma sin respaldo.
2. El rediseño no cambia reglas de asignación, permisos, solicitudes o Motor.
3. Toda pantalla nueva consume selectores y casos de uso; no muta el estado directamente.
4. `planningWeek` será la única fuente visual de planificación una vez consolidada en V1.
5. El frontend no deberá depender de `localStorage`; dependerá de repositorios intercambiables.
6. Cada entrega conservará los flujos existentes y tendrá validación visual.
7. No se reescribirá toda la interfaz en un solo cambio.
8. La experiencia del personal se diseñará primero para celular.
9. La experiencia administrativa se diseñará para trabajo frecuente, lectura rápida y alta densidad.
10. La identidad naranja y amarilla se conservará como acento, no como fondo dominante.

## 4. Relación con el plan arquitectónico

| Etapa arquitectónica | Trabajo frontend correspondiente |
| --- | --- |
| V1.0 Respaldo V0 | Capturas base, inventario de estados y protección de la grilla real |
| V1.1 Pruebas | Pruebas E2E, accesibilidad y regresión visual de la interfaz actual |
| V1.2 Contratos | Modelos de vista, estados y textos centralizados |
| V1.3 Planificación única | Dashboard y grilla dejan de leer `schedule/draft` |
| V1.4 Separación por capas | Páginas, componentes, layouts, eventos y formatters independientes |
| V1.5 Repositorios | Estado de UI desacoplado de `localStorage` |
| V1.6 Estabilización | Primer frontend profesional completo en persistencia local |
| V2.2 Identidad | Login, sesión, permisos y expiración reales |
| V2.3 API | Estados de carga, error, reintento y paginación |
| V2.5 Integración | Reemplazo de repositorios locales por clientes HTTP |
| V2.6 Migración | Comparación visual y funcional de la grilla migrada |
| V2.7 Producción | Monitoreo frontend, performance y manejo de errores |

El frontend no debe adelantarse a una dependencia arquitectónica. Por ejemplo, el selector de múltiples semanas puede diseñarse antes, pero solo se conecta a datos reales cuando el repositorio soporte `listWeeks()`.

## 5. Arquitectura frontend objetivo

### 5.1 En V1

Se conservarán módulos ES y JavaScript, incorporando Vite, pruebas y una separación clara por responsabilidades.

```text
src/
  app.js
  router.js
  config/
    environment.js
  state/
    appStore.js
    uiState.js
    selectors.js
  ui/
    components/
      Button.js
      IconButton.js
      Badge.js
      Modal.js
      ConfirmDialog.js
      Toast.js
      EmptyState.js
      LoadingState.js
      ErrorState.js
      DataTable.js
      FilterBar.js
      WeekStatus.js
      SaveStatus.js
    layouts/
      AdminLayout.js
      StaffLayout.js
      AppSidebar.js
      AppHeader.js
    pages/
      DashboardPage.js
      PlanningPage.js
      RequestsPage.js
      EmployeesPage.js
      NotificationsPage.js
      AuditPage.js
      LoginPage.js
    features/
      planning/
      requests/
      employees/
      notifications/
      audit/
    formatters/
      dates.js
      labels.js
  infrastructure/
    repositories/
      local/
  styles/
    tokens.css
    reset.css
    base.css
    layouts.css
    components/
    features/
    utilities.css
```

### 5.2 En V2

Los componentes y páginas se mantienen. Cambian la sesión y los adaptadores de datos.

```text
src/
  infrastructure/
    http/
      apiClient.js
      apiErrors.js
    repositories/
      api/
        ApiSessionRepository.js
        ApiPlanningRepository.js
        ApiRequestRepository.js
        ApiEmployeeRepository.js
        ApiNotificationRepository.js
        ApiAuditRepository.js
```

La incorporación de TypeScript se realizará progresivamente desde contratos, repositorios y casos de uso hacia componentes. Un cambio de framework requerirá un ADR independiente y no bloqueará V1.

## 6. Principios de diseño

### 6.1 Orientación operativa

- La interfaz debe priorizar decisiones y tareas pendientes.
- La información importante debe estar visible sin abrir varias tarjetas.
- Las acciones frecuentes deben ser directas.
- Las acciones sensibles deben estar separadas y confirmadas.
- Las descripciones largas se reemplazarán por ayuda contextual cuando corresponda.

### 6.2 Jerarquía

Cada página tendrá:

1. contexto actual;
2. título claro;
3. una acción primaria;
4. filtros o acciones secundarias;
5. contenido operativo;
6. feedback del sistema.

### 6.3 Identidad visual

- Naranja: marca y acción principal.
- Amarillo: atención y estado pendiente.
- Verde: éxito, publicado y cubierto.
- Rojo: error, rechazo y acción destructiva.
- Azul: información, pausa y revisión.
- Neutros: fondos, bordes, tablas y texto.

Los colores nunca serán la única señal de estado.

### 6.4 Densidad

- Administración: densidad media/compacta.
- Personal: lectura simple y táctil.
- Grilla: máxima información útil sin superposición.
- Formularios: una decisión por bloque.

### 6.5 Accesibilidad

- Contraste WCAG AA.
- Tamaño táctil mínimo de 44 x 44 px.
- Texto operativo habitual de 14 px o más.
- Navegación completa por teclado.
- Foco siempre visible.
- Estados comprensibles sin color.
- Etiquetas y descripciones accesibles.
- Respeto de `prefers-reduced-motion`.

## 7. Plan de trabajo

### FD0 - Línea base de interfaz

#### Dependencia

V1.0 y respaldo validado de la grilla actual.

#### Objetivo

Registrar el comportamiento y aspecto de la V0 antes de comenzar cambios visuales.

#### Trabajos

- Inventariar todas las rutas/páginas por rol.
- Inventariar estados vacíos, parciales, completos y con error.
- Crear una matriz de usuarios demo para pruebas sin datos reales.
- Capturar escritorio, tableta y celular de:
  - login;
  - dashboard de encargada;
  - dashboard de personal;
  - grilla sin crear;
  - borrador incompleto;
  - publicada;
  - pausada;
  - solicitudes por estado;
  - personal;
  - notificaciones;
  - auditoría;
  - modales principales.
- Registrar flujos de teclado actuales.
- Crear pruebas E2E de humo antes de refactorizar.
- Identificar textos hardcodeados, componentes duplicados y selectores CSS frágiles.

#### Entregables

- Inventario de pantallas y estados.
- Capturas base versionadas.
- Pruebas de humo por rol.
- Lista priorizada de defectos visuales comprobados.

#### Criterio de salida

- Existe evidencia reproducible del comportamiento V0.
- La grilla real permanece intacta.
- Los flujos críticos pueden compararse después de cada entrega.

### FD1 - Fundamentos del sistema de diseño

#### Dependencia

FD0 terminado.

#### Objetivo

Crear una base visual común sin rediseñar todavía las pantallas completas.

#### Trabajos

- Dividir tokens, estilos base, layouts, componentes y features.
- Definir tokens para:
  - colores de marca;
  - colores semánticos;
  - tipografía;
  - espaciado;
  - radios;
  - bordes;
  - sombras;
  - z-index;
  - anchos máximos;
  - breakpoints;
  - duración de transiciones.
- Establecer escala de espaciado 4/8/12/16/24/32.
- Establecer escala tipográfica sin tamaños críticos menores a 14 px.
- Sustituir estilos inline.
- Encapsular estilos globales de tablas y formularios.
- Incorporar Lucide o una biblioteca equivalente.
- Crear catálogo interno de iconos por acción y estado.
- Definir variantes de densidad cómoda y compacta.
- Agregar reglas para reducción de movimiento.

#### Componentes iniciales

- Button.
- IconButton.
- Badge/StatusBadge.
- Input, Select y Textarea.
- FormField y FieldError.
- EmptyState.
- LoadingState.
- ErrorState.
- Tooltip.
- Spinner o indicador de progreso.

#### Criterio de salida

- Los componentes base se ven iguales en todas las páginas.
- No existen nuevos colores o espaciados fuera de tokens sin justificación.
- Todos los estados tienen icono, texto y color coherentes.
- `revoked` y revisión manual tienen representación explícita.

### FD2 - Capa accesible de interacción

#### Dependencia

FD1 terminado.

#### Objetivo

Corregir primero los componentes que pueden bloquear o confundir al usuario.

#### Trabajos

- Crear Modal accesible con:
  - `aria-labelledby`;
  - `aria-describedby`;
  - foco inicial;
  - focus trap;
  - cierre por Escape;
  - restauración de foco;
  - bloqueo de scroll de fondo;
  - clic interno que no cierre accidentalmente;
  - tamaño completo en celular cuando corresponda.
- Crear ConfirmDialog para acciones sensibles.
- Crear Toast accesible con estado, cierre manual y duración adecuada.
- Mostrar errores junto a campos.
- Conservar valores cuando una validación falla.
- Bloquear envíos duplicados.
- Crear estados de acción en progreso.
- Unificar textos de confirmación para publicar, pausar, eliminar, rechazar y revocar.
- Asegurar que controles de solo lectura no parezcan editables.

#### Pruebas

- Teclado completo.
- Lectura de nombres accesibles.
- Apertura y cierre repetido.
- Foco después de error.
- Foco restaurado al cerrar.
- Viewports de 320 y 375 px.

#### Criterio de salida

- Ningún flujo principal requiere mouse.
- Ningún modal pierde o fuga el foco.
- Los errores permanecen visibles y asociados a su campo.
- Acciones destructivas siempre explican su consecuencia.

### FD3 - Shell, navegación y contexto

#### Dependencia

FD1 y FD2.

#### Objetivo

Crear una estructura de aplicación consistente por rol.

#### Trabajos

- Separar AdminLayout y StaffLayout.
- Modularizar sidebar, header y navegación móvil.
- Incorporar iconografía uniforme.
- Agregar `aria-current="page"`.
- Crear overlay y gestión de foco para sidebar móvil.
- Cerrar menú al navegar o presionar Escape.
- Crear router basado en URL.
- Persistir página, filtros y elemento seleccionado cuando sea útil.
- Mostrar semana activa, estado y SaveStatus en el encabezado administrativo.
- Ocultar información administrativa en StaffLayout.
- Definir página 404 y estado de ruta no autorizada.
- Separar acciones principales de menús secundarios.

#### Navegación objetivo

##### Encargada/admin

- Resumen.
- Planificación.
- Solicitudes.
- Personal.
- Notificaciones.
- Auditoría.

##### Supervisora

- Resumen.
- Planificación en consulta.
- Solicitudes en consulta.
- Personal en consulta.
- Auditoría.

##### Personal

- Inicio.
- Mi semana.
- Solicitudes.
- Notificaciones.

#### Criterio de salida

- Recargar conserva la página actual.
- Atrás/adelante del navegador funcionan.
- Cada rol ve solo sus destinos permitidos.
- El menú móvil puede operarse íntegramente con teclado.

### FD4 - Estado de UI, selectores y persistencia desacoplada

#### Dependencia

V1.2, V1.3, V1.4 y V1.5 del plan arquitectónico.

#### Objetivo

Evitar que las pantallas dependan de colecciones globales o `localStorage`.

#### Trabajos

- Crear `appStore` para estado de dominio recibido de repositorios.
- Crear `uiState` separado para:
  - ruta;
  - filtros;
  - modal activo;
  - selección;
  - scroll/contexto;
  - operación en curso;
  - estado de guardado.
- Crear selectores para:
  - semana visible;
  - asignaciones por persona;
  - puestos por sector/turno;
  - conflictos;
  - solicitudes visibles por rol;
  - solicitudes que requieren acción;
  - métricas de dashboard.
- Implementar SaveStatus: guardando, guardado, error.
- Evitar llamadas directas a `saveState` desde componentes.
- Conectar componentes a casos de uso.
- Mantener filtros y foco después de cada actualización.

#### Criterio de salida

- Dashboard y grilla usan `planningWeek`.
- No hay métricas provenientes de `schedule/draft`.
- La UI no importa ni escribe directamente en `localStorage`.
- Cambiar el repositorio no obliga a reescribir páginas.

### FD5 - Dashboard profesional por rol

#### Dependencia

FD3 y FD4.

#### Objetivo

Convertir el inicio en una vista operativa accionable.

#### Dashboard de encargada

- Estado de la semana activa y próxima acción.
- Solicitudes que requieren decisión.
- Ausencias y coberturas relevantes.
- Conflictos o puestos críticos.
- Cambios pendientes de publicación.
- Actividad reciente con fecha real.
- Enlaces a listas ya filtradas.

#### Dashboard de supervisora

- Estado general de la semana.
- Alertas y excepciones en consulta.
- Solicitudes por estado sin acciones de resolución.
- Actividad y auditoría relevante.

#### Dashboard del personal

- Próximo turno.
- Próximo franco.
- Lista compacta de su semana.
- Solicitudes propias activas.
- Solicitudes donde debe aceptar o rechazar como compañero.

#### Elementos a retirar

- “Base de datos simulada”.
- Cantidades de catálogos.
- Fecha fija de demostración.
- Métricas basadas en la grilla legada.
- Información operativa privada en personal.

#### Criterio de salida

- La encargada identifica lo pendiente sin abrir otro módulo.
- El personal encuentra su próximo turno en la primera pantalla.
- Cada indicador abre el contexto correcto.

### FD6 - Grilla profesional de escritorio

#### Dependencia

Consolidación de `planningWeek`, FD1 a FD4 y pruebas críticas de planificación.

#### Objetivo

Mejorar la tarea principal sin cambiar estructura operativa ni reglas.

#### Barra de herramientas

- Nombre y período de semana.
- Estado: borrador, publicada o pausada.
- Estado de guardado.
- Cantidad de conflictos relevantes.
- Filtros de sector, turno, persona y estado.
- Acción primaria según estado.
- Menú separado para pausar, volver a borrador, eliminar o republicar.

#### Tabla semanal

- Encabezados de días sticky.
- Columna de puestos sticky.
- Bandas estables de Mañana y Tarde.
- Cocina con tres espacios por turno.
- Pisos sin cambios de estructura.
- Casilleros vacíos visibles y silenciosos.
- Nombre, rol y tipo de asignación.
- Tooltip para contenido truncado.
- Icono y etiqueta para reemplazo, excepción, franco y revisión.
- Advertencias visibles sin modificar publicación.
- Scroll conservado después de editar.
- Selectores CSS independientes del número exacto de filas.

#### Simplificaciones

- Eliminar resúmenes duplicados.
- Corregir el texto que informa cinco espacios de Cocina.
- Retirar la vista legada cuando deje de tener consumidores.
- Reducir paneles decorativos alrededor de la grilla.
- Mantener una sola acción primaria visible.

#### Criterio de salida

- Todos los días muestran la misma estructura.
- Cocina muestra seis espacios por día, tres por turno.
- Pisos conserva seis puestos por día.
- Mañana y Tarde se distinguen sin depender solo del color.
- La encargada puede editar sin perder posición ni filtros.
- La grilla publicada de personal permanece en solo lectura.

### FD7 - Experiencia móvil de planificación

#### Dependencia

FD6 y selectores de planificación.

#### Objetivo

Evitar que el celular dependa de una tabla de más de 1000 px.

#### Vista administrativa “Por día”

- Selector de día con anterior/siguiente.
- Encabezado con fecha, estado y conflictos.
- Secciones compactas:
  - Cocina Mañana;
  - Cocina Tarde;
  - Pisos Mañana;
  - Pisos Tarde;
  - Francos.
- Edición mediante pantalla completa o bottom sheet accesible.
- Retorno al mismo día y posición después de guardar.
- Vista semanal completa como alternativa secundaria.

#### Vista personal “Mi semana”

- Lista cronológica de siete días.
- Asignación, horario, sector y puesto.
- Franco claramente identificado.
- Sin excepciones ni detalles de cobertura administrativos.
- Acceso opcional a la grilla publicada completa.

#### Criterio de salida

- Las tareas principales se completan a 320 px sin scroll horizontal extenso.
- Los objetivos táctiles cumplen 44 x 44 px.
- El contenido no se superpone ni trunca información crítica.
- Personal y administración tienen vistas móviles diferentes.

### FD8 - Solicitudes como cola de trabajo

#### Dependencia

FD1 a FD4 y contratos de solicitudes V1.

#### Objetivo

Simplificar el seguimiento y hacer evidente quién debe actuar.

#### Listado

- Reemplazar ocho pestañas por:
  - Para resolver;
  - En curso;
  - Historial.
- Agregar filtros por tipo, estado, persona y fecha.
- Usar lista densa/table en escritorio.
- Usar filas apiladas en celular.
- Mostrar tipo, solicitante, fecha afectada, estado, antigüedad y actor pendiente.
- Definir icono propio por tipo de solicitud.

#### Detalle

- Panel lateral en escritorio.
- Pantalla completa en celular.
- Datos originales y propuestos ordenados.
- Comparación Antes/Después para el impacto.
- Reemplazo seleccionado cuando corresponda.
- Historial de decisiones.
- Resultado del Motor.
- Revisión manual claramente diferenciada.

#### Acciones

- Aceptar/rechazar compañero agrupados.
- Aprobar/rechazar encargada agrupados.
- Revocar separado como acción sensible.
- Supervisora sin botones de resolución.
- Deshabilitar mientras se procesa.
- Mostrar error de API sin cerrar detalle.

#### Criterio de salida

- Cada usuario identifica qué solicitudes requieren su acción.
- No se pierde el filtro al cerrar un detalle.
- Estados `revoked` y revisión manual son inequívocos.
- Aprobar o revocar nunca modifica directamente la grilla desde la UI.

### FD9 - Personal, notificaciones y auditoría

#### Dependencia

FD1 a FD4.

#### Personal

- Directorio con búsqueda y filtros.
- Encabezado sticky en escritorio.
- Filas apiladas en celular.
- Quitar columna “Gestión” mientras no tenga acciones.
- Mostrar información operativa esencial en lista.
- Preparar detalle individual sin agregar gestión no aprobada.

#### Notificaciones

- Agrupar por Hoy, Esta semana y Anteriores.
- Icono y estilo por categoría.
- Fecha y hora reales.
- Enlace a entidad relacionada.
- Estados leído/no leído accesibles.

#### Auditoría

- Filtros por fecha, usuario, acción, entidad y resultado.
- Tabla responsive.
- Paginación preparada para API.
- Detalle de operación.
- Estados éxito, error y revisión manual.
- Eliminar “Restablecer datos de demostración” de entornos no demo.

#### Criterio de salida

- Tablas son legibles y operables en los viewports definidos.
- La navegación desde notificaciones conserva contexto.
- La supervisora puede consultar sin obtener acciones administrativas.

### FD10 - Preparación para API y V2

#### Dependencia

V1 frontend terminado y contratos de API definidos.

#### Objetivo

Agregar todos los estados necesarios para abandonar la persistencia inmediata local.

#### Componentes y estados

- Skeleton o LoadingState por página.
- Guardando y acción en progreso.
- Error recuperable con reintento.
- Sin conexión.
- Sesión vencida.
- Sin permiso.
- Conflicto de versión.
- Error de validación de servidor.
- Error inesperado con identificador de correlación.
- Estado vacío real diferenciado de error de carga.

#### Comportamiento

- Cancelar solicitudes HTTP obsoletas al navegar.
- Evitar dobles envíos.
- No asumir éxito antes de respuesta en comandos críticos.
- Aplicar actualización optimista solo en acciones simples y reversibles.
- En conflicto de versión, conservar la edición local y ofrecer recargar/comparar.
- En sesión vencida, guardar contexto de navegación y volver después de iniciar sesión.
- Mostrar mensajes seguros sin exponer detalles internos.

#### Criterio de salida

- Todas las páginas funcionan con respuestas lentas, vacías y fallidas.
- Ningún error de red deja controles bloqueados indefinidamente.
- El usuario puede recuperar o repetir una acción segura.

### FD11 - Conexión progresiva con API

#### Dependencia

V2.2 a V2.5 del plan arquitectónico.

#### Orden

1. `ApiSessionRepository` y usuario actual.
2. Empleados y catálogos en lectura.
3. Lista y detalle de semanas.
4. Edición de asignaciones y francos.
5. Ciclo de publicación.
6. Solicitudes y decisiones.
7. Aplicación y revocación del Motor.
8. Notificaciones.
9. Auditoría.

#### Regla de fuente única

Cada ambiente usará una sola fuente autoritativa:

- V1 local: repositorios locales.
- V2 integración: repositorios API.
- Comparación de migración: lectura controlada, sin doble escritura.

No se guardará simultáneamente una operación en API y `localStorage` como mecanismo de sincronización.

#### Validación por módulo

Cada reemplazo de repositorio debe comprobar:

- igualdad de datos renderizados;
- permisos;
- errores;
- fechas y zonas horarias;
- filtros y paginación;
- concurrencia;
- auditoría;
- accesibilidad;
- responsive.

#### Criterio de salida

- El frontend funciona sin datos de dominio en `localStorage`.
- Dos dispositivos muestran el mismo estado.
- Los conflictos de versión no sobrescriben cambios.
- La aprobación y revocación dependen del resultado transaccional del servidor.

### FD12 - Calidad y preparación productiva

#### Dependencia

Todas las fases anteriores.

#### Matriz de viewports

| Ancho | Uso principal |
| --- | --- |
| 320 px | celular mínimo |
| 375 px | celular habitual |
| 768 px | tableta |
| 1024 px | notebook pequeña |
| 1440 px | escritorio operativo |

#### Matriz de roles

- Admin/encargada.
- Supervisora.
- Personal solicitante.
- Personal involucrado como compañero.

#### Matriz de datos

- sin semana;
- borrador vacío;
- borrador incompleto;
- publicada completa;
- publicada incompleta;
- pausada;
- con excepciones;
- con conflictos;
- con solicitudes en cada estado;
- con revocación automática;
- con revisión manual;
- listas vacías;
- listas extensas;
- nombres y textos largos.

#### Pruebas automáticas

- Componentes y variantes.
- Selectores de vista.
- Navegación y permisos visibles.
- Formularios y errores.
- Accesibilidad con axe.
- E2E por rol.
- Regresión visual.
- Responsive.
- Sesión vencida.
- Error de red.
- Conflicto de versión.

#### Performance

- Medir carga inicial.
- Evitar rerender completo cuando cambie una celda.
- Paginar listas extensas.
- Cargar módulos por ruta cuando aporte valor.
- Optimizar fuentes e iconos.
- Evitar dependencias visuales de gran tamaño.
- Mantener interacción fluida en la grilla.

#### Criterio de salida

- No existen defectos críticos de accesibilidad.
- Las capturas aprobadas no presentan regresiones.
- No hay superposición ni pérdida de texto en los cinco viewports.
- Los flujos E2E críticos pasan para todos los roles.
- La encargada valida la grilla y solicitudes con datos migrados.

## 8. Orden de implementación recomendado

| Orden | Bloque | Entrega principal | Depende de |
| --- | --- | --- | --- |
| 1 | FD0 | Línea base y pruebas de humo | Respaldo V0 |
| 2 | FD1 | Tokens y componentes visuales | FD0 |
| 3 | FD2 | Accesibilidad y feedback | FD1 |
| 4 | FD3 | Layouts y navegación | FD1-FD2 |
| 5 | FD4 | Estado, selectores y repositorios | V1.2-V1.5 |
| 6 | FD5 | Dashboards por rol | FD3-FD4 |
| 7 | FD6 | Grilla de escritorio | FD1-FD4 |
| 8 | FD7 | Grilla móvil y Mi semana | FD6 |
| 9 | FD8 | Solicitudes | FD1-FD4 |
| 10 | FD9 | Personal, avisos y auditoría | FD1-FD4 |
| 11 | FD10 | Estados de API | Contratos V2 |
| 12 | FD11 | Repositorios HTTP | API disponible |
| 13 | FD12 | Calidad productiva | FD0-FD11 |

FD5, FD6, FD8 y FD9 pueden desarrollarse en paralelo únicamente después de cerrar componentes, layouts, selectores y contratos compartidos.

## 9. Entregas y ramas sugeridas

1. `design/baseline-and-visual-tests`
2. `design/tokens-and-primitives`
3. `design/accessible-interactions`
4. `design/app-shell-and-router`
5. `design/ui-state-and-selectors`
6. `design/role-dashboards`
7. `design/planning-desktop`
8. `design/planning-mobile`
9. `design/request-work-queue`
10. `design/supporting-modules`
11. `design/api-states`
12. `design/api-repositories`
13. `design/production-qa`

Cada rama deberá contener un cambio visual o técnico acotado, capturas antes/después y pruebas del flujo afectado.

## 10. Elementos que se conservarán

- Identidad Uzumaki.
- Navegación lateral en escritorio.
- Separación de vistas por rol.
- Estructura operativa de Cocina y Pisos.
- Estados de grilla.
- Casilleros editables por posición.
- Excepciones visibles para perfiles administrativos.
- Vista previa de impacto.
- Mensajes de conflictos.
- Vista de personal en solo lectura.
- Comportamiento funcional validado del Motor.

## 11. Elementos que se retirarán gradualmente

- Dependencia visual y funcional de `schedule/draft`.
- Fechas y semanas hardcodeadas.
- Bloques de demostración en dashboard.
- Botón de restablecimiento fuera de desarrollo.
- Símbolos Unicode y emojis funcionales.
- Ocho pestañas simultáneas de solicitudes.
- Columna de gestión deshabilitada.
- Textos de automatización futura frente a usuarios.
- Resúmenes duplicados alrededor de la grilla.
- Estilos inline.
- Selectores CSS que dependen del número exacto de filas.
- Tablas de escritorio como única experiencia móvil.
- Mutaciones directas desde eventos de UI.
- Lecturas directas de `localStorage` desde la interfaz.

## 12. Riesgos de diseño y mitigaciones

| Riesgo | Mitigación |
| --- | --- |
| Rediseñar antes de consolidar datos | FD4 depende explícitamente de V1.2-V1.5 |
| Romper la grilla cargada | Respaldo, capturas y pruebas antes de FD0 |
| Cambiar reglas desde la UI | Casos de uso y pruebas de caracterización |
| Reescritura demasiado grande | Entregas por componente y página |
| Inconsistencia durante la transición | Tokens y primitives antes de páginas |
| Móvil tratado como escritorio reducido | Vista Por día y Mi semana específicas |
| Pérdida de contexto al guardar | Estado de UI separado y restauración de foco/scroll |
| Permisos solo visuales | UI por rol y validación obligatoria en API V2 |
| Doble fuente de verdad | Repositorio autoritativo único por ambiente |
| Regresiones CSS | Estilos encapsulados y capturas automáticas |
| Estados de red olvidados | FD10 antes de conectar API |
| Accesibilidad postergada | FD2 antes del rediseño de páginas |

## 13. Definición de frontend V1 terminado

- Existe línea base visual y E2E de V0.
- El sistema de diseño está tokenizado.
- Los componentes principales son accesibles.
- La navegación funciona por URL.
- Dashboard y grilla consumen `planningWeek`.
- La UI no escribe directamente en `localStorage`.
- Modales y menús funcionan con teclado.
- El dashboard es específico por rol.
- La grilla de escritorio conserva estructura y contexto.
- Existe vista móvil por día.
- El personal dispone de Mi semana.
- Solicitudes funciona como cola de trabajo.
- No aparecen elementos de demo en la experiencia productiva.
- Las pruebas responsive y visuales pasan.

## 14. Definición de frontend V2 terminado

- La sesión proviene del backend.
- Los repositorios API reemplazan los locales.
- El frontend no conserva datos operativos como fuente de verdad local.
- Carga, error, sesión vencida y conflicto de versión están resueltos.
- Dos dispositivos muestran el mismo estado.
- Las acciones críticas esperan confirmación transaccional del servidor.
- La grilla migrada coincide visual y funcionalmente con el respaldo.
- Los permisos visibles coinciden con los permisos de API.
- Los flujos E2E pasan por rol y viewport.
- No existen defectos críticos de accesibilidad ni superposición.

## 15. Primer trabajo a realizar

El primer trabajo frontend será FD0, pero solo después de confirmar el respaldo V0 definido en `docs/planing_arquitect.md`.

Secuencia inicial:

1. respaldar y restaurar la grilla actual;
2. levantar la aplicación con cada rol;
3. capturar todas las pantallas y estados principales;
4. crear pruebas de humo del comportamiento existente;
5. documentar defectos visuales comprobados;
6. comenzar tokens y componentes sin rediseñar aún la grilla.

Este orden evita que una mejora visual o una refactorización destruya información, cambie reglas o elimine comportamientos que todavía no fueron protegidos por pruebas.
