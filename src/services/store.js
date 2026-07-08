import {
  auditLogs,
  DAYS,
  demoUsers,
  employees,
  incidents,
  initialAudit,
  initialNotifications,
  initialRequests,
  initialSchedule,
  pisos,
  referenceSchedule,
  requests,
  rolesOperativos,
  rolesSistema,
  sectores,
  turnos,
  weeklySchedules,
} from "../data/mockData.js?v=20260706-3";

const KEY = "uzumaki-mvp-state-v4";
const LEGACY_KEYS = ["uzumaki-mvp-state-v3", "uzumaki-mvp-state-v2", "uzumaki-mvp-state-v1", "turnia-mvp-state-v1"];
const normalizePlanningWeek = (week) => {
  if (!week || typeof week !== "object") return null;
  return {
    ...week,
    operationalPositions: Array.isArray(week.operationalPositions) ? week.operationalPositions : [],
    assignments: Array.isArray(week.assignments) ? week.assignments : [],
    daysOff: Array.isArray(week.daysOff) ? week.daysOff : [],
    coverages: Array.isArray(week.coverages) ? week.coverages : [],
    exceptions: Array.isArray(week.exceptions) ? week.exceptions : [],
  };
};
const requestTypeLegacyMap = {
  "Parte de enfermo": "absence",
  Ausencia: "absence",
  Licencia: "leave",
  Vacaciones: "leave",
  "Cambio de franco": "dayOffChange",
  "Cambio de turno": "shiftChange",
};
const normalizeRequest = (request) => {
  if (!request || typeof request !== "object") return request;
  const type = requestTypeLegacyMap[request.type] || request.type || "absence";
  const status = request.status === "pending"
    ? request.requiresPartner ? "pendingPartner" : "pendingManager"
    : ["review", "partnerAccepted"].includes(request.status) ? "pendingManager" : request.status || "pendingManager";
  return {
    ...request,
    type,
    status,
    partnerEmployeeId: request.partnerEmployeeId || "",
    partnerStatus: request.partnerStatus || (request.partnerEmployeeId ? "pending" : ""),
    scheduleImpact: request.scheduleImpact || {},
  };
};
const freshState = () => ({
  employees: structuredClone(employees),
  weeklySchedules: structuredClone(weeklySchedules),
  requests: structuredClone(initialRequests),
  notifications: structuredClone(initialNotifications),
  auditLogs: structuredClone(initialAudit),
  incidents: structuredClone(incidents),
  schedule: structuredClone(initialSchedule),
  draft: structuredClone(initialSchedule),
  planningWeek: null,
  referenceSchedule: structuredClone(referenceSchedule),
  catalogs: {
    rolesOperativos: structuredClone(rolesOperativos),
    rolesSistema: structuredClone(rolesSistema),
    sectores: structuredClone(sectores),
    turnos: structuredClone(turnos),
    pisos: structuredClone(pisos),
  },
  demoUsers: structuredClone(demoUsers),
  days: structuredClone(DAYS),
  scheduleVersion: 0,
  hasDraftChanges: false,
});

export function loadState() {
  try {
    const saved = localStorage.getItem(KEY);
    if (!saved) return freshState();
    const parsed = JSON.parse(saved);
    const baseState = freshState();
    return {
      ...baseState,
      ...parsed,
      employees: Array.isArray(parsed.employees) ? parsed.employees : baseState.employees,
      weeklySchedules: Array.isArray(parsed.weeklySchedules) ? parsed.weeklySchedules : baseState.weeklySchedules,
      requests: Array.isArray(parsed.requests) ? parsed.requests.map(normalizeRequest) : baseState.requests,
      notifications: Array.isArray(parsed.notifications) ? parsed.notifications : baseState.notifications,
      auditLogs: Array.isArray(parsed.auditLogs) ? parsed.auditLogs : baseState.auditLogs,
      incidents: Array.isArray(parsed.incidents) ? parsed.incidents : baseState.incidents,
      schedule: Array.isArray(parsed.schedule) ? parsed.schedule : baseState.schedule,
      draft: Array.isArray(parsed.draft) ? parsed.draft : baseState.draft,
      planningWeek: normalizePlanningWeek(parsed.planningWeek),
      referenceSchedule: baseState.referenceSchedule,
      catalogs: {
        ...baseState.catalogs,
        ...(parsed.catalogs || {}),
      },
      demoUsers: baseState.demoUsers,
      days: baseState.days,
      scheduleVersion: Array.isArray(parsed.schedule) && parsed.schedule.length
        ? Number(parsed.scheduleVersion) || 1
        : 0,
    };
  } catch {
    return freshState();
  }
}

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function resetState() {
  localStorage.removeItem(KEY);
  LEGACY_KEYS.forEach((key) => localStorage.removeItem(key));
  return freshState();
}
