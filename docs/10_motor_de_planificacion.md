# 10. Motor de planificación operativa

## 1. Objetivo del motor de planificación

Definir la forma de razonamiento que Uzumaki deberá respetar antes de construir una grilla semanal.

Este documento no describe algoritmos ni una implementación automática. Describe el orden mental y las prioridades que utiliza una encargada del Servicio de Alimentación Hospitalario cuando revisa una semana, identifica necesidades y decide cómo distribuir al personal.

El futuro motor deberá acompañar ese razonamiento sin reemplazar la decisión humana. Hasta que exista una etapa de automatización expresamente aprobada, este proceso funcionará únicamente como referencia funcional para la planificación manual.

## 2. Principios generales

### 2.1 La operación se planifica por puestos

La pregunta principal no es “¿dónde coloco a cada empleado?”, sino “¿qué puestos necesita cubrir el servicio y quién puede ocupar cada uno?”.

La semana deberá comprenderse en este orden:

1. sector;
2. turno;
3. puesto o piso;
4. persona asignada;
5. situación especial, si corresponde.

### 2.2 Pisos tiene prioridad absoluta de cobertura

Cada uno de los tres pisos debe contar con una persona asignada en el turno mañana y otra en el turno tarde.

La planificación no puede considerarse completa mientras exista un piso sin cobertura.

### 2.3 Las asignaciones habituales son el punto de partida

La encargada comienza observando los puestos y turnos habituales de cada persona. Los cambios se realizan únicamente cuando existe un franco, ausencia, licencia, vacaciones, cobertura o necesidad operativa concreta.

### 2.4 Las franqueras son el recurso flexible

Débora y Lucila se consideran primero para cubrir necesidades de Pisos.

Sólo cuando todos los pisos estén cubiertos podrán colaborar en Cocina durante el turno mañana. La encargada mantiene siempre la decisión final sobre cuál franquera ocupa cada puesto.

### 2.5 Cocina conserva su estructura propia

Cocina se revisa por separado de Pisos:

- turno mañana: 2 cocineros y 1 peón de cocina como dotación habitual;
- turno tarde: 1 cocinero y 1 peón de cocina como dotación habitual.

La excepción conocida es la cobertura de Julio por Gustavo. Cuando Gustavo cubre el turno tarde, no trabaja también durante la mañana.

### 2.6 Un franco o una ausencia no son un puesto vacío sin explicación

La grilla debe diferenciar claramente:

- persona trabajando;
- persona de franco;
- licencia;
- vacaciones;
- ausencia;
- puesto pendiente de cobertura;
- cobertura realizada.

La encargada necesita conocer la causa de cada cambio antes de decidir cómo resolverlo.

### 2.7 La decisión final es humana

Uzumaki podrá organizar información, señalar conflictos y mostrar necesidades, pero no deberá tomar una decisión operativa definitiva sin validación de la encargada.

### 2.8 Toda grilla oficial debe ser trazable

Una grilla publicada representa la versión oficial de una semana. Cualquier cambio posterior deberá conservar la versión anterior, registrar el motivo y generar una actualización controlada.

## 3. Concepto de Puesto Operativo

Uzumaki planifica primero los puestos que necesita cubrir el servicio y después asigna personas a esos puestos.

Un **Puesto Operativo** representa una necesidad estable de la operación dentro de un sector, turno y ubicación determinados. El puesto existe independientemente de quién lo ocupe durante un día o una semana concreta.

Ejemplos de puestos operativos:

- Cocinero Mañana 1.
- Cocinero Mañana 2.
- Cocinero Tarde.
- Peón Cocina Mañana.
- Peón Cocina Tarde.
- Piso 1 Mañana.
- Piso 2 Mañana.
- Piso 3 Mañana.
- Piso 1 Tarde.
- Piso 2 Tarde.
- Piso 3 Tarde.

### 3.1 El puesto permanece

El puesto forma parte de la estructura del servicio. No desaparece cuando su ocupante habitual tiene franco, licencia, vacaciones o una ausencia.

