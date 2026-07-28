import unittest
from datetime import date

from database import planning_week_name


class PlanningWeekNameTests(unittest.TestCase):
    def test_uses_the_automatic_short_date_range(self):
        self.assertEqual(
            planning_week_name(date(2026, 8, 3)),
            "Grilla operativa del 3/8 al 9/8",
        )

    def test_supports_ranges_across_months(self):
        self.assertEqual(
            planning_week_name(date(2026, 8, 31)),
            "Grilla operativa del 31/8 al 6/9",
        )
