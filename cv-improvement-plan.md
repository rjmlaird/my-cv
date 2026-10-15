# cv.rjmlaird.co.uk — Critical Review & Improvement Plan

Scope: the `my-cv-master` snapshot (Astro 7, static, content from `api.rjmlaird.co.uk`, ~3.4k lines).
Goal you set: **rjmlaird.co.uk is the canonical identity/schema source; the CV subdomain references it.**

---

## 1. Verdict

The architecture is sound: static Astro, API-driven content, Zod validation, one `@graph` with cross-linked `@id`s. The weaknesses are in four places: (a) the identity model competes with your main site instead of deferring to it, (b) several things silently fail or are mis-wired, (c) docs have drifted from code, and (d) the build/deploy pipeline can ship a blank CV without anyone noticing.

Note: this zip appears to be **behind the schema work you've described**. It has no `hasOccupation`, no `dateCreated`/`dateModified` on the ProfilePage, `worksFor` still lists every past employer, and `sameAs` isn't filtered or normalised. Check whether a newer branch exists before starting; Phase 1 assumes this snapshot is what's live.

---

## 2. Findings

### A. Schema / identity (most relevant to your goal)

| # | Finding | Why it matters |
|---|---|---|
| A1 | CV defines its own full `Person` at `cv.rjmlaird.co.uk/#person`. | Two competing Person entities for one human. Splits entity signals and contradicts the plan to make the apex the canonical node. |
| A2 | The CV never links to rjmlaird.co.uk in its JSON-LD (not in `sameAs`, `isPartOf` or `publisher`), though page body links to `rjmlaird.co.uk/projects/…`. | Reciprocal linking is the whole point of federation, and it's missing. |
| A3 | `worksFor` is built from the whole employment history (`structuredData.ts` ~L72). | States he currently works for ESA/EUMETSAT/ESO. Needs `worksFor` = current only, past roles in `hasOccupation`. |
| A4 | ProfilePage has no `dateCreated` / `dateModified`. | Required for Google's Profile page rich result. |
| A5 | `sameAs` merges API socials with four hardcoded URLs, with no dedupe on protocol/www/slash and no filtering of `wa.me`, `signal.me`, `t.me`. | Messaging links aren't identity profiles. Duplicates dilute the signal. |
| A6 | Hardcoded identity data in 4 places: `Layout.astro` fallback Person, `structuredData.ts`, `Contact.astro`, `index.astro` (emails, `greenorbit.space`, LinkedIn handle). | Impact Orbit vs Green Orbit is undecided, and every change means editing several files. |
| A7 | Email is emitted in JSON-LD as `mailto:`. | Scraper bait on a page whose job is discoverability. Better to omit or use `contactPoint` to a form. |
| A8 | `Layout.astro` has a **static fallback Person** that differs from the dynamic one (extra ISU alumniOf, different shape). | If the API fails at build, a *different* entity ships silently. |
| A9 | Hardcoded `og:title`, `<meta keywords>` (ignored by search engines), generic `description`, and a single global OG image. | Low value. Per-page meta is only worth doing if you add pages. |
| A10 | `ProfilePage` has `primaryImageOfPage` as a bare URL string and `Person.image` as the OG image (1200×630). | Use an `ImageObject` and a square portrait for `Person.image`. A banner is wrong for a person image. |

### B. Bugs / silent failures

