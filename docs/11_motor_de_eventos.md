# 11. Motor de Planificación

## 1. Objetivo

El Motor de Planificación será el componente interno encargado de interpretar, validar y aplicar cambios operativos sobre una planificación semanal de Uzumaki.

En esta primera etapa, el motor trabajará a partir de eventos operativos. Esos eventos serán la forma de describir licencias, ausencias, cambios, coberturas y excepciones, pero el nombre conceptual del módulo será **Motor de Planificación**.

Su objetivo es resolver un problema central: a medida que la aplicación crece, distintos módulos pueden necesitar modificar la grilla. Las solicitudes, las excepciones, las licencias, los cambios de turno y las coberturas afectan la planificación, pero no deberían escribir cambios directamente sobre ella de forma aislada.

El Motor de Planificación existe para ordenar ese proceso. Su función será recibir eventos operativos aprobados, entender qué impacto tienen sobre la semana y aplicar esos cambios de manera controlada, trazable y consistente dentro de la planificación.

En esta etapa, el Motor de Planificación se define como arquitectura futura. Este documento no describe código, algoritmos ni una implementación inmediata.

## 2. Concepto de evento operativo

Un **evento operativo** representa una situación concreta que puede afectar una planificación semanal.

Un evento no es una modificación directa de la grilla. Es una intención o hecho operativo que describe qué ocurrió, quién está involucrado, en qué fecha, en qué turno y sobre qué parte de la planificación podría impactar.

Ejemplos:

- una persona informa una ausencia;
- una encargada registra una licencia;
- dos personas acuerdan un cambio de turno;
- una persona cubre a otra;
- un puesto queda sin cubrir.

La planificación semanal conserva la estructura base. El evento describe el cambio que debe evaluarse y, cuando corresponda, aplicarse sobre esa planificación.

Esta separación permite que Uzumaki mantenga trazabilidad: primero se registra el hecho operativo, luego se aprueba o valida, y recién después se aplica sobre la grilla.

## 3. Eventos operativos existentes

Los eventos operativos contemplados actualmente por Uzumaki son:

- **Licencia:** una persona autorizada no trabaja durante una fecha o período determinado.
- **Ausencia:** una persona no se presenta o informa que no podrá cubrir su turno.
- **Licencia por estudio:** una licencia específica asociada a motivos de estudio.
- **Cambio de turno:** una persona solicita modificar o intercambiar un turno con otra persona.
- **Cambio de franco:** una persona solicita cambiar un franco por otra fecha o con otro compañero.
- **Doble turno:** una persona trabaja más de un turno en una misma fecha, siempre que la regla operativa lo permita.
- **Reemplazo:** una persona ocupa el lugar de otra en un puesto, día o turno determinado.
- **Cobertura:** una persona cubre un puesto que estaba pendiente o que perdió su asignación habitual.
- **Vacaciones:** una persona autorizada no trabaja por período vacacional.
- **Puesto sin cubrir:** un puesto operativo queda sin persona asignada o sin cobertura confirmada.

Esta lista no es definitiva. Podrán agregarse nuevos eventos en versiones futuras cuando aparezcan nuevas necesidades operativas o reglas validadas por la encargada.

## 4. Origen del evento

Un evento puede generarse desde distintos puntos del sistema, siempre respetando permisos y trazabilidad.

Los orígenes contemplados son:

- **Encargada:** puede registrar eventos manuales, excepciones y decisiones operativas sobre una semana.
- **Personal mediante solicitudes:** puede generar eventos indirectos al crear solicitudes de licencia, ausencia, cambio de turno o cambio de franco.
- **Supervisora:** puede registrar o revisar eventos según los permisos definidos para su rol.
- **Futuras automatizaciones:** podrán generar eventos sugeridos o derivados, siempre que queden pendientes de validación cuando corresponda.

El origen del evento debe quedar registrado para auditoría. Uzumaki deberá poder responder quién generó el evento, desde qué flujo, cuándo se creó y qué planificación semanal podría afectar.

## 5. Ciclo de vida del evento

El ciclo de vida conceptual de un evento será:

```text
Creado
↓
Pendiente
↓
Aceptado, cuando corresponda
↓
Aprobado
↓
Aplicado sobre la planificación
↓
Registrado en auditoría
```

