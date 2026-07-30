from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]


class ResponsivePlanningCssTests(unittest.TestCase):
    def test_mobile_full_name_override_is_last_in_cascade(self):
        css = (ROOT / "src/styles/app.css").read_text(encoding="utf-8")
        responsive_start = css.index("@media (max-width: 1024px)")
        mobile_show = css.index(
            ".planning-position-assignment.assigned .planning-assignment-name--full",
            responsive_start,
        )
        self.assertIn("display: block !important;", css[mobile_show:mobile_show + 160])
        self.assertIn("overflow-wrap: anywhere;", css[mobile_show:mobile_show + 360])

    def test_mobile_compact_name_remains_hidden(self):
        css = (ROOT / "src/styles/app.css").read_text(encoding="utf-8")
        mobile_hide = css.rindex(
            ".planning-position-assignment.assigned .planning-assignment-name--compact"
        )
        self.assertIn("display: none !important;", css[mobile_hide:mobile_hide + 160])

    def test_week_grid_fits_phone_and_tablet_without_horizontal_scroll(self):
        css = (ROOT / "src/styles/app.css").read_text(encoding="utf-8")
        responsive = css[css.index("@media (max-width: 1024px)"):]
        self.assertIn("overflow-x: hidden;", responsive)
        self.assertIn("repeat(7, minmax(0, 1fr))", responsive)
        self.assertIn(".planning-position-row-label > strong", responsive)
        self.assertIn("font-weight: 900;", responsive)

    def test_full_and_compact_names_and_today_view_are_present(self):
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
        self.assertIn("planning-assignment-name--full", app)
        self.assertNotIn("preferred-short", app)

    def test_mobile_days_off_names_wrap_without_ellipsis(self):
        css = (ROOT / "src/styles/app.css").read_text(encoding="utf-8")
        responsive = css[css.index("@media (max-width: 1024px)"):]
        rule = responsive.index(".planning-days-off-grid .planning-day-off-chip strong")
        declaration = responsive[rule:rule + 360]
        self.assertIn("overflow-wrap: anywhere;", declaration)
        self.assertIn("text-overflow: clip;", declaration)
        self.assertIn("white-space: normal;", declaration)

    def test_today_days_off_keeps_one_day_layout(self):
        css = (ROOT / "src/styles/app.css").read_text(encoding="utf-8")
        responsive = css[css.index("@media (max-width: 1024px)"):]
        selector = ".planning-position-grid.planning-days-off-grid.planning-position-grid--today"
        rule = responsive.index(selector)
        self.assertIn(
            "grid-template-columns: clamp(72px, 20vw, 150px) minmax(0, 1fr);",
            responsive[rule:rule + 220],
        )

    def test_all_schedule_names_share_bold_uniform_scale(self):
        css = (ROOT / "src/styles/app.css").read_text(encoding="utf-8")
        final_rules = css[css.index("Nombres de personal: una única escala"):]
        self.assertIn(
            ".planning-position-assignment.assigned .planning-assignment-name--full,\n"
            ".planning-days-off-grid .planning-day-off-chip strong",
            final_rules,
        )
        self.assertIn("font-size: var(--schedule-person-name-size) !important;", final_rules)
        self.assertIn("font-weight: 900 !important;", final_rules)
        self.assertIn(
            "--schedule-person-name-size: clamp(17px, calc(1.15vw + 2px), 20px);",
            final_rules,
        )
        self.assertIn(
            "--schedule-person-name-size: clamp(11px, calc(1.55vw + 2px), 16px);",
            final_rules,
        )
        self.assertIn(
            "--schedule-person-name-size: clamp(10px, calc(2.35vw + 2px), 12px);",
            final_rules,
        )


if __name__ == "__main__":
    unittest.main()
