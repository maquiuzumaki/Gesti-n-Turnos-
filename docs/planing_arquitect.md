# Planning Architect: evolución de Uzumaki de V0 a V2

## 1. Propósito

Este documento convierte las etapas V1 y V2 definidas en `docs/12_plan_evolucion_v0_a_productivo.md` en un plan técnico de implementación.

El punto de partida es la V0 actual: una aplicación frontend funcional, con persistencia en `localStorage`, autenticación simulada, una planificación semanal activa y primeras reglas del Motor de Planificación.

El punto de llegada es la V2: una aplicación con backend, base de datos centralizada, autenticación real, permisos validados en servidor, auditoría persistente y operaciones del Motor ejecutadas de forma transaccional.

Este plan no agrega nuevas reglas operativas. Su objetivo es conservar las funcionalidades ya validadas mientras cambia la arquitectura que las sostiene.

## 2. Resultados esperados

### Al finalizar V1

- La información actual puede exportarse e importarse sin pérdida.
- Existe un único modelo vigente de planificación.
- Las reglas críticas están protegidas por pruebas automatizadas.
- La interfaz deja de escribir directamente sobre estructuras internas del dominio.
- El código queda dividido por responsabilidades.
- El Motor de Planificación puede ejecutarse sin depender del DOM ni de `localStorage`.
- La aplicación sigue funcionando localmente con el mismo comportamiento operativo.

### Al finalizar V2

- Los datos se almacenan en una base de datos centralizada.
- Dos usuarios pueden consultar el mismo estado desde dispositivos diferentes.
- La autenticación y autorización son reales.
- Los permisos se validan en frontend y backend.
- La planificación, solicitudes y eventos se modifican mediante una API versionada.
- Las operaciones del Motor son atómicas e idempotentes.
- La auditoría es persistente e inmutable para los usuarios de la aplicación.
- La grilla V0/V1 puede migrarse y verificarse.
- Existen ambientes, despliegue, copias de seguridad y recuperación documentada.

## 3. Principios arquitectónicos

1. **No perder datos reales.** Ningún cambio de almacenamiento comienza sin un respaldo verificable del estado local.
2. **No reescribir reglas mientras se migra infraestructura.** Primero se protege el comportamiento actual; después se cambia dónde se ejecuta y almacena.
3. **Monolito modular antes que microservicios.** La escala inicial no justifica sistemas distribuidos.
4. **Dominio independiente de la interfaz.** Las reglas de planificación no conocen HTML, eventos del navegador ni mecanismos de persistencia.
5. **Comandos para modificar y consultas para leer.** Toda escritura pasa por un caso de uso explícito.
6. **Servidor como autoridad.** En V2 el frontend no decide permisos ni confirma por sí solo una modificación.
7. **Transacciones para cambios relacionados.** Solicitud, asignaciones, excepción y auditoría se confirman juntas o no se confirman.
8. **Idempotencia.** Repetir una petición no puede aplicar dos veces el mismo evento.
9. **Versionado optimista.** Una edición antigua no debe sobrescribir silenciosamente una versión más reciente.
10. **Migraciones progresivas y reversibles.** Cada cambio de esquema incluye validación y estrategia de vuelta atrás.
11. **Una grilla publicada es una versión identificable.** No se mezcla el borrador de trabajo con la versión visible para el personal.
12. **Sin automatizaciones nuevas hasta cerrar V2.** Se conservan licencias, ausencias, cambios de turno y sus revocaciones actuales.

## 4. Diagnóstico técnico de V0

### 4.1 Estado y persistencia

El estado completo se guarda como un único JSON en:

```text
localStorage["uzumaki-mvp-state-v4"]
```

La sesión demostrativa se guarda en:

```text
sessionStorage["uzumaki-user-v4"]
```

`src/services/store.js` mezcla tres responsabilidades:

- creación del estado inicial;
- normalización y compatibilidad con datos antiguos;
- persistencia del documento completo.

Este diseño resulta adecuado para una demostración, pero no permite concurrencia, consultas parciales, integridad referencial ni recuperación centralizada.

### 4.2 Dominio

El dominio vigente está repartido entre:

