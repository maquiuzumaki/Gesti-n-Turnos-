# 05. Experiencia de usuario y pantallas del MVP

## 1. Principios generales de UX

La experiencia de la aplicación debe ser simple, rápida y enfocada en la operación diaria. Los principios que guiarán el diseño son los siguientes:

- Minimizar la cantidad de clics para llegar a la información clave.
- Mostrar primero lo más importante: estado del servicio, solicitudes pendientes, cambios relevantes y cobertura operativa.
- Mantener una única fuente de verdad para la información operativa.
- Garantizar consistencia visual y funcional en todo el sistema.
- Diseñar priorizando la experiencia en dispositivos móviles, sin perder utilidad en escritorio.
- Ofrecer acciones rápidas para tareas frecuentes como solicitar un cambio, ver el turno del día o consultar notificaciones.
- Hacer visible la trazabilidad de las decisiones y los cambios.
- Priorizar la simplicidad sobre la profundidad funcional.

## 2. Navegación principal

La navegación deberá adaptarse al rol del usuario, manteniendo un enfoque claro y simple.

### Administradora
La administradora verá un menú orientado a la gestión completa del servicio:

- Dashboard
- Grilla Operativa
- Personal
- Solicitudes
- Notificaciones
- Estadísticas
- Auditoría
- Configuración

### Encargada
La encargada verá un menú orientado a la operación diaria y al control operativo:

- Dashboard
- Grilla Operativa
- Personal
- Solicitudes
- Notificaciones
- Estadísticas

### Supervisora
La supervisora verá un menú orientado a la supervisión, revisión y aprobación:

- Dashboard
- Grilla Operativa
- Solicitudes
- Notificaciones
- Personal (solo consulta básica)
- Estadísticas

### Personal
El personal verá un menú orientado a su información y a sus acciones diarias:

- Inicio / Mi resumen
- Mi Semana
- Mis Solicitudes
- Notificaciones
- Mi Historial
- Mi Perfil

## 3. Flujo de navegación

La navegación deberá guiar al usuario por caminos simples según su necesidad.

### Flujo de administración
Dashboard → Grilla Operativa → Detalle de turno o sector → Solicitud o cambio → Notificación → Auditoría

### Flujo de personal
Inicio / Mi resumen → Mi Semana → Solicitud → Estado de la solicitud → Notificación

### Flujo de aprobación
Solicitudes → Detalle de solicitud → Revisión → Aprobación / Rechazo → Notificación → Auditoría

### Flujo de consulta operativa
Dashboard → Indicadores → Grilla → Detalle del empleado → Historial

## 4. Pantallas del MVP

### 4.1 Login
**Objetivo**
Permitir el acceso del usuario al sistema con credenciales básicas.

**Usuario**
Todos los perfiles.

**Información que muestra**
- formulario de usuario y contraseña,
- mensaje de error si las credenciales no son válidas,
- opción de recordar sesión si se define más adelante.

**Acciones disponibles**
- iniciar sesión,
- recuperar acceso si se habilita en futuras versiones.

**Datos principales**
- usuario,
- contraseña,
- rol asociado.

**Relación con otras pantallas**
Al iniciar sesión, el sistema redirige al dashboard correspondiente al rol del usuario.

### 4.2 Dashboard administrativo
**Objetivo**
Dar una visión rápida del estado operativo del servicio antes de entrar en detalles.

**Usuario**
Administradora, encargada y supervisora.

**Información que muestra**
- personal programado para hoy,
- solicitudes pendientes,
- cambios pendientes de aprobación,
- partes de enfermo activos,
- licencias y vacaciones vigentes,
- puestos con posible falta de cobertura,
- notificaciones relevantes,
- indicadores operativos básicos.

**Acciones disponibles**
- ver grilla semanal,
- revisar solicitudes,
- abrir notificaciones,
- acceder a indicadores y personal.

**Datos principales**
- estado general del servicio,
- alertas inmediatas,
- accesos rápidos a módulos clave.

**Relación con otras pantallas**
Es el punto de entrada para la administración operativa y enlaza a grilla, solicitudes, personal y estadísticas.

