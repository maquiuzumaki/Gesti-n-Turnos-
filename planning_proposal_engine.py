"""Motor puro de propuesta operativa.

No conoce HTTP, PostgreSQL ni sesiones. Es el equivalente servidor de las
reglas de propuesta que existían en ``src/services/planningEngine.js``.
"""
from collections import defaultdict
from datetime import date

from planning_rules import cycle_day_off

FLOOR_TEMPLATE_IDS = {
    "floor-1-morning", "floor-2-morning", "floor-3-morning",
    "floor-1-afternoon", "floor-2-afternoon", "floor-3-afternoon",
}
FLOOR_COVERERS = ("emp-franquera-debora", "emp-franquera-lucila")
KITCHEN_MORNING_TEMPLATE_ID = "kitchen-extra-morning"
GUSTAVO_EMPLOYEE_ID = "emp-cocinero-manana-1"
JULIO_EMPLOYEE_ID = "emp-cocinero-julio"
GUSTAVO_MORNING_TEMPLATE_ID = "kitchen-cook-morning-2"
JULIO_AFTERNOON_TEMPLATE_ID = "kitchen-cook-afternoon"
FRANQUERA_ANCHOR = date.fromisoformat("2026-07-20")


def _request_dates(request):
    impact = request.get("scheduleImpact") or {}
    target, proposed = impact.get("target") or {}, impact.get("proposed") or {}
    return {
        "start": request.get("startDate") or target.get("startDate") or target.get("date") or request.get("targetDate"),
        "end": request.get("endDate") or target.get("endDate") or target.get("date") or request.get("targetDate"),
        "proposed": proposed.get("date") or request.get("proposedDate"),
    }


def _in_range(value, start, end):
    return bool(value and start and end and start <= value <= end)


def _operational(employee):
    return bool(employee) and employee.get("status") == "active" and employee.get("participaEnOperacion", True)


def _vacation(employee, target_date):
    for item in employee.get("vacations", employee.get("vacaciones", [])) or []:
        start = item.get("startDate") or item.get("inicio") or item.get("fecha")
        end = item.get("endDate") or item.get("fin") or item.get("fecha")
        if _in_range(target_date, start, end):
            return True
    return False


def availability(employee, target_date, manual_days_off, exceptions, requests):
    """Disponibilidad canónica: respeta el orden de precedencia del motor web."""
    if not _operational(employee):
        return False, "notOperational"
    if _vacation(employee, target_date):
        return False, "vacation"
    for request in requests:
        if request.get("employeeId") != employee["id"] or request.get("status") != "approved":
            continue
        dates = _request_dates(request)
        if request.get("type") in {"absence", "leave", "vacation", "vacations"} and _in_range(target_date, dates["start"], dates["end"]):
            return False, request.get("type")
        if request.get("type") == "dayOffChange" and dates["proposed"] == target_date:
            return False, "dayOff"
    for exception in exceptions:
        if exception.get("affectedEmployeeId") == employee["id"] and exception.get("date") == target_date and exception.get("status", "active") in {"approved", "active", "covered"}:
            return False, exception.get("type", "exception")
    if (employee["id"], target_date) in manual_days_off:
        return False, "dayOff"
    cycle = employee.get("francoCycle") or {}
    if cycle_day_off(cycle.get("anchorDate"), cycle.get("anchorType"), target_date, cycle.get("cycleLengthDays", 15)):
        return False, "dayOff"
    return True, "available"


def build_availability(employees, dates, manual_days_off, exceptions, requests):
    return {
        employee["id"]: {target: availability(employee, target, manual_days_off, exceptions, requests) for target in dates}
        for employee in employees
    }


def _indexes(positions_by_id, assignments):
    occupied, assigned_by_shift = set(), set()
    for assignment in assignments:
        position = positions_by_id.get(assignment.get("positionId"))
        if not position or not assignment.get("employeeId"):
            continue
        occupied.add(position["id"])
        assigned_by_shift.add((position["date"], position.get("shift"), assignment["employeeId"]))
    return occupied, assigned_by_shift


def _priority(week_start):
    offset = (date.fromisoformat(week_start) - FRANQUERA_ANCHOR).days // 7
    if offset % 2 == 0:
        return {"Mañana": FLOOR_COVERERS[0], "Tarde": FLOOR_COVERERS[1]}
    return {"Mañana": FLOOR_COVERERS[1], "Tarde": FLOOR_COVERERS[0]}


