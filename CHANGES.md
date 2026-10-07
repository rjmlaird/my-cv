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

### Validation fixes (Phase 5)
- "Download / Print" button: white on orange was 1.97:1 contrast; now dark on orange. Lighthouse accessibility 95 → 100.
- `/ats/` page: buttons were styled only inside `Nav.astro`, so the secondary button rendered white-on-white; the global
  `header` flex rule also pushed the name and role apart. Both fixed.
- Added `scripts/check-federation.mjs` (`pnpm check:live`) and `POST-DEPLOY-CHECKLIST.md`.

### Polish
- Fonts self-hosted via Fontsource (no Google Fonts requests).
- Removed `<meta name="keywords">`; OG/Twitter titles and descriptions now follow page props; `<html lang="en-GB">`.
- Removed debug logging and `as any` casts in the API client; removed `!important` overrides in `Skills.astro`.
