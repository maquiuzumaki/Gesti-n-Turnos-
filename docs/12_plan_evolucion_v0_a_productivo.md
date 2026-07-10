# Plan de evolución de Uzumaki: de V0 a producto operativo

## 1. Propósito

Este documento define una evolución gradual de Uzumaki desde la versión actual, denominada **V0**, hasta una aplicación productiva de planificación operativa.

El criterio de versionado de este plan es funcional y no depende de los nombres usados anteriormente en commits o documentos. La aplicación actual se considera V0 porque valida el producto y sus reglas principales, pero todavía funciona como un prototipo frontend con datos locales y usuarios simulados.

El objetivo no es reescribir todo de una vez. Cada versión debe entregar una mejora utilizable, verificable y reversible, conservando la operación ya validada.

## 2. Diagnóstico de la V0 actual

### 2.1 Capacidades ya disponibles

La V0 contiene una base funcional valiosa:

- Inicio de sesión simulado y navegación por roles.
- Perfiles de administradora/encargada, supervisora y personal operativo.
- Creación de una semana de planificación.
- Grilla semanal editable con Cocina y Pisos, turnos Mañana y Tarde.
- Asignación manual de personas y carga manual de francos F1/F2.
- Validación de duplicados en el mismo día y turno.
- Doble turno permitido cuando los turnos son distintos.
- Estados de grilla: borrador, publicada y pausada.
- Publicación, pausa, vuelta a borrador, republicación y eliminación de una grilla.
- Vista del personal limitada a la grilla publicada y en modo consulta.
- Registro, edición y eliminación de excepciones semanales.
- Solicitudes de licencia, ausencia, cambio de franco y cambio de turno.
- Aceptación del compañero cuando corresponde.
- Aprobación y rechazo por encargada/admin.
- Vista previa del impacto de una solicitud.
- Motor de Planificación para aplicar licencias, ausencias y cambios de turno.
- Revocación segura de licencias, ausencias y cambios de turno aplicados.
- Notificaciones internas y registro básico de auditoría.
- Compatibilidad básica con solicitudes antiguas almacenadas en el navegador.
- Interfaz responsive sin dependencias de compilación.

### 2.2 Arquitectura actual

La aplicación es un frontend estático construido con HTML, CSS y JavaScript.

- `src/app.js` concentra renderizado, navegación, formularios y coordinación de casos de uso.
- `src/services/store.js` carga, normaliza y guarda el estado completo.
- `src/services/planningWeeks.js` crea la estructura de una semana.
- `src/services/planningEngine.js` aplica y revoca cambios automáticos.
- `src/services/permissions.js` define permisos básicos por rol.
- `src/data/mockData.js` contiene catálogos, empleados y usuarios de demostración.
- El estado se guarda como un único documento JSON en `localStorage` bajo la clave `uzumaki-mvp-state-v4`.
- La sesión se guarda en `sessionStorage` bajo la clave `uzumaki-user-v4`.

### 2.3 Limitaciones para un uso productivo

Las siguientes limitaciones no invalidan el prototipo, pero impiden considerarlo todavía un sistema productivo:

- Los datos existen solamente en el navegador y dispositivo donde fueron cargados.
- No hay servidor, API ni base de datos compartida.
- Dos usuarios no pueden trabajar sobre el mismo estado real.
- El inicio de sesión y las contraseñas son simulados.
- No existe control de concurrencia ni resolución de ediciones simultáneas.
- La aplicación mantiene dos modelos de grilla: el modelo legado `schedule/draft` y el modelo vigente `planningWeek`.
- Solo se administra una `planningWeek` activa; no hay repositorio real de semanas históricas.
- La grilla publicada no es todavía una versión inmutable separada del borrador de trabajo.
- La auditoría es local, mutable y usa textos de tiempo simplificados como `Ahora`.
- Las notificaciones son locales y no tienen destinatarios, entrega ni confirmación real.
- La gestión de empleados está deshabilitada y depende de datos simulados.
- No hay esquema formal, restricciones de base de datos ni migraciones versionadas.
- No hay pruebas automatizadas, integración continua ni entorno de pruebas separado.
- `src/app.js` concentra demasiadas responsabilidades y aumenta el riesgo de regresiones.
- No hay monitoreo, copias de seguridad, recuperación ante fallos ni política de seguridad.
- Los adjuntos y certificados no tienen almacenamiento real.

