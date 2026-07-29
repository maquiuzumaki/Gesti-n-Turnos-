from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]


class ResponsivePlanningCssTests(unittest.TestCase):
    def test_mobile_name_override_is_last_in_cascade(self):
        css = (ROOT / "src/styles/app.css").read_text(encoding="utf-8")
        global_hide = css.index(
            ".planning-assignment-name--compact,\n"
            ".planning-position-assignment.assigned > small { display: none !important; }"
        )
        mobile_show = css.rindex(
            ".planning-position-assignment.assigned .planning-assignment-name--compact"
        )
        self.assertGreater(mobile_show, global_hide)
        self.assertIn("display: block !important;", css[mobile_show:mobile_show + 160])

    def test_mobile_full_name_remains_hidden(self):
        css = (ROOT / "src/styles/app.css").read_text(encoding="utf-8")
        mobile_hide = css.rindex(
            ".planning-position-assignment.assigned .planning-assignment-name--full"
        )
        self.assertIn("display: none !important;", css[mobile_hide:mobile_hide + 160])


if __name__ == "__main__":
    unittest.main()