- `src/app.js`, que contiene validaciones y casos de uso;
- `src/services/planningWeeks.js`, que crea semanas y puestos;
- `src/services/planningEngine.js`, que aplica y revoca eventos;
- `src/services/permissions.js`, que define permisos visibles;
- `src/data/mockData.js`, que combina catálogos y datos iniciales.

Antes de crear el backend se debe determinar qué reglas pertenecen al dominio y retirarlas gradualmente de la capa de interfaz.

### 4.3 Modelos de grilla coexistentes

Actualmente conviven:

- `schedule` y `draft`, correspondientes a la grilla inicial/legada;
- `planningWeek`, correspondiente al editor vigente por puestos operativos.

V1 debe dejar a `planningWeek` como única fuente funcional de planificación. El modelo legado se conservará temporalmente solo para migración o referencia y luego se retirará.

### 4.4 Trazabilidad

La auditoría actual es una lista mutable dentro del mismo estado local. Sus fechas pueden contener textos como `Ahora` y no existe correlación transaccional entre solicitud, aplicación del Motor y cambios de grilla.

V1 deberá generar registros estructurados. V2 deberá persistirlos en una tabla separada, con fecha del servidor e identificador de correlación.

## 5. Arquitectura objetivo

### 5.1 Estilo general

Se propone un **monolito modular cliente-servidor**:

```text
Navegador
   |
   | HTTPS / JSON
   v
API REST /api/v1
   |
   +-- Autenticación y autorización
   +-- Casos de uso
   +-- Motor de Planificación
   +-- Auditoría
   |
   v
PostgreSQL
```

El monolito modular permite desplegar una sola aplicación backend, conservar transacciones simples y separar internamente los módulos sin introducir microservicios.

### 5.2 Stack técnico recomendado

Las decisiones finales deberán registrarse como ADR antes de implementarse. La referencia recomendada es:

| Capa | Tecnología propuesta | Motivo |
| --- | --- | --- |
| Frontend V1 | JavaScript modular con Vite | Moderniza build y pruebas sin forzar una reescritura inmediata |
| Tipado progresivo | TypeScript | Protege contratos al conectar frontend, API y Motor |
| Backend | Node.js con TypeScript | Permite compartir lenguaje, tipos y conocimiento del equipo |
| API | REST versionada | Suficiente y clara para los casos de uso actuales |
| Base de datos | PostgreSQL | Transacciones, restricciones e integridad relacional |
| Validación | Esquemas compartidos o equivalentes | Evita contratos ambiguos entre cliente y servidor |
| Pruebas unitarias | Vitest o equivalente | Compatible con módulos de frontend y dominio |
| Pruebas end-to-end | Playwright | Valida flujos reales por rol y responsive |
| Empaquetado | Docker | Repetibilidad entre ambientes |
| CI/CD | GitHub Actions | Calidad y despliegue asociados al repositorio actual |

La elección de framework de interfaz no es requisito de V1. Si se decide migrar a React, Vue u otra alternativa, deberá hacerse mediante un ADR y por módulos, no como condición para comenzar el backend.

### 5.3 Límites de módulos

```text
identity       usuarios, sesión, roles y permisos
employees      empleados y disponibilidad administrativa
planning       semanas, puestos, asignaciones, francos y versiones
requests       solicitudes, participantes, estados y decisiones
events         excepciones y eventos operativos
planningEngine aplicación, simulación y revocación
notifications  avisos y destinatarios
audit          registro de acciones y correlación
```

Cada módulo expone casos de uso. Ninguna pantalla debe modificar directamente sus colecciones internas.

## 6. Plan de trabajo V1

### V1.0 - Congelamiento y respaldo de la V0

#### Objetivo

Crear una línea base recuperable antes de modificar estructura, herramientas o modelos.

#### Cambios

- Documentar versión de navegador y clave de almacenamiento vigente.
- Implementar exportación completa del estado como JSON.
- Incluir en el respaldo:
  - `schemaVersion`;
  - fecha ISO de exportación;
  - identificador de la instalación;
  - estado completo;
  - resumen de conteos;
  - checksum del contenido.
- Implementar importación con vista previa, validación y confirmación.
- Rechazar respaldos corruptos o de versiones desconocidas.
- Conservar una copia de prueba de la grilla modelo fuera de `localStorage`.
- Crear una etiqueta Git para la línea base V0 luego de validar el respaldo.

#### Validación

