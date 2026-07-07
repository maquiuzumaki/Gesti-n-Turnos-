import { loadState, resetState, saveState } from "./services/store.js?v=20260706-3";
import { canEditSchedule, canManageEmployees, canResolveRequests, canSeeAudit, isAdminRole, roleLabel } from "./services/permissions.js?v=20260703-1";
import { createDraftPlanningWeek } from "./services/planningWeeks.js?v=20260706-1";
import { demoUsers as canonicalDemoUsers } from "./data/mockData.js?v=20260706-3";

const app = document.querySelector("#app");
const toastRegion = document.querySelector("#toast-region");
let state = loadState();
const SESSION_KEY = "uzumaki-user-v4";
let user = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
let page = "dashboard";
let scheduleMode = "official";
let employeeSearch = "";
let requestFilter = "all";

const icons = {
  dashboard: "▦", schedule: "▤", employees: "♙", requests: "↔", notifications: "♢", audit: "◷", logout: "↪", plus: "+", menu: "☰",
};
const statusText = { pending: "Pendiente", review: "En revisión", approved: "Aprobada", rejected: "Rechazada", active: "Activo", inactive: "Inactivo" };
const shiftState = { working: "Trabaja", sick: "Enfermo", leave: "Licencia", off: "Franco" };

function toast(message, tone = "success") {
  const node = document.createElement("div");
  node.className = `toast ${tone}`;
  node.textContent = message;
  toastRegion.append(node);
  setTimeout(() => node.remove(), 3200);
}

function audit(action, entity, result) {
  state.auditLogs.unshift({ id: crypto.randomUUID(), time: "Ahora", user: user.name, action, entity, result });
}

function persist() {
  saveState(state);
  render();
}

function render() {
  if (!user) return renderLogin();
  app.innerHTML = `<div class="app-shell">
    ${sidebar()}
    <div class="workspace">
      ${topbar()}
      <main class="content" id="content">${renderPage()}</main>
    </div>
  </div>`;
}

function renderLogin(error = "") {
  app.innerHTML = `<main class="login-page">
    <section class="login-brand">
      <div class="brand-mark large"><img src="./ICONO.webp" alt="" /></div>
      <div class="login-copy">
        <span class="eyebrow light">Plataforma de gestión operativa para servicios de alimentación</span>
        <h1>“El trabajo duro es inútil para aquellos que no creen en sí mismos.”</h1>
        <p>Planificá turnos, resolvé solicitudes y mantené la operación bajo control, sin perder el hilo.</p>
      </div>
      <div class="login-proof"><span>✓</span><p><strong>Semana organizada</strong><br />Menos mensajes sueltos, más claridad.</p></div>
    </section>
    <section class="login-panel">
      <form class="login-card" id="login-form">
        <div class="mobile-logo"><span class="brand-mark"><img src="./ICONO.webp" alt="" /></span><strong>Uzumaki</strong></div>
        <span class="eyebrow">BIENVENIDA</span>
        <h2>Ingresá a tu espacio</h2>
        <p class="muted">Usá el acceso de demostración.</p>
        ${error ? `<div class="form-error">${error}</div>` : ""}
        <label>Usuario<input name="username" autocomplete="username" value="maqui" required /></label>
        <label>Contraseña<div class="password-field"><input name="password" type="password" autocomplete="current-password" value="demo123" required /><button type="button" class="text-button" data-action="toggle-password">Ver</button></div></label>
        <button class="button primary wide" type="submit">Ingresar <span>→</span></button>
        <div class="demo-access">
          <p>Accesos rápidos · clave <code>demo123</code></p>
          <div>${canonicalDemoUsers.map((item) => `<button type="button" class="chip" data-action="demo-login" data-username="${item.username}">${item.username}</button>`).join("")}</div>
        </div>
      </form>
    </section>
  </main>`;
}

function sidebar() {
  const admin = isAdminRole(user.role);
  const items = admin
    ? [["dashboard", "Resumen"], ["schedule", "Grilla operativa"], ["employees", "Personal"], ["requests", "Solicitudes"], ["notifications", "Notificaciones"], ...(canSeeAudit(user.role) ? [["audit", "Auditoría"]] : [])]
    : [["dashboard", "Mi resumen"], ["schedule", "Mi semana"], ["requests", "Mis solicitudes"], ["notifications", "Notificaciones"]];
  return `<aside class="sidebar" id="sidebar">
    <div class="brand"><span class="brand-mark"><img src="./ICONO.webp" alt="" /></span><div><strong>Uzumaki</strong><small>Gestión operativa</small></div></div>
    <nav>${items.map(([id, label]) => `<button class="nav-item ${page === id ? "active" : ""}" data-page="${id}"><span>${icons[id]}</span>${label}${id === "notifications" && unreadCount() ? `<b>${unreadCount()}</b>` : ""}</button>`).join("")}</nav>
    <div class="sidebar-foot"><div class="mini-avatar">${initials(user.name)}</div><div><strong>${user.name}</strong><small>${roleLabel[user.role]}</small></div><button title="Cerrar sesión" data-action="logout">${icons.logout}</button></div>
  </aside>`;
}

function topbar() {
  const titles = { dashboard: isAdminRole(user.role) ? "Resumen operativo" : `Hola, ${user.name.split(" ")[0]}`, schedule: isAdminRole(user.role) ? "Grilla operativa" : "Mi semana", employees: "Personal", requests: isAdminRole(user.role) ? "Solicitudes" : "Mis solicitudes", notifications: "Notificaciones", audit: "Auditoría" };
  const weekLabel = state.planningWeek ? `${formatIsoDate(state.planningWeek.startDate)} — ${formatIsoDate(state.planningWeek.endDate)}` : "Semana sin crear";
  return `<header class="topbar"><button class="mobile-menu" data-action="menu">${icons.menu}</button><div><span class="crumb">Uzumaki /</span><strong>${titles[page]}</strong></div><div class="top-actions"><button class="icon-button" data-page="notifications" aria-label="Notificaciones">♢${unreadCount() ? `<b>${unreadCount()}</b>` : ""}</button><span class="date-pill">${weekLabel}</span></div></header>`;
}

function renderPage() {
  const pages = { dashboard: dashboardPage, schedule: schedulePage, employees: employeesPage, requests: requestsPage, notifications: notificationsPage, audit: auditPage };
  return (pages[page] || dashboardPage)();
}

function pageHeading(kicker, title, description, action = "") {
  return `<div class="page-heading"><div><span class="eyebrow">${kicker}</span><h1>${title}</h1><p>${description}</p></div>${action}</div>`;
}

