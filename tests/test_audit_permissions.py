import unittest
from pathlib import Path

from database import Database, DomainError


class AuditPermissionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        root = Path(__file__).resolve().parents[1]
        cls.app_source = (root / "src/app.js").read_text(encoding="utf-8")
        cls.server_source = (root / "server.py").read_text(encoding="utf-8")
        cls.database_source = (root / "database.py").read_text(encoding="utf-8")

    def test_only_primary_admin_can_delete_audit_movements(self):
        Database._assert_audit_log_deletion_allowed({"role": "admin"})
        for role in ("manager", "supervisor", "staff"):
            with self.subTest(role=role):
                with self.assertRaises(DomainError) as error:
                    Database._assert_audit_log_deletion_allowed({"role": role})
                self.assertEqual(error.exception.status, 403)

    def test_audit_row_delete_is_only_rendered_for_admin(self):
        self.assertIn('const canDelete = user.role === "admin";', self.app_source)

    def test_bulk_audit_reset_is_not_available(self):
        combined = self.app_source + self.server_source + self.database_source
        for forbidden in ("reset-audit-logs", "reset_audit_logs", "auditLogsReset", "audit_logs_reset"):
            self.assertNotIn(forbidden, combined)
