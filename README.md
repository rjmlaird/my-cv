# Ryan Laird — CV

Source for [cv.rjmlaird.co.uk](https://cv.rjmlaird.co.uk). Astro 7, static output, content fetched at build time
from `api.rjmlaird.co.uk` and validated with Zod.

## Identity and structured data

**rjmlaird.co.uk owns the canonical `Person`** (`https://rjmlaird.co.uk/#person`). This site does not define a competing
entity. `src/lib/structuredData.ts` emits one `@graph` containing:

| Node          | `@id`                               | Notes                                                                  |
| ------------- | ----------------------------------- | ---------------------------------------------------------------------- |
| `WebSite`     | `https://cv.rjmlaird.co.uk/#website` | `isPartOf` the main site's `#website`; `publisher` is the canonical Person |
| `ProfilePage` | `https://cv.rjmlaird.co.uk/#webpage` | `mainEntity`/`about` → canonical Person; `dateCreated`, `dateModified`  |
| `Person`      | `https://rjmlaird.co.uk/#person`     | **Slim stub** (name, url, jobTitle, image, current `worksFor`, `sameAs`) |

The stub is deliberate: Google evaluates each page's JSON-LD on its own and does not reliably resolve `@id`s across
domains, so the ProfilePage needs a Person node on the page. Full detail (occupation history, credentials, awards,
memberships, languages, `knowsAbout`) belongs on the main site, built from the API's `/v1/schema/person` endpoint.

Rules that are enforced by `pnpm check:dist`:

- no email address in JSON-LD (it stays visible on the page)
- `worksFor` is the current employer only
- `sameAs` is https-only, deduped, and excludes messaging links (`wa.me`, `signal.me`, `t.me`)
- the CV is self-canonical; it is not canonicalised to the main site

All identity constants live in `src/config/site.ts`. Change them there, nowhere else. `CV_FIRST_PUBLISHED` should be set
to the real publish date; until it is, `dateCreated` falls back to the build date.

## Structure

```
src/
├── config/site.ts          # Origins, canonical @ids, current employer, contact email
├── data/
│   ├── nav.ts              # Section nav links
│   └── skills.yaml         # Skills taxonomy (see "Skills" below)
├── lib/
│   ├── api.ts              # Fetch + validate every collection; memoised; fail-fast
│   ├── cdn.ts              # Resolves CDN document ids to URLs
│   ├── sameAs.ts           # Normalise / filter / dedupe profile URLs
│   ├── skills.ts           # Taxonomy loader + tag aggregation
│   ├── structuredData.ts   # JSON-LD graph (see above)
│   ├── format.ts           # Date/text helpers
│   └── schemas/            # One Zod schema per API collection
├── layouts/Layout.astro    # <head>, meta, JSON-LD, fonts, global CSS
├── components/             # One component per CV section, plus Nav and AtsView
├── pages/
│   ├── index.astro         # The visual CV
│   └── ats.astro           # Plain-text CV for ATS parsers (noindex)
└── styles/global.css       # Design tokens and styles
scripts/check-dist.mjs      # Post-build checks
```

Fonts (Space Grotesk, Inter, JetBrains Mono) are self-hosted via `@fontsource-variable/*`. There is no request to
Google Fonts.

## Content and the API

Almost everything comes from `api.rjmlaird.co.uk` at build time (`src/lib/api.ts`). Each endpoint is requested once per
build and shared by every component, so sections can't disagree.

**The build fails** if `profile`, `experience` or `education` can't be fetched or don't validate. A blank CV is never
deployed. Other collections degrade to empty sections with a logged warning.

| Variable          | Effect                                                                           |
| ----------------- | -------------------------------------------------------------------------------- |
| `ALLOW_PARTIAL=1` | Let the build continue when critical data is missing (local work only)           |
| `CV_API_BASE`     | Override the API base URL, e.g. `http://127.0.0.1:4599/api` to build against a mock |

## Skills

The Skills section is built from the `skills` tags on experience and education entries (`aggregateSkills`), not
curated by hand. `src/data/skills.yaml` supplies categories and canonical names only; it never adds a skill on its own.
Tags that match nothing in the taxonomy still appear, under "Other".

`skills.yaml` accepts either a map of `category_key: [skill names]` (current) or an array of
`{ name, category, description, proficiency, relatedSkills }` entries. Any other shape fails the build. New category
keys need a label in `CATEGORY_LABELS` in `src/lib/skills.ts`; unknown keys fall back to a Title Case of the key.

## ATS / print

- `/ats/` is a plain, single-column version for applicant tracking systems and clean PDFs. It is `noindex`,
  canonicalised to `/`, and excluded from the sitemap.
- "Download / Print" on the main page prints the visual layout.

## Commands

| Command             | Action                                                              |
| ------------------- | ------------------------------------------------------------------- |
| `pnpm install`      | Install dependencies (pnpm only; version pinned in `packageManager`) |
| `pnpm dev`          | Dev server at `localhost:4321`                                      |
| `pnpm build`        | `astro check` then production build to `./dist/`                    |
| `pnpm preview`      | Preview the production build                                        |
| `pnpm typecheck`    | Type-check only                                                     |
| `pnpm lint`         | ESLint (`eslint.config.mjs`)                                        |
| `pnpm format`       | Prettier (writes; run as its own commit)                            |
| `pnpm check:dist`   | Post-build checks on `./dist`                                       |
| `pnpm verify`       | Typecheck, lint, build, then dist checks                            |
| `pnpm check:live`   | After deploy: check CV and main site agree on the Person (needs network) |

Node version is in `.nvmrc` (24). TypeScript is pinned to 5.9 because `astro check` doesn't work with TypeScript 7 yet.

## Deploying

`.github/workflows/deploy-cv.yml` builds and deploys to GitHub Pages on:

- push to `master`
- `repository_dispatch` with type `content-updated`. Fire it from the API repo when CV data changes:
  `gh api repos/rjmlaird/my-cv/dispatches -f event_type=content-updated`
- a nightly schedule (04:17 UTC) as a backstop
- manual `workflow_dispatch`

CI runs lint, build and `check:dist`; a failure stops the deploy. Update `SITE_URL` in `src/config/site.ts` **and**
`site` in `astro.config.mjs` if the domain ever changes.

## After deploying

See `POST-DEPLOY-CHECKLIST.md` for the live checks (Rich Results Test, Search Console, `pnpm check:live`).

## SEO notes

- Canonical URL, Open Graph and Twitter meta are generated from the page `title` and `description` props.
- `<meta name="keywords">` is intentionally absent (search engines ignore it).
- The sitemap deliberately has no `lastmod`: nightly rebuilds would bump it daily with no real content change.