1. Exportar el estado real.
2. Importarlo en un perfil de navegador aislado.
3. Comparar semana, puestos, asignaciones, francos, excepciones y solicitudes.
4. Confirmar que la aplicación produce la misma vista y conflictos.
5. Conservar el respaldo original sin modificar.

### V1.1 - Herramientas y pruebas de caracterización

#### Objetivo

Registrar mediante pruebas cómo funciona la V0 antes de refactorizarla.

#### Cambios

- Incorporar `package.json` y comandos reproducibles.
- Incorporar Vite como servidor y proceso de build.
- Configurar análisis estático y formato.
- Configurar pruebas unitarias y end-to-end.
- Agregar CI para instalar, analizar, probar y construir.
- Crear fixtures sin datos personales reales.

#### Pruebas prioritarias

- Crear, publicar, pausar, volver a borrador, republicar y eliminar una semana.
- Publicar grillas completas e incompletas.
- Asignar una persona a turnos distintos el mismo día.
- Bloquear duplicados en el mismo turno.
- Crear, editar y eliminar excepciones.
- Flujo de licencia/ausencia con reemplazo.
- Flujo de cambio de turno con aceptación del compañero.
- Revocación segura y revisión manual.
- Visibilidad y acciones por rol.
- Carga de solicitudes legacy.
- Persistencia después de recargar.

#### Criterio de salida

- Los flujos críticos tienen pruebas repetibles.
- La build de producción funciona.
- Una regresión bloquea la integración en CI.

### V1.2 - Contratos de dominio y esquema local

#### Objetivo

Dejar de tratar el estado como un JSON sin contrato.

#### Cambios

- Definir esquemas para:
  - empleado;
  - semana;
  - puesto operativo;
  - asignación;
  - franco semanal;
  - solicitud;
  - excepción/evento;
  - aplicación del Motor;
  - notificación;
  - auditoría.
- Agregar `schemaVersion` al estado local.
- Reemplazar normalizaciones implícitas por migraciones explícitas y encadenadas.
- Definir enums únicos de estados, tipos y roles.
- Usar fechas ISO y marcas de tiempo completas.
- Definir transiciones permitidas de solicitudes y semanas.
- Separar identificadores internos de textos visibles.

#### Regla de migración

```text
estado v4 -> migración v5 -> validación -> estado v5
```

Una migración nunca elimina el estado anterior hasta que la nueva versión haya sido validada y guardada correctamente.

### V1.3 - Consolidación de la planificación

#### Objetivo

Dejar `planningWeek` como único modelo funcional de grilla.

#### Cambios

- Identificar todas las lecturas y escrituras sobre `schedule`, `draft`, `scheduleVersion` y `hasDraftChanges`.
- Sustituir métricas y vistas que todavía dependan del modelo legado.
- Crear selectores derivados desde la planificación vigente.
- Retirar acciones de edición y publicación de la grilla legada.
- Mantener un adaptador de lectura temporal solo durante la migración.
- Eliminar el modelo legado cuando no existan consumidores ni pruebas dependientes.
- Corregir textos y documentación que todavía describan el modelo anterior.

#### Restricción

La consolidación no puede alterar la grilla modelo cargada por la usuaria. La comparación antes/después debe realizarse sobre el respaldo exportado.

### V1.4 - Separación por capas

#### Objetivo

Retirar casos de uso y reglas de negocio de `src/app.js`.

#### Estructura propuesta

```text
src/
  app.js
  domain/
    planning/
      planningRules.js
      planningEngine.js
      planningModels.js
    requests/
      requestRules.js
      requestTransitions.js
    shared/
      ids.js
      dates.js
  application/
    planning/
      createWeek.js
      assignEmployee.js
      publishWeek.js
      revokePlanningChange.js
    requests/
      createRequest.js
      resolveRequest.js
  infrastructure/
    persistence/
      localStateRepository.js
      migrations/
    clock/
      browserClock.js
  ui/
    pages/
    components/
    events/
    formatters/
```

#### Flujo esperado

```text
Interfaz -> caso de uso -> dominio -> repositorio -> persistencia
```

La interfaz recibe un resultado estructurado y decide cómo mostrarlo. El caso de uso coordina. El dominio valida. El repositorio persiste.

#### Cambios en el Motor