## 3. Definición de aplicación productiva

Uzumaki será operativamente productiva cuando pueda ser usada por encargadas, supervisora y personal durante una semana real sin depender de un único navegador y cumpla, como mínimo, estas condiciones:

- Datos centralizados, persistentes y recuperables.
- Usuarios reales con autenticación segura y permisos comprobados en el servidor.
- Historial de semanas y versiones publicadas.
- Edición simultánea protegida contra sobrescrituras accidentales.
- Solicitudes y decisiones visibles para las personas correctas.
- Motor de Planificación transaccional, trazable e idempotente.
- Auditoría inmutable de acciones relevantes.
- Pruebas automáticas de las reglas críticas.
- Copias de seguridad y procedimiento de recuperación.
- Monitoreo de errores y operación.
- Piloto validado con una semana real y criterios de aceptación firmados.

La meta productiva inicial se alcanza en la **V5**. La **V6** representa crecimiento posterior y no es requisito para comenzar a operar.

## 4. Principios de evolución

1. **Preservar datos reales.** Antes de cambiar el almacenamiento debe existir una exportación y una migración verificable de la grilla actualmente cargada.
2. **Una única fuente de verdad.** La planificación vigente debe abandonar gradualmente el modelo legado y usar un modelo de dominio único.
3. **Toda modificación pasa por casos de uso controlados.** La interfaz no debe escribir directamente sobre estructuras internas de planificación.
4. **El Motor de Planificación ejecuta decisiones.** No propone reemplazos ni toma decisiones administrativas sin una regla aprobada.
5. **Publicar genera una versión estable.** El personal nunca debe ver cambios incompletos del borrador.
6. **Permisos en dos niveles.** La interfaz oculta acciones no permitidas y el backend vuelve a validar cada operación.
7. **Automatización gradual.** Cada regla nueva debe incluir simulación, aplicación, auditoría y reversión o revisión manual.
8. **Observabilidad antes de complejidad.** No se agregan automatizaciones difíciles de diagnosticar sin trazabilidad suficiente.
9. **Cada versión tiene una puerta de salida.** Una versión no se cierra solo porque el código esté escrito; debe superar pruebas y validación operativa.

## 5. Roadmap por versiones

### V1 - Estabilización y consolidación del dominio

#### Objetivo

Convertir el prototipo actual en una base técnica confiable, todavía local, sin cambiar las reglas de negocio ya validadas.

#### Alcance

- Inventariar y congelar las reglas actuales mediante pruebas automatizadas.
- Agregar pruebas unitarias para:
  - duplicados por día y turno;
  - doble turno permitido;
  - publicación incompleta;
  - aplicación y revocación de licencias/ausencias;
  - aplicación y revocación de cambios de turno;
  - permisos de encargada, supervisora y personal.
- Agregar pruebas de integración para los flujos completos de grilla y solicitudes.
- Incorporar validación formal del estado almacenado y migraciones locales versionadas.
- Crear una función segura de exportación e importación de respaldo de la V0.
- Consolidar `schedule/draft` y `planningWeek` alrededor de un único modelo vigente.
- Separar gradualmente `src/app.js` en vistas, casos de uso y componentes de interfaz.
- Reemplazar fechas y textos fijos por fechas reales y marcas de tiempo ISO.
- Definir identificadores, estados y transiciones válidas en un único lugar.
- Documentar el contrato real del Motor de Planificación.
- Agregar herramientas de calidad: formateo, análisis estático, pruebas e integración continua.
- Revisar accesibilidad, navegación móvil, mensajes de error y estados vacíos.

#### Fuera de alcance

- Backend y base de datos compartida.
- Automatizaciones nuevas.
- Multiusuario real.
- Integraciones externas.

#### Criterio de salida