def _floor_history_score(history, employee_id, position):
    score = 0
    for record in history:
        if record.get("employeeId") != employee_id or record.get("sector") != "Pisos":
            continue
        if record.get("templateId") == position.get("templateId"):
            score += 3
        elif record.get("shift") == position.get("shift"):
            score += 1
    return score


def _kitchen_history_score(history, employee_id):
    return sum(1 for record in history if record.get("employeeId") == employee_id and record.get("sector") == "Cocina" and record.get("shift") == "Mañana")


def generate_planning_proposal(payload):
    """Devuelve una propuesta determinista sin modificar ``payload``.

    ``currentAssignments`` contiene únicamente las asignaciones que deben
    conservarse (manuales y overrides); las automáticas previas se reemplazan
    en la capa de persistencia antes de invocar este motor.
    """
    week = payload["week"]
    employees = payload.get("employees", [])
    positions = sorted(payload.get("positions", []), key=lambda item: (item["date"], item.get("label", ""), item["id"]))
    current = list(payload.get("currentAssignments", []))
    exceptions = list(payload.get("exceptions", []))
    requests = list(payload.get("approvedRequests", []))
    history = list(payload.get("assignmentHistory", []))
    generated_at = payload.get("generatedAt")
    positions_by_id = {position["id"]: position for position in positions}
    employees_by_id = {employee["id"]: employee for employee in employees}
    dates = sorted({position["date"] for position in positions})
    manual_days_off = {(item["employeeId"], item["date"]) for item in payload.get("manualDaysOff", [])}
    available = build_availability(employees, dates, manual_days_off, exceptions, requests)
    occupied, assigned_by_shift = _indexes(positions_by_id, current)
    _, preserved_by_shift = _indexes(positions_by_id, current)
    assignments, skipped, uncovered = [], [], []

    # Titulares habituales.
    by_template = {employee.get("habitualPositionTemplateId"): employee for employee in employees if employee.get("habitualPositionTemplateId")}
    for position in positions:
        if position["id"] in occupied:
            continue
        employee = by_template.get(position.get("templateId"))
        if not employee or not _operational(employee) or not available[employee["id"]][position["date"]][0]:
            continue
        key = (position["date"], position.get("shift"), employee["id"])
        if key in assigned_by_shift:
            continue
        proposal = {"positionId": position["id"], "employeeId": employee["id"], "generated": True, "generationReason": "habitualPosition", "assignmentType": "regular", "generatedAt": generated_at}
        assignments.append(proposal)
        occupied.add(position["id"])
        assigned_by_shift.add(key)

    # Excepción Gustavo/Julio: sustituye la propuesta habitual de Gustavo por
    # una cobertura de la tarde de Julio cuando este no está disponible.
    gustavo = employees_by_id.get(GUSTAVO_EMPLOYEE_ID)
    for target_date in dates:
        julio_position = next((p for p in positions if p["date"] == target_date and p.get("templateId") == JULIO_AFTERNOON_TEMPLATE_ID), None)
        gustavo_position = next((p for p in positions if p["date"] == target_date and p.get("templateId") == GUSTAVO_MORNING_TEMPLATE_ID), None)
        if not julio_position or not gustavo_position or available.get(JULIO_EMPLOYEE_ID, {}).get(target_date, (False,))[0]:
            continue
        if not _operational(gustavo) or not available.get(GUSTAVO_EMPLOYEE_ID, {}).get(target_date, (False,))[0]:
            skipped.append({"date": target_date, "reason": "gustavoUnavailable"})
            continue
        if julio_position["id"] in occupied or (target_date, julio_position.get("shift"), GUSTAVO_EMPLOYEE_ID) in preserved_by_shift:
            skipped.append({"date": target_date, "reason": "targetOccupiedOrDuplicate"})
            continue
        assignments[:] = [item for item in assignments if not (item["employeeId"] == GUSTAVO_EMPLOYEE_ID and positions_by_id[item["positionId"]].get("templateId") == GUSTAVO_MORNING_TEMPLATE_ID and positions_by_id[item["positionId"]]["date"] == target_date)]
        occupied.discard(gustavo_position["id"])
        assigned_by_shift.discard((target_date, gustavo_position.get("shift"), GUSTAVO_EMPLOYEE_ID))
        proposal = {"positionId": julio_position["id"], "employeeId": GUSTAVO_EMPLOYEE_ID, "generated": True, "generationReason": "gustavoCoversJulio", "assignmentType": "coverage", "coverageReason": "gustavoCoversJulio", "coveredEmployeeId": JULIO_EMPLOYEE_ID, "sourcePositionTemplateId": GUSTAVO_MORNING_TEMPLATE_ID, "targetPositionTemplateId": JULIO_AFTERNOON_TEMPLATE_ID, "generatedAt": generated_at}
        assignments.append(proposal)
        occupied.add(julio_position["id"])
        assigned_by_shift.add((target_date, julio_position.get("shift"), GUSTAVO_EMPLOYEE_ID))

    # Cobertura de Pisos por franqueras, priorizada semanalmente e histórico.
    priority = _priority(week["startDate"])
    for position in positions:
        if position.get("templateId") not in FLOOR_TEMPLATE_IDS or position["id"] in occupied:
            continue
        candidates = [employees_by_id[item] for item in FLOOR_COVERERS if item in employees_by_id and _operational(employees_by_id[item]) and available[item][position["date"]][0] and (position["date"], position.get("shift"), item) not in assigned_by_shift]
        candidates.sort(key=lambda item: (item["id"] != priority.get(position.get("shift")), -_floor_history_score(history, item["id"], position), item["id"]))
        if not candidates:
            uncovered.append({"positionId": position["id"], "date": position["date"], "shift": position.get("shift"), "templateId": position.get("templateId"), "label": position.get("label"), "reason": "noAvailableFloorCoverer"})
            continue
        coverer = candidates[0]
        habitual = by_template.get(position.get("templateId"))
        proposal = {"positionId": position["id"], "employeeId": coverer["id"], "generated": True, "generationReason": "floorCoverage", "assignmentType": "coverage", "coverageReason": "habitualEmployeeUnavailable", "coveredPositionTemplateId": position.get("templateId"), "coveredEmployeeId": habitual.get("id") if habitual else None, "generatedAt": generated_at}
        assignments.append(proposal)
        occupied.add(position["id"])
        assigned_by_shift.add((position["date"], position.get("shift"), coverer["id"]))

    # Apoyo de cocina únicamente con Pisos completo y una franquera libre.
    gap_dates = {item["date"] for item in uncovered}
    for target_date in dates:
        floor_positions = [p for p in positions if p["date"] == target_date and p.get("templateId") in FLOOR_TEMPLATE_IDS]
        support = next((p for p in positions if p["date"] == target_date and p.get("templateId") == KITCHEN_MORNING_TEMPLATE_ID), None)
        if target_date in gap_dates or not floor_positions or not all(p["id"] in occupied for p in floor_positions) or not support or support["id"] in occupied:
            continue
        candidates = [employees_by_id[item] for item in FLOOR_COVERERS if item in employees_by_id and _operational(employees_by_id[item]) and available[item][target_date][0] and (target_date, support.get("shift"), item) not in assigned_by_shift]
        candidates.sort(key=lambda item: (-_kitchen_history_score(history, item["id"]), item["id"]))
        if not candidates:
            continue
        collaborator = candidates[0]
        proposal = {"positionId": support["id"], "employeeId": collaborator["id"], "generated": True, "generationReason": "kitchenMorningCollaboration", "assignmentType": "collaboration", "collaborationArea": "kitchen", "collaborationShift": "morning", "generatedAt": generated_at}
        assignments.append(proposal)
        occupied.add(support["id"])
        assigned_by_shift.add((target_date, support.get("shift"), collaborator["id"]))

    calculated_days_off = [
        {"employeeId": employee["id"], "date": target_date, "type": cycle_day_off((employee.get("francoCycle") or {}).get("anchorDate"), (employee.get("francoCycle") or {}).get("anchorType"), target_date, (employee.get("francoCycle") or {}).get("cycleLengthDays", 15)), "source": "calculatedCycle"}
        for employee in employees for target_date in dates
        if available[employee["id"]][target_date][1] == "dayOff" and (employee["id"], target_date) not in manual_days_off
    ]
    return {"assignments": assignments, "calculatedDaysOff": calculated_days_off, "uncoveredPositions": uncovered, "warnings": [], "skippedRules": skipped, "metadata": {"mode": "habitualPositionsGustavoJulioFloorCoverageAndKitchenMorningCollaboration", "generatedAt": generated_at}}