- Conservar las reglas actuales sin ampliarlas.
- Evitar mutaciones parciales cuando una validación falla.
- Recibir datos explícitos y devolver cambios/errores estructurados.
- Incorporar una clave de idempotencia por solicitud y operación.
- Separar simulación, aplicación y revocación.
- No leer usuarios, empleados o estado desde variables globales.

### V1.5 - Adaptadores y repositorios locales

#### Objetivo

Preparar el reemplazo de `localStorage` sin que la interfaz conozca el mecanismo.

#### Contratos mínimos

```text
PlanningRepository
  getCurrentWeek()
  saveWeek(week, expectedVersion)
  listWeeks()

RequestRepository
  list(filters)
  getById(id)
  save(request, expectedVersion)

AuditRepository
  append(entry)

SessionRepository
  getCurrentUser()
```

En V1 estos contratos utilizan adaptadores locales. En V2 se reemplazan por clientes HTTP manteniendo los casos de uso y las pantallas.

### V1.6 - Estabilización funcional y frontend

#### Cambios

- Aplicar la primera fase de accesibilidad definida en `docs/13_plan_frontend_profesional.md`.
- Corregir modales, foco, teclado y feedback.
- Mostrar estado de guardado.
- Sustituir fechas fijas por contexto real.
- Conectar el dashboard al modelo único de planificación.
- Revisar todos los estados vacíos y de error.
- Validar escritorio y celular con capturas de referencia.

#### Puerta de salida de V1

V1 se considera terminada cuando:

- el respaldo V0 fue restaurado en una instalación limpia;
- no quedan escrituras sobre el modelo legado;
- el Motor y permisos críticos tienen pruebas;
- el estado local tiene esquema y migraciones;
- `app.js` dejó de contener reglas críticas;
- todos los flujos actuales pasan en CI y prueba manual;
- la aplicación está preparada para cambiar repositorios locales por HTTP.

## 7. Plan de trabajo V2

### V2.0 - Decisiones y base del backend

#### Objetivo

Crear la infraestructura mínima sin conectar todavía la grilla real.

#### ADR obligatorios

- ADR-001: stack de backend.
- ADR-002: PostgreSQL y herramienta de migraciones.
- ADR-003: autenticación y manejo de sesión.
- ADR-004: estrategia de despliegue y ambientes.
- ADR-005: almacenamiento y retención de adjuntos.
- ADR-006: estrategia de concurrencia y versionado.
- ADR-007: política de auditoría y privacidad.

#### Estructura propuesta del repositorio

```text
apps/
  web/
  api/
packages/
  domain/
  contracts/
  test-fixtures/
docs/
infra/
```

Se recomienda mantener frontend y backend en el mismo repositorio durante V2 para compartir contratos, ejecutar cambios coordinados y simplificar CI.

### V2.1 - Modelo relacional y migraciones

#### Entidades principales

```text
organizations
users
roles
user_roles
employees
sectors
shifts
operational_position_templates
planning_weeks
planning_versions
planning_positions
assignments
weekly_days_off
requests
request_participants
request_decisions
operational_events
planning_applications
notifications
notification_recipients
audit_entries
attachments
```

#### Relaciones centrales

```text
planning_week
  -> planning_versions
      -> planning_positions
          -> assignments

request
  -> request_participants
  -> request_decisions
  -> operational_event
      -> planning_application
          -> affected assignments
```

#### Restricciones de base de datos

- Identificadores únicos y estables.
- Una semana no puede tener períodos inválidos.
- Las versiones pertenecen a una única semana.
- Una versión publicada tiene número de versión único por semana.
- Una posición pertenece a una versión y fecha incluidas en la semana.
- Una asignación referencia una posición y empleado existentes.
- No se borran físicamente empleados con historial.
- Una solicitud aplicada posee una clave de idempotencia única.
- Los registros de auditoría no se actualizan desde la aplicación.
- Cada registro mutable posee `createdAt`, `updatedAt` y `version`.

Las restricciones de duplicidad por día y turno requieren validación de dominio dentro de una transacción, porque dependen de la relación entre posición, fecha, turno y empleado.

### V2.2 - Identidad, sesión y permisos

#### Cambios

