BEGIN;

-- Maqui es la creadora de la aplicación y la única Administración principal.
UPDATE users
SET system_role = 'sys-admin', updated_at = now()
WHERE id = 'user-maqui' OR lower(username) = 'maqui';

-- Se conserva el usuario de inicio de sesión existente para Supervisión,
-- pero la identidad visible de la supervisora general pasa a ser Solana.
UPDATE users
SET name = 'Solana', updated_at = now()
WHERE id = 'user-supervisora' AND system_role = 'sys-supervisora';

COMMIT;
