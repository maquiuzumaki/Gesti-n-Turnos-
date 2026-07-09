const requestTypeToException = {
  absence: "absence",
  leave: "leave",
};

function sameShiftDuplicate(week, position, employeeId) {
  return (week.assignments || []).some((assignment) => {
    if (assignment.positionId === position.id || assignment.employeeId !== employeeId) return false;
    const assignedPosition = week.operationalPositions.find((item) => item.id === assignment.positionId);
    return assignedPosition?.date === position.date && assignedPosition.shift === position.shift;
  });
}

function employeeIsAvailable(employees, employeeId) {
  return employees.some((employee) => employee.id === employeeId && employee.status === "active" && employee.participaEnOperacion !== false);
}

function findAssignmentRecord(week, employeeId, date, shift) {
  return (week.assignments || [])
    .map((assignment) => ({
      assignment,
      position: week.operationalPositions.find((position) => position.id === assignment.positionId),
    }))
    .find(({ assignment, position }) => assignment.employeeId === employeeId && position?.date === date && position.shift === shift);
}

function hasDuplicateAfterChange(week, position, employeeId, excludedPositionIds = []) {
  return (week.assignments || []).some((assignment) => {
    if (assignment.employeeId !== employeeId || excludedPositionIds.includes(assignment.positionId)) return false;
    const assignedPosition = week.operationalPositions.find((item) => item.id === assignment.positionId);
    return assignedPosition?.date === position.date && assignedPosition.shift === position.shift;
  });
}

function manualReview(message, trace = {}) {
  return { ok: true, reverted: false, requiresManualReview: true, message, trace };
}

export function applyApprovedAbsenceOrLeave({ week, request, coverEmployeeId, approvedBy, employees, createId, now }) {
  if (!week || !["draft", "published"].includes(week.status)) {
    return { ok: false, message: "No hay una planificación semanal editable para aplicar la solicitud." };
  }
  if (!["absence", "leave"].includes(request.type)) {
    return { ok: false, message: "El Motor de Planificación sólo aplica licencias y ausencias en esta etapa." };
  }
  const target = request.scheduleImpact?.target;
  if (!target?.date || !target?.shift || !request.employeeId) {
    return { ok: false, message: "No hay información suficiente para calcular el impacto." };
  }
  if (!employeeIsAvailable(employees, coverEmployeeId)) {
    return { ok: false, message: "Seleccioná una persona válida para cubrir el puesto." };
  }
  if (coverEmployeeId === request.employeeId) {
    return { ok: false, message: "La persona afectada no puede cubrir su propia licencia o ausencia." };
  }

  const sourceRecord = (week.assignments || [])
    .map((assignment) => ({
      assignment,
      position: week.operationalPositions.find((position) => position.id === assignment.positionId),
    }))
    .find(({ assignment, position }) => assignment.employeeId === request.employeeId && position?.date === target.date && position.shift === target.shift);

  if (!sourceRecord?.assignment || !sourceRecord.position) {
    return { ok: false, message: "No se encontró el puesto original afectado en la planificación." };
  }
  if (sameShiftDuplicate(week, sourceRecord.position, coverEmployeeId)) {
    return { ok: false, message: "La persona reemplazante ya está asignada en ese mismo día y turno." };
  }

  const appliedAt = now();
  if (!Array.isArray(week.exceptions)) week.exceptions = [];
  sourceRecord.assignment.employeeId = coverEmployeeId;
  sourceRecord.assignment.coverageType = "replacement";
  sourceRecord.assignment.sourceRequestId = request.id;
  sourceRecord.assignment.replacedEmployeeId = request.employeeId;
  sourceRecord.assignment.appliedByPlanningEngine = true;
  sourceRecord.assignment.appliedAt = appliedAt;
  sourceRecord.assignment.appliedBy = approvedBy;
  const exception = {
    id: createId(),
    positionId: sourceRecord.position.id,
    date: sourceRecord.position.date,
    shift: sourceRecord.position.shift,
    sector: sourceRecord.position.sector,
    affectedEmployeeId: request.employeeId,
    type: requestTypeToException[request.type],
    coverEmployeeId,
    note: `Aplicada automáticamente desde la solicitud ${request.id}.`,
    coverageType: "replacement",
    status: "covered",
    sourceRequestId: request.id,
    sourceRequestType: request.type,
    appliedBy: approvedBy,
    appliedAt,
    updatedAt: appliedAt,
    updatedBy: approvedBy,
    createdAt: appliedAt,
    appliedByPlanningEngine: true,
  };
  week.exceptions.push(exception);

  return {
    ok: true,
    exception,
    assignment: sourceRecord.assignment,
    position: sourceRecord.position,
    trace: {
      sourceRequestId: request.id,
      affectedEmployeeId: request.employeeId,
      coverEmployeeId,
      positionId: sourceRecord.position.id,
      date: sourceRecord.position.date,
      shift: sourceRecord.position.shift,
      approvedBy,
      appliedAt,
    },
  };
}