- Reemplazar usuarios demo por usuarios persistidos.
- Vincular usuario, rol del sistema y empleado cuando corresponda.
- Almacenar contraseñas mediante un hash seguro.
- Utilizar sesión segura en cookie `HttpOnly`, `Secure` y `SameSite`.
- Implementar inicio, cierre, expiración y recuperación de acceso.
- Proteger operaciones contra CSRF si la estrategia de sesión lo requiere.
- Limitar intentos de autenticación.
- Registrar inicios, cierres y acciones sensibles.
- Revalidar permisos en cada endpoint.

#### Matriz mínima

| Acción | Admin/Encargada | Supervisora | Personal |
| --- | --- | --- | --- |
| Ver grilla publicada | Sí | Sí | Sí |
| Editar planificación | Sí | No | No |
| Ver excepciones | Sí | Sí | No |
| Crear solicitud propia | Según vínculo | No administrativa | Sí |
| Aceptar como compañero | Si corresponde | Si corresponde | Si corresponde |
| Aprobar/rechazar | Sí | No | No |
| Revocar aplicación | Sí | No | No |
| Ver auditoría | Sí | Sí | No |

La matriz definitiva debe derivarse de las reglas actuales y probarse tanto en UI como en API.

### V2.3 - API versionada

#### Convenciones

- Prefijo `/api/v1`.
- Respuestas JSON estructuradas.
- Errores con código estable, mensaje seguro y detalles de campo cuando corresponda.
- Identificador de correlación por petición.
- Paginación y filtros en colecciones.
- Fechas en UTC y formato ISO 8601.
- Versionado optimista mediante campo `version` o `ETag`.
- Clave de idempotencia en comandos críticos.

#### Endpoints iniciales

```text
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
GET    /api/v1/me

GET    /api/v1/employees
GET    /api/v1/planning-weeks
POST   /api/v1/planning-weeks
GET    /api/v1/planning-weeks/:id
PATCH  /api/v1/planning-weeks/:id
POST   /api/v1/planning-weeks/:id/publish
POST   /api/v1/planning-weeks/:id/pause
POST   /api/v1/planning-weeks/:id/return-to-draft

GET    /api/v1/requests
POST   /api/v1/requests
GET    /api/v1/requests/:id
POST   /api/v1/requests/:id/partner-decision
POST   /api/v1/requests/:id/manager-decision
POST   /api/v1/requests/:id/revoke

GET    /api/v1/notifications
POST   /api/v1/notifications/:id/read
GET    /api/v1/audit
```

No se recomienda un endpoint genérico para reemplazar el estado completo. Cada comando debe expresar la intención operativa.

### V2.4 - Motor de Planificación transaccional

#### Objetivo

Ejecutar en servidor las mismas reglas ya validadas en V1.

#### Flujo de aprobación

```text
Solicitud pendiente
  -> autorización
  -> validación de versión de grilla
  -> simulación del Motor
  -> transacción
       actualizar solicitud
       crear evento operativo
       aplicar asignaciones
       crear excepción si corresponde
       crear planning_application
       crear auditoría
  -> commit
  -> notificaciones
```

#### Garantías

- Si falla cualquier escritura, toda la transacción revierte.
- La solicitud no puede aplicarse dos veces.
- El Motor bloquea datos insuficientes o inconsistentes.
- La fecha y el usuario aprobador provienen del servidor.
- La revocación verifica que las asignaciones no hayan cambiado.
- Una revocación insegura no modifica la grilla y registra revisión manual.
- El frontend nunca modifica asignaciones como efecto lateral de aprobar.

#### Alcance conservado

- Licencia con reemplazo.
- Ausencia con reemplazo.
- Cambio de turno aceptado por compañero.
- Revocación segura de esos tres casos.

No se agregan cambio de franco automático, vacaciones, doble turno automático, F1/F2 ni sugerencias.

### V2.5 - Integración progresiva del frontend

#### Estrategia

Los repositorios locales de V1 se reemplazan por adaptadores HTTP de forma gradual:

```text
LocalPlanningRepository -> ApiPlanningRepository
LocalRequestRepository  -> ApiRequestRepository
LocalAuditRepository    -> ApiAuditRepository
LocalSessionRepository  -> ApiSessionRepository
```

#### Orden de conexión

1. Sesión y usuario actual.
2. Empleados y catálogos en lectura.
3. Semanas y grilla en lectura.
4. Edición de planificación.
5. Publicación y ciclo de vida.
6. Solicitudes y decisiones.
7. Motor y revocaciones.
8. Notificaciones y auditoría.