### 4.3 Dashboard del empleado
**Objetivo**
Dar al personal una vista rápida y útil de su situación operativa.

**Usuario**
Personal.

**Información que muestra**
- próximo turno,
- resumen de la semana,
- solicitudes recientes,
- notificaciones,
- acciones rápidas.

**Acciones disponibles**
- solicitar cambio de turno,
- solicitar cambio de franco,
- informar parte de enfermo,
- consultar mis solicitudes,
- ver mi historial.

**Datos principales**
- turno próximo,
- estado semanal,
- solicitudes vigentes,
- notificaciones recientes.

**Relación con otras pantallas**
Conecta con Mi Semana, Mis Solicitudes, Notificaciones y Mi Historial.

### 4.4 Grilla Operativa
**Objetivo**
Mostrar la planificación semanal organizada por día, sector, turno y empleado, con foco en la cobertura del servicio.

**Usuario**
Administradora, encargada y supervisora.

**Información que muestra**
- días de la semana,
- sectores,
- turnos,
- empleados asignados,
- estados operativos de cada asignación,
- vacíos o puestos sin cobertura.

**Acciones disponibles**
- ver la grilla oficial vigente,
- ver borrador de grilla,
- publicar una nueva grilla,
- revisar cambios y versiones,
- abrir el detalle de un turno o empleado.

**Datos principales**
- cobertura operativa,
- estados de cada asignación,
- versiones de grilla.

**Relación con otras pantallas**
Se relaciona directamente con Dashboard, Solicitudes, Personal y versiones de grilla.

### 4.5 Mi Semana
**Objetivo**
Permitir al empleado ver su propia semana operativa en una vista simple.

**Usuario**
Personal.

**Información que muestra**
- turnos programados,
- francos,
- licencias,
- vacaciones,
- cambios aprobados.

**Acciones disponibles**
- ver detalle de un evento,
- solicitar cambio.

**Datos principales**
- estado semanal del empleado.

**Relación con otras pantallas**
Se vincula con Dashboard del empleado y Mis Solicitudes.

### 4.6 Personal
**Objetivo**
Permitir consultar y administrar la información base del equipo.

**Usuario**
Administradora, encargada y supervisora con permisos correspondientes.

**Información que muestra**
- listado de empleados,
- estado activo/inactivo,
- sector principal,
- rol operativo,
- información básica de contacto.

**Acciones disponibles**
- crear empleado,
- editar empleado,
- desactivar empleado,
- ver ficha del empleado,
- ver historial del empleado.

**Datos principales**
- empleados del servicio,
- estado del personal.

**Relación con otras pantallas**
Se conecta con Ficha del empleado, Grilla Operativa y Solicitudes.

### 4.7 Ficha del empleado
**Objetivo**
Centralizar la información relevante del empleado en un único lugar.

**Usuario**
Administradora, encargada, supervisora y personal (solo datos propios).

**Información que muestra**
- datos personales básicos,
- rol operativo,
- sector principal,
- estado,
- historial de eventos,
- solicitudes,
- incidencias y ausencias.

**Acciones disponibles**
- editar información básica,
- ver historial,
- ver solicitudes,
- ver notificaciones relacionadas.

**Datos principales**
- perfil del empleado,
- información operativa y de estado.

**Relación con otras pantallas**
Se vincula con Personal, Mi Semana, Solicitudes y Historial.

### 4.8 Solicitudes
**Objetivo**
Permitir a los perfiles administrativos revisar y gestionar allas solicitudes del sistema.

**Usuario**
Administradora, encargada y supervisora.

**Información que muestra**
- lista de solicitudes pendientes,
- filtros por estado, tipo y empleado,
- resumen de cada solicitud,
- fecha de creación,
- última actualización.

**Acciones disponibles**
- ver detalle,
- aprobar,
- rechazar,
- filtrar y buscar.

**Datos principales**
- solicitudes del sistema,
- estado de aprobación,
- usuarios involucrados.

