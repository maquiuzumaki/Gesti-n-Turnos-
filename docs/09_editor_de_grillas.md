# 09. Editor manual de grillas

## 1. Objetivo del editor de grillas

Definir el comportamiento funcional del editor manual de grillas semanales de Uzumaki.

Antes de incorporar automatizaciones de francos, coberturas o ciclos F1/F2, la aplicación deberá permitir que una encargada construya, revise, guarde y publique una semana operativa de forma completamente manual.

El editor deberá representar la operación real del Servicio de Alimentación Hospitalario. La planificación se organizará por puestos, sectores, turnos y pisos; no como una lista general de empleados.

## 2. Problema que resuelve

Actualmente la planificación puede depender de planillas externas, mensajes y acuerdos informales. Esto dificulta:

- identificar cuál es la versión vigente de una semana;
- conocer quién ocupa cada puesto;
- revisar rápidamente la cobertura de los tres pisos;
- distinguir un borrador de una planificación publicada;
- registrar modificaciones urgentes sin perder el historial;
- comunicar una única grilla oficial al personal.

El editor manual deberá ofrecer un primer reemplazo ordenado para la planilla semanal, aun sin contar con un motor automático de planificación.

## 3. Usuarios que lo utilizan

### Encargadas

Son las usuarias principales del editor. Podrán:

- crear una semana;
- editar y guardar borradores;
- asignar o reemplazar empleados;
- mover manualmente a las franqueras;
- publicar la grilla;
- actualizar una grilla publicada ante una necesidad urgente.

### Administradora principal

Podrá realizar las mismas acciones administrativas sobre la grilla, de acuerdo con los permisos generales del sistema.

### Supervisora

Podrá consultar la operación, las grillas publicadas y el historial según sus permisos. En el MVP no editará borradores ni publicará grillas.

### Personal operativo

Sólo podrá consultar la última grilla publicada. No tendrá acceso al borrador ni a las acciones de edición.

## 4. Estados posibles de una grilla

### 4.1 Sin crear

La semana todavía no posee una grilla.

En este estado, una encargada podrá iniciar la planificación creando la estructura vacía correspondiente al período de lunes a domingo.

### 4.2 Borrador

La grilla existe, pero todavía no es oficial.

Características:

- puede editarse;
- puede guardarse parcialmente;
- sólo es visible para los perfiles autorizados;
- no debe mostrarse al personal operativo;
- puede contener puestos pendientes mientras se está preparando;
- no reemplaza ninguna grilla publicada.

### 4.3 Publicada

Es la versión oficial vigente de la semana.

Características:

- es visible para el personal;
- debe mostrar claramente su número de versión y fecha de publicación;
- no se modifica silenciosamente;
- toda modificación posterior deberá producir una actualización registrada.

### 4.4 Actualizada

Es una nueva versión oficial generada cuando una grilla ya publicada requiere un cambio urgente.

Características:

- reemplaza a la versión oficial anterior;
- debe registrar quién realizó el cambio, cuándo y por qué;
- debe conservar la versión anterior como histórica;
- pasa a ser la única versión vigente visible para el personal.

Cada nueva actualización deberá incrementar la versión de la grilla sin alterar el historial previo.

### 4.5 Histórica

Es una versión que dejó de ser la oficial vigente.

Características:

- es de sólo lectura;
- no puede editarse ni volver a publicarse directamente;
- conserva asignaciones, francos, autoría, fechas y motivo de los cambios;
- permanece disponible para consulta administrativa y auditoría.

## 5. Flujo general

```text
Sin crear
    ↓ Crear semana
Borrador
    ↓ Guardar y completar
Borrador
    ↓ Publicar
Publicada
    ↓ Cambio urgente registrado
Actualizada
    ↓ Nueva actualización o cierre de la semana
Histórica
```

La grilla oficial anterior pasa a ser histórica cada vez que una publicación o actualización la reemplaza.

## 6. Acciones disponibles

### 6.1 Crear semana

La encargada seleccionará o confirmará un período semanal de lunes a domingo.

La aplicación deberá crear una estructura vacía con todos los bloques operativos obligatorios. La nueva semana comenzará en estado **Borrador** y no será visible para el personal.

### 6.2 Editar borrador

La encargada podrá completar o modificar cualquier puesto del borrador antes de publicarlo.

La interfaz deberá indicar permanentemente que se está trabajando sobre una versión no publicada.

### 6.3 Asignar empleado a un puesto

La encargada podrá seleccionar manualmente un empleado y asignarlo a un día, sector, turno y puesto concreto.

La asignación deberá respetar la estructura operativa:

- cocineros y peones de cocina trabajan en Cocina;
- camareras fijas trabajan en Pisos;
- las franqueras pueden cubrir puestos de Pisos;
- una franquera puede colaborar en Cocina durante el turno mañana cuando no exista una cobertura pendiente en Pisos;
- la cobertura excepcional de Gustavo en el turno tarde se realizará manualmente cuando corresponda cubrir el franco de Julio.

El editor no deberá decidir estas asignaciones por cuenta propia.

### 6.4 Cambiar empleado asignado

La encargada podrá reemplazar manualmente a la persona asignada a un puesto.

El cambio deberá mostrar con claridad:

- el puesto afectado;
- la persona anterior;
- la nueva persona asignada;
- si el cambio todavía pertenece al borrador o modifica una grilla publicada.

### 6.5 Mover una franquera entre puestos

Las franqueras deberán poder moverse manualmente entre puestos compatibles.

La prioridad operativa será:

1. cubrir los puestos pendientes en Pisos;
2. mantener los tres pisos cubiertos en ambos turnos;
3. sólo cuando Pisos esté cubierto, permitir su colaboración en Cocina durante el turno mañana.