#### Estados nuevos de interfaz

- cargando;
- guardando;
- guardado;
- error recuperable;
- sesión vencida;
- sin conexión;
- conflicto de versión;
- acción en progreso;
- reintento seguro.

Durante la transición no se debe escribir simultáneamente en API y `localStorage` como dos fuentes de verdad. Puede existir lectura comparativa, pero cada ambiente debe tener una única persistencia autoritativa.

### V2.6 - Migración de datos V0/V1

#### Proceso

```text
Exportar -> validar -> transformar -> importar en staging
         -> reconciliar -> aprobar -> importar en producción
```

#### Etapas

1. Congelar temporalmente ediciones durante la migración final.
2. Exportar el estado mediante la herramienta de V1.
3. Verificar checksum y versión de esquema.
4. Crear identificadores y relaciones de base de datos.
5. Importar empleados, catálogos, semana, puestos, asignaciones, francos, excepciones, solicitudes y auditoría.
6. Generar un informe de elementos importados, omitidos y rechazados.
7. Comparar conteos y relaciones contra el respaldo.
8. Ejecutar validaciones del Motor sin modificar datos.
9. Revisar visualmente la grilla migrada.
10. Obtener aprobación funcional.
11. Habilitar el frontend conectado a la API.
12. Conservar el respaldo V0/V1 y la base anterior durante el período definido de rollback.

#### Reconciliación obligatoria

| Elemento | Validación |
| --- | --- |
| Semana | Identificador, nombre, período y estado |
| Puestos | Cantidad por día, sector y turno |
| Asignaciones | Posición y persona coincidentes |
| Francos | Fecha, sector, persona y tipo |
| Excepciones | Posición, afectados, cobertura y estado |
| Solicitudes | Tipo, participantes, estado e impacto |
| Aplicaciones | Solicitud origen y posiciones afectadas |
| Auditoría | Cantidad y asociación disponible |

Ningún dato rechazado puede descartarse silenciosamente.

### V2.7 - Operación, seguridad y despliegue

#### Ambientes

- Desarrollo local.
- Integración/pruebas.
- Staging con datos anonimizados.
- Producción.

#### CI/CD

Cada cambio deberá ejecutar:

1. análisis estático;
2. pruebas unitarias;
3. pruebas de integración;
4. pruebas de contratos;
5. build del frontend y backend;
6. escaneo de dependencias;
7. migraciones sobre una base efímera;
8. pruebas end-to-end críticas.

#### Operación mínima

- Logs estructurados sin contraseñas ni información sensible innecesaria.
- Identificador de correlación en API, Motor y auditoría.
- Métricas de errores, latencia y operaciones fallidas.
- Alertas por fallos de login, publicación, aprobación o Motor.
- Copias automáticas de PostgreSQL.
- Restauración ensayada en un ambiente aislado.
- Gestión segura de secretos y variables.
- HTTPS obligatorio.
- Política de actualización de dependencias.

## 8. Estrategia de pruebas

### Pirámide

```text
          E2E por rol
       Integración API/DB
    Casos de uso y contratos
Reglas puras del dominio y Motor
```

### Dominio

- Estados y transiciones.
- Invariantes de asignación.
- Simulación, aplicación y revocación.
- Idempotencia.
- Conflictos y revisión manual.

### Backend

- Autenticación y permisos por endpoint.
- Restricciones de base de datos.
- Transacciones completas y rollback.
- Concurrencia y versiones antiguas.
- Auditoría y correlación.

### Frontend

- Render por rol.
- Estados de carga y error.
- Formularios y validaciones.
- Sesión vencida y conflicto de versión.
- Accesibilidad y navegación por teclado.
- Responsive y regresión visual.

### E2E obligatorias

1. Encargada crea, completa y publica una semana.
2. Personal consulta solo la versión publicada.
3. Personal crea licencia; encargada selecciona reemplazo y aprueba.
4. Motor actualiza la grilla y registra trazabilidad.
5. Encargada revoca y la grilla vuelve al estado seguro.
6. Dos usuarios editan la misma versión y el segundo recibe conflicto.
7. Supervisora consulta pero no aprueba ni revoca.
8. Un usuario sin permiso intenta ejecutar un endpoint protegido.