**Relación con otras pantallas**
Se conecta con Detalle de solicitud, Grilla Operativa y Notificaciones.

### 4.9 Mis Solicitudes
**Objetivo**
Centralizar las solicitudes del personal en una vista simple y útil.

**Usuario**
Personal.

**Información que muestra**
- solicitudes recientes o relevantes,
- estado de cada solicitud,
- tipo de solicitud,
- fecha de creación,
- última actualización.

**Acciones disponibles**
- crear una nueva solicitud,
- ver detalle,
- consultar historial.

**Datos principales**
- solicitudes propias.

**Relación con otras pantallas**
Se conecta con Dashboard del empleado, Detalle de solicitud y Notificaciones.

### 4.10 Detalle de solicitud
**Objetivo**
Mostrar el estado completo de una solicitud y todo su historial.

**Usuario**
Administradora, encargada, supervisora y personal (solo solicitudes propias).

**Información que muestra**
- tipo de solicitud,
- solicitante,
- persona involucrada cuando aplica,
- estado actual,
- historial de acciones,
- observaciones,
- resolución final.

**Acciones disponibles**
- aceptar cuando corresponda,
- aprobar o rechazar,
- consultar historial.

**Datos principales**
- estado y evolución de la solicitud.

**Relación con otras pantallas**
Se relaciona con Solicitudes, Mis Solicitudes y Grilla Operativa.

### 4.11 Notificaciones
**Objetivo**
Centralizar los mensajes internos relevantes para cada usuario.

**Usuario**
Todos los perfiles.

**Información que muestra**
- cambios en la grilla,
- novedades sobre solicitudes,
- aprobaciones o rechazos,
- incidencias,
- modificaciones relevantes.

**Acciones disponibles**
- marcar como leída,
- abrir el elemento relacionado,
- filtrar por tipo.

**Datos principales**
- estado de las notificaciones.

**Relación con otras pantallas**
Se conecta con Dashboard, Solicitudes, Grilla Operativa y Mi Semana.

### 4.12 Centro de actividad
**Objetivo**
Permitir consultar eventos y cambios recientes del sistema.

**Usuario**
Administradora, encargada y supervisora.

**Información que muestra**
- actividad reciente del sistema,
- publicaciones de grilla,
- cambios operativos,
- acciones de auditoría relevantes.

**Acciones disponibles**
- filtrar por fecha,
- filtrar por tipo de evento,
- abrir detalle de la acción.

**Datos principales**
- actividad histórica reciente.

**Relación con otras pantallas**
Se relaciona con Auditoría, Grilla Operativa y Solicitudes.

### 4.13 Estadísticas
**Objetivo**
Ofrecer indicadores operativos básicos para tomar decisiones.

**Usuario**
Administradora, encargada y supervisora.

**Información que muestra**
- personal programado,
- personal presente,
- solicitudes pendientes,
- licencias y vacaciones vigentes,
- cobertura del servicio,
- incidencias registradas.

**Acciones disponibles**
- filtrar por rango de fechas,
- revisar indicadores por día o por semana.

**Datos principales**
- métricas operativas básicas.

**Relación con otras pantallas**
Se vincula con Dashboard y Grilla Operativa.

### 4.14 Configuración
**Objetivo**
Permitir administrar parámetros básicos del sistema en una primera etapa.

**Usuario**
Administradora principal.

**Información que muestra**
- usuarios del sistema,
- permisos básicos,
- parámetros generales del producto.

**Acciones disponibles**
- gestionar usuarios,
- ajustar permisos generales,
- administrar configuraciones básicas del MVP.

**Datos principales**
- configuración operativa y de acceso.

**Relación con otras pantallas**
Se relaciona con Personal y permisos del sistema.

## 5. Navegación Mobile

La experiencia mobile debe priorizar la velocidad, la claridad y la acción inmediata.

### Principios del diseño mobile
- La pantalla principal para el personal debe mostrar información útil de inmediato.
- Las acciones frecuentes deben estar accesibles a un solo toque.
- Las listas deben ser cortas, claras y fáciles de recorrer.
- La grilla debe adaptarse a una vista simplificada, sin perder el contexto operativo.
- Los formularios deben ser cortos y con pocos campos por pantalla.
- La navegación debe basarse en tabs o secciones cortas.

