BEGIN;

-- Patrones reales de lectura del bootstrap, solicitudes y sesiones.
CREATE INDEX IF NOT EXISTS requests_employee_created_idx
ON requests (employee_id, created_at DESC);

CREATE INDEX IF NOT EXISTS requests_partner_created_idx
ON requests (partner_employee_id, created_at DESC)
WHERE partner_employee_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS requests_approved_dates_idx
ON requests (status, target_date, start_date, end_date)
WHERE status = 'approved';

CREATE INDEX IF NOT EXISTS sessions_user_active_idx
ON sessions (user_id, expires_at DESC)
WHERE revoked_at IS NULL;

CREATE INDEX IF NOT EXISTS planning_exceptions_week_date_idx
ON planning_exceptions (planning_week_id, date);

COMMIT;