- La grilla V0 puede exportarse, importarse y recuperarse sin pérdida.
- Todas las reglas críticas tienen pruebas automáticas.
- No quedan escrituras funcionales sobre el modelo legado.
- Los flujos actuales pasan una prueba manual completa en escritorio y celular.
- La aplicación puede cambiar su almacenamiento en V2 sin reescribir las reglas del Motor.

### V2 - Backend, base de datos y seguridad

#### Objetivo

Reemplazar el almacenamiento local y la autenticación simulada por una plataforma centralizada y segura.

#### Alcance

- Crear un backend con API versionada.
- Incorporar una base de datos relacional con migraciones.
- Modelar como entidades independientes:
  - usuarios y roles;
  - empleados;
  - sectores, puestos y turnos;
  - semanas de planificación;
  - versiones de grilla;
  - asignaciones y francos;
  - solicitudes y decisiones;
  - eventos/excepciones;
  - aplicaciones del Motor;
  - notificaciones;
  - auditoría.
- Implementar autenticación real, contraseñas cifradas, recuperación de acceso y cierre de sesión seguro.
- Validar permisos y reglas críticas en el servidor.
- Crear versionado optimista para evitar sobrescrituras silenciosas.
- Ejecutar aplicación y revocación del Motor dentro de transacciones de base de datos.
- Implementar auditoría inmutable con actor, fecha, entidad, acción, resultado y correlación.
- Agregar almacenamiento seguro para certificados o adjuntos, si se mantienen dentro del alcance operativo.
- Crear entornos separados de desarrollo, prueba y producción.
- Configurar despliegue automatizado, variables seguras, copias de seguridad y restauración comprobada.
- Construir una migración asistida desde el respaldo JSON de la V0/V1.

#### Decisiones técnicas que deben cerrarse al iniciar V2

- Tecnología de backend y hosting.
- Motor de base de datos.
- Proveedor de autenticación o autenticación propia.
- Política de retención de datos y adjuntos.
- Requisitos legales y de privacidad aplicables.

#### Criterio de salida

- Dos usuarios pueden consultar el mismo estado desde dispositivos distintos.
- Reiniciar o cambiar de navegador no pierde información.
- Ningún permiso depende solo de ocultar botones en el frontend.
- Las transacciones del Motor se aplican completas o no se aplican.
- Existe restauración probada desde una copia de seguridad.
- La grilla real de V0/V1 puede migrarse y compararse contra su origen.

### V3 - Operación multiusuario y piloto controlado

#### Objetivo

Hacer que la aplicación acompañe una semana real de trabajo con colaboración segura entre todos los roles.

#### Alcance

- Habilitar gestión administrativa de empleados activos e inactivos sin borrar historial.
- Vincular cada usuario real con su empleado y rol correspondiente.
- Administrar múltiples semanas: pasada, actual y próximas.
- Mantener borrador editable y publicación como versiones separadas.
- Permitir preparar una nueva versión sin alterar la versión que ve el personal.
- Mostrar historial y comparación de versiones publicadas.
- Resolver conflictos de edición con aviso y recarga controlada.
- Completar notificaciones internas dirigidas por usuario y por evento.
- Asegurar que el personal vea solo sus datos y la grilla publicada autorizada.
- Mejorar el tablero de encargada con pendientes, ausencias, coberturas y alertas accionables.
- Agregar búsqueda y filtros operativos por semana, persona, sector, solicitud y estado.
- Completar historial de solicitudes, excepciones, aprobaciones y revocaciones.
- Realizar migración de datos reales y un piloto paralelo con el método de trabajo actual.

#### Piloto recomendado

1. Cargar una semana futura completa.
2. Compararla con la planificación manual vigente.
3. Publicarla a un grupo controlado.
4. Procesar solicitudes y excepciones reales durante siete días.
5. Verificar resultados diariamente con la encargada.
6. Registrar incidencias sin corregir datos directamente en la base.
7. Cerrar la semana con conciliación de grilla, solicitudes y auditoría.

#### Criterio de salida