function dashboardPage() {
  if (!isAdminRole(user.role)) return staffDashboard();
  const active = state.employees.filter((e) => e.status === "active").length;
  const pending = state.requests.filter((r) => ["pending", "review"].includes(r.status)).length;
  const absent = state.schedule.filter((s) => ["sick", "leave"].includes(s.state) && s.day === state.days[0]).length;
  const todayShifts = state.schedule.filter((s) => s.day === state.days[0]);
  return `${pageHeading("VIERNES, 3 DE JULIO DE 2026", `Buen día, ${user.name}`, "Este es el pulso de la operación para hoy.", `<button class="button primary" data-page="schedule">Ver grilla <span>→</span></button>`)}
    <section class="metric-grid">
      ${metric("Personal activo", active, "Base inicial vigente", "sun", "♙")}
      ${metric("Programados hoy", todayShifts.length, `${Math.max(0, todayShifts.length - absent)} confirmados`, "blue", "▤")}
      ${metric("Solicitudes pendientes", pending, pending ? "Requieren atención" : "Todo al día", "amber", "↔")}
      ${metric("Ausencias hoy", absent, absent ? "1 cobertura a revisar" : "Sin novedades", "rose", "!")}
    </section>
    <section class="panel">
      <div class="panel-head">
        <div>
          <span class="eyebrow">ESTADO DEL SISTEMA</span>
          <h2>Base de datos simulada</h2>
        </div>
      </div>
      <div class="metric-grid" style="margin-top: 12px;">
        ${metric("Roles operativos", Object.keys(state.catalogs.rolesOperativos).length, "Catálogo base", "blue", "♙")}
        ${metric("Roles del sistema", Object.keys(state.catalogs.rolesSistema).length, "Catálogo base", "amber", "◷")}
        ${metric("Empleados cargados", state.employees.length, `${state.employees.filter((employee) => employee.participaEnOperacion).length} operativos`, "sun", "♟")}
        ${metric("Solicitudes cargadas", state.requests.length, "Sin datos aún", "rose", "↔")}
      </div>
      <div class="dashboard-grid" style="margin-top: 14px; grid-template-columns: repeat(3, minmax(0, 1fr));">
        <div>
          <strong>Sectores</strong>
          <p>${Object.values(state.catalogs.sectores).map((sector) => sector.nombre).join(" · ")}</p>
        </div>
        <div>
          <strong>Turnos</strong>
          <p>${Object.values(state.catalogs.turnos).map((turno) => turno.nombre).join(" · ")}</p>
        </div>
        <div>
          <strong>Pisos</strong>
          <p>${Object.values(state.catalogs.pisos).map((piso) => `Piso ${piso.numero}`).join(" · ")}</p>
        </div>
      </div>
    </section>
    <section class="dashboard-grid single-panel">
      <article class="panel"><div class="panel-head"><div><span class="eyebrow">PARA RESOLVER</span><h2>Solicitudes recientes</h2></div><button class="text-link" data-page="requests">Ver todas</button></div>
        <div class="request-list">${state.requests.filter((r) => ["pending", "review"].includes(r.status)).slice(0, 3).map(requestMini).join("") || empty("No hay solicitudes pendientes")}</div>
      </article>
    </section>
    <section class="panel activity-strip"><div><span class="eyebrow">ACTIVIDAD RECIENTE</span><h2>Lo último en Uzumaki</h2></div>${state.auditLogs.slice(0, 3).map((a) => `<div class="activity-item"><span class="activity-dot"></span><p><strong>${a.user}</strong> ${a.action.toLowerCase()}<small>${a.time} · ${a.entity}</small></p></div>`).join("")}<button class="icon-button" data-page="audit">→</button></section>`;
}

function staffDashboard() {
  const employee = state.employees.find((item) => item.id === user.employeeId);
  const publishedWeek = state.planningWeek?.status === "published" ? state.planningWeek : null;
  const myAssignments = publishedWeek && employee ? employeeWeekAssignments(publishedWeek, employee.id) : [];
  const myDaysOff = publishedWeek && employee ? employeeWeekDaysOff(publishedWeek, employee.id) : [];
  const next = myAssignments[0];
  const ownRequests = state.requests.filter((r) => r.employeeId === user.employeeId);
  if (!employee) {
    return `${pageHeading("MI PERFIL", "Información operativa", "Tu usuario no está vinculado a un empleado operativo.")}
      <section class="panel">${empty("No encontramos información operativa para este usuario")}</section>`;
  }
  return `${pageHeading("MI PERFIL", `Hola, ${employee.name}`, "Esta es tu información operativa visible en Uzumaki.", `<button class="button secondary" data-page="schedule">Ver grilla publicada</button>`)}
    <section class="staff-profile-hero">
      <div class="staff-profile-avatar">${employee.initials}</div>
      <div><span class="eyebrow light">PERSONAL OPERATIVO</span><h2>${employee.name}</h2><p>${employee.role} · ${employee.sector || "Sin sector"} · ${employee.turno || "Turno flexible"}</p></div>
      <div class="staff-profile-status"><strong>${next ? formatIsoDate(next.date) : "—"}</strong><small>Próxima asignación</small></div>
    </section>
    <section class="metric-grid staff-metrics">${metric("Asignaciones publicadas", myAssignments.length, publishedWeek ? publishedWeek.name : "Sin grilla publicada", "sun", "▤")}${metric("Francos publicados", myDaysOff.length, "Semana publicada", "amber", "○")}${metric("Solicitudes activas", ownRequests.filter((r) => ["pending", "review"].includes(r.status)).length, "Seguimiento personal", "blue", "↔")}</section>
    <section class="staff-profile-grid">
      <article class="panel"><div class="panel-head"><div><span class="eyebrow">DATOS OPERATIVOS</span><h2>Mi puesto habitual</h2></div></div>
        <div class="staff-info-list">
          <span><small>Rol operativo</small><strong>${employee.role}</strong></span>
          <span><small>Turno habitual</small><strong>${employee.turno || "Flexible"}</strong></span>
          <span><small>Sector principal</small><strong>${employee.sector || "No operativo"}</strong></span>
          <span><small>Ubicación</small><strong>${employee.piso ? `Piso ${employee.piso}` : employee.role === "Franquera" ? "Cobertura flexible" : "Sin piso fijo"}</strong></span>
        </div>
      </article>
      <article class="panel"><div class="panel-head"><div><span class="eyebrow">GRILLA PUBLICADA</span><h2>Próximas asignaciones</h2></div></div>
        ${publishedWeek ? myAssignments.map(staffAssignmentCard).join("") || empty("No tenés asignaciones en la grilla publicada") : empty("No hay grilla publicada disponible")}
      </article>
      <article class="panel"><div class="panel-head"><div><span class="eyebrow">FRANCOS</span><h2>Semana publicada</h2></div></div>
        ${publishedWeek ? myDaysOff.map(staffDayOffCard).join("") || empty("No tenés francos cargados en la semana publicada") : empty("No hay grilla publicada disponible")}
      </article>
    </section>`;
}