### Comportamiento esperado en mobile
- El personal verá primero Mi resumen o Mi semana.
- Los administrativos verán primero el Dashboard.
- Las solicitudes y notificaciones deberán ser fáciles de abrir desde un menú compacto.
- El historial debe estar disponible pero no debe ser el punto principal de entrada.

## 6. Navegación Desktop

La experiencia desktop debe permitir mayor profundidad y control operativo.

### Principios del diseño desktop
- Se podrá mostrar más información simultáneamente.
- La grilla podrá visualizarse con mayor detalle y contexto.
- Las tablas, filtros y búsquedas serán más completos.
- La administración de solicitudes y de personal podrá hacerse con mayor comodidad.

### Comportamiento esperado en desktop
- La administradora y la encargada podrán ver la grilla con mayor contexto y volumen de datos.
- Los filtros y búsquedas tendrán más espacio para facilitar el análisis.
- Las estadísticas podrán mostrarse en paneles más amplios y legibles.

## 7. Componentes reutilizables

La interfaz deberá estar construida con componentes reutilizables para mantener consistencia y reducir tiempos de desarrollo.

### Tarjetas
Se usarán para mostrar:
- resumen del día,
- próximos turnos,
- solicitudes recientes,
- indicadores rápidos,
- notificaciones destacadas.

### Tablas
Se usarán para:
- personal,
- solicitudes,
- historial,
- versiones de grilla,
- indicadores.

### Filtros
Se usarán para:
- estado de solicitud,
- tipo de solicitud,
- empleado,
- fecha,
- sector,
- turno.

### Búsquedas
Se usarán para encontrar:
- empleados,
- solicitudes,
- notificaciones,
- eventos de auditoría.

### Estados
Se usarán para mostrar:
- pendiente,
- aprobado,
- rechazado,
- activo,
- inactivo,
- en revisión,
- publicado,
- borrador.

### Badges
Se usarán para resaltar:
- tipos de solicitudes,
- estados operativos,
- tipos de notificación,
- cambios de grilla.

### Botones
Se usarán para:
- aprobar,
- rechazar,
- publicar,
- editar,
- crear,
- ver detalle,
- volver.

### Modales
Se usarán para:
- confirmar acciones,
- editar datos simples,
- ver detalles compactos,
- registrar incidencias o comentarios.

### Paneles
Se usarán para:
- mostrar indicadores,
- resumir información,
- agrupar acciones rápidas.

### Notificaciones
Se usarán para comunicar:
- cambios de grilla,
- nuevas solicitudes,
- decisiones de aprobación,
- alertas operativas.

## 8. Decisiones de diseño

### Por qué existe un Dashboard
Porque la encargada necesita entender rápidamente el estado del servicio antes de entrar al detalle de la grilla.

### Por qué la grilla no es la primera pantalla para todos
Porque la grilla es importante, pero el tablero operativo permite detectar primero si hay problemas o tareas urgentes.

### Por qué el empleado tiene una experiencia distinta
Porque el personal necesita una vista simple, clara y útil desde el celular, orientada a su información propia y a sus acciones diarias.

### Por qué existe el historial
Porque la trazabilidad es un valor central del producto. El historial permite comprender qué pasó, quién lo hizo y cuándo.

### Por qué la navegación se separa por rol
Porque cada perfil necesita acceso a información y acciones diferentes, y la experiencia debe ser adaptada para evitar sobrecarga.

## 9. Mejoras futuras

Las siguientes mejoras pueden incorporarse en versiones futuras:

- notificaciones push,
- integración con WhatsApp o correo,
- módulos más avanzados de incidencias y apercibimientos,
- flujos de aprobación más complejos por tipo de solicitud,
- reportes más completos y exportables,
- soporte multi-sede o multi-servicio nativo,
- paneles más personalizados por usuario,
- automatización avanzada de cobertura y planificación.
