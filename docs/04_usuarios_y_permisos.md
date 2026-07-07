# 04. Usuarios y permisos del MVP

## 1. Objetivo del documento

Definir de forma clara los perfiles de usuario del sistema y los permisos mínimos necesarios para operar el MVP de manera segura, ordenada y coherente con las reglas de negocio.

Este documento servirá como base para la lógica de autenticación, permisos, vistas por rol y trazabilidad de acciones dentro de la aplicación.

## 2. Diferencia entre rol del sistema y rol operativo

Es importante distinguir entre dos conceptos:

- Rol del sistema: define qué acciones puede realizar un usuario dentro de la aplicación y qué información puede ver.
- Rol operativo: describe la función que cumple la persona dentro del servicio: cocinero, peón de cocina, camarera, franquera o nutricionista.

En el MVP, el rol del sistema será el que determine los permisos reales dentro de la app. El rol operativo servirá principalmente para organizar la información operativa del personal y para contextualizar la asignación de turnos, sectores y cobertura.

## 3. Roles del sistema

### 3.1 Administradora principal

**Función principal**
- Es la dueña de la app.
- Tiene control total del sistema.
- Puede modificar configuraciones generales, gestionar usuarios y supervisar toda la operación.

**Permisos esperados**
- Acceso total a la aplicación.
- Gestión completa de empleados.
- Creación, edición y publicación de grillas.
- Visualización completa de solicitudes, auditoría, indicadores y notificaciones.
- Aprobación y rechazo de solicitudes.
- Gestión de usuarios y roles del sistema.
- Consulta histórica de versiones de grilla y auditoría completa.

**Limitaciones**
- Debe actuar dentro del marco definido por las reglas de negocio y la trazabilidad del sistema.

### 3.2 Encargada

**Función principal**
- Gestiona la operación diaria, la grilla y las solicitudes.
- Es el perfil principal para la administración operativa del servicio.

**Permisos esperados**
- Visualización completa de la operación.
- Creación y edición de borradores de grilla.
- Publicación de la grilla oficial.
- Gestión de empleados básicos.
- Visualización de solicitudes pendientes y aprobadas/rechazadas.
- Aprobación y rechazo de solicitudes.
- Registro de licencias, vacaciones, partes de enfermo e incidencias.
- Consulta de auditoría y versiones de grilla.

**Limitaciones**
- No debería tener permisos de configuración total del sistema, salvo que la administradora principal se los otorgue explícitamente.

### 3.3 Supervisora

**Función principal**
- Puede visualizar y controlar la operación, participar en la revisión y aprobación de solicitudes y colaborar en la gestión operativa.

**Permisos esperados**
- Visualización de la operación en general.
- Consulta de grilla, solicitudes, notificaciones e indicadores.
- Aprobación y rechazo de solicitudes.
- Registro de incidencias básicas.
- Consulta de auditoría y versiones de grilla.

**Limitaciones**
- No debería tener permisos de administración total ni gestión de usuarios del sistema.
- Su alcance debe ser menor que el de la administradora principal y, en el MVP, similar al de la encargada en temas de aprobación y revisión, pero sin el control total.

### 3.4 Personal

**Función principal**
- Consulta sus datos operativos, realiza solicitudes y recibe notificaciones.

**Permisos esperados**
- Inicio de sesión y acceso a su vista personal.
- Consulta de su propio turno actual y próximos turnos.
- Consulta de sus francos, licencias, vacaciones y partes de enfermo.
- Creación de solicitudes propias.
- Consulta del estado de sus solicitudes.
- Consulta de sus notificaciones.
- Consulta de su historial personal.

**Limitaciones**
- No puede modificar directamente la grilla oficial.
- No puede aprobar ni rechazar solicitudes de otros empleados.
- No puede ver información completa de otros empleados ni de la operación general, salvo lo que se defina como información visible compartida.

## 4. Roles operativos

Los roles operativos describen el tipo de trabajo del empleado dentro del servicio. Afectan principalmente la carga operativa, el sector y la asignación de turnos.

