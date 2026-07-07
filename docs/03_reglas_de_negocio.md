# 03. Reglas de negocio del sistema

## 1. Reglas generales del sistema

1. El sistema operará inicialmente para un único servicio de alimentación, aunque su arquitectura deberá permitir escalar en el futuro.
2. Toda acción relevante del sistema deberá quedar registrada de forma automática para garantizar trazabilidad.
3. El sistema deberá trabajar con una única grilla oficial vigente por semana, visible para el personal.
4. Los usuarios deberán identificarse mediante autenticación básica con usuario y contraseña.
5. El sistema deberá diferenciar claramente entre:
   - información personal del empleado,
   - información operativa del turno,
   - solicitudes y eventos,
   - y auditoría del sistema.
6. Un empleado dado de baja no deberá eliminarse físicamente del sistema; deberá conservarse su historial y quedar marcado como inactivo.
7. Cada integrante del personal operativo deberá contar con un sector principal. Sólo las franqueras podrán recibir asignaciones temporales en Cocina durante el turno mañana cuando no exista una cobertura pendiente en Pisos.
8. El sistema deberá evitar duplicidades operativas que generen conflictos, como asignar dos turnos simultáneos al mismo empleado en la misma fecha o superponer un turno con un franco, licencia, vacaciones o parte de enfermo.
9. El sistema deberá presentar información clara y consistente para distintos roles, sin exponer información de más a usuarios que no tengan permisos para verla.
10. El MVP deberá priorizar simplicidad funcional por sobre cobertura compleja.

## 2. Reglas de planificación de turnos

1. La planificación semanal deberá organizarse por día, sector, turno y empleado asignado.
2. Cada asignación deberá indicar al menos:
   - día de la semana,
   - sector,
   - turno,
   - empleado asignado,
   - estado operativo.
3. Cada empleado podrá tener un estado operativo asociado a cada asignación, por ejemplo:
   - trabajando,
   - franco,
   - vacaciones,
   - licencia,
   - parte de enfermo,
   - cambio aprobado,
   - turno pendiente de cobertura.
4. El sistema deberá permitir identificar visualmente los puestos que no cuentan con cobertura suficiente.
5. La planificación deberá poder modificarse en un borrador antes de ser publicada.
6. La grilla oficial deberá reflejar únicamente la versión vigente de la planificación.
7. Los cambios en la planificación deberán quedar asociados a una causa o motivo, por ejemplo: solicitud aprobada, modificación manual, ausencia registrada, cambio operativo.
8. La planificación sólo deberá admitir cambios temporales de sector para las franqueras y bajo las condiciones definidas en `Directivas.md`.

## 3. Reglas de publicación de la grilla

1. La encargada podrá crear y modificar un borrador de la grilla sin que ese contenido sea visible para el personal.
2. El borrador solo será visible para usuarios con permisos administrativos.
3. La publicación de la grilla generará la versión oficial vigente y la volverá visible para todo el personal.
4. La grilla publicada podrá reemplazarse por una nueva publicación cuando haya cambios operativos importantes.
5. Cada nueva publicación generará automáticamente una nueva versión de la grilla.
6. Las versiones anteriores deberán conservarse para consulta administrativa y auditoría.
7. La publicación de una nueva versión deberá registrar:
   - número de versión,
   - fecha y hora,
   - usuario que publicó,
   - motivo de la publicación,
   - resumen de los cambios.
8. El personal deberá recibir una notificación cuando una nueva grilla publicada afecte su planificación.
9. La publicación deberá dejar claro cuál es la versión actual y cuál fue la versión anterior.

## 4. Reglas de cambios de turno y francos

1. El personal podrá solicitar cambios de turno o cambios de franco desde la aplicación.
2. Cuando la solicitud implique un compañero involucrado, deberá existir una etapa de aceptación o rechazo por parte del compañero antes de continuar con la aprobación administrativa.
3. Las solicitudes de cambio deberán incluir información mínima sobre:
   - empleado solicitante,
   - turno o franco afectado,
   - propuesta de cambio,
   - fecha de la solicitud,
   - observaciones.
4. Si la solicitud es aprobada, el sistema deberá actualizar la grilla oficial vigente y generar una nueva versión de la grilla.
5. Si la solicitud es rechazada, la grilla no deberá modificarse y la decisión deberá registrarse en auditoría.
6. El sistema deberá conservar el historial completo de la solicitud, incluyendo la aceptación del compañero, la aprobación administrativa y el resultado final.
7. Las solicitudes que no puedan resolverse automáticamente deberán mantenerse en estado pendiente hasta que un usuario administrativo tome una decisión.

## 5. Reglas de licencias, vacaciones y partes de enfermo

