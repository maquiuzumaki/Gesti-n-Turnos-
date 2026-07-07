# Directivas del Proyecto Uzumaki

## Datos iniciales

La aplicación comenzará con una estructura preparada para simular un servicio de alimentación real y facilitar el desarrollo del MVP. Los datos concretos de las personas se cargarán más adelante en `mockData.js`.

### Estructura inicial del servicio

El servicio estará compuesto por un total de **16 personas**.

### Personal operativo: 13 empleados

- 3 cocineros: 2 de turno mañana y 1 de turno tarde.
- 2 peones de cocina.
- 6 camareras con puesto fijo en los pisos.
- 2 franqueras.

### Personal administrativo: 3 personas

- 2 encargadas/nutricionistas: una de turno mañana y una de turno tarde.
- 1 supervisora general.

### Sectores operativos

La operación estará dividida inicialmente en dos sectores:

- Cocina.
- Pisos.

### Reglas operativas del servicio

- Los cocineros y peones desempeñan sus tareas exclusivamente en el sector Cocina.
- Las camareras tienen un puesto fijo asignado en los distintos pisos y, en condiciones normales, no rotan de sector.
- Las franqueras tienen un rol flexible. Su función principal es cubrir los francos, licencias, vacaciones o ausencias de las camareras fijas en el sector Pisos.
- Cuando no exista ninguna cobertura pendiente en Pisos, las franqueras deberán ser asignadas automáticamente al sector Cocina durante el turno mañana para colaborar con las tareas operativas.
- La aplicación deberá contemplar que las franqueras pueden cambiar de sector según las necesidades del servicio, mientras que el resto del personal mantiene normalmente un sector principal fijo.

Estas reglas representan el funcionamiento real del servicio y deberán utilizarse como base para el diseño de la grilla operativa, la asignación de turnos y las futuras automatizaciones del sistema.

## Nombre del producto

**Uzumaki**

## Descripción general

Uzumaki es una plataforma de gestión operativa para servicios de alimentación hospitalarios.

Su objetivo es centralizar la planificación del personal, la grilla semanal, los francos, las solicitudes, las licencias, los partes de enfermo, las notificaciones y la trazabilidad de la operación en una única aplicación.

La aplicación debe reemplazar progresivamente el uso de planillas, Excel, WhatsApp, llamados y acuerdos informales por un sistema organizado, transparente y auditable.

---

# Tecnologías iniciales

En esta primera versión se utilizarán:

- HTML.
- CSS.
- JavaScript.

El objetivo es construir una primera base simple, clara y entendible. No se deberá avanzar todavía con frameworks complejos, backend real ni base de datos real.

---

# Alcance inicial del MVP

La primera demo de Uzumaki deberá mostrar cuatro módulos principales:

- Dashboard.
- Grilla Operativa.
- Personal.
- Solicitudes.

El MVP deberá enfocarse en representar la operación diaria del servicio, sin intentar automatizar todo desde el inicio.

---

# Contexto operativo del servicio

Uzumaki debe representar el funcionamiento real de un Servicio de Alimentación Hospitalario.

La aplicación no será un gestor genérico de turnos, sino una herramienta adaptada a la operación diaria del servicio.

Todas las funcionalidades futuras deberán respetar las reglas operativas definidas en este documento.

---

# Estructura física de la institución

La institución está compuesta por:

- Subsuelo: Cocina del Servicio de Alimentación.
- Planta Baja: Comedor del personal autorizado.
- Primer Piso: Internación.
- Segundo Piso: Internación.
- Tercer Piso: Internación.

La camarera asignada al Primer Piso también es responsable de distribuir la comida al comedor del personal autorizado ubicado en Planta Baja.

---

# Sectores operativos

Existen únicamente dos sectores operativos:

## Cocina

Área donde se prepara y organiza la producción alimentaria.

En este sector trabajan:

- Cocineros.
- Peones de cocina.

## Pisos

Área donde se distribuye la alimentación a los pacientes internados y al personal autorizado.

En este sector trabajan:

- Camareras fijas.
- Franqueras.

---

# Organización del personal

