import unittest
from datetime import date

from database import planning_week_name


class PlanningWeekNameTests(unittest.TestCase):
    def test_uses_the_automatic_short_date_range(self):
        self.assertEqual(
            planning_week_name(date(2026, 8, 3)),
            "Grilla operativa del 03/08 al 09/08",
        )

    def test_supports_ranges_across_months(self):
        self.assertEqual(
            planning_week_name(date(2026, 8, 31)),
            "Grilla operativa del 31/08 al 06/09",
        )
