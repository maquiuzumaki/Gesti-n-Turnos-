import unittest

from planning_proposal_engine import generate_planning_proposal


def employee(employee_id, template=None, cycle=None):
    return {"id": employee_id, "name": employee_id, "status": "active", "participaEnOperacion": True, "habitualPositionTemplateId": template, "francoCycle": cycle}


def position(position_id, template, day, sector="Cocina", shift="Mañana"):
    return {"id": position_id, "templateId": template, "date": day, "sector": sector, "shift": shift, "label": position_id, "optional": False}


def proposal(**overrides):
    payload = {
        "week": {"id": "week-1", "startDate": "2026-07-20"},
        "employees": [], "positions": [], "currentAssignments": [], "manualDaysOff": [],
        "exceptions": [], "approvedRequests": [], "assignmentHistory": [], "generatedAt": "2026-07-20T00:00:00Z",
    }
    payload.update(overrides)
    return generate_planning_proposal(payload)


class PlanningProposalEngineTests(unittest.TestCase):
    def test_habitual_assignment_respects_f1_cycle(self):
        worker = employee("emp-a", "kitchen-a", {"anchorDate": "2026-07-20", "anchorType": "F1", "cycleLengthDays": 15})
        result = proposal(employees=[worker], positions=[position("p1", "kitchen-a", "2026-07-20"), position("p2", "kitchen-a", "2026-07-21")])
        self.assertEqual([(item["positionId"], item["employeeId"]) for item in result["assignments"]], [("p2", "emp-a")])
        self.assertEqual(result["calculatedDaysOff"][0]["type"], "F1")

    def test_f2_cycle_blocks_both_anchor_days(self):
        worker = employee("emp-a", "kitchen-a", {"anchorDate": "2026-07-20", "anchorType": "F2", "cycleLengthDays": 15})
        result = proposal(employees=[worker], positions=[position("p1", "kitchen-a", "2026-07-20"), position("p2", "kitchen-a", "2026-07-21"), position("p3", "kitchen-a", "2026-07-22")])
        self.assertEqual([item["positionId"] for item in result["assignments"]], ["p3"])

    def test_gustavo_covers_julio_and_replaces_morning_proposal(self):
        gustavo = employee("emp-cocinero-manana-1", "kitchen-cook-morning-2")
        julio = employee("emp-cocinero-julio", "kitchen-cook-afternoon", {"anchorDate": "2026-07-20", "anchorType": "F1", "cycleLengthDays": 15})
        result = proposal(employees=[gustavo, julio], positions=[position("morning", "kitchen-cook-morning-2", "2026-07-20"), position("afternoon", "kitchen-cook-afternoon", "2026-07-20", shift="Tarde")])
        self.assertEqual([(item["positionId"], item["generationReason"]) for item in result["assignments"]], [("afternoon", "gustavoCoversJulio")])

    def test_floor_priority_and_kitchen_support(self):
        debora, lucila = employee("emp-franquera-debora"), employee("emp-franquera-lucila")
        positions = [
            position("f1", "floor-1-morning", "2026-07-20", "Pisos"),
            position("f2", "floor-2-morning", "2026-07-20", "Pisos"),
            position("f3", "floor-3-morning", "2026-07-20", "Pisos"),
            position("support", "kitchen-extra-morning", "2026-07-20"),
        ]
        result = proposal(employees=[debora, lucila], positions=positions)
        assignments = {item["positionId"]: item for item in result["assignments"]}
        self.assertEqual(assignments["f1"]["employeeId"], "emp-franquera-debora")
        self.assertEqual(len(result["uncoveredPositions"]), 1)
        self.assertNotIn("support", assignments)

    def test_priority_alternates_and_free_franquera_supports_kitchen(self):
        debora, lucila = employee("emp-franquera-debora"), employee("emp-franquera-lucila")
        result = proposal(
            week={"id": "week-2", "startDate": "2026-07-27"},
            employees=[debora, lucila],
            positions=[position("floor", "floor-1-morning", "2026-07-27", "Pisos"), position("support", "kitchen-extra-morning", "2026-07-27")],
        )
        assignments = {item["positionId"]: item for item in result["assignments"]}
        self.assertEqual(assignments["floor"]["employeeId"], "emp-franquera-lucila")
        self.assertEqual(assignments["support"]["employeeId"], "emp-franquera-debora")

    def test_manual_assignment_is_preserved_and_not_overwritten(self):
        worker = employee("emp-a", "kitchen-a")
        result = proposal(employees=[worker], positions=[position("p1", "kitchen-a", "2026-07-21")], currentAssignments=[{"positionId": "p1", "employeeId": "manual"}])
        self.assertEqual(result["assignments"], [])

    def test_approved_leave_prevents_habitual_assignment(self):
        worker = employee("emp-a", "kitchen-a")
        request = {"id": "r1", "employeeId": "emp-a", "type": "leave", "status": "approved", "startDate": "2026-07-21", "endDate": "2026-07-21"}
        result = proposal(employees=[worker], positions=[position("p1", "kitchen-a", "2026-07-21")], approvedRequests=[request])
        self.assertEqual(result["assignments"], [])

    def test_manual_day_off_prevents_habitual_assignment(self):
        worker = employee("emp-a", "kitchen-a")
        result = proposal(employees=[worker], positions=[position("p1", "kitchen-a", "2026-07-21")], manualDaysOff=[{"employeeId": "emp-a", "date": "2026-07-21", "tipo": "F1"}])
        self.assertEqual(result["assignments"], [])

    def test_weekly_exception_prevents_habitual_assignment(self):
        worker = employee("emp-a", "kitchen-a")
        result = proposal(employees=[worker], positions=[position("p1", "kitchen-a", "2026-07-21")], exceptions=[{"id": "x1", "affectedEmployeeId": "emp-a", "date": "2026-07-21", "type": "absence", "status": "active"}])
        self.assertEqual(result["assignments"], [])

    def test_approved_day_off_change_prevents_assignment_on_proposed_date(self):
        worker = employee("emp-a", "kitchen-a")
        request = {"id": "r1", "employeeId": "emp-a", "type": "dayOffChange", "status": "approved", "scheduleImpact": {"proposed": {"date": "2026-07-21"}}}
        result = proposal(employees=[worker], positions=[position("p1", "kitchen-a", "2026-07-21")], approvedRequests=[request])
        self.assertEqual(result["assignments"], [])

    def test_same_employee_can_be_generated_in_morning_and_afternoon(self):
        worker = employee("emp-a", "kitchen-a")
        result = proposal(employees=[worker], positions=[position("p1", "kitchen-a", "2026-07-21"), position("p2", "kitchen-a", "2026-07-21", shift="Tarde")])
        self.assertEqual(len(result["assignments"]), 2)

    def test_duplicate_same_shift_is_not_generated(self):
        worker = employee("emp-a", "kitchen-a")
        result = proposal(employees=[worker], positions=[position("p1", "kitchen-a", "2026-07-21"), position("p2", "kitchen-a", "2026-07-21")])
        self.assertEqual(len(result["assignments"]), 1)

    def test_same_input_produces_same_proposal(self):
        worker = employee("emp-a", "kitchen-a")
        payload = {"employees": [worker], "positions": [position("p1", "kitchen-a", "2026-07-21")]}
        self.assertEqual(proposal(**payload), proposal(**payload))
