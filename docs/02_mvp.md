# 02. MVP del producto

## Objetivo del MVP

Construir una primera versión del producto que permita a la organización gestionar de forma centralizada y trazable la operación diaria del personal, con foco en:

- la planificación semanal,
- la gestión de solicitudes,
- la visibilidad del estado del servicio,
- la comunicación interna básica,
- y la trazabilidad de las acciones.

El MVP debe resolver el problema principal de forma simple, útil y verificable, sin intentar cubrir toda la complejidad de una gestión integral del personal en la primera etapa.

## Alcance funcional

El MVP incluirá las funcionalidades necesarias para que la encargada y los perfiles administrativos puedan operar de forma práctica, mientras que el personal pueda consultar información y realizar solicitudes desde un acceso simple y móvil.

### Alcance incluido

- Autenticación básica con usuario y contraseña.
- Roles y permisos simples: administradora principal, encargada, supervisora y personal.
- Gestión básica de empleados.
- Tablero operativo inicial con indicadores básicos.
- Grilla semanal con versión en borrador y versión publicada.
- Gestión de solicitudes de cambio de turno, cambio de franco, licencia y parte de enfermo.
- Notificaciones internas básicas.
- Historial de auditoría básico.
- Historial personal visible según rol.
- Indicadores operativos generales del servicio.

### Alcance no incluido en el MVP

- Integraciones externas como WhatsApp, correo o APIs de terceros.
- Reglas complejas de aprobación por tipo de solicitud o por sector.
- Módulo completo de apercibimientos o disciplina.
- Gestión avanzada de RRHH.
- Reportes empresariales complejos.
- Multisede o multi-servicio como funcionalidad activa.

## Funcionalidades imprescindibles

Estas funcionalidades son esenciales para que el producto tenga valor desde la primera versión:

1. Inicio de sesión con usuarios y contraseñas.
2. Visualización de un tablero operativo inicial.
3. Gestión de empleados con información básica y estado activo/inactivo.
4. Creación y publicación de una grilla semanal.
5. Visualización de la grilla oficial para el personal y del borrador para los perfiles administrativos.
6. Gestión de solicitudes con flujo simple: creación, aceptación del compañero cuando aplique, aprobación o rechazo administrativa.
7. Actualización automática de la grilla oficial cuando una solicitud aprobada impacta en la planificación.
8. Generación de versiones de grilla con trazabilidad.
9. Centro de notificaciones internas.
10. Historial de auditoría básico.
11. Indicadores operativos simples para la toma de decisiones.

## Funcionalidades excluidas del MVP

Las siguientes funcionalidades pueden dejarse para futuras versiones sin afectar el objetivo principal del producto:

- Notificaciones push, correo electrónico o WhatsApp.
- Reglas de aprobación diferenciadas por tipo de solicitud.
- Múltiples niveles de aprobación complejos.
- Módulo avanzado de incidencias y apercibimientos.
- Reportes PDF o exportación avanzada.
- Gestión completa de vacaciones, licencias y ausentismos con lógica jurídica o documental compleja.
- Soporte para múltiples sedes o servicios activos en la misma instancia.
- Integración con sistemas externos de RRHH o recursos.
- Funcionalidades de análisis predictivo o automatización avanzada.

## Reglas de negocio mínimas

Estas reglas deben quedar definidas desde el inicio para evitar ambigüedades durante el desarrollo:

1. Cada usuario debe iniciar sesión con credenciales válidas.
2. Los permisos dependen del rol del usuario.
3. La grilla oficial es la única visible para el personal.
4. El borrador solo es visible para perfiles administrativos.
5. La grilla publicada puede reemplazarse por una nueva versión cuando haya cambios aprobados.
6. Toda modificación de la grilla oficial debe quedar registrada en el historial.
7. Una solicitud solo puede ser aprobada una vez.
8. Toda acción relevante debe registrarse en auditoría con usuario, fecha, tipo de acción y resultado.
9. El personal operativo mantiene su sector principal. Sólo las franqueras pueden recibir asignaciones temporales en Cocina durante el turno mañana cuando no exista una cobertura pendiente en Pisos.
10. Un empleado dado de baja debe conservar su historial y no eliminarse físicamente del sistema.
11. Las notificaciones se registran dentro de la aplicación y están visibles para el usuario correspondiente.
12. Los indicadores operativos deben calcularse automáticamente a partir de los datos existentes.

## Riesgos identificados

Los principales riesgos del MVP son:

1. Alcance excesivo.
   Si se intentan cubrir demasiados módulos desde el inicio, el proyecto puede volverse complejo y poco sostenible.

2. Falta de claridad en los permisos.
   Si los permisos no quedan bien definidos, pueden generarse errores en la operación y conflictos de responsabilidad.

3. Complejidad en la gestión de la grilla.
   La lógica de borradores, publicaciones y versiones puede volverse difícil si no se estructura de forma simple.

4. Sobre-ingeniería en la lógica de solicitudes.
   Si se modelan reglas demasiado complejas de aprobación, el MVP se vuelve más difícil de construir y validar.

5. Ambigüedad en el tratamiento de incidencias y licencias.
   Estas áreas pueden crecer rápidamente si se abordan con demasiada profundidad desde el principio.

6. Uso de demasiados módulos simultáneos.
   La combinación de turnos, solicitudes, empleados, auditoría, indicadores y notificaciones puede volverse pesada si no se prioriza bien.

## Casos de uso principales

Los casos de uso principales del MVP son los siguientes:

1. Iniciar sesión y ver el tablero operativo.
2. Crear un borrador de grilla semanal.
3. Publicar una grilla oficial.
4. Modificar la grilla oficial mediante una solicitud aprobada.
5. Crear una solicitud de cambio de turno o franco.
6. Aceptar una solicitud cuando corresponda.
7. Aprobar o rechazar una solicitud desde un perfil administrativo.
8. Registrar un parte de enfermo o una licencia.
9. Consultar el estado de un empleado y su historial personal.
10. Revisar el historial de auditoría y las versiones de grilla.
11. Recibir notificaciones internas de cambios relevantes.

## Criterios para considerar exitoso el MVP

El MVP será considerado exitoso si permite cumplir, de forma clara y estable, los siguientes objetivos:

- La encargada puede visualizar el estado operativo del servicio desde un tablero inicial.
- La encargada puede crear y publicar una grilla semanal con una lógica simple de borrador/publicación.
- El personal puede consultar la grilla oficial vigente desde su vista personal.
- El personal puede crear solicitudes y consultar su estado.
- Los perfiles administrativos pueden aprobar o rechazar solicitudes y registrar la decisión.
- Los cambios aprobados impactan automáticamente en la grilla oficial y generan una nueva versión con trazabilidad.
- El sistema registra acciones relevantes en auditoría.
- El usuario puede recibir notificaciones internas de cambios importantes.
- La experiencia funcional es simple, útil y usable desde celular.

## Recomendación de simplificación

Para que el MVP sea viable y valioso, conviene mantener el foco en la operación diaria y evitar convertirlo en un sistema de gestión completa de RRHH. La prioridad debe ser cubrir de forma sólida los procesos operativos principales y dejar la complejidad adicional para futuras etapas.
