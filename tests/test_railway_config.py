import os
import unittest
from unittest.mock import patch

from scripts.migrate_postgres import database_url


class RailwayDatabaseConfigTests(unittest.TestCase):
    def test_railway_uses_private_database_url(self):
        variables = {
            "RAILWAY_ENVIRONMENT_ID": "production",
            "DATABASE_URL": "private-database-url",
            "DATABASE_PUBLIC_URL": "public-database-url",
        }
        with patch.dict(os.environ, variables, clear=True):
            self.assertEqual(database_url(), variables["DATABASE_URL"])

    def test_local_diagnostic_can_use_public_database_url(self):
        variables = {
            "DATABASE_URL": "private-database-url",
            "DATABASE_PUBLIC_URL": "public-database-url",
        }
        with patch.dict(os.environ, variables, clear=True):
            self.assertEqual(database_url(), variables["DATABASE_PUBLIC_URL"])

    def test_railway_does_not_fall_back_to_public_url(self):
        variables = {
            "RAILWAY_SERVICE_ID": "app",
            "DATABASE_PUBLIC_URL": "public-database-url",
        }
        with patch.dict(os.environ, variables, clear=True):
            self.assertIsNone(database_url())


if __name__ == "__main__":
    unittest.main()
