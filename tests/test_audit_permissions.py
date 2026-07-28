import unittest

from database import Database, DomainError


class AuditPermissionTests(unittest.TestCase):
    def test_only_management_roles_can_delete_audit_movements(self):
        Database._assert_audit_log_deletion_allowed({"role": "admin"})
        Database._assert_audit_log_deletion_allowed({"role": "manager"})
        with self.assertRaises(DomainError) as error:
            Database._assert_audit_log_deletion_allowed({"role": "supervisor"})
        self.assertEqual(error.exception.status, 403)