### 4.1 Cocinero
- Puede ser asignado a turnos de cocina.
- Mantiene su turno habitual, salvo las coberturas expresamente definidas en `Directivas.md`.
- Puede realizar solicitudes de cambio de turno o franco.

### 4.2 Peón de cocina
- Trabaja exclusivamente en el sector Cocina.
- Puede realizar solicitudes de cambio de turno o franco.

### 4.3 Camarera
- Trabaja en el sector Pisos y tiene un piso fijo asignado dentro de su turno habitual.
- Puede participar en solicitudes de cambio de turno o franco.

### 4.4 Franquera
- Su prioridad es cubrir francos, licencias, vacaciones o ausencias en Pisos.
- Solo puede colaborar en Cocina durante el turno mañana cuando no exista una cobertura pendiente en Pisos.
- Tiene especial relevancia en la lógica de cobertura y asignaciones temporales.

### 4.5 Nutricionista
- Puede tener turnos o responsabilidades específicas según el servicio.
- Su rol operativo es relevante para la organización de la planificación.

No se contemplan otros roles operativos en el MVP.

### 4.6 Identificación de los perfiles administrativos

Hasta que se definan nombres oficiales, los perfiles administrativos se documentan de forma genérica como:

- Encargada turno mañana.
- Encargada turno tarde.
- Supervisora.

Los nombres utilizados en una demostración de interfaz no reemplazan esta identificación oficial.

## 5. Matriz de permisos por rol

| Función | Administradora principal | Encargada | Supervisora | Personal |
|---|---|---|---|---|
| Iniciar sesión | Sí | Sí | Sí | Sí |
| Ver tablero operativo | Sí | Sí | Sí | No |
| Crear/editar borrador de grilla | Sí | Sí | No | No |
| Publicar grilla oficial | Sí | Sí | No | No |
| Modificar grilla oficial directamente | Sí | Sí | No | No |
| Ver grilla oficial | Sí | Sí | Sí | Sí |
| Ver borrador de grilla | Sí | Sí | No | No |
| Crear empleados | Sí | Sí | No | No |
| Editar empleados | Sí | Sí | No | No |
| Desactivar empleados | Sí | Sí | No | No |
| Ver historial de empleados | Sí | Sí | Sí | No |
| Crear solicitudes | Sí | Sí | Sí | Sí |
| Ver solicitudes de otros | Sí | Sí | Sí | No |
| Aprobar/rechazar solicitudes | Sí | Sí | Sí | No |
| Registrar licencias/partes/vacaciones | Sí | Sí | Sí | Sí (propias) |
| Ver notificaciones | Sí | Sí | Sí | Sí |
| Ver auditoría completa | Sí | Sí | Sí | No |
| Gestionar usuarios | Sí | No | No | No |
| Ver indicadores operativos | Sí | Sí | Sí | No |

## 6. Qué puede ver cada perfil

### Administradora principal
Puede ver:
- toda la operación general,
- la grilla oficial y los borradores,
- todas las solicitudes,
- todos los empleados,
- indicadores completos,
- historial de auditoría,
- versiones de la grilla,
- notificaciones del sistema.

### Encargada
Puede ver:
- la operación general,
- la grilla oficial y el borrador,
- solicitudes del sistema,
- información de empleados,
- indicadores básicos,
- historial de auditoría general,
- notificaciones.

### Supervisora
Puede ver:
- la operación general,
- la grilla oficial,
- solicitudes del sistema,
- empleados e historial relevante,
- indicadores básicos,
- notificaciones.

### Personal
Puede ver:
- su información personal,
- sus turnos,
- sus francos,
- sus licencias y vacaciones,
- sus solicitudes,
- sus notificaciones,
- su historial personal.

## 7. Qué puede crear, editar, aprobar o rechazar cada perfil

### Administradora principal
**Puede crear**
- empleados,
- solicitudes,
- grillas en borrador,
- versiones de grilla,
- usuarios del sistema,
- notificaciones administrativas.

**Puede editar**
- información de empleados,
- grilla en borrador,
- grilla oficial mediante publicación o cambio administrativo,
- solicitudes,
- estados de licencias, vacaciones, partes y otras incidencias.