El editor deberá permitir que la encargada decida qué franquera cubre cada hueco. No deberá asignarla automáticamente.

### 6.6 Guardar borrador

La encargada podrá guardar el trabajo en cualquier momento sin publicarlo.

Guardar deberá:

- conservar todas las asignaciones realizadas;
- mantener el estado **Borrador**;
- registrar la última fecha de modificación;
- mantener el contenido oculto para el personal;
- permitir continuar la edición más adelante.

### 6.7 Publicar grilla

Publicar convierte el borrador en la grilla oficial visible para el personal.

Antes de publicar, la aplicación deberá verificar como mínimo que:

- cada uno de los tres pisos tenga una persona asignada en el turno mañana;
- cada uno de los tres pisos tenga una persona asignada en el turno tarde;
- no exista una misma persona asignada a dos puestos simultáneos;
- ninguna persona figure trabajando y de franco en el mismo día;
- la semana corresponda a un período completo de lunes a domingo.

Si un piso queda sin cobertura, la publicación deberá quedar bloqueada hasta corregirlo.

Toda publicación deberá registrar:

- número de versión;
- fecha y hora;
- usuario responsable;
- período semanal;
- estado publicado;
- resumen de la operación publicada.

### 6.8 Actualizar una grilla publicada

Cuando exista un cambio urgente, la encargada podrá editar la planificación vigente mediante una actualización controlada.

La actualización deberá:

- solicitar un motivo del cambio;
- identificar las asignaciones modificadas;
- generar una nueva versión oficial;
- conservar la versión anterior como histórica;
- registrar la acción en auditoría;
- mantener una única versión oficial vigente.

No se deberá sobrescribir silenciosamente la grilla ya publicada.

## 7. Estructura visual obligatoria

La grilla deberá conservar la siguiente jerarquía:

```text
Semana
│
├── Cocina
│   ├── Turno Mañana
│   ├── Turno Tarde
│   └── Francos Cocina
│
└── Pisos
    ├── Turno Mañana
    │   ├── Piso 1
    │   ├── Piso 2
    │   └── Piso 3
    │
    ├── Turno Tarde
    │   ├── Piso 1
    │   ├── Piso 2
    │   └── Piso 3
    │
    └── Francos Pisos
```

### Principios de visualización

- Cocina y Pisos deberán percibirse como bloques claramente diferenciados.
- Cada puesto deberá pertenecer visualmente a un sector y turno.
- Los pisos deberán identificarse sin depender del nombre de la camarera asignada.
- Las franqueras deberán distinguirse cuando estén realizando una cobertura o colaborando en Cocina.
- Los francos deberán permanecer separados por sector.
- Los puestos sin asignación deberán ser visibles y no confundirse con un franco.
- Los estados **Borrador**, **Publicada**, **Actualizada** e **Histórica** deberán identificarse claramente.
- La lectura deberá seguir siendo usable en computadora, tablet y celular.

## 8. Reglas funcionales importantes

1. El personal no puede crear, editar, guardar ni publicar grillas.
2. El personal sólo puede ver la última grilla publicada.
3. Las encargadas pueden crear y editar borradores.
4. Las encargadas pueden publicar y actualizar la grilla dentro de sus permisos.
5. Las franqueras deben poder moverse manualmente entre puestos compatibles.
6. Nunca puede quedar un piso sin cobertura en una grilla publicada.
7. La cobertura de Pisos tiene prioridad sobre la colaboración de una franquera en Cocina.
8. Toda publicación o actualización debe quedar registrada.
9. Sólo puede existir una versión oficial vigente por semana.
10. Las versiones reemplazadas deben conservarse como históricas.
11. Un puesto vacío y un franco son estados diferentes.
12. La decisión final sobre cada asignación corresponde a la encargada.

## 9. Qué no debe hacer todavía

En esta etapa, el editor:

- no calculará francos automáticamente;
- no generará coberturas automáticas;
- no aplicará el motor F1/F2;
- no proyectará semanas futuras a partir de la semana de referencia;
- no modificará el flujo ni los datos de solicitudes;
- no actualizará automáticamente la grilla por una solicitud;
- no creará backend ni base de datos real;
- no incorporará notificaciones externas;
- no tomará decisiones operativas en lugar de la encargada.

Los francos y las asignaciones serán cargados o modificados manualmente hasta que exista una etapa posterior, expresamente aprobada, para diseñar las automatizaciones.

## 10. Criterios de éxito

El editor manual se considerará funcionalmente correcto cuando:

1. Una encargada pueda crear una semana completa de lunes a domingo.
2. Pueda asignar manualmente empleados a los puestos de Cocina y Pisos.
3. Pueda identificar y mover manualmente a las franqueras.
4. Pueda cargar francos separados por sector.
5. Pueda guardar la planificación como borrador sin hacerla visible al personal.
6. Pueda recuperar el borrador y continuar su edición.
7. Pueda publicar una grilla completa.
8. El personal sólo pueda consultar la versión publicada.
9. Pueda actualizar una grilla publicada sin perder la versión anterior.
10. Toda publicación y actualización quede registrada.
11. Cocina, Pisos, turnos, pisos, coberturas y francos se comprendan visualmente con rapidez.
12. La aplicación pueda reemplazar una planilla semanal inicial sin depender todavía de automatizaciones.

## 11. Alcance de este documento

Este documento define el comportamiento funcional esperado. No define componentes técnicos, estructura de código, diseño de base de datos ni implementación de interfaz.

La implementación deberá realizarse en una tarea posterior y requerirá aprobación explícita.