| # | Finding |
|---|---|
| B1 | **`src/data/skills.yaml` is a map** (`marketing_growth: [..]`) but `skills.ts` expects an array of `{name, category}` and falls back to `[]` when it isn't an array (confirmed). The taxonomy is therefore always empty: no skill is ever "resolved", no categories, no descriptions. The README/CHANGES describe a markdown content collection that doesn't exist in the repo. |
| B2 | **`AtsView.astro` is in `src/pages/`**, so Astro also builds it as a route (`/AtsView/`) and includes it in the sitemap. It's also imported into `index.astro`. Result: a duplicate, unstyled page that can be indexed. |
| B3 | **Two `<main>` elements** on the index page (the real one plus `#ats-view`), and the ATS markup is hidden by CSS only. This is an a11y/HTML-validity problem and gives crawlers the content twice. |
| B4 | **Profile failure is swallowed** (`.catch(() => null)` then render). If the API is down at build time, the CV deploys blank/partial with a green tick. |
| B5 | **Every component refetches the API** (`Experience`, `Education`, `Skills` each call `getExperience()`, and `AtsView` calls them all again). There's no memoisation, so builds make 2–3× the requests needed and can get *inconsistent* data across sections if the API changes mid-build. |
| B6 | `cdn.ts` has `console.log` debug noise on every lookup (marked `// ADD THIS`). Fetch has no timeout or retry. |
| B7 | `getMemberships`/`getCertifications`/`getAwards` use `as any`, which bypasses the validation they just ran (14 `any`s in total). |
| B8 | `Skills.astro` is passed a `skills` prop from `index.astro` that it ignores (it refetches and aggregates for itself). |
| B9 | `index.astro` skill sources use `href: ""`, while `Skills.astro` uses real anchors, so the two paths aggregate differently. |

### C. Build / tooling / deploy

| # | Finding |
|---|---|
| C1 | **Node mismatch:** `.nvmrc` = 18.17.1, CI = Node 24, Astro 7 needs a modern Node. Local dev on `.nvmrc` will break. |
| C2 | **Two lockfiles** (`package-lock.json` + `pnpm-lock.yaml`) with CI on pnpm 9. Ambiguous source of truth. |
| C3 | `zod`, `@astrojs/sitemap`, `@astrojs/check` are in `devDependencies` but needed at build; `typescript` isn't declared. `js-yaml` + `@types/js-yaml` unused (`yaml` is used). |
| C4 | `.eslintrc.cjs` and `.prettierrc.mjs` exist, but no eslint/prettier dependency or script. No tests, no CI lint step. |
| C5 | **Deploys only on push.** Content lives in the API, so editing CV data changes nothing on the live site until someone pushes code. |
| C6 | `.DS_Store` files committed; `.gitignore` lacks them. `paths: "**"` in the workflow is a no-op. |
| C7 | No post-build validation of JSON-LD, links or HTML. |

### D. Docs / content / UX

| # | Finding |
|---|---|
| D1 | README/CHANGES list files that don't exist (`content.config.ts`, `content/skills/`, `Projects.astro`, `Teaching.astro`, `Causes.astro`). Misleading for you and for any AI agent working on the repo. |
| D2 | Fonts are loaded from Google Fonts (render-blocking third-party request, GDPR noise for a UK site). Self-host. |
| D3 | `robots.txt` has no disallow for the ATS route and no `lastmod` in the sitemap. |
| D4 | Large component CSS and `!important` overrides in `Skills.astro`; `global.css` is a ~1.1k-line single file. Fine now, but a maintenance risk. |
| D5 | Page `<html lang="en">` while schema says `en-GB`. |

---

## 3. Target schema model (main site = canonical, CV = referencing)

**Canonical IDs (owned by rjmlaird.co.uk):**
- `https://rjmlaird.co.uk/#person` — the one Person
- `https://rjmlaird.co.uk/#website` — main WebSite
- Optional later: `https://rjmlaird.co.uk/#org-green-orbit` / `#org-impact-orbit` once you decide the Impact Orbit question

**On rjmlaird.co.uk:** full Person (occupation history, credentials, awards, memberships, languages, knowsAbout), `sameAs` includes `https://cv.rjmlaird.co.uk/`, plus `subjectOf` / a `hasPart` link to the CV ProfilePage if you want it explicit.

**On cv.rjmlaird.co.uk (this repo) emit only:**