export function applyApprovedShiftChange({ week, request, approvedBy, employees, now }) {
  if (!week || !["draft", "published"].includes(week.status)) {
    return { ok: false, message: "No hay una planificación semanal editable para aplicar la solicitud." };
  }
  if (request.type !== "shiftChange") {
    return { ok: false, message: "El Motor de Planificación sólo aplica cambios de turno en esta regla." };
  }
  if (request.partnerStatus !== "accepted" && request.status !== "partnerAccepted") {
    return { ok: false, message: "El compañero debe aceptar la solicitud antes de aplicarla." };
  }

  const original = request.scheduleImpact?.original;
  const proposed = request.scheduleImpact?.proposed;
  if (!original?.date || !original?.shift || !proposed?.date || !proposed?.shift || !request.employeeId || !request.partnerEmployeeId) {
    return { ok: false, message: "No hay información suficiente para aplicar el cambio de turno." };
  }
  if (request.employeeId === request.partnerEmployeeId) {
    return { ok: false, message: "La persona solicitante y el compañero no pueden ser la misma persona." };
  }
  if (!employeeIsAvailable(employees, request.employeeId) || !employeeIsAvailable(employees, request.partnerEmployeeId)) {
    return { ok: false, message: "La solicitud incluye una persona no disponible para operación." };
  }

  const requesterRecord = findAssignmentRecord(week, request.employeeId, original.date, original.shift);
  const partnerRecord = findAssignmentRecord(week, request.partnerEmployeeId, proposed.date, proposed.shift);
  if (!requesterRecord?.assignment || !requesterRecord.position) {
    return { ok: false, message: "No se encontró el puesto original de la persona solicitante." };
  }
  if (!partnerRecord?.assignment || !partnerRecord.position) {
    return { ok: false, message: "No se encontró el puesto original del compañero involucrado." };
  }

  const excludedPositionIds = [requesterRecord.position.id, partnerRecord.position.id];
  if (hasDuplicateAfterChange(week, partnerRecord.position, request.employeeId, excludedPositionIds)) {
    return { ok: false, message: "La persona solicitante quedaría duplicada en el turno propuesto." };
  }
  if (hasDuplicateAfterChange(week, requesterRecord.position, request.partnerEmployeeId, excludedPositionIds)) {
    return { ok: false, message: "El compañero quedaría duplicado en el turno original." };
  }

  const appliedAt = now();
  requesterRecord.assignment.employeeId = request.partnerEmployeeId;
  requesterRecord.assignment.swapType = "shiftChange";
  requesterRecord.assignment.sourceRequestId = request.id;
  requesterRecord.assignment.swappedWithEmployeeId = request.employeeId;
  requesterRecord.assignment.appliedByPlanningEngine = true;
  requesterRecord.assignment.appliedAt = appliedAt;
  requesterRecord.assignment.appliedBy = approvedBy;

  partnerRecord.assignment.employeeId = request.employeeId;
  partnerRecord.assignment.swapType = "shiftChange";
  partnerRecord.assignment.sourceRequestId = request.id;
  partnerRecord.assignment.swappedWithEmployeeId = request.partnerEmployeeId;
  partnerRecord.assignment.appliedByPlanningEngine = true;
  partnerRecord.assignment.appliedAt = appliedAt;
  partnerRecord.assignment.appliedBy = approvedBy;

  return {
    ok: true,
    assignments: [requesterRecord.assignment, partnerRecord.assignment],
    positions: [requesterRecord.position, partnerRecord.position],
    trace: {
      sourceRequestId: request.id,
      requesterEmployeeId: request.employeeId,
      partnerEmployeeId: request.partnerEmployeeId,
      original: {
        date: original.date,
        shift: original.shift,
        positionId: requesterRecord.position.id,
        assignedEmployeeId: request.partnerEmployeeId,
      },
      proposed: {
        date: proposed.date,
        shift: proposed.shift,
        positionId: partnerRecord.position.id,
        assignedEmployeeId: request.employeeId,
      },
      affectedPositionIds: [requesterRecord.position.id, partnerRecord.position.id],
      approvedBy,
      appliedAt,
      appliedByPlanningEngine: true,
    },
  };
}

