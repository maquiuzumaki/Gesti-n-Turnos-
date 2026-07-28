const MANAGER_ROLES = ["admin", "manager"];

// Las vistas de gestión son exclusivas de Administración principal y Encargada.
// Supervisión recibe la misma experiencia de consulta que Personal operativo.
export const isAdminRole = (role) => MANAGER_ROLES.includes(role);
export const canEditSchedule = (role) => MANAGER_ROLES.includes(role);
export const canEditApplications = (role) => MANAGER_ROLES.includes(role);
export const canManageEmployees = (role) => MANAGER_ROLES.includes(role);
export const canResolveRequests = (role) => canEditApplications(role);
export const canSeeAudit = (role) => MANAGER_ROLES.includes(role);

export const roleLabel = {
  admin: "Administración principal",
  manager: "Encargada",
  supervisor: "Supervisión",
  staff: "Personal operativo",
};