function employeeWeekAssignments(week, employeeId) {
  return (week.assignments || [])
    .filter((assignment) => assignment.employeeId === employeeId)
    .map((assignment) => {
      const position = week.operationalPositions.find((item) => item.id === assignment.positionId);
      return position ? { ...position, assignmentId: assignment.id } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.date.localeCompare(b.date) || a.label.localeCompare(b.label));
}

function employeeWeekDaysOff(week, employeeId) {
  return (week.daysOff || [])
    .filter((dayOff) => dayOff.employeeId === employeeId)
    .sort((a, b) => a.date.localeCompare(b.date));
}

function staffAssignmentCard(position) {
  const location = position.floor ? `Piso ${position.floor}` : position.sector;
  return `<div class="staff-week-item"><div class="day-box">${formatIsoDate(position.date).slice(0, 5)}</div><div><strong>${position.label}</strong><small>${position.sector} · Turno ${position.shift} · ${location}</small></div><span class="badge working">Asignado</span></div>`;
}

function staffDayOffCard(dayOff) {
  return `<div class="staff-week-item"><div class="day-box">${formatIsoDate(dayOff.date).slice(0, 5)}</div><div><strong>Franco ${dayOff.tipo}</strong><small>${dayOff.sector}</small></div><span class="badge active">Franco</span></div>`;
}

function metric(label, value, meta, color, icon) {
  return `<article class="metric-card"><div class="metric-icon ${color}">${icon}</div><div><span>${label}</span><strong>${value}</strong><small>${meta}</small></div></article>`;
}

function requestMini(r) {
  return `<button class="request-mini" data-page="requests"><span class="request-icon">${r.type.includes("enfermo") ? "+" : "↔"}</span><span><strong>${r.employee}</strong><small>${r.type} · ${r.detail}</small></span><span class="badge ${r.status}">${statusText[r.status]}</span></button>`;
}

function schedulePage() {
  if (state.planningWeek) return planningWeekPage();
  if (!state.schedule.length) return planningWeekPage();
  const canEdit = canEditSchedule(user.role);
  const mine = !isAdminRole(user.role);
  const source = scheduleMode === "draft" && canEdit ? state.draft : state.schedule;
  const visibleDays = state.days;
  const rows = mine ? source.filter((s) => s.employeeId === user.employeeId) : source;
  const action = canEdit ? `<div class="heading-actions"><button class="button secondary" data-action="toggle-schedule">${scheduleMode === "official" ? "Ver borrador" : "Ver oficial"}</button>${scheduleMode === "draft" ? `<button class="button primary" data-action="publish" ${state.hasDraftChanges ? "" : "disabled"}>Publicar cambios</button>` : ""}</div>` : "";
  const scheduleDescription = state.scheduleVersion === 0
    ? mine ? "Todavía no hay una grilla publicada." : "Borrador inicial · Todavía no existe una versión publicada."
    : mine ? "Tu planificación oficial del 1 al 7 de diciembre de 2025." : `Versión ${state.scheduleVersion} publicada`;
  return `${pageHeading("SEMANA 49 · 1 AL 7 DE DICIEMBRE DE 2025", mine ? "Mi semana" : "Grilla operativa", scheduleDescription, action)}
    ${scheduleMode === "draft" && canEdit ? `<div class="notice"><span>✎</span><div><strong>Estás viendo el borrador</strong><p>Hacé clic en un turno para cambiar su estado. El personal no verá estos cambios hasta publicar.</p></div>${state.hasDraftChanges ? `<b>Cambios sin publicar</b>` : ""}</div>` : ""}
    <section class="schedule-board">${visibleDays.map((day) => {
      const shifts = rows.filter((s) => s.day === day);
      return `<article class="day-column"><header><span>${day.split(" ")[0]}</span><strong>${day.split(" ")[1]}</strong><small>${shifts.length} asignados</small></header><div>${shifts.map((s) => shiftCard(s, scheduleMode === "draft" && canEdit)).join("") || `<div class="no-shift">Franco<br /><small>Sin asignación</small></div>`}</div></article>`;
    }).join("")}</section>
    ${!mine ? `<div class="legend"><span><i class="working"></i> Trabaja</span><span><i class="sick"></i> Parte de enfermo</span><span><i class="leave"></i> Licencia</span><span><i class="off"></i> Franco</span></div>` : ""}`;
}

function planningWeekPage() {
  const week = state.planningWeek;
  const canCreate = canEditSchedule(user.role);
  if (!canCreate) {
    if (week?.status === "published") return staffPublishedPlanningWeekPage(week);
    return `${pageHeading("PLANIFICACIÓN SEMANAL", "Mi semana", "No hay grilla publicada disponible.")}
      <section class="panel">${empty("No hay grilla publicada disponible")}</section>`;
  }
  if (!week) {
    return `${pageHeading("PLANIFICACIÓN SEMANAL", "Grilla operativa", "Creá el contenedor de una semana antes de comenzar a editar puestos.", canCreate ? `<button class="button primary" data-action="new-planning-week">${icons.plus} Crear semana</button>` : "")}
      <section class="week-lifecycle-card week-not-created">
        <div class="week-lifecycle-head"><span class="week-state-icon">○</span><div><span class="eyebrow">ESTADO ACTUAL</span><h2>Sin crear</h2><p>Todavía no existe una semana de planificación.</p></div><span class="week-status empty">Sin crear</span></div>
        <div class="week-lifecycle-flow" aria-label="Ciclo de vida inicial"><span class="active"><i>1</i><b>Sin crear</b></span><em>→</em><span><i>2</i><b>Borrador</b></span></div>
        <div class="week-empty-explanation"><strong>¿Qué se creará?</strong><p>Un contenedor con nombre, período y los puestos operativos vacíos de sus siete días. No copiará personas, francos, coberturas ni información de otra semana.</p></div>
      </section>`;
  }
  const assignmentCount = week.assignments.length;
  const emptyPositionCount = week.operationalPositions.length - assignmentCount;
  const daysOffCount = week.daysOff?.length || 0;
  const conflicts = detectPlanningConflicts(week);
  const isPublished = week.status === "published";
  const publishAction = week.status === "draft" && canCreate ? `<button class="button primary" data-action="publish-planning-week">Publicar grilla</button>` : "";
  return `${pageHeading("PLANIFICACIÓN SEMANAL", week.name, `${formatIsoDate(week.startDate)} — ${formatIsoDate(week.endDate)}`, publishAction)}
    <section class="week-lifecycle-card ${isPublished ? "week-published" : "week-draft"}">
      <div class="week-lifecycle-head"><span class="week-state-icon">${isPublished ? "✓" : "✎"}</span><div><span class="eyebrow">${isPublished ? "GRILLA PUBLICADA" : "SEMANA CREADA"}</span><h2>${week.name}</h2><p>${formatIsoDate(week.startDate)} al ${formatIsoDate(week.endDate)}${isPublished ? ` · Publicada ${formatDateTime(week.publishedAt)} por ${week.publishedBy?.name || "Usuario"}` : ""}</p></div><span class="week-status ${isPublished ? "published" : "draft"}">${isPublished ? "Publicada" : "Borrador"}</span></div>
      <div class="week-lifecycle-flow" aria-label="Ciclo de vida inicial"><span class="complete"><i>✓</i><b>Sin crear</b></span><em>→</em><span class="${isPublished ? "complete" : "active"}"><i>${isPublished ? "✓" : "2"}</i><b>Borrador</b></span><em>→</em><span class="${isPublished ? "active" : ""}"><i>${isPublished ? "✓" : "3"}</i><b>Publicada</b></span></div>
      <div class="week-empty-canvas">
        <span class="week-empty-symbol">▦</span><div><h3>${isPublished ? "Grilla publicada editable" : "Grilla lista para completar"}</h3><p>${assignmentCount} puestos asignados, ${emptyPositionCount} sin asignar y ${daysOffCount} francos manuales cargados. ${isPublished ? "La encargada puede ajustar la grilla cuando el servicio lo requiera." : "Las coberturas continúan vacías."}</p></div>
      </div>
      ${planningConflictPanel(conflicts)}
      ${planningWeekStructure(week, conflicts)}
      <div class="week-empty-collections" aria-label="Contenido inicial de la semana">
        <span><b>Puestos operativos</b><small>${week.operationalPositions.length} puestos</small></span>
        <span><b>Asignaciones</b><small>${assignmentCount} manuales</small></span>
        <span><b>Francos</b><small>${daysOffCount ? `${daysOffCount} manuales` : "Vacío"}</small></span>
        <span><b>Coberturas</b><small>Vacío</small></span>
      </div>
    </section>`;
}

function staffPublishedPlanningWeekPage(week) {
  const assignmentCount = week.assignments.length;
  const daysOffCount = week.daysOff?.length || 0;
  const conflicts = detectPlanningConflicts(week);
  return `${pageHeading("GRILLA PUBLICADA", week.name, `${formatIsoDate(week.startDate)} — ${formatIsoDate(week.endDate)}`)}
    <section class="week-lifecycle-card week-published staff-published-week">
      <div class="week-lifecycle-head"><span class="week-state-icon">✓</span><div><span class="eyebrow">SOLO LECTURA</span><h2>${week.name}</h2><p>${formatIsoDate(week.startDate)} al ${formatIsoDate(week.endDate)} · Publicada ${formatDateTime(week.publishedAt)}</p></div><span class="week-status published">Publicada</span></div>
      <div class="week-empty-canvas">
        <span class="week-empty-symbol">▦</span><div><h3>Grilla disponible para consultar</h3><p>${assignmentCount} puestos publicados y ${daysOffCount} francos informados. Esta vista no permite editar, publicar ni cargar cambios.</p></div>
      </div>
      ${planningWeekStructure(week, conflicts)}
    </section>`;
}

function planningWeekStructure(week, conflicts) {
  return `<div class="planning-position-sectors" aria-label="Puestos operativos">
    ${planningPositionSector(week, { sector: "Cocina", key: "kitchen", icon: "🍳", eyebrow: "SECTOR OPERATIVO", description: "Cinco puestos diarios organizados por turno." }, conflicts)}
    ${planningPositionSector(week, { sector: "Pisos", key: "floors", icon: "🏥", eyebrow: "COBERTURA POR PISO", description: "Seis puestos diarios para los tres pisos y ambos turnos." }, conflicts)}
    ${planningDaysOffSection(week, conflicts)}
  </div>`;
}

function planningPositionSector(week, section, conflicts) {
  const positions = week.operationalPositions.filter((position) => position.sector === section.sector);
  const dates = [...new Set(positions.map((position) => position.date))];
  const rows = positions.filter((position) => position.dayIndex === 0);
  const dayNames = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  const editable = ["draft", "published"].includes(week.status) && canEditSchedule(user.role);
  return `<section class="planning-position-sector reference-sector reference-sector-${section.key}" aria-labelledby="planning-${section.key}-title">
    <header class="reference-sector-head"><span class="reference-sector-icon" aria-hidden="true">${section.icon}</span><div><span class="reference-sector-eyebrow">${section.eyebrow}</span><h2 id="planning-${section.key}-title">${section.sector}</h2><p>${section.description}</p></div></header>
    <div class="planning-position-board"><div class="planning-position-grid">
      <div class="planning-position-corner"><strong>Puesto</strong><small>${week.assignments.length} asignados</small></div>
      ${dates.map((date, index) => `<div class="planning-position-day"><span>${dayNames[index]}</span><strong>${formatIsoDate(date).slice(0, 5)}</strong></div>`).join("")}
      ${rows.map((row) => `<div class="planning-position-row-label"><strong>${row.label}</strong><small>Turno ${row.shift}</small></div>${dates.map((date) => {
        const position = positions.find((item) => item.templateId === row.templateId && item.date === date);
        const assignment = week.assignments.find((item) => item.positionId === position.id);
        const employee = assignment ? state.employees.find((item) => item.id === assignment.employeeId) : null;
        const warnings = conflicts.positionWarnings.get(position.id) || [];
        return `<div class="planning-position-cell ${warnings.length ? "has-warning" : ""}"><button class="planning-position-assignment ${employee ? "assigned" : "empty"} ${warnings.length ? "warning" : ""}" type="button" ${editable ? `data-action="assign-planning-position" data-position-id="${position.id}"` : "disabled"} aria-label="${employee ? `Cambiar asignación de ${position.label}: ${employee.name}` : `Asignar empleado a ${position.label}`}">${employee ? `<strong>${employee.name}</strong><small>${employee.role}</small>` : `<span>Sin asignar</span>`}${warnings.length ? `<em>${warnings[0]}</em>` : ""}</button></div>`;
      }).join("")}`).join("")}
    </div></div>
  </section>`;
}

function planningDaysOffSection(week, conflicts) {
  const dates = [...new Set(week.operationalPositions.map((position) => position.date))];
  const dayNames = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  const rows = ["Cocina", "Pisos"];
  const editable = ["draft", "published"].includes(week.status) && canEditSchedule(user.role);
  return `<section class="planning-position-sector reference-sector reference-sector-off" aria-labelledby="planning-days-off-title">
    <header class="reference-sector-head"><span class="reference-sector-icon" aria-hidden="true">○</span><div><span class="reference-sector-eyebrow">DISPONIBILIDAD</span><h2 id="planning-days-off-title">Francos</h2><p>Registro manual de empleados de franco por sector y día.</p></div></header>
    <div class="planning-position-board"><div class="planning-position-grid planning-days-off-grid">
      <div class="planning-position-corner"><strong>Francos</strong><small>${week.daysOff?.length || 0} cargados</small></div>
      ${dates.map((date, index) => `<div class="planning-position-day"><span>${dayNames[index]}</span><strong>${formatIsoDate(date).slice(0, 5)}</strong></div>`).join("")}
      ${rows.map((sector) => `<div class="planning-position-row-label"><strong>Francos ${sector}</strong><small>Manual · F1/F2</small></div>${dates.map((date) => planningDaysOffCell(week, sector, date, editable, conflicts)).join("")}`).join("")}
    </div></div>
  </section>`;
}

function planningDaysOffCell(week, sector, date, editable, conflicts) {
  const dayOffs = (week.daysOff || []).filter((item) => item.sector === sector && item.date === date);
  return `<div class="planning-position-cell planning-days-off-cell"><button class="planning-day-off-button ${dayOffs.length ? "assigned" : "empty"}" type="button" ${editable ? `data-action="add-planning-day-off" data-sector="${sector}" data-date="${date}"` : "disabled"} aria-label="Cargar franco de ${sector} para ${formatIsoDate(date)}">${dayOffs.length ? dayOffs.map((dayOff) => {
    const employee = state.employees.find((item) => item.id === dayOff.employeeId);
    const warnings = conflicts.dayOffWarnings.get(dayOff.id) || [];
    return `<span class="planning-day-off-chip ${warnings.length ? "warning" : ""}"><strong>${employee?.name || "Empleado"}</strong><small>${dayOff.tipo}</small>${warnings.length ? `<em>${warnings[0]}</em>` : ""}</span>`;
  }).join("") : `<span>Sin francos</span>`}</button></div>`;
}

function detectPlanningConflicts(week) {
  const positionWarnings = new Map();
  const dayOffWarnings = new Map();
  const items = [];
  const counts = { assignedAndOff: 0, duplicateAssignment: 0, unassignedPosition: 0, uncoveredFloor: 0 };
  const assignmentsByPosition = new Map((week.assignments || []).map((assignment) => [assignment.positionId, assignment]));
  const dayOffs = week.daysOff || [];

  const addPositionWarning = (positionId, message) => {
    if (!positionWarnings.has(positionId)) positionWarnings.set(positionId, []);
    positionWarnings.get(positionId).push(message);
  };
  const addDayOffWarning = (dayOffId, message) => {
    if (!dayOffWarnings.has(dayOffId)) dayOffWarnings.set(dayOffId, []);
    dayOffWarnings.get(dayOffId).push(message);
  };

  week.operationalPositions.forEach((position) => {
    const assignment = assignmentsByPosition.get(position.id);
    if (!assignment) {
      counts.unassignedPosition += 1;
      if (position.sector === "Pisos" && position.floor) {
        counts.uncoveredFloor += 1;
        addPositionWarning(position.id, `Piso ${position.floor} sin cobertura`);
        items.push({ type: "uncoveredFloor", text: `${formatIsoDate(position.date)} · Piso ${position.floor} ${position.shift} sin cobertura.` });
      }
      addPositionWarning(position.id, "Sin asignar");
      items.push({ type: "unassignedPosition", text: `${formatIsoDate(position.date)} · ${position.label} está sin asignar.` });
    }
  });

  const assignmentsByShiftEmployee = new Map();
  (week.assignments || []).forEach((assignment) => {
    const position = week.operationalPositions.find((item) => item.id === assignment.positionId);
    if (!position) return;
    const key = `${position.date}:${position.shift}:${assignment.employeeId}`;
    if (!assignmentsByShiftEmployee.has(key)) assignmentsByShiftEmployee.set(key, []);
    assignmentsByShiftEmployee.get(key).push({ assignment, position });
  });

  assignmentsByShiftEmployee.forEach((records) => {
    if (records.length < 2) return;
    const employee = state.employees.find((item) => item.id === records[0].assignment.employeeId);
    counts.duplicateAssignment += 1;
    records.forEach(({ position }) => addPositionWarning(position.id, "Duplicado mismo turno"));
    items.push({ type: "duplicateAssignment", text: `${formatIsoDate(records[0].position.date)} · ${employee?.name || "Empleado"} figura ${records.length} veces en turno ${records[0].position.shift}.` });
  });

  dayOffs.forEach((dayOff) => {
    const records = (week.assignments || [])
      .map((assignment) => ({ assignment, position: week.operationalPositions.find((item) => item.id === assignment.positionId) }))
      .filter(({ assignment, position }) => position && position.date === dayOff.date && assignment.employeeId === dayOff.employeeId);
    if (!records.length) return;
    const employee = state.employees.find((item) => item.id === dayOff.employeeId);
    counts.assignedAndOff += 1;
    addDayOffWarning(dayOff.id, "También asignado");
    records.forEach(({ position }) => addPositionWarning(position.id, "Empleado de franco"));
    items.push({ type: "assignedAndOff", text: `${formatIsoDate(dayOff.date)} · ${employee?.name || "Empleado"} está asignado y cargado como franco.` });
  });

  return { counts, items, positionWarnings, dayOffWarnings, total: items.length };
}

function planningConflictPanel(conflicts) {
  if (!conflicts.total) {
    return `<div class="planning-conflict-panel ok"><span>✓</span><div><strong>Sin advertencias visibles</strong><p>No se detectan conflictos básicos en esta grilla.</p></div></div>`;
  }
  const summary = [
    ["Asignado y de franco", conflicts.counts.assignedAndOff],
    ["Asignación duplicada", conflicts.counts.duplicateAssignment],
    ["Puestos sin asignar", conflicts.counts.unassignedPosition],
    ["Pisos sin cobertura", conflicts.counts.uncoveredFloor],
  ];
  return `<section class="planning-conflict-panel warning" aria-label="Advertencias de la grilla">
    <div class="planning-conflict-head"><span>!</span><div><strong>Advertencias de la grilla</strong><p>Los puestos sin asignar y pisos sin cobertura no bloquean la publicación. Solo se bloquea una persona repetida dentro del mismo turno y día.</p></div></div>
    <div class="planning-conflict-summary">${summary.map(([label, count]) => `<span><b>${count}</b><small>${label}</small></span>`).join("")}</div>
    <ul>${conflicts.items.slice(0, 8).map((item) => `<li>${item.text}</li>`).join("")}${conflicts.items.length > 8 ? `<li>+ ${conflicts.items.length - 8} advertencias más en la grilla.</li>` : ""}</ul>
  </section>`;
}

function publishPlanningWeek() {
  const week = state.planningWeek;
  if (!week || week.status !== "draft" || !canEditSchedule(user.role)) return;
  const conflicts = detectPlanningConflicts(week);
  if (conflicts.counts.duplicateAssignment) {
    return toast(`No se puede publicar: corregí ${conflicts.counts.duplicateAssignment} duplicado(s) dentro del mismo turno.`, "error");
  }
  const publishedAt = new Date().toISOString();
  week.status = "published";
  week.publishedAt = publishedAt;
  week.publishedBy = { id: user.id || user.username, name: user.name, role: user.role };
  audit("Publicó una grilla manual", week.name, "Publicada");
  persist();
  toast("Grilla publicada correctamente");
}

function referenceSchedulePage() {
  const reference = state.referenceSchedule;
  const kitchenRows = [
    { sector: "Cocina", label: "Turno mañana", values: (day) => day.cocina.manana },
    { sector: "Cocina", label: "Turno tarde", values: (day) => day.cocina.tarde },
  ];
  const floorRows = [
    { sector: "Pisos", label: "Mañana · Piso 1", values: (day) => [day.pisos.manana[1]] },
    { sector: "Pisos", label: "Mañana · Piso 2", values: (day) => [day.pisos.manana[2]] },
    { sector: "Pisos", label: "Mañana · Piso 3", values: (day) => [day.pisos.manana[3]] },
    { sector: "Pisos", label: "Tarde · Piso 1", values: (day) => [day.pisos.tarde[1]] },
    { sector: "Pisos", label: "Tarde · Piso 2", values: (day) => [day.pisos.tarde[2]] },
    { sector: "Pisos", label: "Tarde · Piso 3", values: (day) => [day.pisos.tarde[3]] },
  ];
  const offRows = [
    { sector: "Francos", label: "Cocina", values: (day) => day.francos.cocina, state: "off" },
    { sector: "Francos", label: "Pisos", values: (day) => day.francos.pisos, state: "off" },
  ];
  return `${pageHeading("SEMANA DE REFERENCIA · 29 JUN — 5 JUL 2026", "Grilla operativa", "Ejemplo manual de una semana real. Define el formato visual, no calcula semanas futuras.")}
    <div class="notice reference-notice"><span>ⓘ</span><div><strong>Referencia visual y funcional</strong><p>Esta distribución no modifica el ciclo F1/F2 ni funciona como regla de planificación automática.</p></div><b>NO CALCULADA</b></div>
    <div class="reference-sectors">
      ${referenceSectorBlock(reference, { key: "kitchen", icon: "🍳", eyebrow: "SECTOR OPERATIVO", title: "Cocina", description: "Producción y apoyo organizados por turno.", cornerLabel: "Turno", rows: kitchenRows })}
      ${referenceSectorBlock(reference, { key: "floors", icon: "🏥", eyebrow: "DISTRIBUCIÓN", title: "Pisos", description: "Cobertura de los tres pisos en ambos turnos.", cornerLabel: "Turno / piso", rows: floorRows })}
      ${referenceSectorBlock(reference, { key: "off", icon: "○", eyebrow: "DISPONIBILIDAD", title: "Francos", description: "Personal de Cocina y Pisos que no presta servicio ese día.", cornerLabel: "Área", rows: offRows })}
    </div>
    <div class="reference-legend"><span><i class="working"></i> Asignación habitual</span><span><i class="coverage"></i> Cobertura o colaboración</span><span><i class="exception"></i> Cobertura excepcional</span><span><i class="off"></i> Franco</span></div>`;
}

function referenceSectorBlock(reference, section) {
  return `<section class="reference-sector reference-sector-${section.key}" aria-labelledby="reference-${section.key}-title">
    <header class="reference-sector-head"><span class="reference-sector-icon" aria-hidden="true">${section.icon}</span><div><span class="reference-sector-eyebrow">${section.eyebrow}</span><h2 id="reference-${section.key}-title">${section.title}</h2><p>${section.description}</p></div></header>
    <div class="reference-board"><div class="reference-grid">
      <div class="reference-corner"><strong>${section.title}</strong><small>${section.cornerLabel}</small></div>
      ${reference.days.map((day) => `<header class="reference-day"><span>${day.shortLabel}</span><strong>${day.displayDate}</strong></header>`).join("")}
      ${section.rows.map((row) => `<div class="reference-row-label"><strong>${row.label}</strong><small>${section.title}</small></div>${reference.days.map((day) => `<div class="reference-cell">${row.values(day).filter(Boolean).map((person) => referencePerson(person, row.state)).join("")}</div>`).join("")}`).join("")}
    </div></div>
  </section>`;
}

function referencePerson(person, state = "") {
  const tone = state || person.kind || "working";
  return `<div class="reference-person ${tone}"><strong>${person.name}</strong>${person.note ? `<small>${person.note}</small>` : ""}</div>`;
}

function shiftCard(s, editable) {
  return `<button class="shift-card ${s.state}" ${editable ? `data-action="cycle-shift" data-id="${s.id}" title="Cambiar estado"` : "disabled"}><span class="avatar tiny">${initials(s.employee)}</span><span><strong>${s.employee.split(" ")[0]}</strong><small>${s.time}<br />${s.sector}</small></span><i></i></button>`;
}

function employeesPage() {
  if (!isAdminRole(user.role)) return staffDashboard();
  const query = employeeSearch.toLowerCase();
  const filtered = state.employees.filter((employee) => [employee.name, employee.role, employee.sector, employee.turno].filter(Boolean).some((value) => value.toLowerCase().includes(query)));
  return `${pageHeading("EQUIPO", "Personal", `${state.employees.filter((e) => e.status === "active").length} personas activas en el servicio.`)}
    <div class="notice"><span>ⓘ</span><div><strong>Gestión de empleados deshabilitada en esta versión del MVP</strong><p>La base oficial de 16 perfiles permanece fija por ahora.</p></div></div>
    <section class="toolbar"><label class="search">⌕<input id="employee-search" placeholder="Buscar por nombre, rol, sector o turno…" value="${employeeSearch}" /></label><div class="filter-summary"><span class="status-dot"></span>${filtered.length} resultados</div></section>
    <section class="table-card"><table><thead><tr><th>Persona</th><th>Rol</th><th>Turno y ubicación</th><th>Francos base</th><th>Estado</th><th>Gestión</th></tr></thead><tbody>${filtered.map((employee) => `<tr><td><div class="person-cell"><span class="avatar">${employee.initials}</span><div><strong>${employee.name}</strong><small>${employee.participaEnOperacion ? "Personal operativo" : employee.systemRole}</small></div></div></td><td>${employee.role}</td><td>${employeeAssignment(employee)}</td><td>${employeeFrancos(employee)}</td><td><span class="badge ${employee.status}">${statusText[employee.status]}</span></td><td><span class="muted">Deshabilitada</span></td></tr>`).join("")}</tbody></table>${filtered.length ? "" : empty("No encontramos personas con esa búsqueda")}</section>`;
}

function employeeAssignment(employee) {
  const location = employee.piso ? `Piso ${employee.piso}` : employee.role === "Franquera" ? "Cobertura flexible" : employee.sector || "No operativo";
  return `<div class="employee-assignment"><strong>${employee.turno || "Sin turno fijo"}</strong><small>${location}</small></div>`;
}

function employeeFrancos(employee) {
  if (!employee.francos?.length) return `<span class="muted">Sin francos cargados</span>`;
  return `<details class="francos-details"><summary>${employee.francos.length} fechas cargadas</summary><div>${employee.francos.map((franco) => `<span class="franco-chip ${franco.tipo.toLowerCase()}"><b>${franco.tipo}</b> ${franco.fecha.slice(8, 10)}/${franco.fecha.slice(5, 7)}</span>`).join("")}</div></details>`;
}

function requestsPage() {
  const admin = isAdminRole(user.role);
  const own = admin ? state.requests : state.requests.filter((r) => r.employeeId === user.employeeId);
  const filtered = requestFilter === "all" ? own : own.filter((r) => r.status === requestFilter);
  return `${pageHeading("GESTIÓN", admin ? "Solicitudes" : "Mis solicitudes", admin ? "Revisá y resolvé los pedidos del equipo." : "Creá pedidos y seguí su resolución.", `<button class="button primary" data-action="new-request">${icons.plus} Nueva solicitud</button>`)}
    <div class="tabs">${[["all", "Todas"], ["pending", "Pendientes"], ["review", "En revisión"], ["approved", "Aprobadas"], ["rejected", "Rechazadas"]].map(([id, label]) => `<button class="${requestFilter === id ? "active" : ""}" data-action="filter-request" data-filter="${id}">${label}${id === "pending" ? `<b>${own.filter((r) => r.status === "pending").length}</b>` : ""}</button>`).join("")}</div>
    <section class="request-cards">${filtered.map((r) => requestCard(r, admin)).join("") || empty("No hay solicitudes en este estado")}</section>`;
}

function requestCard(r, admin) {
  const resolvable = admin && canResolveRequests(user.role) && ["pending", "review"].includes(r.status);
  return `<article class="request-card"><div class="request-card-top"><span class="request-icon large">${r.type.includes("enfermo") ? "+" : "↔"}</span><div><span class="request-id">${r.id}</span><h3>${r.type}</h3><p>${r.detail}</p></div><span class="badge ${r.status}">${statusText[r.status]}</span></div><div class="request-meta"><span><small>SOLICITANTE</small><strong>${r.employee}</strong></span><span><small>CREADA</small><strong>${r.date}</strong></span><span><small>OBSERVACIÓN</small><strong>${r.note}</strong></span></div>${resolvable ? `<div class="card-actions"><button class="button danger-soft" data-action="resolve" data-id="${r.id}" data-status="rejected">Rechazar</button><button class="button primary" data-action="resolve" data-id="${r.id}" data-status="approved">Aprobar</button></div>` : ""}</article>`;
}

function notificationsPage() {
  return `${pageHeading("CENTRO DE AVISOS", "Notificaciones", `${unreadCount()} novedades sin leer.`, unreadCount() ? `<button class="button secondary" data-action="read-all">Marcar todas como leídas</button>` : "")}
    <section class="notification-list">${state.notifications.map((n) => `<button class="notification ${n.read ? "read" : ""}" data-action="read-notification" data-id="${n.id}"><span class="notification-symbol ${n.type}">${n.type === "alert" ? "!" : n.type === "schedule" ? "▤" : "↔"}</span><span><strong>${n.title}</strong><p>${n.text}</p><small>${n.time}</small></span>${n.read ? "" : `<i></i>`}</button>`).join("") || empty("No tenés notificaciones")}</section>`;
}

function auditPage() {
  if (!canSeeAudit(user.role)) return dashboardPage();
  return `${pageHeading("TRAZABILIDAD", "Auditoría", "Registro de las acciones relevantes del sistema.")}
    <section class="table-card"><table><thead><tr><th>Fecha</th><th>Usuario</th><th>Acción</th><th>Elemento</th><th>Resultado</th></tr></thead><tbody>${state.auditLogs.map((a) => `<tr><td>${a.time}</td><td><strong>${a.user}</strong></td><td>${a.action}</td><td><span class="sector-pill">${a.entity}</span></td><td><span class="badge active">${a.result}</span></td></tr>`).join("")}</tbody></table></section>
    <button class="reset-link" data-action="reset-demo">Restablecer datos de demostración</button>`;
}

function modal(content) {
  document.body.insertAdjacentHTML("beforeend", `<div class="modal-backdrop" data-action="close-modal"><section class="modal" role="dialog" aria-modal="true">${content}</section></div>`);
}

function newRequestModal() {
  modal(`<button class="modal-close" data-action="close-modal">×</button><span class="eyebrow">NUEVA SOLICITUD</span><h2>¿Qué necesitás gestionar?</h2><p class="muted">La solicitud quedará registrada y vas a poder seguir su estado.</p><form id="request-form"><label>Tipo<select name="type" required><option>Cambio de turno</option><option>Cambio de franco</option><option>Parte de enfermo</option><option>Licencia</option><option>Vacaciones</option></select></label><label>Fecha o período<input name="detail" placeholder="Ej: viernes 4, turno tarde" required /></label><label>Motivo<textarea name="note" rows="3" placeholder="Contanos brevemente el motivo" required></textarea></label><label class="file-label">Certificado o respaldo (opcional)<input name="file" type="file" accept=".pdf,.jpg,.jpeg,.png" /><span>Adjuntar archivo</span></label><div class="modal-actions"><button type="button" class="button secondary" data-action="close-modal">Cancelar</button><button class="button primary">Enviar solicitud</button></div></form>`);
}

function newEmployeeModal() {
  modal(`<button class="modal-close" data-action="close-modal">×</button><span class="eyebrow">PERSONAL</span><h2>Gestión deshabilitada</h2><p class="muted">La base oficial de 16 perfiles permanece fija en esta versión del MVP.</p><div class="modal-actions"><button type="button" class="button primary" data-action="close-modal">Entendido</button></div>`);
}

function newPlanningWeekModal() {
  modal(`<button class="modal-close" data-action="close-modal">×</button><span class="eyebrow">NUEVA SEMANA</span><h2>Crear semana de planificación</h2><p class="muted">Se creará la estructura operativa vacía en estado Borrador.</p><form id="planning-week-form"><label>Nombre o identificador<input name="name" placeholder="Ej: Semana del 6 al 12 de julio" required /></label><div class="form-row"><label>Fecha de inicio<input name="startDate" type="date" required /></label><label>Fecha de fin<input name="endDate" type="date" readonly required /></label></div><div class="week-form-note"><strong>Semana de 7 días</strong><p>Al elegir la fecha de inicio, la fecha de fin se calcula automáticamente 6 días después.</p></div><div class="modal-actions"><button type="button" class="button secondary" data-action="close-modal">Cancelar</button><button class="button primary">Crear borrador</button></div></form>`);
}

function assignmentModal(positionId) {
  const week = state.planningWeek;
  if (!week || !["draft", "published"].includes(week.status) || !canEditSchedule(user.role)) return;
  const position = week.operationalPositions.find((item) => item.id === positionId);
  if (!position) return;
  const assignment = week.assignments.find((item) => item.positionId === positionId);
  const availableEmployees = state.employees.filter((employee) => employee.status === "active" && employee.participaEnOperacion !== false);
  modal(`<button class="modal-close" data-action="close-modal">×</button><span class="eyebrow">ASIGNACIÓN MANUAL</span><h2>${position.label}</h2><p class="muted">${formatIsoDate(position.date)} · Turno ${position.shift} · ${position.sector}</p><form id="position-assignment-form"><input type="hidden" name="positionId" value="${position.id}" /><label>Empleado<select name="employeeId" required><option value="">Seleccionar empleado</option>${availableEmployees.map((employee) => `<option value="${employee.id}" ${assignment?.employeeId === employee.id ? "selected" : ""}>${employee.name} · ${employee.role}</option>`).join("")}</select></label><div class="week-form-note"><strong>Asignación manual</strong><p>Se permite doble turno en el mismo día. No se permite repetir la misma persona dentro del mismo turno.</p></div><div class="modal-actions">${assignment ? `<button type="button" class="button danger-soft" data-action="remove-planning-assignment" data-position-id="${position.id}">Quitar asignación</button>` : ""}<button type="button" class="button secondary" data-action="close-modal">Cancelar</button><button class="button primary">${assignment ? "Cambiar empleado" : "Asignar empleado"}</button></div></form>`);
}

function dayOffModal({ sector, date }) {
  const week = state.planningWeek;
  if (!week || !["draft", "published"].includes(week.status) || !canEditSchedule(user.role)) return;
  const availableEmployees = state.employees.filter((employee) => employee.status === "active" && employee.participaEnOperacion !== false && employee.sector === sector);
  const currentDayOffs = (week.daysOff || []).filter((item) => item.sector === sector && item.date === date);
  modal(`<button class="modal-close" data-action="close-modal">×</button><span class="eyebrow">FRANCO MANUAL</span><h2>Francos ${sector}</h2><p class="muted">${formatIsoDate(date)} · Grilla ${week.status === "published" ? "publicada" : "en Borrador"}</p><form id="planning-day-off-form"><input type="hidden" name="sector" value="${sector}" /><input type="hidden" name="date" value="${date}" /><label>Empleado<select name="employeeId" required><option value="">Seleccionar empleado</option>${availableEmployees.map((employee) => `<option value="${employee.id}">${employee.name} · ${employee.role}</option>`).join("")}</select></label><label>Tipo de franco<select name="tipo" required><option value="F1">F1</option><option value="F2">F2</option></select></label><div class="week-form-note"><strong>Carga manual</strong><p>Este dato se guarda solo dentro de la semana. No modifica los francos base ni calcula el ciclo F1/F2.</p>${currentDayOffs.length ? `<p><strong>Ya cargados:</strong> ${currentDayOffs.map((dayOff) => {
    const employee = state.employees.find((item) => item.id === dayOff.employeeId);
    return `${employee?.name || "Empleado"} (${dayOff.tipo})`;
  }).join(" · ")}</p><div class="remove-list">${currentDayOffs.map((dayOff) => {
    const employee = state.employees.find((item) => item.id === dayOff.employeeId);
    return `<button type="button" class="row-action danger" data-action="remove-planning-day-off" data-day-off-id="${dayOff.id}">Quitar ${employee?.name || "franco"} (${dayOff.tipo})</button>`;
  }).join("")}</div>` : ""}</div><div class="modal-actions"><button type="button" class="button secondary" data-action="close-modal">Cancelar</button><button class="button primary">Guardar franco</button></div></form>`);
}

function closeModal() { document.querySelector(".modal-backdrop")?.remove(); }
function initials(name) { return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase(); }
function formatIsoDate(value) { const [year, month, day] = value.split("-"); return `${day}/${month}/${year}`; }
function addIsoDays(value, amount) {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + amount));
  return date.toISOString().slice(0, 10);
}
function formatDateTime(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("es-AR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
}
function hasSameShiftDuplicate(week, position, employeeId) {
  return (week.assignments || []).some((assignment) => {
    if (assignment.positionId === position.id || assignment.employeeId !== employeeId) return false;
    const assignedPosition = week.operationalPositions.find((item) => item.id === assignment.positionId);
    return assignedPosition?.date === position.date && assignedPosition.shift === position.shift;
  });
}
function unreadCount() { return state.notifications.filter((n) => !n.read).length; }
function empty(message) { return `<div class="empty-state"><span>◇</span><p>${message}</p></div>`; }

function loginAsDemoUser(match) {
  user = match;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
  sessionStorage.removeItem("uzumaki-user-v3");
  sessionStorage.removeItem("uzumaki-user-v2");
  sessionStorage.removeItem("uzumaki-user");
  sessionStorage.removeItem("turnia-user");
  page = "dashboard";
  render();
}

document.addEventListener("submit", (event) => {
  event.preventDefault();
  if (event.target.id === "login-form") {
    const data = new FormData(event.target);
    const username = data.get("username").trim().toLowerCase();
    const match = canonicalDemoUsers.find((u) => u.username === username && u.password === data.get("password"));
    if (!match) return renderLogin("Usuario o contraseña incorrectos.");
    return loginAsDemoUser(match);
  }
  if (event.target.id === "request-form") {
    const data = new FormData(event.target);
    const employee = state.employees.find((e) => e.id === user.employeeId);
    if (!employee) return toast("El usuario no está vinculado a un empleado.", "error");
    const request = { id: `SOL-${String(25 + state.requests.length).padStart(3, "0")}`, employee: employee.name, employeeId: employee.id, type: data.get("type"), detail: data.get("detail"), date: "Ahora", status: "pending", note: data.get("note"), requiresPartner: String(data.get("type")).includes("Cambio") };
    state.requests.unshift(request);
    state.notifications.unshift({ id: crypto.randomUUID(), title: "Solicitud enviada", text: `${request.type}: ${request.detail}.`, time: "Ahora", type: "request", read: false });
    audit("Creó una solicitud", request.id, "Pendiente");
    closeModal(); persist(); toast("Solicitud enviada correctamente");
  }
  if (event.target.id === "planning-week-form") {
    if (!canEditSchedule(user.role) || state.planningWeek) return;
    const data = new FormData(event.target);
    const startDate = data.get("startDate");
    const endDate = addIsoDays(startDate, 6);
    if (data.get("endDate") && data.get("endDate") !== endDate) return toast("La semana debe durar exactamente 7 días.", "error");
    state.planningWeek = createDraftPlanningWeek({
      id: crypto.randomUUID(),
      name: data.get("name").trim(),
      startDate,
      endDate,
    });
    closeModal(); persist(); toast("Semana creada como borrador");
  }
  if (event.target.id === "position-assignment-form") {
    const week = state.planningWeek;
    if (!week || !["draft", "published"].includes(week.status) || !canEditSchedule(user.role)) return;
    const data = new FormData(event.target);
    const positionId = data.get("positionId");
    const employeeId = data.get("employeeId");
    const position = week.operationalPositions.find((item) => item.id === positionId);
    const employee = state.employees.find((item) => item.id === employeeId && item.status === "active" && item.participaEnOperacion !== false);
    if (!position || !employee) return toast("No se pudo guardar la asignación.", "error");
    if (hasSameShiftDuplicate(week, position, employeeId)) return toast(`${employee.name} ya está asignado en el turno ${position.shift} de ese día.`, "error");
    const existingAssignment = week.assignments.find((item) => item.positionId === positionId);
    if (existingAssignment) existingAssignment.employeeId = employeeId;
    else week.assignments.push({ id: crypto.randomUUID(), positionId, employeeId });
    closeModal(); persist(); toast(`${employee.name} fue asignado al puesto`);
  }
  if (event.target.id === "planning-day-off-form") {
    const week = state.planningWeek;
    if (!week || !["draft", "published"].includes(week.status) || !canEditSchedule(user.role)) return;
    const data = new FormData(event.target);
    const sector = data.get("sector");
    const date = data.get("date");
    const employeeId = data.get("employeeId");
    const tipo = data.get("tipo");
    const employee = state.employees.find((item) => item.id === employeeId && item.status === "active" && item.participaEnOperacion !== false && item.sector === sector);
    if (!["Cocina", "Pisos"].includes(sector) || !["F1", "F2"].includes(tipo) || !employee) return toast("No se pudo guardar el franco.", "error");
    if (!Array.isArray(week.daysOff)) week.daysOff = [];
    const existingDayOff = week.daysOff.find((item) => item.date === date && item.sector === sector && item.employeeId === employeeId);
    if (existingDayOff) existingDayOff.tipo = tipo;
    else week.daysOff.push({ id: crypto.randomUUID(), date, sector, employeeId, tipo });
    closeModal(); persist(); toast(`Franco ${tipo} cargado para ${employee.name}`);
  }
  if (event.target.id === "employee-form") {
    return toast("Gestión de empleados deshabilitada en esta versión del MVP.", "error");
  }
});

document.addEventListener("input", (event) => {
  if (event.target.id === "employee-search") { employeeSearch = event.target.value; render(); document.querySelector("#employee-search")?.focus(); }
  if (event.target.name === "startDate" && event.target.closest("#planning-week-form")) {
    const endDateInput = event.target.form.querySelector('input[name="endDate"]');
    endDateInput.value = event.target.value ? addIsoDays(event.target.value, 6) : "";
  }
});

document.addEventListener("change", (event) => {
  if (event.target.name === "startDate" && event.target.closest("#planning-week-form")) {
    const endDateInput = event.target.form.querySelector('input[name="endDate"]');
    endDateInput.value = event.target.value ? addIsoDays(event.target.value, 6) : "";
  }
});

document.addEventListener("click", (event) => {
  const pageButton = event.target.closest("[data-page]");
  if (pageButton) { page = pageButton.dataset.page; document.querySelector("#sidebar")?.classList.remove("open"); render(); return; }
  const button = event.target.closest("[data-action]"); if (!button) return;
  const action = button.dataset.action;
  if (action === "toggle-password") { const input = document.querySelector('input[name="password"]'); input.type = input.type === "password" ? "text" : "password"; button.textContent = input.type === "password" ? "Ver" : "Ocultar"; }
  if (action === "demo-login") {
    const match = canonicalDemoUsers.find((item) => item.username === button.dataset.username);
    if (!match) return renderLogin("Usuario demo no disponible.");
    loginAsDemoUser(match);
  }
  if (action === "logout") { user = null; sessionStorage.removeItem(SESSION_KEY); sessionStorage.removeItem("uzumaki-user-v3"); sessionStorage.removeItem("uzumaki-user-v2"); sessionStorage.removeItem("uzumaki-user"); sessionStorage.removeItem("turnia-user"); render(); }
  if (action === "menu") document.querySelector("#sidebar")?.classList.toggle("open");
  if (action === "toggle-schedule") { scheduleMode = scheduleMode === "official" ? "draft" : "official"; render(); }
  if (action === "cycle-shift") { const item = state.draft.find((s) => s.id === button.dataset.id); const states = ["working", "off", "sick", "leave"]; item.state = states[(states.indexOf(item.state) + 1) % states.length]; state.hasDraftChanges = true; saveState(state); render(); }
  if (action === "publish") { state.schedule = structuredClone(state.draft); state.scheduleVersion += 1; state.hasDraftChanges = false; state.notifications.unshift({ id: crypto.randomUUID(), title: "Nueva grilla publicada", text: `La versión ${state.scheduleVersion} ya está disponible.`, time: "Ahora", type: "schedule", read: false }); audit("Publicó la grilla", `Semana 49 · v${state.scheduleVersion}`, "Publicada"); scheduleMode = "official"; persist(); toast(`Grilla versión ${state.scheduleVersion} publicada`); }
  if (action === "new-request") newRequestModal();
  if (action === "new-employee") newEmployeeModal();
  if (action === "new-planning-week" && canEditSchedule(user.role) && !state.planningWeek) newPlanningWeekModal();
  if (action === "assign-planning-position") assignmentModal(button.dataset.positionId);
  if (action === "add-planning-day-off") dayOffModal({ sector: button.dataset.sector, date: button.dataset.date });
  if (action === "remove-planning-assignment") {
    const week = state.planningWeek;
    if (!week || !["draft", "published"].includes(week.status) || !canEditSchedule(user.role)) return;
    const before = week.assignments.length;
    week.assignments = week.assignments.filter((assignment) => assignment.positionId !== button.dataset.positionId);
    if (week.assignments.length === before) return toast("No había asignación para quitar.", "error");
    closeModal(); persist(); toast("Asignación quitada");
  }
  if (action === "remove-planning-day-off") {
    const week = state.planningWeek;
    if (!week || !["draft", "published"].includes(week.status) || !canEditSchedule(user.role)) return;
    const before = week.daysOff?.length || 0;
    week.daysOff = (week.daysOff || []).filter((dayOff) => dayOff.id !== button.dataset.dayOffId);
    if (week.daysOff.length === before) return toast("No se encontró el franco para quitar.", "error");
    closeModal(); persist(); toast("Franco quitado");
  }
  if (action === "publish-planning-week") publishPlanningWeek();
  if (action === "close-modal") { if (event.target === button || button.classList.contains("modal-close") || button.tagName === "BUTTON") closeModal(); }
  if (action === "filter-request") { requestFilter = button.dataset.filter; render(); }
  if (action === "resolve") { const request = state.requests.find((r) => r.id === button.dataset.id); if (!["pending", "review"].includes(request.status)) return toast("La solicitud ya fue resuelta", "error"); request.status = button.dataset.status; state.notifications.unshift({ id: crypto.randomUUID(), title: `Solicitud ${statusText[request.status].toLowerCase()}`, text: `${request.id} · ${request.type}.`, time: "Ahora", type: "request", read: false }); audit(`${request.status === "approved" ? "Aprobó" : "Rechazó"} una solicitud`, request.id, statusText[request.status]); persist(); toast(`Solicitud ${statusText[request.status].toLowerCase()}`); }
  if (action === "toggle-employee") toast("Gestión de empleados deshabilitada en esta versión del MVP.", "error");
  if (action === "read-notification") { const notification = state.notifications.find((n) => n.id === button.dataset.id); notification.read = true; persist(); }
  if (action === "read-all") { state.notifications.forEach((n) => n.read = true); persist(); toast("Notificaciones marcadas como leídas"); }
  if (action === "reset-demo") { state = resetState(); persist(); toast("Datos de demostración restablecidos"); }
});

render();