function revokeAbsenceOrLeave({ week, request, revokedBy, reason, now }) {
  const trace = request.planningApplication || {};
  const position = week.operationalPositions.find((item) => item.id === trace.positionId);
  const assignment = (week.assignments || []).find((item) => item.positionId === trace.positionId && item.sourceRequestId === request.id);
  if (!position || !assignment) {
    return manualReview("No se encontró la asignación aplicada por el Motor de Planificación.", { sourceRequestId: request.id });
  }
  if (assignment.employeeId !== trace.coverEmployeeId || assignment.replacedEmployeeId !== trace.affectedEmployeeId) {
    return manualReview("La asignación fue modificada luego de la aprobación. Revisar la grilla manualmente.", { sourceRequestId: request.id, positionId: position.id });
  }
  if (sameShiftDuplicate(week, position, trace.affectedEmployeeId)) {
    return manualReview("La persona original ya está asignada en ese día y turno. Revisar la grilla manualmente.", { sourceRequestId: request.id, positionId: position.id });
  }

  const revokedAt = now();
  assignment.employeeId = trace.affectedEmployeeId;
  assignment.revokedSourceRequestId = request.id;
  assignment.revokedByPlanningEngine = true;
  assignment.revokedAt = revokedAt;
  assignment.revokedBy = revokedBy;
  assignment.revocationReason = reason;
  delete assignment.coverageType;
  delete assignment.sourceRequestId;
  delete assignment.replacedEmployeeId;
  delete assignment.appliedByPlanningEngine;

  const exception = (week.exceptions || []).find((item) => item.sourceRequestId === request.id && item.appliedByPlanningEngine);
  if (exception) {
    exception.status = "revoked";
    exception.revokedAt = revokedAt;
    exception.revokedBy = revokedBy;
    exception.revocationReason = reason;
    exception.updatedAt = revokedAt;
    exception.updatedBy = revokedBy;
  }

  return {
    ok: true,
    reverted: true,
    requiresManualReview: false,
    message: "Revocación aplicada automáticamente.",
    trace: {
      sourceRequestId: request.id,
      revokedChangeType: request.type,
      positionId: position.id,
      affectedEmployeeId: trace.affectedEmployeeId,
      coverEmployeeId: trace.coverEmployeeId,
      revokedBy,
      revokedAt,
      reason,
      changesReverted: [{ positionId: position.id, restoredEmployeeId: trace.affectedEmployeeId }],
      automatic: true,
    },
  };
}