1. Las licencias, vacaciones y partes de enfermo deberán registrarse como eventos operativos que impactan la planificación.
2. Un parte de enfermo deberá poder registrarse por el personal y deberá quedar asociado a un empleado, una fecha y una observación básica.
3. Una licencia o vacaciones deberá poder registrarse una vez aprobada o autorizada por un usuario administrativo.
4. Estos eventos deberán afectar el estado operativo del empleado para los días correspondientes.
5. El sistema deberá reflejar la ausencia del empleado en la grilla y en los indicadores del servicio.
6. Los eventos de ausencia deberán ser visibles en el historial personal del empleado.
7. Si un parte de enfermo o licencia se registra en período ya cubierto por otra ausencia, el sistema deberá dejarlo como conflicto y requerir revisión administrativa.
8. La subida de certificados médicos deberá poder registrarse como evidencia asociada al parte de enfermo, aunque no será obligatoria en el MVP si se prioriza la simplicidad.

## 6. Reglas de aprobación

1. Todas las solicitudes que requieran intervención administrativa deberán seguir un flujo de aprobación simple y uniforme.
2. El flujo básico será:
   - solicitud enviada,
   - aceptación del compañero cuando corresponda,
   - revisión administrativa,
   - resolución final.
3. Cualquier usuario con permisos administrativos podrá visualizar las solicitudes pendientes y aprobar o rechazar aquellas que le correspondan.
4. Una solicitud solo podrá resolverse una vez.
5. Cada decisión de aprobación o rechazo deberá registrar:
   - quién aprobó o rechazó,
   - fecha y hora,
   - observaciones,
   - resultado final.
6. La aprobación de una solicitud que impacte la grilla deberá generar automáticamente una nueva versión oficial.
7. No se implementarán reglas diferenciadas por tipo de solicitud en esta primera versión, aunque la arquitectura deberá permitir incorporarlas en futuras versiones.
8. El sistema deberá impedir que un usuario apruebe una solicitud que ya fue resuelta.

## 7. Reglas de auditoría y trazabilidad

1. Todo cambio relevante del sistema deberá registrarse en un historial de auditoría.
2. Cada evento de auditoría deberá almacenar, como mínimo:
   - usuario que realizó la acción,
   - fecha y hora,
   - tipo de acción,
   - elemento afectado,
   - estado anterior,
   - estado nuevo,
   - observaciones.
3. La auditoría deberá cubrir, al menos:
   - creación y publicación de la grilla,
   - modificaciones de turnos o francos,
   - solicitudes de cambio,
   - aceptaciones o rechazos de solicitudes,
   - aprobaciones o rechazos administrativos,
   - registro de licencias, vacaciones y partes de enfermo,
   - cambios manuales en la planificación,
   - incidencias registradas.
4. El historial de auditoría deberá ser consultable por usuarios administrativos.
5. El historial personal del empleado deberá mostrar únicamente los eventos que afecten su actividad o estado operativo.
6. Las acciones exclusivamente administrativas que no involucren directamente al empleado deberán conservarse en la auditoría general, pero no necesariamente aparecer en el historial personal.

## 8. Reglas de notificaciones

1. El sistema deberá contar con un centro de notificaciones internas.
2. Las notificaciones deberán generarse automáticamente cuando ocurra un evento relevante.
3. Los eventos que dispararán notificaciones incluirán, como mínimo:
   - recepción de una solicitud de cambio,
   - respuesta del compañero involucrado,
   - aprobación o rechazo de una solicitud,
   - cambio de grilla que afecte al empleado,
   - publicación de una nueva grilla,
   - aprobación o rechazo de un parte de enfermo o licencia,
   - registro de incidencia relevante.
4. Las notificaciones deberán dirigirse a los usuarios afectados o involucrados.
5. El personal deberá poder consultar sus notificaciones desde la aplicación.
6. Las notificaciones no reemplazarán el flujo formal de aprobación; solo lo complementarán.
7. En esta primera versión no se implementarán notificaciones push externas ni integraciones con WhatsApp o correo.

## 9. Reglas de estadísticas e indicadores

1. Los indicadores operativos deberán calcularse automáticamente a partir de los datos registrados en la aplicación.
2. No deberá requerirse carga manual para generar indicadores.
3. Los indicadores del MVP deberán cubrir, como mínimo:
   - personal programado para el día,
   - personal presente,
   - partes de enfermo activos,
   - licencias y vacaciones vigentes,
   - puestos pendientes de cobertura,
   - solicitudes pendientes,
   - solicitudes aprobadas,
   - solicitudes rechazadas,
   - cambios de turno realizados,
   - cambios de franco realizados,
   - ausentismos por empleado,
   - licencias por empleado,
   - solicitudes realizadas por empleado,
   - solicitudes aprobadas y rechazadas por empleado,
   - historial de incidencias.
