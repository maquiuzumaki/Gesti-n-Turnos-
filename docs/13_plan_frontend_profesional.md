# Plan de evolución del frontend de Uzumaki

## 1. Objetivo

Este documento analiza exclusivamente el frontend actual de Uzumaki y propone las mejoras necesarias para convertirlo en una interfaz profesional de gestión de personal y turnos.

El análisis no redefine reglas de negocio, almacenamiento ni automatizaciones del Motor de Planificación. Se concentra en:

- experiencia de uso;
- arquitectura de información;
- diseño visual;
- navegación por rol;
- grilla operativa;
- formularios y mensajes;
- accesibilidad;
- responsive y experiencia móvil;
- mantenibilidad del código de interfaz;
- pruebas de frontend.

La revisión se realizó sobre `index.html`, `src/app.js`, `src/styles/app.css`, los permisos visibles y la documentación de experiencia de usuario. En esta sesión no estuvo disponible el navegador integrado, por lo que los hallazgos visuales se basan en el código renderizado y deben cerrarse con una validación posterior mediante capturas reales en escritorio y celular.

## 2. Evaluación ejecutiva

La interfaz actual tiene una base valiosa: identidad propia, navegación por roles, estados visibles, grilla editable, formularios comprensibles y una primera adaptación responsive. No es necesario descartar el diseño existente.

Sin embargo, todavía presenta características de prototipo:

- exceso de mensajes explicativos y referencias a la demostración;
- demasiadas superficies tipo tarjeta para una herramienta de trabajo frecuente;
- jerarquías visuales inconsistentes entre módulos;
- grilla de escritorio trasladada casi sin adaptación al celular;
- iconografía basada en caracteres, símbolos y emojis sin un sistema común;
- estados y acciones distribuidos en demasiados bloques;
- tipografía pequeña para información operativa crítica;
- modales sin gestión completa de foco y teclado;
- código de presentación concentrado en un único archivo;
- ausencia de pruebas visuales y de accesibilidad.

La recomendación es evolucionar hacia una interfaz **operativa, sobria, rápida y orientada a decisiones**. La identidad naranja y amarilla debe permanecer como acento de marca, no como color dominante de todas las superficies.

## 3. Fortalezas que conviene conservar

- Navegación principal estable en barra lateral.
- Separación visible entre experiencia administrativa y experiencia del personal.
- Uso consistente de la identidad Uzumaki.
- Estados de grilla publicados, pausados y en borrador.
- Bloques de Cocina, Pisos y Francos reconocibles.
- Encabezados y primera columna fijos en varias vistas tabulares.
- Avisos de conflicto asociados a posiciones concretas.
- Estados vacíos y mensajes de confirmación ya presentes en varios flujos.
- Formularios agrupados por contexto.
- Vista previa del impacto de solicitudes.
- Región de notificaciones emergentes con `aria-live`.
- Primeras reglas de foco visible.
- Breakpoints para escritorio, tableta y celular.
- Escapado de contenido dinámico en gran parte del renderizado.

Estas fortalezas deben transformarse en componentes reutilizables, no rediseñarse desde cero sin una razón funcional.

## 4. Hallazgos principales

| Prioridad | Hallazgo | Impacto |
| --- | --- | --- |
| Crítica | Los modales no administran foco, no declaran un título accesible, no tienen cierre por Escape ni restauran el foco | Dificulta o impide operar con teclado y lectores de pantalla |
| Crítica | La grilla móvil sigue teniendo un ancho mínimo superior a 1000 px y depende del desplazamiento horizontal | La tarea principal se vuelve lenta y confusa en celular |
| Alta | El dashboard administrativo utiliza fechas y métricas vinculadas al modelo legado | Puede mostrar información distinta de la planificación vigente |
| Alta | La interfaz mezcla componentes de la grilla vigente con una grilla de referencia/legada | Genera inconsistencias visuales y aumenta el costo de mantenimiento |
| Alta | No existe una indicación persistente de guardado, cambios pendientes o error de persistencia | La encargada no sabe con certeza si su último cambio quedó registrado |
| Alta | Acciones sensibles aparecen mezcladas con acciones frecuentes | Aumenta el riesgo de pausar, eliminar o revocar por error |
| Alta | La información operativa usa reiteradamente texto de 12 px | Reduce legibilidad, especialmente en grillas densas y celulares |
| Alta | Estados dependen demasiado del color y algunos no tienen estilo específico, como `revoked` | Dificulta interpretar el estado y afecta accesibilidad |
| Media | Hay ocho pestañas simultáneas en Solicitudes, varias con significado parecido | Hace más difícil encontrar la cola de trabajo real |
| Media | Los iconos son símbolos Unicode y emojis con estilos y significados variables | La interfaz pierde consistencia y cambia según dispositivo |
| Media | El CSS contiene reglas globales y selectores estructurales frágiles | Cambiar filas o componentes puede romper el diseño de forma silenciosa |
| Media | Hay textos internos de prototipo como “Base de datos simulada” y “automatización futura” | Resta confianza y expone detalles técnicos innecesarios |
| Media | Las tablas solo se desplazan horizontalmente y no ofrecen vista alternativa | Personal y auditoría resultan incómodos en celular |
| Media | No hay navegación mediante URL, historial o enlace directo a una solicitud | Recargar o volver atrás hace perder el contexto de trabajo |
| Baja | Existen estilos inline y valores repetidos fuera de los tokens | Complica mantener consistencia visual |

