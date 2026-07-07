# 07. Modelo de datos conceptual del MVP

## 1. Objetivo del modelo de datos

Definir de forma clara y simple la estructura conceptual de la información que deberá manejar la aplicación en el MVP.

El objetivo no es modelar un sistema complejo, sino construir una base entendible que permita:

- representar la operación del servicio,
- registrar solicitudes y cambios,
- mantener trazabilidad,
- soportar permisos por rol,
- y facilitar su implementación en JavaScript con datos mockeados.

## 2. Entidades principales del sistema

Las entidades mínimas que deben existir en el MVP son las siguientes:

- Usuario
- Empleado
- Rol del sistema
- Rol operativo
- Sector
- Turno
- Grilla semanal
- Versión de grilla
- Solicitud
- Licencia
- Vacaciones
- Parte de enfermo
- Certificado médico
- Notificación
- Evento de auditoría
- Incidencia
- Estadística o indicador

## 3. Descripción de cada entidad

### 3.1 Usuario
Representa a cada persona que puede ingresar al sistema.

Un usuario está asociado a un rol del sistema y a un empleado, aunque no necesariamente todos los usuarios serán empleados operativos del servicio.

### 3.2 Empleado
Representa a la persona que forma parte del equipo del servicio.

El empleado posee información básica personal y laboral, y está relacionado con turnos, solicitudes, ausencias e incidencias.

### 3.3 Rol del sistema
Define los permisos y accesos dentro de la aplicación.

En el MVP los roles del sistema son:
- Administradora principal
- Encargada
- Supervisora
- Personal

### 3.4 Rol operativo
Describe la función que cumple el empleado dentro del servicio. Los únicos roles operativos válidos son:
- Cocinero
- Peón de cocina
- Camarera
- Franquera
- Nutricionista

### 3.5 Sector
Representa una unidad operativa del servicio. Los únicos sectores operativos válidos en el MVP son Cocina y Pisos.

### 3.6 Turno
Representa una asignación operativa concreta de un empleado en un sector, en un día y en un horario determinado.

### 3.7 Grilla semanal
Es la planificación general del servicio para una semana determinada.

Contiene las asignaciones de turnos y la cobertura semanal.

### 3.8 Versión de grilla
Representa una versión concreta de la grilla semanal en un momento determinado.

Cada vez que se publica una nueva versión o se aprueba una modificación que impacta la planificación, se genera una nueva versión.

### 3.9 Solicitud
Representa una petición de cambio, ausencia, modificación o intervención operativa realizada por un usuario y que requiere seguimiento.

### 3.10 Licencia
Representa una ausencia autorizada del empleado por un período de tiempo.

### 3.11 Vacaciones
Representa una ausencia programada del empleado por un período de descanso.

### 3.12 Parte de enfermo
Representa una ausencia por salud registrada por el empleado o por un administrador.

### 3.13 Certificado médico
Representa la evidencia documental asociada a un parte de enfermo, cuando exista.

### 3.14 Notificación
Representa un aviso interno del sistema para un usuario determinado.

### 3.15 Evento de auditoría
Representa una acción relevante registrada por el sistema.

### 3.16 Incidencia
Representa un registro de incumplimiento u observación operativa asociada a un empleado.

### 3.17 Estadística o indicador
Representa un dato derivado de las operaciones registradas, útil para el tablero y el análisis operativo.

## 4. Campos principales de cada entidad

### 4.1 Usuario
Campos mínimos sugeridos:
- id
- nombre
- apellido
- correo electrónico
- username
- contraseña (o referencia a credenciales)
- rol del sistema
- estado activo/inactivo
- fecha de creación
- fecha de última modificación

### 4.2 Empleado
Campos mínimos sugeridos:
- id
- nombre
- apellido
- documento de identidad
- teléfono
- correo electrónico
- fecha de ingreso
- estado (activo/inactivo)
- rol operativo
- sector principal
- turno habitual (opcional)
- fecha de creación
- fecha de última modificación

### 4.3 Rol del sistema
Campos mínimos sugeridos:
- id
- nombre del rol
- descripción
- permisos asociados

### 4.4 Rol operativo
Campos mínimos sugeridos:
- id
- nombre del rol operativo
- descripción

### 4.5 Sector
Campos mínimos sugeridos:
- id
- nombre del sector
- descripción
- estado activo/inactivo