## 9. Estrategia de ramas y entregas

Cada bloque debe integrarse en cambios pequeños y verificables. Orden sugerido:

1. `v1-backup-and-schema`
2. `v1-characterization-tests`
3. `v1-planning-consolidation`
4. `v1-application-layers`
5. `v1-local-repositories`
6. `v1-frontend-stabilization`
7. `v2-backend-foundation`
8. `v2-database-and-auth`
9. `v2-planning-api`
10. `v2-requests-engine-api`
11. `v2-data-migration`
12. `v2-production-readiness`

No se debe mantener una rama de migración abierta durante toda la V1 o V2. Cada entrega debe tener alcance acotado, pruebas y documentación.

## 10. Estrategia de rollback

### Durante V1

- Conservar la exportación original de V0.
- Mantener migraciones locales hacia adelante y copia previa al cambio.
- No eliminar la clave anterior hasta validar la nueva.
- Permitir volver a una versión Git compatible con el respaldo.

### Durante V2

- Probar migraciones y rollback en staging.
- Realizar respaldo de base antes de cada migración productiva.
- Separar despliegue de esquema y activación de funcionalidad cuando sea necesario.
- Usar flags para habilitar progresivamente los adaptadores API.
- Conservar el respaldo V0/V1 sin modificar.
- Si falla la migración final, detener escrituras y volver al estado anterior; no reconciliar manualmente datos incompletos.

## 11. Riesgos y mitigaciones

| Riesgo | Mitigación |
| --- | --- |
| Perder la grilla cargada | Respaldo versionado, checksum, restauración y conciliación |
| Cambiar comportamiento durante la refactorización | Pruebas de caracterización antes de mover código |
| Mantener dos fuentes de verdad | Un repositorio autoritativo por ambiente y etapa |
| Reescribir frontend y backend simultáneamente | Adaptadores y migración progresiva |
| Aplicar dos veces una solicitud | Idempotencia y restricción única |
| Sobrescribir cambios concurrentes | Campo de versión y respuesta de conflicto |
| Permisos inconsistentes | Matriz única probada en UI y API |
| Auditoría incompleta | Escritura dentro de la misma transacción |
| Migraciones irreversibles | Ensayo en staging, backups y plan de rollback |
| Datos legacy inválidos | Informe de rechazo y revisión; nunca omisión silenciosa |
| Aumentar complejidad sin valor | Monolito modular y alcance cerrado a reglas existentes |

## 12. Fuera de alcance hasta cerrar V2

- Cambio de franco automático.
- Vacaciones automáticas.
- Cálculo F1/F2.
- Selección automática de reemplazos.
- Motor de sugerencias.
- Optimización automática de la grilla.
- Integraciones con WhatsApp, correo o RRHH.
- Multisede operativa.
- Reportes avanzados.
- Aplicación móvil nativa.
- Microservicios.

## 13. Definición de terminado

La transición de V0 a V2 queda terminada únicamente cuando:

- existe un respaldo restaurable de la V0 original;
- el modelo legado de grilla dejó de utilizarse;
- las reglas críticas están cubiertas por pruebas;
- la interfaz consume casos de uso y repositorios definidos;
- backend y base de datos se despliegan de forma reproducible;
- la autenticación y los permisos son reales;
- la API no acepta escrituras no autorizadas;
- el Motor aplica y revoca dentro de transacciones;
- una solicitud no puede aplicarse dos veces;
- la auditoría conserva actor, fecha del servidor, acción, resultado y correlación;
- la grilla migrada coincide con el respaldo V0/V1;
- dos dispositivos consultan el mismo estado;
- los conflictos de edición se detectan y no sobrescriben datos;
- las copias de seguridad pueden restaurarse;
- todas las pruebas críticas pasan en CI y staging;
- la encargada valida manualmente los flujos principales.

## 14. Primer bloque a ejecutar

El primer cambio no será crear el backend. Será implementar V1.0:

1. definir el formato de respaldo;
2. exportar la grilla actual;
3. restaurarla en un entorno aislado;
4. comparar todos sus datos;
5. recién entonces comenzar las pruebas de caracterización.

Este orden protege el activo más importante de la V0: la planificación real ya cargada y las reglas que fueron validadas durante su uso.