**Creado:** el evento nace desde una acción del usuario o desde un flujo interno.

**Pendiente:** el evento queda a la espera de revisión, aceptación o aprobación.

**Aceptado:** se utiliza cuando el evento requiere participación de otra persona, por ejemplo en un cambio de turno o cambio de franco con compañero involucrado.

**Aprobado:** una persona con permisos administrativos valida que el evento puede impactar la planificación.

**Aplicado sobre la planificación:** el Motor de Planificación actualiza la planificación semanal según el tipo de evento y las reglas vigentes.

**Registrado en auditoría:** el sistema conserva el historial del evento, la acción realizada y el resultado.

Este ciclo de vida es conceptual. No define algoritmos, estructuras internas ni implementación técnica.

## 6. Qué puede modificar un evento

Un evento aprobado podrá modificar distintas partes de una planificación semanal.

Según su tipo, un evento puede afectar:

- **Asignaciones:** cambiar qué persona ocupa un puesto en una fecha y turno.
- **Puestos operativos:** marcar un puesto como cubierto, pendiente o afectado por una situación especial.
- **Francos:** registrar, mover o intercambiar francos.
- **Coberturas:** indicar quién cubre una ausencia, licencia o puesto libre.
- **Turnos:** modificar el turno asignado a una persona o intercambiar turnos entre personas.
- **Estado de la semana:** generar una actualización de una grilla publicada o dejar una planificación con cambios pendientes.

No todos los eventos modifican todo. Cada tipo de evento deberá tener un impacto claramente delimitado.

## 7. Regla arquitectónica principal

La regla arquitectónica principal de la V3 será:

> "La planificación semanal nunca debe modificarse desde distintos módulos.
> Toda modificación deberá pasar por el Motor de Planificación."

Esta regla evita que la grilla quede expuesta a cambios dispersos desde solicitudes, excepciones, formularios manuales o futuras automatizaciones.

Si cada módulo modifica la planificación por su cuenta, pueden aparecer inconsistencias como:

- una solicitud aprobada que no coincide con la grilla;
- una excepción visible que no modifica el puesto correcto;
- una cobertura aplicada sin auditoría;
- un franco actualizado en una vista pero no en otra;
- una grilla publicada con cambios imposibles de rastrear.

Centralizar las modificaciones en el Motor de Planificación simplifica el mantenimiento porque cada cambio operativo pasa por el mismo punto de control. También permite validar reglas, detectar conflictos, registrar auditoría y mantener una única interpretación oficial de la semana.

## 8. Relación con la planificación

La planificación semanal representa la base operativa de una semana.

Incluye:

- puestos operativos;
- asignaciones;
- francos;
- coberturas;
- estado de la semana;
- información necesaria para publicar o consultar la grilla.

Los eventos representan excepciones o cambios sobre esa base.

La grilla publicada representa el resultado final luego de aplicar todos los eventos válidos sobre la planificación correspondiente.

En términos conceptuales:

```text
Planificación semanal base
        +
Eventos aprobados y aplicados
        =
Grilla publicada vigente
```

Esto permite diferenciar claramente entre:

- la estructura que debía cubrirse;
- las situaciones que alteraron esa estructura;
- el resultado visible para encargada y personal.

## 9. Alcance de la V3

En la primera etapa de la V3, el Motor de Planificación sólo deberá aplicar automáticamente eventos vinculados a:

- licencias;
- ausencias;
- cambios de turno;
- cambios de franco.

Estos eventos se eligen primero porque ya existen dentro del flujo de solicitudes y cuentan con datos suficientes para avanzar hacia una automatización controlada.

Los demás eventos continuarán siendo manuales hasta versiones futuras:

- licencia por estudio;
- doble turno;
- reemplazo;
- cobertura;
- vacaciones;
- puesto sin cubrir.

Durante esta primera etapa, Uzumaki deberá priorizar claridad, trazabilidad y validación humana por encima de automatizaciones amplias. El Motor de Planificación deberá crecer de forma gradual, incorporando nuevos tipos de eventos únicamente cuando sus reglas operativas estén suficientemente validadas.