Si la persona habitual no está disponible, el puesto continúa existiendo y pasa a requerir cobertura. Un puesto sin persona asignada debe mostrarse como pendiente; nunca debe ocultarse.

### 3.2 La persona puede cambiar

La persona asignada puede variar según la disponibilidad y las decisiones de la encargada.

Por ejemplo, **Piso 1 Mañana** continúa siendo el mismo puesto cuando lo ocupa la camarera fija o cuando lo cubre una franquera. Del mismo modo, **Cocinero Tarde** sigue siendo el mismo puesto cuando Julio trabaja habitualmente o cuando Gustavo cubre su franco.

La asignación debe explicar quién ocupa el puesto y si lo hace como titular, cobertura, colaboración o excepción.

### 3.3 Base del editor y del futuro motor

El editor manual deberá permitir que la encargada vea los puestos y asigne personas a cada uno.

El futuro motor de planificación deberá razonar sobre esos mismos puestos antes de considerar nombres concretos. Esta separación evita confundir la estructura necesaria del servicio con la disponibilidad circunstancial de una persona.

## 4. Orden de planificación de una semana

El proceso deberá respetar el siguiente orden. Cada etapa responde a una pregunta concreta que se hace la encargada.

### Paso 1. Identificar la semana

**Pregunta:** ¿Qué período se está planificando?

La encargada confirma:

- fecha de inicio;
- fecha de finalización;
- que la semana comprenda de lunes a domingo;
- que no exista otra grilla oficial vigente para el mismo período.

En esta etapa sólo se establece el marco temporal. No se copian ni proyectan automáticamente asignaciones de otras semanas.

### Paso 2. Identificar los francos

**Pregunta:** ¿Quién está de franco cada día?

La encargada revisa los francos ya conocidos de cada empleado y los ubica en la semana.

Los francos deben quedar separados por sector:

- Francos Cocina.
- Francos Pisos.

En esta etapa, Uzumaki no calcula nuevas fechas ni prolonga el ciclo F1/F2. Sólo considera los francos que hayan sido cargados o confirmados para la semana.

### Paso 3. Identificar licencias y ausencias

**Pregunta:** ¿Qué personas no estarán disponibles además de quienes tienen franco?

La encargada revisa:

- licencias confirmadas;
- partes de enfermo;
- ausencias conocidas;
- cualquier evento que impida trabajar en el turno habitual.

Cada ausencia debe quedar visible y asociada a la persona y al período correspondiente. Detectarla no significa que Uzumaki deba decidir automáticamente su reemplazo.

### Paso 4. Identificar vacaciones

**Pregunta:** ¿Hay vacaciones autorizadas dentro de la semana?

Las vacaciones confirmadas se consideran una indisponibilidad y deben mostrarse antes de evaluar la cobertura.

En esta etapa, el sistema sólo las identifica. La resolución de la cobertura generada por vacaciones continúa siendo una decisión manual de la encargada.

### Paso 5. Verificar la cobertura de Pisos

**Pregunta:** ¿Cada piso tiene una persona asignada en ambos turnos?

La encargada revisa seis puestos diarios:

- Piso 1, turno mañana.
- Piso 2, turno mañana.
- Piso 3, turno mañana.
- Piso 1, turno tarde.
- Piso 2, turno tarde.
- Piso 3, turno tarde.

Primero se consideran las camareras fijas disponibles. Todo puesto que pierda a su titular por franco, licencia, vacaciones o ausencia queda pendiente de cobertura.

Mientras exista un puesto pendiente en Pisos, la planificación de ese día no puede considerarse resuelta.

### Paso 6. Asignar franqueras si corresponde

**Pregunta:** ¿Débora o Lucila deben cubrir algún puesto de Pisos?

La encargada analiza los huecos detectados y decide manualmente:

- qué franquera realiza cada cobertura;
- en qué turno trabaja;
- qué piso cubre;
- si existen dos huecos y deben utilizarse ambas franqueras.

La prioridad de una franquera es siempre Pisos. Su disponibilidad para Cocina sólo se evalúa después de confirmar que no queda ninguna cobertura pendiente en los pisos.

### Paso 7. Verificar la cobertura de Cocina