## Cocina

El sector Cocina está compuesto por:

- Mario y Gustavo como cocineros fijos de turno mañana.
- Julio como cocinero fijo de turno tarde.
- Verónica como peón de cocina de turno mañana.
- Víctor como peón de cocina de turno tarde.

La dotación habitual de Cocina es:

- Turno mañana: 2 cocineros y 1 peón de cocina.
- Turno tarde: 1 cocinero y 1 peón de cocina.

Habitualmente, Mario y Gustavo trabajan como cocineros durante el turno mañana.

Cuando Julio tiene franco, Gustavo cubre su puesto como cocinero durante la tarde y no trabaja en el turno mañana. En esos días, Cocina queda con 1 cocinero en el turno mañana y 1 cocinero en el turno tarde; Mario es el único cocinero de la mañana y Gustavo cubre la tarde.

## Pisos

El sector Pisos está compuesto por:

- 3 camareras fijas de turno mañana.
- 3 camareras fijas de turno tarde.
- 2 franqueras.

Cada piso tiene una camarera fija por turno.

Las franqueras principales del servicio son:

- Débora.
- Lucila.

Las franqueras no tienen un piso fijo permanente. Su función principal es cubrir francos, licencias, vacaciones o ausencias de las camareras fijas.

## Personal administrativo

El servicio cuenta además con:

- 1 encargada/nutricionista de turno mañana.
- 1 encargada/nutricionista de turno tarde.
- 1 supervisora general.

La supervisora no trabaja físicamente en el servicio y cumple funciones de supervisión.

Las encargadas son responsables de la planificación semanal, la gestión del personal, la administración de la grilla operativa y la aprobación de solicitudes.

Ambas encargadas trabajan de lunes a viernes con horario fijo. Además, cubren el turno del sábado de forma alternada: un sábado trabaja una encargada y el sábado siguiente trabaja la otra.

En esta etapa, los perfiles administrativos se mantienen genéricos y se identifican únicamente como:

- Encargada turno mañana.
- Encargada turno tarde.
- Supervisora.

No se consideran oficiales nombres personales para estos perfiles hasta que sean definidos y validados expresamente.

---

# Turnos

Existen dos turnos operativos principales:

## Turno mañana

06:00 a 14:00.

## Turno tarde

14:00 a 21:30.

La cocina y el sector Pisos trabajan en ambos turnos.

Las encargadas cumplen los siguientes horarios:

- Encargada turno mañana, de lunes a viernes: 07:00 a 14:00.
- Encargada turno tarde, de lunes a viernes: 14:00 a 21:00.
- Guardia de sábado alternada entre ambas encargadas: 08:00 a 13:00.

La alternancia de los sábados se realiza semana por medio. La fecha de inicio de la alternancia se definirá más adelante; no debe calcularse ni asumirse automáticamente en esta etapa.

---

# Asignación de pisos

Cada camarera tiene un piso fijo asignado dentro de la grilla operativa.

La asignación permanece estable para dar continuidad al servicio.

La asignación vigente es:

- Turno mañana: Estela en Piso 1, Loly en Piso 2 y Cintia en Piso 3.
- Turno tarde: Milagros en Piso 1, Romina en Piso 2 y Yesica en Piso 3.

Aproximadamente cada dos meses, las encargadas podrán realizar una rotación de pisos para que el personal conozca distintos sectores y no permanezca siempre en el mismo lugar.

Esta rotación es una decisión administrativa y no forma parte de la planificación diaria automática.

La próxima rotación está prevista para septiembre con la siguiente distribución:

- Turno mañana: Cintia en Piso 1, Estela en Piso 2 y Loly en Piso 3.
- Turno tarde: Yesica en Piso 1, Milagros en Piso 2 y Romina en Piso 3.

---

# Sistema de francos

Todo el personal operativo utiliza el mismo ciclo general de francos:

- 6 días trabajados y luego 1 día de franco.
- Después, 6 días trabajados y luego 2 días de franco.
- El ciclo vuelve a comenzar de forma continua.

En la grilla se utilizarán las siguientes marcas:

- **F1:** semana o instancia donde el empleado tiene 1 franco.
- **F2:** semana o instancia donde el empleado tiene 2 francos.

Aunque todos los empleados siguen el mismo patrón, cada persona inicia el ciclo en una posición distinta. Por eso los francos se encuentran alternados y no caen todos los mismos días.

La aplicación no debe asumir que todos los empleados tienen el mismo calendario de francos.

La lógica de francos individuales se cargará luego en los datos iniciales/mockData, no dentro de este archivo de directivas.

## Glosario operativo

### F1
Representa un ciclo donde el empleado tiene **1 franco**.

### F2
Representa un ciclo donde el empleado tiene **2 francos consecutivos**.

### Franquera
Empleado operativo sin un puesto fijo. Su función principal es cubrir los huecos generados por francos, licencias, vacaciones o ausencias de las camareras fijas. Si no existen coberturas pendientes en Pisos, podrá colaborar en Cocina durante el turno mañana.

### Grilla publicada
Es la versión oficial de la grilla semanal que visualiza el personal operativo. Contiene los días de trabajo, turnos, francos, licencias y cualquier modificación aprobada. El personal solo puede consultarla; no puede editarla.

---

# Reglas de cobertura de Pisos

Esta es una regla crítica del sistema:

**Nunca puede quedar un piso sin cobertura.**

Cada uno de los tres pisos debe tener una camarera asignada por turno.

Cuando una camarera fija tiene franco, la cobertura debe ser realizada por una franquera.

Si dos camareras fijas tienen franco o ausencia el mismo día, ambas franqueras podrán cubrir simultáneamente los dos huecos.

Cuando una camarera se ausente por licencia médica, vacaciones, parte de enfermo u otra situación extraordinaria, la cobertura deberá ser definida o validada por las encargadas.

La prioridad absoluta siempre será cubrir Pisos.

---

# Reglas de las franqueras

Las franqueras son el recurso más flexible del servicio.

Su prioridad será siempre cubrir Pisos.

Solo cuando no exista ninguna cobertura pendiente en Pisos, las franqueras podrán ser asignadas a Cocina durante el turno mañana para colaborar con la operación.

La aplicación podrá sugerir automáticamente qué franquera cubre cada hueco, pero la encargada siempre deberá poder modificar esa asignación antes de publicar la grilla.

Si existen dos huecos en Pisos, el sistema deberá permitir elegir manualmente cuál franquera cubre cada piso.

La decisión final siempre será humana.

---

# Conteo de presentes

La grilla deberá mostrar un conteo diario de personas presentes por sector.

Deben existir, como mínimo:

- Conteo de presentes en Cocina.
- Conteo de presentes en Pisos, incluyendo camareras y franqueras.

Estos conteos sirven para verificar rápidamente si la cobertura diaria es suficiente.

---


---

# Modelo operativo de la grilla

La grilla semanal representa el funcionamiento operativo real del Servicio de Alimentación Hospitalario.

No debe organizarse como una lista de empleados, sino como una representación de la operación del servicio.

La estructura visual de la grilla deberá seguir este orden:

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

## Objetivo de la grilla

La grilla debe permitir que una encargada pueda responder rápidamente preguntas operativas como:

- ¿Está completa la cobertura del servicio?
- ¿Quién trabaja en cada puesto?
- ¿Qué camarera está asignada a cada piso?
- ¿Qué franquera está realizando una cobertura?
- ¿Quién está de franco?
- ¿Existe algún puesto sin cubrir?

La prioridad de lectura siempre será la operación del servicio y no la lista de empleados.

## Ejemplo operativo

Durante el desarrollo podrá utilizarse una semana real de referencia únicamente para validar el diseño de la interfaz y el comportamiento de la grilla.

Ese ejemplo no deberá utilizarse para calcular automáticamente futuras planificaciones ni reemplaza el sistema oficial de francos.

## Principios de diseño de la grilla