**Puede aprobar o rechazar**
- cualquier solicitud del sistema.

### Encargada
**Puede crear**
- borradores de grilla,
- solicitudes,
- empleados básicos,
- licencias, vacaciones y partes de enfermo,
- incidencias básicas.

**Puede editar**
- la grilla en borrador,
- la grilla oficial mediante publicación o administración de cambios,
- información básica de empleados,
- solicitudes cuando sea necesario para gestionar la operación.

**Puede aprobar o rechazar**
- solicitudes del sistema en el marco del flujo de aprobación.

### Supervisora
**Puede crear**
- solicitudes,
- incidencias,
- observaciones sobre una solicitud o un evento.

**Puede editar**
- información operativa relacionada con la gestión del servicio,
- estados de solicitudes cuando lo permita la operación.

**Puede aprobar o rechazar**
- solicitudes que entren en su ámbito de revisión.

### Personal
**Puede crear**
- solicitudes propias,
- partes de enfermo propios,
- consultas de estado personal.

**Puede editar**
- solo sus propias solicitudes mientras estén pendientes y no hayan sido resueltas.

**Puede aprobar o rechazar**
- no aplica, salvo que se defina en futuras versiones una lógica de aceptación por compañero.

## 8. Restricciones importantes

1. El personal no puede modificar directamente la grilla oficial.
2. El personal no puede aprobar ni rechazar solicitudes de otros usuarios.
3. La grilla oficial solo podrá cambiarse mediante:
   - publicación de una nueva grilla,
   - aprobación de una solicitud que impacte la planificación,
   - o modificación administrativa registrada.
4. Toda acción relevante deberá quedar registrada en auditoría.
5. La visibilidad de la información deberá estar limitada al rol del usuario.
6. Los perfiles administrativos no deben poder borrar información crítica del sistema; solo deben poder desactivar o marcar estados cuando corresponda.
7. La información del empleado debe conservarse aunque el empleado esté inactivo.
8. Un usuario no debe poder ver o modificar datos de otros usuarios si no tiene permisos para ello.

## 9. Casos especiales

1. Si un empleado es desactivado, su historial debe conservarse y su acceso debe quedar restringido.
2. Si un empleado tiene una solicitud pendiente y además una ausencia registrada, ambos estados deben ser visibles según el perfil correspondiente.
3. Si una solicitud aprobada modifica la grilla oficial, el sistema debe actualizar la grilla vigente y generar una nueva versión.
4. Si un usuario administrativo intenta realizar una acción no autorizada, la operación debe ser rechazada y registrada.
5. Si un usuario del personal genera una solicitud que involucra a otros empleados, debe poder ver el estado de la misma, pero no gestionar directamente la resolución final.
6. Si la encargada o supervisora aprueban una solicitud, el sistema deberá registrar quién lo hizo y cuándo.

## 10. Decisiones pendientes de validación

1. Si la supervisora deberá tener los mismos permisos de aprobación que la encargada o un alcance más limitado en el MVP.
2. Si el personal podrá editar una solicitud una vez enviada, o solo mientras siga en estado pendiente.
3. Si las licencias y vacaciones requerirán aprobación previa por parte de un perfil administrativo o si podrán registrarse directamente.
4. Si las incidencias deben poder ser creadas solo por perfiles administrativos o también por el personal.
5. Si los usuarios administrativos podrán crear nuevas cuentas de usuario en el MVP o si la creación de usuarios se limitará a la administradora principal.
6. Si el personal podrá ver información operativa de otros empleados en una forma limitada o si su visión deberá restringirse a su propia información.

## Recomendación de simplificación

Para que el MVP sea claro y viable, se recomienda:

1. Mantener un modelo de permisos simple y jerárquico.
2. Dar a la administradora principal control total.
3. Dar a la encargada y a la supervisora permisos administrativos compartidos, con diferencias mínimas en el MVP.
4. Restringir el personal a operaciones propias y a la consulta de información limitada.
5. Mantener las reglas de acceso alineadas con la lógica de auditoría y trazabilidad.
