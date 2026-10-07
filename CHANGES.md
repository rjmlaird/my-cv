# Changes

Earlier entries in this file described files and features that don't exist in the repository (a `content.config.ts`
skills collection, `Projects.astro`, `Teaching.astro`, `Causes.astro`) and were removed. This log restarts from the
October 2026 overhaul.

## 2026-10 overhaul

### Identity and structured data
- Canonical Person is now `https://rjmlaird.co.uk/#person`. The CV emits a slim stub with that `@id`, plus its own
  `WebSite` and `ProfilePage`, linked to the main site both ways.
- `worksFor` is the current employer only; ProfilePage has `dateCreated` and `dateModified`; `sameAs` is normalised and
  deduped, with messaging links removed; email removed from JSON-LD; the static fallback Person is gone.
- All identity constants moved to `src/config/site.ts`.

### Reliability
- Build fails if profile, experience or education can't be loaded (`ALLOW_PARTIAL=1` overrides).
- One memoised request per API endpoint per build; 15 s timeout and one retry.
- Skills taxonomy fixed: `skills.yaml` is a category map but the loader expected an array, so it was always empty.
  The loader now supports both shapes and throws on anything else.
- Fixed dead in-page links (`#exp-…`, `#edu-…`, `#tech-stack`) and a placeholder "Intro" in the Skills section.

### Pages
- ATS view moved from an accidental `/AtsView/` route embedded in the main page to a dedicated `/ats/` page
  (`noindex`, canonical `/`, not in the sitemap). The main page now has a single `<main>`.

### Tooling
- pnpm only (`package-lock.json` removed), Node 24, `packageManager` pinned, TypeScript pinned to 5.9.
- Build-time packages moved to `dependencies`; unused `js-yaml` removed.
- ESLint (flat config) and Prettier set up; `lint`, `format`, `check:dist`, `verify` scripts added.
- CI: lint, build and dist checks; rebuild on `repository_dispatch` and nightly.

### Layout and navigation pass
- **Header:** now `position: sticky` instead of `fixed`, so it no longer covers the hero or the "Ryan Laird" heading.
  Anchor jumps clear it via `scroll-margin-top`.
- **Nav:** hamburger below 1180px (accessible: `aria-expanded`, Escape and outside-click close, closes on link, panel
  scrolls if taller than the screen); inline links at 1180px and up, with nothing clipped at any width tested
  (360, 390, 768, 1180, 1280, 1600). ATS view and Download / Print live in the mobile menu and in the hero.
- **Hero:** introduction runs the full width of the content column; "Get in touch", "ATS version" and
  "Download / Print" are real 44px buttons; the portfolio links are buttons too ("Elsewhere"), stacking on phones.
  The role string is now HTML-escaped before the employer name is emphasised. Fixed biography/summary fallback
  (`biography` defaults to `[]`, so `??` never fell through to `summary`).
- **Skills:** every skill is a button that opens its own panel (description, proficiency, where it was applied, with
  links to those entries). The old six-per-category cut-off and nested "More detail" are gone. One panel per group is
  open at a time; deep links like `/#skill-seo` open that skill; without JavaScript all panels are visible content.
- **ATS view:** conventional section order (summary, core skills by category, experience, education, certifications,
  memberships, awards, volunteering, languages), contact line, dates right-aligned, one plain font, real bullets,
  `<time>` elements, print rules (A4, 14mm margins, no orphaned headings). Styles moved out of `global.css`.

### Validation fixes (Phase 5)
- "Download / Print" button: white on orange was 1.97:1 contrast; now dark on orange. Lighthouse accessibility 95 → 100.
- `/ats/` page: buttons were styled only inside `Nav.astro`, so the secondary button rendered white-on-white; the global
  `header` flex rule also pushed the name and role apart. Both fixed.
- Added `scripts/check-federation.mjs` (`pnpm check:live`) and `POST-DEPLOY-CHECKLIST.md`.

### Polish
- Fonts self-hosted via Fontsource (no Google Fonts requests).
- Removed `<meta name="keywords">`; OG/Twitter titles and descriptions now follow page props; `<html lang="en-GB">`.
- Removed debug logging and `as any` casts in the API client; removed `!important` overrides in `Skills.astro`.