### 4.6 Turno
Campos mínimos sugeridos:
- id
- fecha
- día de la semana
- horario
- sector
- empleado asignado
- estado operativo
- observaciones

### 4.7 Grilla semanal
Campos mínimos sugeridos:
- id
- semana o rango de fechas
- estado (borrador/publicada)
- fecha de creación
- fecha de publicación
- usuario creador
- usuario publicador
- versión actual

### 4.8 Versión de grilla
Campos mínimos sugeridos:
- id
- grilla semanal asociada
- número de versión
- fecha y hora de creación
- usuario responsable
- motivo del cambio
- resumen de cambios
- estado vigente

### 4.9 Solicitud
Campos mínimos sugeridos:
- id
- tipo de solicitud
- empleado solicitante
- persona involucrada (si aplica)
- fecha de creación
- estado actual
- observaciones
- fecha de última actualización
- solicitud aceptada por compañero (si aplica)
- aprobada o rechazada por un usuario administrativo
- grilla afectada (si aplica)

### 4.10 Licencia
Campos mínimos sugeridos:
- id
- empleado asociado
- fecha de inicio
- fecha de fin
- estado
- observaciones
- usuario que registró

### 4.11 Vacaciones
Campos mínimos sugeridos:
- id
- empleado asociado
- fecha de inicio
- fecha de fin
- estado
- observaciones
- usuario que registró

### 4.12 Parte de enfermo
Campos mínimos sugeridos:
- id
- empleado asociado
- fecha de inicio
- fecha de fin
- estado
- observaciones
- usuario que registró
- certificado asociado (si aplica)

### 4.13 Certificado médico
Campos mínimos sugeridos:
- id
- parte de enfermo asociado
- fecha de carga
- tipo de archivo
- referencia o ruta del archivo
- usuario que cargó

### 4.14 Notificación
Campos mínimos sugeridos:
- id
- usuario destinatario
- tipo de notificación
- mensaje
- fecha de creación
- leída/no leída
- entidad relacionada
- id de la entidad relacionada

### 4.15 Evento de auditoría
Campos mínimos sugeridos:
- id
- usuario que realizó la acción
- fecha y hora
- tipo de acción
- entidad afectada
- id de la entidad afectada
- estado anterior
- estado nuevo
- observaciones

### 4.16 Incidencia
Campos mínimos sugeridos:
- id
- empleado asociado
- fecha de registro
- tipo de incidencia
- descripción
- estado
- usuario que registró
- observaciones

### 4.17 Estadística o indicador
Campos mínimos sugeridos:
- id
- tipo de indicador
- valor
- período
- entidad relacionada
- fecha de cálculo

## 5. Relaciones entre entidades

Las relaciones principales del sistema son las siguientes:

- Un Usuario pertenece a un Rol del sistema.
- Un Usuario puede estar asociado a un Empleado.
- Un Empleado tiene un Rol operativo.
- Un integrante del personal operativo pertenece a un Sector principal.
- Un Empleado puede tener múltiples Turnos asignados en una semana.
- Una Grilla semanal contiene múltiples Turnos.
- Una Grilla semanal tiene múltiples Versiones de grilla.
- Una Versión de grilla representa el estado completo de la planificación en un momento determinado.
- Un Empleado puede tener múltiples Solicitudes.
- Una Solicitud puede involucrar a un compañero y a un usuario administrativo.
- Un Empleado puede tener múltiples Licencias, Vacaciones y Partes de enfermo.
- Un Parte de enfermo puede tener un Certificado médico asociado.
- Un Usuario puede recibir múltiples Notificaciones.
- Un Evento de auditoría puede estar asociado a múltiples entidades del sistema.
- Un Empleado puede tener múltiples Incidencias.
- Un Indicador se calcula a partir de múltiples entidades del sistema.

## 6. Diferencia entre rol del sistema y rol operativo

Es importante mantener estas dos nociones separadas en el modelo de datos:

- Rol del sistema: controla permisos y accesos dentro de la app.
- Rol operativo: describe la función del empleado dentro del servicio.

Esto permite que una misma persona pueda ser, por ejemplo, una encargada del sistema y también tener un rol operativo asociado como cocinera o nutricionista, sin mezclar permisos con función operativa.

## 7. Cómo se relacionan empleados, sectores, turnos, grillas y solicitudes