function revokeShiftChange({ week, request, revokedBy, reason, now }) {
  const trace = request.planningApplication || {};
  const originalPositionId = trace.original?.positionId;
  const proposedPositionId = trace.proposed?.positionId;
  const requesterEmployeeId = trace.requesterEmployeeId;
  const partnerEmployeeId = trace.partnerEmployeeId;
  const originalPosition = week.operationalPositions.find((item) => item.id === originalPositionId);
  const proposedPosition = week.operationalPositions.find((item) => item.id === proposedPositionId);
  const originalAssignment = (week.assignments || []).find((item) => item.positionId === originalPositionId && item.sourceRequestId === request.id);
  const proposedAssignment = (week.assignments || []).find((item) => item.positionId === proposedPositionId && item.sourceRequestId === request.id);
  if (!originalPosition || !proposedPosition || !originalAssignment || !proposedAssignment) {
    return manualReview("No se encontraron las dos asignaciones aplicadas por el cambio de turno.", { sourceRequestId: request.id });
  }
  if (originalAssignment.employeeId !== partnerEmployeeId || proposedAssignment.employeeId !== requesterEmployeeId) {
    return manualReview("El cambio de turno fue modificado luego de la aprobación. Revisar la grilla manualmente.", { sourceRequestId: request.id, affectedPositionIds: [originalPositionId, proposedPositionId] });
  }

  const excludedPositionIds = [originalPositionId, proposedPositionId];
  if (hasDuplicateAfterChange(week, originalPosition, requesterEmployeeId, excludedPositionIds)) {
    return manualReview("La persona solicitante ya está asignada en el turno original. Revisar la grilla manualmente.", { sourceRequestId: request.id, positionId: originalPositionId });
  }
  if (hasDuplicateAfterChange(week, proposedPosition, partnerEmployeeId, excludedPositionIds)) {
    return manualReview("El compañero ya está asignado en el turno propuesto. Revisar la grilla manualmente.", { sourceRequestId: request.id, positionId: proposedPositionId });
  }

  const revokedAt = now();
  originalAssignment.employeeId = requesterEmployeeId;
  proposedAssignment.employeeId = partnerEmployeeId;
  [originalAssignment, proposedAssignment].forEach((assignment) => {
    assignment.revokedSourceRequestId = request.id;
    assignment.revokedByPlanningEngine = true;
    assignment.revokedAt = revokedAt;
    assignment.revokedBy = revokedBy;
    assignment.revocationReason = reason;
    delete assignment.swapType;
    delete assignment.sourceRequestId;
    delete assignment.swappedWithEmployeeId;
    delete assignment.appliedByPlanningEngine;
  });

  return {
    ok: true,
    reverted: true,
    requiresManualReview: false,
    message: "Revocación aplicada automáticamente.",
    trace: {
      sourceRequestId: request.id,
      revokedChangeType: request.type,
      requesterEmployeeId,
      partnerEmployeeId,
      original: { positionId: originalPositionId, restoredEmployeeId: requesterEmployeeId, date: originalPosition.date, shift: originalPosition.shift },
      proposed: { positionId: proposedPositionId, restoredEmployeeId: partnerEmployeeId, date: proposedPosition.date, shift: proposedPosition.shift },
      affectedPositionIds: excludedPositionIds,
      revokedBy,
      revokedAt,
      reason,
      changesReverted: [
        { positionId: originalPositionId, restoredEmployeeId: requesterEmployeeId },
        { positionId: proposedPositionId, restoredEmployeeId: partnerEmployeeId },
      ],
      automatic: true,
    },
  };
}

export function revokePlanningApplication({ week, request, revokedBy, reason, now }) {
  if (!week || !["draft", "published"].includes(week.status)) {
    return manualReview("No hay una planificación semanal editable para revertir automáticamente.", { sourceRequestId: request?.id });
  }
  if (!reason?.trim()) {
    return { ok: false, message: "Indicá un motivo de revocación." };
  }
  if (!request?.planningApplication?.sourceRequestId) {
    return manualReview("La solicitud no tiene trazabilidad suficiente para revertir automáticamente.", { sourceRequestId: request?.id });
  }
  if (["absence", "leave"].includes(request.type)) {
    return revokeAbsenceOrLeave({ week, request, revokedBy, reason: reason.trim(), now });
  }
  if (request.type === "shiftChange") {
    return revokeShiftChange({ week, request, revokedBy, reason: reason.trim(), now });
  }
  return { ok: false, message: "Este tipo de solicitud todavía no admite revocación automática." };
}