## 5. Qué mejoraría

### 5.1 Sistema visual

#### Paleta

- Mantener naranja y amarillo como identidad, acciones principales y señalización.
- Usar una base neutral blanca/gris cálida para el área de trabajo.
- Reservar verde, ámbar, rojo y azul para estados semánticos consistentes.
- Definir contraste AA como mínimo para texto, controles, badges y foco.
- Evitar que borrador, publicado y pausado dependan solamente del color; agregar icono y texto.

#### Tipografía

- Establecer 14 px como tamaño mínimo habitual de contenido operativo.
- Reservar 12 px para metadatos secundarios no críticos.
- Eliminar espaciado negativo excesivo en títulos.
- Definir una escala tipográfica única: título de página, título de sección, título de bloque, cuerpo y metadato.
- Mejorar altura de línea en textos largos y formularios.

#### Espaciado y densidad

- Crear una escala única de 4, 8, 12, 16, 24 y 32 px.
- Reducir grandes espacios decorativos en páginas administrativas.
- Permitir más información visible sin perder separación entre tareas.
- Usar tarjetas solo para elementos repetidos o claramente delimitados.
- Presentar secciones operativas como bandas o paneles planos, evitando una sucesión de tarjetas dentro de tarjetas.

#### Iconografía

- Sustituir símbolos como `▦`, `↔`, `♙`, `◇` y emojis por una biblioteca coherente, preferentemente Lucide.
- Mantener icono más texto en acciones importantes.
- Agregar `aria-hidden` a iconos decorativos y nombres accesibles a botones solo con icono.
- Usar el mismo icono para una misma acción en toda la aplicación.

### 5.2 Estructura general y navegación

- Mantener la barra lateral en escritorio, con ancho más compacto y jerarquía clara.
- Mostrar en el encabezado la semana activa, su estado y el estado de guardado.
- Incorporar navegación real mediante URL para conservar página, filtros y solicitud seleccionada.
- Mantener una acción primaria por pantalla; mover acciones secundarias a un menú contextual.
- Hacer que el menú móvil tenga overlay, cierre al elegir una sección, cierre con Escape y gestione el foco.
- Marcar la sección activa con color, icono y atributo `aria-current="page"`.
- Separar navegación de operación y navegación administrativa cuando aumenten los módulos.

### 5.3 Dashboard de encargada

El dashboard debe ser una vista ejecutiva de trabajo, no una presentación del sistema.

Mejoras recomendadas:

- Eliminar fechas fijas y obtener el contexto de la semana activa.
- Reemplazar métricas del modelo legado por datos de `planningWeek`.
- Priorizar: solicitudes por resolver, puestos críticos, ausencias del día, coberturas y cambios sin publicar.
- Hacer clickeable cada indicador para abrir su lista filtrada.
- Mostrar solo actividad reciente relevante y con fecha real.
- Incluir un bloque compacto con estado de la grilla y acción siguiente.
- Diferenciar alertas críticas de información general.
- Evitar mostrar catálogos, cantidad de roles o estado de la base simulada.

Orden sugerido:

1. Estado y acción principal de la semana.
2. Pendientes que requieren decisión.
3. Riesgos de cobertura de hoy y próximos días.
4. Actividad reciente.

### 5.4 Dashboard del personal

- Mostrar primero el próximo turno o franco, con fecha, horario y puesto.
- Mostrar la semana personal como lista cronológica compacta.
- Evitar métricas administrativas o conteos que no ayuden a la persona.
- Destacar solicitudes que necesitan aceptación del compañero.
- Usar lenguaje directo: “Tu próximo turno”, “Tu franco”, “Solicitud pendiente”.
- Evitar que la persona tenga que recorrer la grilla completa para encontrar su asignación.

### 5.5 Grilla operativa

La grilla es el centro del producto y debe recibir la mayor inversión de diseño.