- Una semana real puede gestionarse de principio a fin en Uzumaki.
- Cada rol ve y ejecuta únicamente lo que le corresponde.
- No se pierde ningún cambio por concurrencia o desconexión.
- La publicación que ve el personal siempre corresponde a una versión identificable.
- Las incidencias del piloto están clasificadas y no existen defectos críticos abiertos.

### V4 - Motor de Planificación operativo completo

#### Objetivo

Extender la automatización de manera controlada una vez que los datos, permisos y transacciones sean confiables.

#### Alcance

- Consolidar un registro de eventos operativos separado de la grilla base.
- Garantizar idempotencia: una solicitud no puede aplicarse dos veces.
- Mantener simulación, validación, aplicación, auditoría y revocación para cada regla.
- Incorporar cambio de franco automático.
- Incorporar vacaciones con período, turnos afectados y cobertura.
- Implementar el ciclo individual de francos 6x1/6x2 y sus marcas F1/F2.
- Aplicar coberturas de franqueras según reglas aprobadas.
- Registrar puestos sin cubrir y alertas de dotación mínima.
- Validar compatibilidad de rol, sector, turno y puesto cuando corresponda.
- Agregar una bandeja de revisión manual para eventos no aplicables de forma segura.
- Permitir reconstruir el resultado publicado desde una versión base y sus eventos válidos.
- Incorporar pruebas de propiedades e invariantes del Motor.

#### Orden recomendado de reglas

1. Cambio de franco.
2. Vacaciones.
3. Ciclo F1/F2 individual.
4. Cobertura automática de pisos.
5. Asignación de franqueras sin cobertura a Cocina Mañana.
6. Alertas de dotación y puestos sin cubrir.

#### Criterio de salida

- Cada regla puede simularse antes de aprobarse.
- Aplicar dos veces el mismo evento no duplica cambios.
- Una falla intermedia no deja la planificación parcialmente modificada.
- Toda aplicación identifica evento, versión base, cambios, actor y fecha.
- Toda revocación insegura deja la grilla intacta y genera revisión manual.
- La encargada puede explicar por qué cada persona aparece en cada puesto.

### V5 - Salida productiva y confiabilidad operacional

#### Objetivo

Convertir el piloto validado en la herramienta oficial de planificación diaria.

#### Alcance

- Optimizar la experiencia móvil del personal como aplicación web instalable.
- Incorporar estrategia de funcionamiento ante conectividad inestable.
- Configurar monitoreo de disponibilidad, errores, rendimiento y tareas fallidas.
- Definir alertas técnicas y responsables de respuesta.
- Completar controles de seguridad, privacidad y acceso a datos personales.
- Registrar sesiones, intentos fallidos y acciones administrativas sensibles.
- Implementar reportes operativos y exportación de grilla e historial.
- Establecer política de copias, restauración y continuidad operativa.
- Preparar manuales breves por rol y capacitación.
- Definir soporte, canal de incidencias y tiempos de respuesta.
- Ejecutar pruebas de carga acordes a la dotación esperada.
- Realizar aceptación formal y plan de vuelta atrás antes del lanzamiento.

#### Criterio de salida

- Uzumaki es la fuente oficial de la grilla semanal.
- Existe un responsable funcional y uno técnico.
- Los usuarios fueron capacitados y pueden completar sus tareas principales.
- Las copias de seguridad y la restauración fueron verificadas.
- Los errores críticos generan alertas y tienen procedimiento de atención.
- Se completa al menos un ciclo operativo real sin pérdida ni inconsistencia de datos.

### V6 - Escala, integraciones e inteligencia asistida

#### Objetivo

Escalar el producto después de estabilizar su uso productivo, sin poner en riesgo la operación principal.

#### Alcance posible

- Múltiples servicios, sedes o instituciones con aislamiento de datos.
- Configuración de sectores, puestos, turnos y reglas por organización.
- Integración con sistemas de RRHH, asistencia o liquidación.
- Notificaciones externas por correo, mensajería o push con consentimiento y trazabilidad.
- Indicadores históricos de ausentismo, coberturas, cambios y carga operativa.
- Detección de patrones y alertas preventivas.
- Sugerencias de cobertura explicables y siempre confirmadas por una encargada.
- Optimización asistida de la planificación con restricciones configurables.
- API para integraciones autorizadas.

