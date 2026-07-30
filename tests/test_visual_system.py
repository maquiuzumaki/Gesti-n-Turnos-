from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]


class VisualSystemTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.css = (ROOT / "src/styles/app.css").read_text(encoding="utf-8")
        cls.html = (ROOT / "index.html").read_text(encoding="utf-8")
        cls.app = (ROOT / "src/app.js").read_text(encoding="utf-8")
        cls.mock = (ROOT / "src/data/mockData.js").read_text(encoding="utf-8")

    def test_uzumaki_identity_remains_the_source_of_brand_colors(self):
        self.assertIn("--uzumaki-primary: var(--uzumaki-orange-700);", self.css)
        self.assertIn("--app-border-strong: color-mix(in srgb, var(--uzumaki-orange-700)", self.css)
        self.assertIn("var(--uzumaki-orange-900)", self.css)

    def test_shared_saas_surface_tokens_are_defined(self):
        for token in (
            "--app-canvas:",
            "--app-surface:",
            "--app-border:",
            "--app-shadow-sm:",
            "--app-radius-lg:",
            "--app-ease:",
        ):
            self.assertIn(token, self.css)

    def test_navigation_and_shared_components_use_the_new_system(self):
        redesign = self.css[self.css.index("Uzumaki SaaS UI"):]
        for selector in (
            ".sidebar {",
            ".topbar {",
            ".metric-card",
            ".people-table-panel",
            ".request-filter-panel",
            ".modal {",
        ):
            self.assertIn(selector, redesign)

    def test_secondary_screens_share_the_same_visual_language(self):
        redesign = self.css[self.css.index("Uzumaki SaaS UI"):]
        for selector in (
            ".staff-profile-hero",
            ".empty-state {",
            ".request-results-head {",
            ".notification-popover {",
            ".week-lifecycle-flow",
            ".planning-conflict-panel",
            ".account-session-action",
        ):
            self.assertIn(selector, redesign)

    def test_responsive_and_reduced_motion_guards_are_present(self):
        redesign = self.css[self.css.index("Uzumaki SaaS UI"):]
        self.assertIn("@media (max-width: 760px)", redesign)
        self.assertIn("@media (max-width: 470px)", redesign)
        self.assertIn("@media (prefers-reduced-motion: reduce)", redesign)
        self.assertIn(".planning-position-board", self.css)
        self.assertIn("overflow-x: hidden;", self.css)

    def test_stylesheet_cache_version_was_updated(self):
        self.assertIn("app.css?v=20260730-7", self.html)

    def test_clear_palette_overrides_the_dark_sidebar(self):
        clear_palette = self.css[self.css.index("Paleta clara Uzumaki"):]
        self.assertIn("linear-gradient(180deg, #fff9f1 0%, #ffe8cd 52%, #ffc878 100%)", clear_palette)
        self.assertIn(".nav-item { color: #725343; }", clear_palette)
        self.assertIn("color: var(--uzumaki-brown-900);", clear_palette)
        self.assertNotIn("#61382c", clear_palette)

    def test_clear_palette_is_shared_by_buttons_icons_and_featured_cards(self):
        clear_palette = self.css[self.css.index("Paleta clara Uzumaki"):]
        for selector in (
            ".icon-button,",
            ".button.secondary,",
            ".metric-icon,",
            ".request-icon,",
            ".planning-library-icon,",
            ".staff-hero,",
            ".staff-profile-hero",
        ):
            self.assertIn(selector, clear_palette)
        self.assertIn("--app-accent-soft: #fff0df;", clear_palette)
        self.assertIn("linear-gradient(120deg, #ffad5e 0%, #fb8c2a 100%)", clear_palette)

    def test_days_off_use_coffee_icon_in_every_frontend_view(self):
        for source in (self.app, self.mock):
            self.assertIn('metric("Francos publicados"', source)
            self.assertIn('"amber", "☕"', source)
            self.assertIn('<span>☕</span><div><h3>Francos ·', source)
            self.assertIn('key: "off", icon: "☕"', source)
            self.assertNotIn('key: "off", icon: "○"', source)
        self.assertIn("app.js?v=20260730-22", self.html)

    def test_internal_responsive_hint_is_not_rendered(self):
        self.assertNotIn("Los siete días se ajustan al ancho de tu pantalla.", self.app)
        self.assertIn("app.js?v=20260730-22", self.html)


if __name__ == "__main__":
    unittest.main()
