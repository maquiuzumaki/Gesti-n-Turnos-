-- Las coberturas y colaboraciones históricas pueden cruzar turnos dentro del
-- mismo sector. Las asignaciones regulares mantienen la compatibilidad exacta.
BEGIN;

CREATE OR REPLACE FUNCTION ensure_assignment_compatibility()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  employee_sector TEXT;
  employee_shift TEXT;
  position_sector TEXT;
  position_shift TEXT;
BEGIN
  SELECT sector_id, shift_id INTO employee_sector, employee_shift FROM employees WHERE id = NEW.employee_id;
  SELECT sector_id, shift_id INTO position_sector, position_shift FROM planning_positions WHERE id = NEW.position_id;
  IF employee_sector IS NULL OR position_sector IS NULL THEN
    RAISE EXCEPTION 'Empleado o puesto operativo inválido';
  END IF;
  IF employee_sector <> position_sector
     AND COALESCE(NEW.assignment_type, 'regular') <> 'collaboration' THEN
    RAISE EXCEPTION 'El empleado no pertenece al sector del puesto';
  END IF;
  IF employee_shift IS NOT NULL AND position_shift IS NOT NULL
     AND employee_shift <> position_shift
     AND COALESCE(NEW.assignment_type, 'regular') NOT IN ('coverage', 'collaboration') THEN
    RAISE EXCEPTION 'El empleado no pertenece al turno del puesto';
  END IF;
  RETURN NEW;
END;
$$;

COMMIT;
