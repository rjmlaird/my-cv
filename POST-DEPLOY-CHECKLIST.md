# Post-deploy checklist (Phase 5 acceptance)

Local results from the pre-deploy run are at the bottom. Everything above them needs the live sites.

## Before you deploy

- [ ] `CV_FIRST_PUBLISHED` set in `src/config/site.ts`
- [ ] Main site (rjmlaird.co.uk) deployed with: full Person at `https://rjmlaird.co.uk/#person`, the CV URL in its `sameAs`,
      `worksFor` = Green Orbit Digital only, past roles in `hasOccupation`, **no email** in JSON-LD
- [ ] `/v1/schema/person` added to the API repo and wired to the main site (optional for the CV itself)
- [ ] `repository_dispatch` (`content-updated`) added to the API repo's workflow
- [ ] Decide what the main site's own `/cv/` route does. It currently exists alongside this subdomain, which risks two
      copies of the same CV competing. Either redirect it to `https://cv.rjmlaird.co.uk/` or canonical it there.

## After deploy

1. **Actions run is green** (lint, build, `check:dist`, deploy). Open the live page source and confirm one JSON-LD block.
2. **Federation check** from your machine: `pnpm check:live`. It confirms both sites share the Person `@id`, reference each
   other, have no email in JSON-LD, one Person per page, current employer only, correct canonicals, and `/ats/` is noindex.
3. **Rich Results Test** (search.google.com/test/rich-results) on `https://cv.rjmlaird.co.uk/`:
   - ProfilePage detected, no errors on `mainEntity`
   - warnings about missing optional fields are fine
4. **Schema validator** (validator.schema.org) on both URLs: no errors, and the `Person` shown is the same entity.
5. **Search Console** (cv.rjmlaird.co.uk property):
   - URL Inspection → test live URL → Request indexing for `/`
   - Sitemaps → resubmit `sitemap-index.xml`; it should list only `/`
   - URL Inspection on `/ats/` should report "Excluded by noindex"
   - Over the next days: Enhancements → Profile page appears; no duplicate or alternate-canonical warnings
6. **Lighthouse** in Chrome on the live URL: accessibility should be 100.
7. **Break test (optional, in a branch):** point `API_BASE` at a bad URL and push. The Actions run must fail at Build and
   nothing may deploy.

## Local results (before deploy, mock API)

| Check                                            | Result                                  |
| ------------------------------------------------ | --------------------------------------- |
| `pnpm verify` (typecheck, lint, build, dist)     | pass                                    |
| Lighthouse `/` (accessibility / SEO / best practices / performance) | 100 / 100 / 100 / 98   |
| Lighthouse `/ats/`                               | 100 / 66 / 100 / 100 (SEO 66 is the intended `noindex`) |
| Build with profile, experience or education missing | exits 1, no deploy                   |
| `ALLOW_PARTIAL=1` with profile missing           | builds                                  |
| `check:live` against fixtures                    | passes when consistent; 5 failures when not |
| Single `<main>`, `/AtsView/` absent, `/ats/` not in sitemap | pass                         |

## Known and not changed

- At about 1300px wide the fixed header is taller than the hero's top padding, so the name is partly covered on load, and
  the nav wraps and cuts off the last links (Skills to Contact). The CSS is identical to your original; it's a design call.
- `global.css` is still one 1.2k-line file.