#### Escritorio

- Mantener una tabla semanal densa, con encabezado de días y columna de puestos fijos durante el scroll.
- Hacer sticky también el encabezado de días de la grilla vigente.
- Agregar una barra de herramientas fija con semana, estado, conflictos, guardado y acciones.
- Representar Mañana y Tarde mediante una banda de turno estable, no mediante selectores estructurales `nth-child`.
- Diferenciar asignación normal, reemplazo, excepción, franco y puesto sin cubrir con icono, etiqueta y color semántico.
- Mostrar el nombre completo cuando haya espacio y tooltip cuando se trunque.
- Hacer visibles los casilleros vacíos sin agregar ruido textual.
- Permitir filtrar visualmente por sector, turno, persona y estado sin modificar la planificación.
- Evitar repetir el resumen de cantidades arriba y abajo de la misma grilla.
- Corregir el texto de Cocina: actualmente la interfaz informa cinco puestos diarios, mientras la estructura vigente contempla seis espacios, tres por turno.

#### Celular

No conviene reducir la grilla de escritorio y obligar a desplazarse más de 1000 px.

Se recomienda una vista móvil específica con dos modos:

- **Por día:** selector de día y lista de Cocina Mañana, Cocina Tarde, Pisos Mañana, Pisos Tarde y Francos.
- **Mi semana:** para personal, lista de sus siete días con asignación o franco.

La encargada debería poder cambiar de día con gestos o botones anterior/siguiente, editar un casillero y volver a la misma posición. La tabla completa puede conservarse como opción secundaria “Vista semanal”.

#### Estados de edición

- Mostrar “Guardando…”, “Guardado” o “Error al guardar”.
- Indicar claramente si se edita borrador, publicada o pausada.
- Advertir al salir cuando existan cambios no persistidos.
- Confirmar acciones destructivas con nombre de semana y consecuencia.
- Después de guardar, mantener scroll, filtro y foco en el casillero editado.

### 5.6 Solicitudes

- Reemplazar las ocho pestañas por tres colas principales: “Para resolver”, “En curso” e “Historial”.
- Mover estados específicos a filtros desplegables.
- En vista administrativa, usar una lista densa o tabla responsive en lugar de tarjetas grandes de dos columnas.
- Mostrar en cada fila: tipo, solicitante, fecha afectada, estado, antigüedad y acción requerida.
- Destacar quién debe actuar ahora: compañero, encargada o nadie.
- Abrir el detalle en panel lateral en escritorio para no perder la lista.
- Mantener un modal o pantalla completa en celular.
- Presentar el impacto como comparación “Antes / Después”.
- Separar visualmente aprobar, rechazar y revocar.
- Mostrar resultado de aplicación del Motor y si requiere revisión manual.
- Agregar estilo explícito para `revoked` y revisión manual.
- Usar iconos diferentes para ausencia, licencia, cambio de franco y cambio de turno.
- Quitar textos sobre “automatización futura” cuando el flujo ya esté operativo.

### 5.7 Personal

- Convertir la tabla en un directorio operativo con filtros por estado, sector, turno y rol.
- Mantener búsqueda visible y agregar botón para limpiar filtros.
- En escritorio, usar filas compactas y encabezado sticky.
- En celular, usar filas apiladas o una ficha simple por persona.
- Mostrar solo la información necesaria para planificación en la lista.
- Reservar historial, francos y detalles para una vista individual.
- Ocultar acciones deshabilitadas; no mostrar una columna “Gestión” cuyo único contenido sea “Deshabilitada”.

### 5.8 Notificaciones y auditoría

#### Notificaciones

- Agrupar por “Hoy”, “Esta semana” y “Anteriores”.
- Diferenciar visualmente solicitud, grilla, alerta y sistema.
- Permitir abrir directamente la entidad relacionada.
- Marcar como leída al abrir, conservando una acción explícita para deshacer si fuera necesario.
- Mostrar fecha y hora reales.

#### Auditoría

- Agregar filtros por fecha, usuario, acción, entidad y resultado.
- Usar paginación o carga progresiva.
- Permitir abrir el detalle de una operación sin saturar la tabla.
- Diferenciar resultado exitoso, fallido y revisión manual.
- Retirar “Restablecer datos de demostración” de esta pantalla en cualquier entorno no demo.

### 5.9 Formularios, modales y feedback