```jsonc
{
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebSite", "@id": "https://cv.rjmlaird.co.uk/#website",
      "url": "https://cv.rjmlaird.co.uk/", "name": "Ryan Laird — CV", "inLanguage": "en-GB",
      "isPartOf": { "@id": "https://rjmlaird.co.uk/#website" },
      "publisher": { "@id": "https://rjmlaird.co.uk/#person" } },
    { "@type": "ProfilePage", "@id": "https://cv.rjmlaird.co.uk/#webpage",
      "url": "https://cv.rjmlaird.co.uk/", "isPartOf": { "@id": "https://cv.rjmlaird.co.uk/#website" },
      "dateCreated": "…", "dateModified": "<build/API updated date>",
      "about":      { "@id": "https://rjmlaird.co.uk/#person" },
      "mainEntity": { "@id": "https://rjmlaird.co.uk/#person" } },
    { "@type": "Person", "@id": "https://rjmlaird.co.uk/#person",
      "name": "Ryan Laird", "url": "https://rjmlaird.co.uk/",
      "image": "<square portrait>", "jobTitle": "…",
      "worksFor": { "…current employer only…" },
      "sameAs": [ "…filtered profile URLs…", "https://cv.rjmlaird.co.uk/" ] }
  ]
}
```

Design notes:
1. **Keep a slim Person stub on the CV page, not a bare reference.** Google evaluates each page's JSON-LD on its own and does not reliably resolve `@id`s across documents/domains. A ProfilePage whose `mainEntity` is an unresolved ID may not qualify for the rich result. The stub shares the canonical `@id` so entity consolidation still works, but carries no duplicated detail.
2. **The CV stays self-canonical** (`<link rel="canonical">` to itself). Don't canonical it to the apex; it's a distinct document.
3. **Reciprocity is what makes it work:** main → CV via `sameAs`/`hasPart`, CV → main via `isPartOf`, `publisher`, `sameAs`.
4. **Single source of truth = your API.** Add `GET /v1/schema/person` (and `/v1/schema/occupations` etc.) to `rjmlaird-api` that returns the canonical Person JSON-LD (current `worksFor`, `hasOccupation`, filtered `sameAs`). Both Astro sites consume it. The CV then only adds ProfilePage + WebSite. This also gives `api.impactorbit.co` a pattern to follow.
5. Make **site origins and the canonical person ID config constants** (`src/config/site.ts` or env), not literals scattered across four files.

---

## 4. Plan

### Phase 0 — Safety net (½ day)
1. Confirm which branch is live and whether your `hasOccupation` / `dateModified` / `sameAs` work lives elsewhere; merge it first.
2. Make the build **fail** if `profile` or `experience` is null/empty (replace the swallowed `.catch`). Optional escape hatch: `ALLOW_PARTIAL=1`.
3. Add a single memoised data loader (`src/lib/data.ts`: `getAll()` caching one `Promise`) and use it from `index.astro` and every component. Removes B5, B8, B9.
4. Add `.DS_Store` to `.gitignore` and remove the committed ones.

### Phase 1 — Schema federation (1–2 days) ← your stated goal
1. Add `src/config/site.ts`: `SITE_URL`, `CANONICAL_SITE_URL = https://rjmlaird.co.uk`, `PERSON_ID = ${CANONICAL}/#person`, `WEBSITE_ID`.
2. Rewrite `buildStructuredData` to the model in §3: WebSite + ProfilePage + slim Person stub using `PERSON_ID`.
3. Fix `worksFor` (current only) and add `hasOccupation` — ideally by consuming the shared API endpoint rather than re-deriving here.
4. Add `dateCreated` / `dateModified` (from API `updated` fields or latest of experience/education; fall back to build date).
5. Normalise `sameAs`: single util (lowercase host, strip `www`, strip trailing slash, force https), exclude `wa.me`, `signal.me`, `t.me`, dedupe, add the main site. Drop the hardcoded duplicates.
6. Remove the email from JSON-LD; replace with `contactPoint` pointing to the contact page/form if you want one.
7. Delete the static fallback Person from `Layout.astro`; if there's no structured data, emit nothing (and Phase 0 makes that case a build failure anyway).
8. Use a square portrait for `Person.image`, `ImageObject` for `primaryImageOfPage`.
9. **Mirror change on rjmlaird.co.uk:** add `https://cv.rjmlaird.co.uk/` to Person `sameAs`, link ProfilePage via `subjectOf`/`hasPart`, enrich with the CV data.
10. Update `<html lang="en-GB">`.