La relación conceptual central del MVP es la siguiente:

- Un integrante del personal operativo pertenece a un sector principal.
- Cocineros, peones de cocina y camareras mantienen su sector. Sólo las franqueras pueden recibir una asignación temporal en Cocina durante el turno mañana cuando no exista una cobertura pendiente en Pisos.
- Una grilla semanal organiza esos turnos en un contexto semanal.
- Una solicitud puede modificar un turno, un franco, una ausencia o una asignación operativa.
- Si la solicitud es aprobada y afecta la planificación, se genera una nueva versión de la grilla.

En términos simples:

Empleado → tiene asignaciones operativas
Sector → define dónde trabaja
Turno → representa una asignación concreta
Grilla semanal → agrupa esos turnos para el servicio
Solicitud → modifica o afecta la grilla o el estado del empleado

## 8. Cómo se registran notificaciones, auditoría e historial

### Notificaciones
Las notificaciones deben registrarse como eventos dirigidos a un usuario concreto o a un grupo de usuarios.

Cada notificación debe poder vincularse a una entidad del sistema, por ejemplo:
- una solicitud,
- una grilla,
- un turno,
- una licencia,
- una incidencia.

### Auditoría
La auditoría deberá registrarse como un evento independiente y transversal.

Cada evento debe permitir identificar:
- quién lo realizó,
- qué entidad modificó,
- qué cambió,
- cuándo ocurrió,
- y si se generó una consecuencia relevante.

### Historial
El historial debe interpretarse de dos formas:
- historial personal del empleado,
- historial administrativo o de auditoría.

El historial personal deberá mostrar eventos que impactan directamente al empleado. El historial administrativo deberá mostrar la evolución completa de operaciones y decisiones del sistema.

## 9. Qué datos son imprescindibles para el MVP

Los datos imprescindibles para la primera versión son los siguientes:

- usuarios con rol del sistema,
- empleados con información básica,
- roles operativos,
- sectores,
- turnos semanales,
- grilla semanal y versiones,
- solicitudes básicas,
- licencias, vacaciones y partes de enfermo,
- notificaciones internas,
- auditoría básica,
- incidencias simples,
- indicadores operativos básicos.

## 10. Qué datos pueden quedar para futuras versiones

Los siguientes datos pueden dejarse fuera del MVP o incorporarse más adelante:

- documentos de identidad digitales complejos,
- archivos adjuntos extensos,
- historial detallado de disciplina o sanciones,
- reglas de aprobación complejas por tipo de solicitud,
- múltiples sedes o servicios dentro de una misma instancia,
- reportes avanzados y exportaciones complejas,
- integraciones con sistemas externos,
- notificaciones push externas,
- análisis predictivo o automatización avanzada.

## 11. Riesgos o decisiones pendientes del modelo de datos

### Riesgos
- Si el modelo se vuelve demasiado complejo desde el inicio, resultará difícil de mantener.
- Si no se separan bien los conceptos de rol del sistema y rol operativo, se generará confusión en permisos y asignaciones.
- Si la grilla y sus versiones no quedan bien definidas conceptualmente, la trazabilidad se volverá difícil de entender.
- Si las solicitudes y las ausencias se modelan de forma demasiado rígida, será difícil adaptarlas a futuras reglas de negocio.

### Decisiones pendientes
1. Si una solicitud debe vincularse directamente a un turno o a un cambio de estado del empleado.
2. Si un parte de enfermo debe tener un estado de “pendiente aprobación” o directamente “registrado”.
3. Si las licencias y vacaciones se modelarán como entidades separadas o como un único concepto general de ausencia.
4. Si las incidencias tendrán una estructura simple o si se requerirá un historial más detallado.
5. Si las versiones de grilla deberán almacenar solo los cambios o el estado completo de la semana.
6. Si las estadísticas se calcularán en tiempo real o se almacenarán como datos derivados.

## Recomendación de simplificación

Para que el modelo sea útil y manejable en el MVP, conviene mantenerlo simple:

- una grilla semanal con versiones,
- un conjunto claro de entidades operativas,
- un historial de auditoría simple,
- y una separación limpia entre datos operativos, datos de usuario y datos de trazabilidad.

Esto permitirá construir la app de forma clara y luego evolucionar hacia una solución más rica si el producto crece.