- Implementar un componente modal accesible con `aria-labelledby` y `aria-describedby`.
- Llevar el foco al primer campo o al título al abrir.
- Encerrar el foco dentro del modal.
- Cerrar con Escape y devolver el foco al control que lo abrió.
- Evitar que un clic dentro del contenido cierre accidentalmente el modal.
- Bloquear el scroll de fondo mientras el modal esté abierto.
- Mostrar errores debajo del campo correspondiente, no solo mediante toast.
- Conservar los datos del formulario cuando una validación falla.
- Indicar campos obligatorios y formatos esperados.
- Deshabilitar el botón de envío mientras se procesa una acción.
- Evitar envíos dobles.
- Usar confirmaciones específicas para eliminar, pausar, rechazar y revocar.
- Agregar acciones “Deshacer” solo para cambios simples y seguros.
- Hacer que los toasts tengan rol semántico, cierre manual y duración suficiente.
- Respetar `prefers-reduced-motion`.

## 6. Qué agregaría al frontend

Estas incorporaciones mejoran la operación sin cambiar por sí mismas las reglas de negocio:

- Selector de semana anterior, actual y próxima.
- Estado persistente de guardado.
- Filtros rápidos por sector, turno, persona y conflicto.
- Vista móvil por día.
- Vista personal “Mi semana”.
- Panel lateral de detalle para solicitudes.
- Comparación visual antes/después para impactos del Motor.
- Menú de acciones de la grilla separado de la acción principal.
- Tooltips consistentes para iconos y textos truncados.
- Indicadores con icono y texto para reemplazos, excepciones y revisión manual.
- Breadcrumbs útiles solo cuando exista profundidad real.
- Enlaces directos a solicitud, empleado, semana o evento.
- Componentes de carga, error de conexión y reintento preparados para el futuro backend.
- Página de error y estado de sesión vencida.
- Preferencias de densidad de la grilla en escritorio: cómoda y compacta.
- Atajos de teclado limitados a tareas frecuentes y documentados en ayuda contextual.

## 7. Qué quitaría o simplificaría

- El bloque “Base de datos simulada” del dashboard productivo.
- Fechas y semanas fijas escritas en la interfaz.
- La grilla visual legada cuando `planningWeek` sea la fuente única.
- “Restablecer datos de demostración” fuera de un entorno de desarrollo.
- Textos técnicos como “automatización futura”, “contenedor” o nombres internos del motor frente al personal.
- La columna “Gestión” cuando no contiene acciones disponibles.
- Resúmenes duplicados de puestos, asignaciones, francos y excepciones.
- Pestañas redundantes de solicitudes.
- Símbolos Unicode y emojis usados como iconos funcionales.
- Gradientes decorativos repetidos en superficies administrativas.
- Sombras en cada panel o tarjeta.
- Etiquetas en mayúsculas con espaciado amplio en bloques muy pequeños.
- Información privada o interna en vistas del personal.
- Controles deshabilitados que parecen editables en vistas de solo lectura.
- Estilos inline y reglas CSS globales de `table`, `th` y `td`.

## 8. Arquitectura de información propuesta

### Encargada / administradora

1. **Resumen**: acción siguiente, alertas, pendientes y actividad.
2. **Planificación**: semana, grilla, conflictos, publicación y excepciones.
3. **Solicitudes**: para resolver, en curso e historial.
4. **Personal**: directorio y detalle operativo.
5. **Notificaciones**: novedades dirigidas.
6. **Auditoría**: historial filtrable.

### Supervisora

1. **Resumen**: estado general y alertas.
2. **Planificación**: consulta de la semana y excepciones.
3. **Solicitudes**: consulta y detalle sin acciones de resolución.
4. **Personal**: consulta.
5. **Auditoría**: consulta.

### Personal operativo

1. **Inicio**: próximo turno, próximo franco y acciones pendientes.
2. **Mi semana**: lista personal y acceso opcional a grilla publicada.
3. **Solicitudes**: crear, aceptar como compañero y consultar estado.
4. **Notificaciones**: novedades personales.

La vista del personal debe evitar la estructura administrativa y priorizar tareas de consulta rápida desde celular.

## 9. Arquitectura técnica del frontend

`src/app.js` concentra actualmente estado, navegación, templates HTML, validaciones, permisos, eventos y coordinación de casos de uso. Para una interfaz profesional conviene dividirlo gradualmente.

Estructura orientativa:

```text
src/
  app.js
  router.js
  state/
    appStore.js
    selectors.js
  components/
    Button.js
    Badge.js
    Modal.js
    Toast.js
    EmptyState.js
    DataTable.js
  layouts/
    AdminLayout.js
    StaffLayout.js
  pages/
    DashboardPage.js
    PlanningPage.js
    RequestsPage.js
    EmployeesPage.js
    NotificationsPage.js
    AuditPage.js
  features/
    planning/
    requests/
    employees/
  styles/
    tokens.css
    base.css
    components.css
    utilities.css
```