#### Condición de entrada

V6 no debe comenzar hasta que V5 tenga métricas de uso estable, datos confiables y reglas operativas suficientemente maduras. Las sugerencias automáticas nunca deben reemplazar la decisión administrativa ni ocultar la explicación de una asignación.

## 6. Dependencias entre versiones

| Versión | Depende de | Resultado principal |
| --- | --- | --- |
| V0 | Prototipo actual | Validación funcional y de experiencia |
| V1 | V0 validada | Dominio estable, probado y migrable |
| V2 | V1 | Datos centralizados, seguridad y transacciones |
| V3 | V2 | Operación multiusuario y piloto real |
| V4 | V3 | Automatización operativa completa y confiable |
| V5 | V3 y reglas V4 necesarias | Uso productivo oficial |
| V6 | V5 estable | Escala, integraciones y asistencia inteligente |

V4 puede desarrollarse en paralelo con la preparación de V5, pero ninguna regla automática debe habilitarse en producción antes de superar sus pruebas y validación operativa.

## 7. Prioridades inmediatas

El siguiente paso recomendado es iniciar V1 en este orden:

1. Crear un respaldo exportable de la grilla y los datos V0 actuales.
2. Escribir pruebas de caracterización para las reglas que hoy funcionan.
3. Definir un único modelo de planificación y retirar gradualmente el modelo legado.
4. Formalizar esquemas, estados y migraciones del almacenamiento local.
5. Dividir `src/app.js` por responsabilidades sin cambiar comportamiento.
6. Preparar la decisión técnica de backend, base de datos y despliegue para V2.

## 8. Riesgos principales

| Riesgo | Consecuencia | Mitigación |
| --- | --- | --- |
| Migrar sin respaldo de `localStorage` | Pérdida de la grilla real cargada | Exportación, checksum, migración de prueba y comparación |
| Automatizar antes de centralizar datos | Cambios inconsistentes entre dispositivos | Completar V2 y transacciones antes de ampliar el Motor |
| Mantener dos modelos de grilla | Errores de renderizado y reglas divergentes | Consolidación en V1 |
| Editar una grilla publicada directamente | Personal expuesto a cambios incompletos | Versiones publicadas inmutables en V3 |
| Permisos solo en frontend | Acciones no autorizadas | Autorización obligatoria en backend desde V2 |
| Motor sin idempotencia | Solicitudes aplicadas más de una vez | Clave única por evento y transacción en V4 |
| Crecer `app.js` sin modularizar | Regresiones y mantenimiento lento | Separación gradual y pruebas en V1 |
| Incorporar reglas no validadas | Automatización incorrecta de la operación | Simulación, piloto y activación por regla |

## 9. Indicadores de avance

Para medir evolución real y no solo cantidad de funcionalidades se recomienda seguir:

- Porcentaje de reglas críticas con pruebas automáticas.
- Cantidad de defectos críticos por semana operativa.
- Solicitudes resueltas sin intervención fuera de Uzumaki.
- Cambios de grilla con trazabilidad completa.
- Eventos aplicados automáticamente y eventos enviados a revisión manual.
- Tiempo promedio para publicar una semana.
- Incidencias de permisos o exposición de información.
- Éxito de copias de seguridad y pruebas de restauración.
- Usuarios activos por rol y tasa de tareas completadas.
- Diferencias detectadas entre la grilla publicada y la operación real.

## 10. Resultado esperado

La evolución propuesta conserva el conocimiento ya incorporado en la V0 y evita reemplazarlo por una reescritura prematura. V1 protege y ordena ese conocimiento; V2 lo convierte en un sistema compartido; V3 lo somete a una operación real; V4 completa la automatización; V5 formaliza la salida productiva; y V6 permite escalar e incorporar asistencia inteligente con una base confiable.

La decisión más importante para el próximo ciclo no es agregar una nueva regla al Motor, sino asegurar que la planificación actual pueda respaldarse, probarse y migrarse sin perder la grilla real ya cargada.