### Phase 2 — Fix the bugs (1 day)
1. **Skills taxonomy (B1):** choose one: (a) convert `skills.yaml` to the array-of-objects shape `skills.ts` expects, or (b) rewrite the loader for the category→list map. Add a Zod `.parse` that **throws** on a non-array so this can't fail silently again.
2. **ATS view (B2, B3):** move `AtsView.astro` to `src/components/`. Decide: (a) keep it in the same page but `hidden`/`aria-hidden` plus `<section>` rather than a second `<main>`; or (b) better, ship a separate static `/ats/` page with `noindex` and a link, and keep the main page clean. Add it to `robots.txt` disallow and exclude it from the sitemap filter.
3. Remove `console.log` noise in `cdn.ts`; add fetch timeout (`AbortSignal.timeout`) and one retry.
4. Replace `as any` in API getters with proper types from the schemas.

### Phase 3 — Build & deploy hardening (½–1 day)
1. Pick **pnpm**, delete `package-lock.json`, set `packageManager` in `package.json`, align `.nvmrc` with CI (Node 22 or 24).
2. Move `zod`, `@astrojs/sitemap`, `@astrojs/check` to `dependencies`; add `typescript`; remove `js-yaml`/`@types/js-yaml`.
3. Add scripts `lint`, `format` and install the matching dev deps (or delete the dead configs).
4. **Rebuild when content changes (C5):** add `repository_dispatch` to the workflow, fired from the API repo's deploy/commit action, plus a nightly `schedule` as a backstop.
5. Add a post-build check script in CI: parse `dist/index.html` JSON-LD, assert `@id`s resolve within the graph or point at `PERSON_ID`, assert exactly one `<main>`, run a link checker on the output.

### Phase 4 — Docs and polish (½ day)
1. Rewrite README and trim CHANGES to match reality (fixes D1). Add an "Identity & schema" section stating that the apex owns the Person.
2. Self-host fonts (Fontsource) and preload the two weights above the fold (D2).
3. `robots.txt` / sitemap `lastmod` (D3). Per-page meta only if you add pages (A9). Drop `meta keywords`.
4. Optional: split `global.css` per component/layer; remove `!important` overrides in `Skills.astro` (D4).

### Phase 5 — Validation (acceptance checks)
- Google Rich Results Test and validator.schema.org pass on the CV URL: ProfilePage valid, no warnings on `mainEntity`.
- Both sites emit the same `@id` for the Person; Search Console shows no duplicate-entity issues.
- Main site's Person `sameAs` contains the CV URL; CV's contains the main site.
- Break the API URL locally → build fails loudly.
- Lighthouse a11y ≥ 95 with a single `<main>`; `/AtsView/` no longer in `dist/` or the sitemap.

---

## 5. Decisions needed from you

1. **Impact Orbit vs Green Orbit:** does Impact Orbit Creative Group supersede Green Orbit Digital as `worksFor`, or do both coexist? (Schema supports both, but `jobTitle` and the CV headline need a single story.)
2. **ATS view:** keep it as a toggle on the main page, or move it to its own `noindex` `/ats/` page? (I recommend the latter.)
3. **Shared schema endpoint:** are you happy to add `/v1/schema/person` to `rjmlaird-api` so that both sites and later `api.impactorbit.co` build from one definition?
4. **Contact email:** keep it on the page (visible) but remove it from JSON-LD?

## 6. Suggested order if time is short

Phase 0.2–0.3 → Phase 1 → Phase 2.1–2.2 → Phase 3.4. That covers the highest-impact items: no more blank deploys, the federated schema, the dead skills taxonomy, the duplicate ATS route, and automatic rebuilds.