No es obligatorio incorporar un framework inmediatamente. La primera mejora es establecer responsabilidades y componentes claros. La decisión de usar React, Vue u otra alternativa debe tomarse al comenzar la integración con backend, evaluando complejidad, equipo y mantenimiento.

Recomendaciones técnicas:

- Renderizar componentes pequeños y testeables.
- Evitar HTML extenso dentro de funciones de negocio.
- Centralizar textos, estados, iconos y formatos.
- Crear selectores derivados para que dashboard y grilla usen la misma fuente.
- Usar eventos semánticos por feature en lugar de un único listener con muchas ramas.
- Evitar selectores CSS dependientes de la cantidad exacta de filas.
- Encapsular estilos por componente.
- Incorporar TypeScript o validación de contratos cuando comience V2.
- Preparar estados de carga, error y actualización optimista para el backend.

## 10. Plan de implementación frontend

### Fase F1 - Seguridad de UX y accesibilidad

- Corregir modales, foco, teclado y cierre.
- Revisar contraste, tamaños de texto y estados no basados solo en color.
- Agregar estilos faltantes para revocada y revisión manual.
- Unificar confirmaciones y mensajes de formulario.
- Retirar textos y acciones exclusivas de demo de las vistas productivas.
- Corregir textos inconsistentes, incluyendo la cantidad de espacios de Cocina.

### Fase F2 - Sistema de diseño y estructura

- Definir tokens de color, tipografía, espaciado, radios y elevación.
- Incorporar biblioteca de iconos.
- Crear componentes base.
- Simplificar paneles, tarjetas y jerarquías visuales.
- Modularizar CSS y retirar estilos inline/globales.
- Consolidar navegación y encabezados por rol.

### Fase F3 - Flujos operativos

- Rediseñar dashboard con datos de la planificación vigente.
- Crear barra de herramientas de la grilla.
- Simplificar solicitudes en colas operativas.
- Mejorar directorio de personal, notificaciones y auditoría.
- Incorporar estado de guardado y conservación de contexto.

### Fase F4 - Responsive profesional

- Crear vista de grilla por día para celular.
- Crear vista “Mi semana” para personal.
- Adaptar tablas a listas o filas apiladas.
- Validar objetivos táctiles mínimos de 44 x 44 px.
- Probar en anchos de 320, 375, 768, 1024 y 1440 px.

### Fase F5 - Calidad continua

- Pruebas de componentes y estados.
- Pruebas de teclado y accesibilidad con axe.
- Pruebas end-to-end por rol.
- Capturas de regresión visual en escritorio y celular.
- Pruebas con datos vacíos, completos, extensos y conflictivos.
- Presupuesto de rendimiento y revisión de carga de fuentes/recursos.

## 11. Criterios de aceptación de un frontend profesional

- La encargada identifica en menos de diez segundos qué necesita atención.
- Crear, editar y publicar una semana mantiene contexto, scroll y foco.
- El personal encuentra su próximo turno en la primera pantalla.
- La grilla puede operarse en celular sin depender de un desplazamiento horizontal extenso.
- Todas las acciones pueden completarse con teclado.
- Los modales cumplen gestión de foco, Escape y etiquetado accesible.
- Los estados se comprenden sin depender únicamente del color.
- No hay texto operativo crítico menor a 14 px.
- No aparecen datos de demostración ni terminología técnica en producción.
- Cada acción sensible explica su consecuencia antes de confirmarse.
- Los errores permanecen visibles junto al campo o acción que los produjo.
- La interfaz indica si los cambios están guardados.
- Encargada, supervisora y personal tienen navegación y contenido acordes a su rol.
- Las capturas de referencia pasan en los cinco tamaños definidos.
- No existen regresiones automáticas de accesibilidad críticas o serias.

## 12. Prioridad recomendada

El orden de mayor impacto es:

1. Accesibilidad y comportamiento correcto de modales.
2. Dashboard conectado al modelo vigente.
3. Estado de guardado y jerarquía de acciones de la grilla.
4. Vista móvil por día y “Mi semana”.
5. Simplificación del módulo de solicitudes.
6. Sistema visual e iconografía consistente.
7. Modularización de `app.js` y CSS.
8. Pruebas visuales, responsive y de accesibilidad continuas.

El frontend no necesita más decoración para verse profesional. Necesita menos ruido, mejor jerarquía, mayor legibilidad y una adaptación real a las tareas de cada rol. La grilla y la cola de solicitudes deben sentirse como herramientas de trabajo diario; el resto de la interfaz debe ayudarlas y mantenerse en segundo plano.