4. Los indicadores deberán estar orientados a la toma de decisiones operativas y no a reportes complejos.
5. La información mostrada en los indicadores deberá basarse en el estado actual de la operación y en los datos históricos relevantes.

## 10. Reglas de seguridad y permisos

1. El acceso al sistema deberá estar restringido a usuarios autenticados.
2. El acceso a cada funcionalidad deberá depender del rol del usuario.
3. El sistema deberá aplicar el principio de mínimo privilegio: un usuario solo podrá acceder a lo necesario para cumplir su función.
4. El personal podrá consultar su propia información, sus solicitudes, sus notificaciones y su historial personal.
5. Los perfiles administrativos podrán ver información operativa completa y gestionar turnos, solicitudes, licencias y grillas.
6. Los cambios sensibles del sistema deberán quedar registrados y asociados al usuario que los realizó.
7. La información sensible deberá conservarse de forma segura y no exponerse a usuarios sin permisos adecuados.
8. El sistema deberá permitir diferenciar entre acciones visibles para el personal y acciones de auditoría exclusivas de usuarios administrativos.

## 11. Casos excepcionales o situaciones especiales que deben contemplarse

1. Si un empleado no cumple con un cambio previamente aceptado y aprobado, deberá registrarse una incidencia asociada al empleado.
2. Si un empleado es desactivado mientras tiene turnos futuros asignados, el sistema deberá conservar su historial y marcar esos turnos como afectados o revisables.
3. Si una solicitud se aprueba después de que la grilla ya fue publicada, deberá actualizarse la grilla vigente y crearse una nueva versión automáticamente.
4. Si la grilla publicada cambia varias veces en una misma semana, el sistema deberá conservar cada versión y dejar constancia de la sucesión de cambios.
5. Si un empleado tiene una solicitud pendiente y además una ausencia registrada, el sistema deberá reflejar ambos estados sin generar inconsistencias.
6. Si hay una solicitud en curso y la grilla oficial cambia por una modificación manual, la solicitud deberá mantenerse visible en el historial y no perder su trazabilidad.
7. Si una solicitud no aplica a un compañero involucrado, deberá poder resolverse sin esa etapa intermedia.
8. Si un usuario intenta generar una acción no permitida por sus permisos, el sistema deberá rechazarla y registrar el intento como evento de seguridad relevante.

## Reglas aún no definidas y que requieren validación

Las siguientes reglas aún no están completamente definidas y deberían cerrarse antes de comenzar la implementación:

1. Qué tipo de información mínima se exige para dar de alta a un empleado en el MVP.
2. Qué sucede si un empleado tiene más de un turno en el mismo día.
3. Si una solicitud de cambio puede modificarse después de enviada.
4. Si una licencia o vacaciones debe contar con una fecha de inicio y fin obligatoria.
5. Qué criterios de prioridad usarán las notificaciones cuando haya varias al mismo tiempo.
6. Si se habilitará la carga de archivos adjuntos para certificados médicos en el MVP o se dejará solo como referencia futura.
7. Si las incidencias tendrán estados o solo serán registro histórico de eventos.
8. Si la grilla deberá contar con un estado de “publicada” y “borrador” únicamente, o si se necesitará un estado intermedio de “en revisión”.

## Contradicciones o decisiones que necesitan validación

1. La arquitectura contempla escalabilidad, pero el MVP debe mantenerse simple. Esto es correcto, aunque deberá evitarse introducir complejidad innecesaria durante la primera implementación.
2. El sistema deberá permitir múltiples publicaciones de grilla por semana, pero también mantener una única grilla oficial vigente. Esta regla es consistente si se entiende que cada publicación reemplaza la anterior, pero debe definirse claramente en la experiencia de usuario y en el modelo de datos.
3. El sistema deberá conservar el historial y, al mismo tiempo, simplificar la experiencia del personal. Esto requiere separar claramente entre historial administrativo y vista personal del empleado.
4. La gestión de permisos se definirá más adelante, pero la lógica de negocio ya asume la existencia de distintos niveles de acceso. Ese diseño debe mantenerse coherente con las reglas de seguridad.

## Propuestas de simplificación

Para evitar sobrecargar el MVP sin perder valor, se recomienda:

1. Mantener un único flujo de aprobación para todo tipo de solicitud, sin reglas diferenciadas por tipo.
2. Limitar la gestión de licencias y vacaciones a un registro básico con estado y fechas, sin lógica documental compleja.
3. Mantener las notificaciones internas como un mensaje simple en un centro de notificaciones, sin push ni integración externa.
4. Mantener un historial de auditoría general y un historial personal simple, en lugar de construir dos sistemas completos desde el inicio.
5. Mantener los indicadores del MVP limitados a los más útiles para la operación diaria, sin reportes sofisticados.
6. Mantener el módulo de incidencias como registro simple de eventos operativos, sin convertirlo en un módulo disciplinario completo.