**Pregunta:** ¿Cómo queda conformada Cocina en cada turno?

La encargada revisa por separado:

- cocineros del turno mañana;
- peón de cocina del turno mañana;
- cocinero del turno tarde;
- peón de cocina del turno tarde;
- francos y ausencias del sector;
- colaboraciones posibles de las franqueras.

Una franquera sólo podrá colaborar en Cocina durante el turno mañana si Pisos ya se encuentra completamente cubierto.

### Paso 8. Aplicar la excepción Gustavo/Julio cuando corresponda

**Pregunta:** ¿Julio está de franco y Gustavo debe cubrir su puesto?

Cuando la encargada decide aplicar esta excepción:

- Gustavo ocupa el puesto de cocinero del turno tarde;
- Gustavo no trabaja durante el turno mañana de ese mismo día;
- Mario queda como único cocinero del turno mañana;
- Julio figura de franco;
- la cobertura debe quedar identificada como una asignación excepcional.

Esta excepción no se aplica por semejanza con otras situaciones ni se extiende a otras personas. Debe utilizarse únicamente en el caso expresamente definido y con validación de la encargada.

### Paso 9. Revisar las solicitudes aprobadas que afecten la semana

**Pregunta:** ¿Existe algún cambio aprobado que modifique turnos, francos, disponibilidad o asignaciones de esta semana?

Antes de realizar la validación final, la encargada revisa las solicitudes ya aprobadas que tengan impacto operativo, entre ellas:

- cambios de turno;
- cambios de franco;
- licencias u otras ausencias aprobadas;
- cualquier solicitud que modifique quién trabaja, cuándo trabaja o qué puesto ocupa.

Cada solicitud aprobada debe reflejarse en la distribución de la semana correspondiente. La encargada deberá comprobar:

- qué día y puesto resultan afectados;
- qué asignación deja de ser válida;
- qué nueva asignación fue aprobada;
- si el cambio genera un hueco de cobertura;
- si afecta la disponibilidad de una franquera;
- si produce un conflicto con otro turno, franco o ausencia.

La aprobación de una solicitud es un dato que debe respetarse, pero no autoriza al sistema a modificar silenciosamente una grilla publicada. Si la semana ya fue publicada, la encargada revisará el resultado y generará una actualización controlada, conservando la versión anterior.

### Paso 10. Revisar que no existan puestos sin cubrir

**Pregunta:** ¿La semana puede funcionar operativamente tal como está planificada?

Antes de guardar el resultado como completo, la encargada revisa:

- que los tres pisos estén cubiertos en ambos turnos;
- que Cocina tenga asignaciones claras por turno;
- que ninguna persona esté en dos puestos simultáneos;
- que nadie figure trabajando y de franco el mismo día;
- que una franquera no esté asignada en Cocina si aún existe un hueco en Pisos;
- que todas las coberturas y excepciones se comprendan visualmente;
- que los puestos vacíos estén identificados como pendientes y no ocultos.

Si existe un conflicto, la planificación vuelve a la etapa correspondiente para ser revisada manualmente.

### Paso 11. Guardar borrador

**Pregunta:** ¿La planificación está lista para conservarse sin comunicarla todavía?

La encargada guarda la semana como borrador.

El borrador:

- conserva las asignaciones realizadas;
- puede seguir editándose;
- no es visible para el personal;
- debe mostrar cuándo y por quién fue modificado;
- no reemplaza la grilla oficial vigente.

### Paso 12. Publicar la grilla

**Pregunta:** ¿La encargada valida esta planificación como la versión oficial?

La publicación sólo ocurre después de la revisión humana.

Al publicar:

- la grilla pasa a ser la versión oficial de la semana;
- el personal puede consultarla;
- se registra usuario, fecha, hora y versión;
- cualquier versión oficial anterior del mismo período pasa a ser histórica;
- los cambios posteriores requieren una actualización registrada.

## 5. Prioridad de las reglas operativas

Cuando dos necesidades compiten entre sí, la encargada deberá considerar las reglas en el siguiente orden, de mayor a menor importancia:

1. **No dejar ningún piso sin cobertura.** Los tres pisos deben estar cubiertos en ambos turnos.
2. **Respetar las indisponibilidades confirmadas.** Una persona de franco, con licencia, vacaciones o ausencia no puede asignarse como si estuviera disponible.
3. **Respetar las solicitudes aprobadas que afecten la semana.** Los cambios confirmados deben incorporarse antes de validar la distribución final.
4. **Evitar asignaciones simultáneas incompatibles.** Una persona no puede ocupar dos puestos o turnos superpuestos.
5. **Utilizar primero a las camareras fijas disponibles en sus puestos habituales.** Las modificaciones deben responder a una necesidad real.
6. **Usar a las franqueras prioritariamente para Pisos.** Débora y Lucila cubren los huecos antes de ser consideradas para Cocina.
7. **Mantener identificada la cobertura de Cocina.** Cada turno debe mostrar claramente cocineros, peones, francos y apoyos.
8. **Aplicar correctamente la excepción Gustavo/Julio.** Si Gustavo cubre la tarde, no trabaja también por la mañana.
9. **Permitir colaboración de una franquera en Cocina sólo con Pisos completo.** Esta colaboración corresponde únicamente al turno mañana.
10. **Mantener claridad visual y trazabilidad.** Toda cobertura, excepción o cambio debe entenderse y quedar registrado.
11. **Conservar la decisión final de la encargada.** Ninguna propuesta o señal del sistema reemplaza su validación.

## 6. Casos especiales conocidos

### 5.1 Franqueras sin cobertura pendiente en Pisos

Si todos los pisos se encuentran cubiertos, una franquera disponible puede colaborar en Cocina durante el turno mañana.

La colaboración debe quedar identificada como tal. No transforma a la franquera en personal fijo de Cocina ni modifica su función principal.

### 5.2 Piso sin cobertura

Un piso sin persona asignada representa una situación crítica.

La grilla puede guardarse como borrador con el puesto señalado como pendiente, pero no debe publicarse mientras el hueco continúe sin resolver.

### 5.3 Gustavo cubre el franco de Julio

Gustavo puede pasar del turno mañana al turno tarde para cubrir el franco de Julio.

Ese día no trabaja durante la mañana. La grilla debe mostrar a Mario como único cocinero de la mañana, a Gustavo como cobertura de la tarde y a Julio de franco.

### 5.4 Cambio aprobado que afecta una grilla vigente

Un cambio aprobado debe reflejarse en la grilla oficial correspondiente.

Sin embargo, el sistema no debe modificarla silenciosamente ni por decisión propia. La encargada deberá revisar el impacto, validar la nueva distribución y publicar una actualización. La versión anterior se conserva como histórica y la acción queda registrada.

## 7. Casos que todavía no resolverá el sistema

Los siguientes casos podrán identificarse y mostrarse, pero su resolución continuará siendo manual:

### 6.1 Múltiples licencias simultáneas

Uzumaki no decidirá cómo redistribuir al personal cuando varias licencias afecten la misma semana o turno. La encargada deberá evaluar la situación completa.

### 6.2 Vacaciones

Las vacaciones confirmadas podrán registrarse como indisponibilidad, pero el sistema no determinará automáticamente quién cubre cada puesto afectado.

### 6.3 Reemplazos extraordinarios

No se elegirán automáticamente reemplazos externos, cambios excepcionales de función ni personas fuera de la dotación habitual.

### 6.4 Faltas imprevistas

Una falta de último momento podrá señalarse en la grilla, pero la respuesta operativa deberá ser definida y validada por la encargada.

### 6.5 Automatización completa del ciclo F1/F2

El sistema no proyectará todavía los francos futuros a partir del patrón de 6 días trabajados, F1, 6 días trabajados y F2.

Los francos existentes se consideran datos iniciales y no una autorización para calcular nuevas fechas.

## 8. Qué no hará todavía el motor

En esta etapa, el motor:

