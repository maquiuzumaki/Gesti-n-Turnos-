export const isAdminRole = (role) => ["admin", "manager", "supervisor"].includes(role);
export const canEditSchedule = (role) => ["admin", "manager"].includes(role);
export const canManageEmployees = (role) => ["admin", "manager"].includes(role);
export const canResolveRequests = (role) => ["admin", "manager"].includes(role);
export const canSeeAudit = (role) => ["admin", "manager", "supervisor"].includes(role);

export const roleLabel = {
  admin: "Administradora principal",
  manager: "Encargada",
  supervisor: "Supervisora",
  staff: "Personal",
};
