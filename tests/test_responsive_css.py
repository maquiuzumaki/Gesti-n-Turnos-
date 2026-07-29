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
        mobile_show = css.index(
            ".planning-position-assignment.assigned .planning-assignment-name--compact",
            global_hide,
        )
        self.assertGreater(mobile_show, global_hide)
        self.assertIn("display: block !important;", css[mobile_show:mobile_show + 160])

    def test_mobile_full_name_remains_hidden(self):
        css = (ROOT / "src/styles/app.css").read_text(encoding="utf-8")
        mobile_hide = css.rindex(
            ".planning-position-assignment.assigned .planning-assignment-name--full"
        )
        self.assertIn("display: none !important;", css[mobile_hide:mobile_hide + 160])

    def test_week_grid_fits_phone_and_tablet_without_horizontal_scroll(self):
        css = (ROOT / "src/styles/app.css").read_text(encoding="utf-8")
        responsive = css[css.rindex("@media (max-width: 1024px)"):]
        self.assertIn("overflow-x: hidden;", responsive)
        self.assertIn("repeat(7, minmax(0, 1fr))", responsive)
        self.assertIn(".planning-position-row-label > strong", responsive)
        self.assertIn("font-weight: 900;", responsive)

    def test_compact_names_and_today_view_are_present(self):
        app = (ROOT / "src/app.js").read_text(encoding="utf-8")
        for full_name, short_name in {
            "romina": "Romi",
            "lucila": "Luci",
            "debora": "Debo",
            "yesica": "Yesi",
            "veronica": "Vero",
            "cintia": "Cin",
            "milagros": "Mili",
        }.items():
            self.assertIn(f'{full_name}: "{short_name}"', app)
        self.assertIn('data-view="today"', app)
        self.assertIn("No hay turnos publicados para hoy", app)
        self.assertNotIn("preferred-short", app)


if __name__ == "__main__":
    unittest.main()
