BEGIN;

-- Una intervención humana sobre una asignación automática no puede ser
-- eliminada por una regeneración posterior.
ALTER TABLE planning_assignments
    ADD COLUMN IF NOT EXISTS manual_override BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS planning_assignments_regeneration_idx
ON planning_assignments (planning_week_id, generated, manual_override);

COMMIT;
