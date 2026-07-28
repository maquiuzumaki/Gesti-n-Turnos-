BEGIN;

-- Una persona puede trabajar en Mañana y Tarde el mismo día, pero no dos
-- puestos dentro del mismo turno. El turno pertenece a planning_positions.
DROP INDEX IF EXISTS planning_one_assignment_per_employee_day;

CREATE OR REPLACE FUNCTION ensure_planning_assignment_shift_integrity()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  position_date DATE;
  position_shift TEXT;
BEGIN
  SELECT date, shift_id INTO position_date, position_shift
  FROM planning_positions WHERE id = NEW.position_id;

  IF position_date IS NULL THEN
    RAISE EXCEPTION 'La asignación debe corresponder a un puesto existente';
  END IF;
  IF NEW.assignment_date <> position_date THEN
    RAISE EXCEPTION 'La fecha de asignación debe coincidir con la fecha del puesto';
  END IF;
  IF EXISTS (
    SELECT 1
    FROM planning_assignments assignment
    JOIN planning_positions assigned_position ON assigned_position.id = assignment.position_id
    WHERE assignment.planning_week_id = NEW.planning_week_id
      AND assignment.employee_id = NEW.employee_id
      AND assignment.assignment_date = NEW.assignment_date
      AND assigned_position.shift_id = position_shift
      AND assignment.id <> NEW.id
  ) THEN
    RAISE EXCEPTION 'La persona ya tiene una asignación en ese turno';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS planning_assignment_shift_integrity ON planning_assignments;
CREATE TRIGGER planning_assignment_shift_integrity
BEFORE INSERT OR UPDATE OF planning_week_id, position_id, employee_id, assignment_date ON planning_assignments
FOR EACH ROW EXECUTE FUNCTION ensure_planning_assignment_shift_integrity();

COMMIT;