- La grilla debe agruparse por sectores y turnos.
- Los puestos son más importantes que los nombres de las personas.
- La cobertura de la operación tiene prioridad sobre la visualización individual de los empleados.
- Los francos deben visualizarse separados por sector para facilitar la revisión diaria.
- La interfaz debe parecer una herramienta operativa y no una planilla de cálculo tradicional.

---

# Grilla operativa semanal

La planificación se realiza semanalmente.

La semana operativa comprende:

**Lunes a Domingo.**

Las encargadas arman una versión borrador de la grilla.

Mientras la grilla está en borrador, solo puede ser vista y editada por perfiles administrativos.

Cuando la planificación está lista, se publica la grilla oficial.

El personal solo puede ver la última grilla publicada.

El personal nunca podrá modificar directamente la grilla.

Si hay cambios urgentes durante la semana, la grilla publicada podrá actualizarse, generando una nueva versión y dejando registro en el historial.

## Semana de referencia visual

La distribución del 29 de junio al 5 de julio de 2026 se incorpora únicamente como ejemplo manual del formato de una semana operativa real.

Esta referencia permite visualizar sectores, turnos, pisos, coberturas, colaboraciones de franqueras y francos. No fue calculada y no deberá utilizarse para proyectar, inferir ni generar futuras grillas. El ciclo individual F1/F2 continúa siendo la fuente operativa para el desarrollo futuro del motor de planificación.

---

# Solicitudes del personal

El personal podrá realizar solicitudes desde la aplicación.

Tipos iniciales de solicitudes:

- Cambio de turno.
- Cambio de franco.
- Parte de enfermo.
- Carga de certificado médico.

Los cambios de turno y franco deberán seguir este flujo:

1. El empleado realiza la solicitud.
2. El compañero involucrado acepta o rechaza.
3. La encargada aprueba o rechaza.
4. Si se aprueba, la grilla oficial se actualiza.
5. Se genera una nueva versión de la grilla.
6. Se notifica a las personas involucradas.
7. Todo queda registrado en auditoría.

---

# Incidencias y apercibimientos

Si un empleado acepta un cambio aprobado y luego no lo cumple, la encargada podrá registrar una incidencia o apercibimiento.

La incidencia deberá quedar asociada al historial del empleado y formar parte de la auditoría del sistema.

En el MVP, las incidencias pueden registrarse de forma simple. No es necesario crear todavía un módulo disciplinario avanzado.

---

# Identidad visual de Uzumaki

La aplicación **Uzumaki** deberá transmitir una imagen moderna, cálida, profesional y organizada.

La interfaz utilizará principalmente tonalidades entre naranja y amarillo.

Principios visuales:

- Diseño moderno y minimalista.
- Interfaz limpia y ordenada.
- Mobile First.
- Responsive para computadora, tablet y celular.
- Tarjetas con bordes redondeados.
- Sombras suaves.
- Botones grandes y claros.
- Íconos simples.
- Tipografía legible.
- Mucho espacio en blanco.

La información más importante siempre deberá aparecer primero.

---

# Reglas para la IA

Cada vez que la IA genere código o proponga cambios deberá:

- Leer primero este archivo de directivas.
- Respetar el contexto operativo del servicio.
- No inventar reglas nuevas si no están documentadas.
- No avanzar con automatizaciones complejas sin validación previa.
- Priorizar soluciones simples y entendibles.
- Mantener separación entre interfaz, lógica y datos.
- Reutilizar componentes cuando sea posible.
- Explicar brevemente qué cambio propone y por qué.

---

# Qué NO debe hacerse todavía

En esta etapa no se deberá implementar:

- Backend real.
- Base de datos real.
- Login avanzado.
- Notificaciones push.
- Integración con WhatsApp.
- Automatización completa de francos.
- Generación automática definitiva de grillas.
- Módulo disciplinario avanzado.
- Liquidación de sueldos.

---

# Próximo paso recomendado

Después de consolidar estas directivas, la información específica de empleados, nombres, roles, sectores, pisos, turnos y francos deberá cargarse en un archivo de datos iniciales/mockData.

Este archivo de directivas define las reglas y el contexto.

Los datos concretos de cada empleado no deben vivir en Directivas.md, sino en los archivos de datos de la aplicación.