- no calculará automáticamente nuevas semanas;
- no generará propuestas automáticas de grilla;
- no asignará coberturas por cuenta propia;
- no elegirá entre Débora y Lucila;
- no aplicará automáticamente el ciclo F1/F2;
- no inferirá reglas desde la semana visual de referencia;
- no tomará decisiones sin validación de la encargada;
- no modificará una grilla publicada por sí solo;
- no resolverá automáticamente licencias, vacaciones o faltas imprevistas;
- no alterará solicitudes ni sus estados;
- no reemplazará el editor manual definido en `docs/09_editor_de_grillas.md`.

Su función documental actual es ordenar el razonamiento, no ejecutar decisiones.

## 9. Puntos de validación humana

La intervención de la encargada es obligatoria antes de:

- confirmar un franco que no estuviera previamente cargado;
- decidir qué franquera cubre un piso;
- mover una franquera a Cocina;
- aplicar la excepción Gustavo/Julio;
- incorporar solicitudes aprobadas que afecten la semana;
- resolver una ausencia extraordinaria;
- aceptar una planificación con una dotación diferente de la habitual;
- guardar una semana como borrador completo;
- publicar una grilla;
- actualizar una grilla ya publicada.

Uzumaki deberá presentar la información necesaria para decidir, pero la confirmación pertenece a la encargada.

## 10. Criterios de éxito

El proceso de planificación estará correctamente definido cuando:

1. La semana se revise siempre de lunes a domingo.
2. Los francos y las indisponibilidades se identifiquen antes de asignar coberturas.
3. Pisos se verifique antes que Cocina.
4. Los seis puestos diarios de Pisos puedan revisarse claramente.
5. Las franqueras se consideren primero para resolver huecos en Pisos.
6. Una franquera sólo pueda colaborar en Cocina cuando Pisos esté completo.
7. La excepción Gustavo/Julio se represente sin duplicar el turno de Gustavo.
8. Las solicitudes aprobadas que afecten la semana se incorporen antes de la validación final.
9. Los conflictos y puestos pendientes sean visibles antes de publicar.
10. La encargada pueda revisar y modificar todas las decisiones.
11. La grilla se guarde primero como borrador.
12. La publicación requiera una validación humana explícita.
13. Toda actualización de una grilla publicada conserve la versión anterior.
14. La semana de referencia no se utilice como regla para calcular otras semanas.
15. El razonamiento pueda aplicarse manualmente antes de diseñar cualquier automatización.

## 11. Alcance de este documento

Este documento describe cómo debe pensar Uzumaki desde la perspectiva operativa de una encargada.

No define fórmulas, algoritmos, pseudocódigo, estructuras de datos, componentes de interfaz ni decisiones de arquitectura. Tampoco autoriza la implementación del motor.

Cualquier automatización futura deberá diseñarse en una tarea independiente, contrastarse con `Directivas.md` y recibir aprobación explícita antes de modificar la aplicación.

## 12. Restricciones inmutables

Las siguientes reglas forman el límite operativo del editor de grillas y de cualquier futuro motor de planificación. Ninguna automatización, sugerencia, actualización o decisión de interfaz podrá violarlas:

1. **Nunca dejar un piso sin cobertura.** Cada piso debe tener una persona asignada en ambos turnos antes de publicar.
2. **Nunca asignar a una persona estando de franco.** Un franco confirmado implica indisponibilidad para trabajar ese día, salvo que exista una modificación explícita y validada del franco antes de la asignación.
3. **Nunca asignar una persona a dos puestos simultáneamente.** Toda superposición debe tratarse como conflicto.
4. **Nunca ocultar un conflicto operativo.** Los puestos vacíos, superposiciones, ausencias y contradicciones deben permanecer visibles hasta su resolución.
5. **Nunca sobrescribir una grilla publicada.** Todo cambio debe producir una nueva versión oficial mediante una actualización controlada.
6. **Nunca perder el historial de cambios.** Las versiones anteriores, responsables, fechas y motivos deben conservarse.
7. **Nunca inventar coberturas automáticamente.** El sistema no puede crear una asignación de cobertura sin reglas previamente aprobadas y validación de la encargada.

Si una acción entra en conflicto con cualquiera de estas restricciones, Uzumaki deberá detener el proceso, mostrar el problema y requerir intervención humana.
