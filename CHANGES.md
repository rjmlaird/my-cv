# Changes made

## Latest pass — skills taxonomy, projects, membership fix, SEO/ATS, branding

- **New: skills content collection.** `src/content.config.ts` + `src/content/skills/*.md`
  — a local, version-controlled taxonomy (name, category, proficiency, description,
  related skills). Experience, education, and project `skills` arrays now resolve
  against it via `src/lib/skills.ts`, rendering as linked pills that jump to the
  matching entry in the Skills section, or plain text if a tag has no match yet.
  The starter set (14 skills) is a placeholder covering the categories visible in
  your profile — edit/extend `src/content/skills/` to match your real skill set.
- **Schema: `skills` (and `projects`) made optional.** `experience.schema.ts` and
  `education.schema.ts` — previously required, so any API record missing the field
  would fail validation. Both now default to `[]`; populate the arrays in the API
  as you tag records, no site changes needed.
- **Fixed: `Memberships.astro` was rendering the wrong component entirely** — it
  was a leftover blog-post-card template (image, author badge, "By ..." attribution,
  `/tags/` and `/authors/` links) that never touched `getMemberships()`, so the
  Memberships section silently showed nothing real. Rewritten to actually consume
  the membership schema (organisation, role, type, description) with a "More detail"
  dropdown for the description. Also removed the matching dead CSS
  (`.author-badge`, `.author-avatar`, `.pt`, a duplicate `.tag` rule) it had pulled
  into `global.css`.
- **New: Projects section.** `project.schema.ts` had TypeScript types but no Zod
  schema and nothing rendered it — it was entirely unused. Added a runtime schema
  (with the same optional `skills` tag field), `getProjects()` in `api.ts`
  (defends against the endpoint not existing yet), and `Projects.astro`: cards
  with tools/tech, cross-referenced skills, links, and a "More detail" dropdown
  for case studies, articles, awards, and impact stats. Wired into the nav and
  page order after Education, and into the ATS export.
- **Cross-referencing:** Experience and Education project mentions (`role.projects`
  / `item.projects`) now link to the matching Projects card when the slug/title
  matches, instead of rendering as inert pill text.
- **Surfaced previously-fetched-but-unrendered fields.** Experience and education
  data included `technologies`, `clients`, `talks`, `articles`, `certifications`,
  etc. that were fetched from the API but never displayed. Added a "More detail"
  `<details>` dropdown per entry (progressive disclosure — stays in the DOM for
  SEO/ATS parsing, prints open) to surface these without cluttering the main
  timeline view.
- **Fixed: `Skills.astro` markup didn't match its own CSS** — the component
  rendered `.skill-tags`/`.skill-tag`/`.skill-kind`, none of which existed in
  `global.css` (only unused `.skill-group ul/li` rules did), so every skill tag
  fell back to unstyled browser defaults. Added the missing rules, plus
  `--resolved`/`--hard`/`--soft` variants and `#skill-{slug}` anchors as the
  landing target for cross-referenced pills elsewhere on the page.
- **SEO:** `Layout.astro` now sets a per-page canonical URL from `Astro.url`,
  Open Graph `url`/`image`/`site_name`, Twitter card meta, `robots`, and richer
  `Person` JSON-LD (`worksFor`, structured `alumniOf`, `address`, image). Needs
  a `public/og-image.png` (1200×630) to complete the social preview — referenced
  but not yet added.
- **ATS export** now includes Projects (title, description, tools/tech) so it
  isn't missing an entire section that appears on the visual page.

## Previous pass — content bugs fixed
- `Research.astro` was accidentally rendering the Teaching data (copy-paste bug),
  so the real research content never appeared, "Teaching" showed twice, and the
  `#research` nav anchor was dead. Now renders your actual research paragraphs + ORCID.
- Nav bar was missing links to Research, Awards, and Volunteering sections that
  exist on the page. Added.
- `Awards.astro` and the ATS view referenced a `.label` field that doesn't exist
  on the award schema (real fields: `title`, `issuer`, `date`, `description`) —
  every award would have rendered as `undefined`. Fixed.
- ATS export (`AtsView.astro`) had several silent failures: wrong education field
  names, a skills-unwrapping bug that always produced an empty skills list, and
  it pulled profile data from a schema missing `credentials`/`tags`. Rewired to
  use the same canonical profile data as the Hero section, and now includes the
  Research and Teaching sections it was previously missing entirely.
- Removed dead code: `src/lib/data.ts` and five orphaned `src/data/*.ts` files
  that imported non-existent JSON files — leftovers from a pre-API version of
  the site.

## Download / print fixed
- Previously, "Download / Print" always forced the plain black-and-white ATS
  text view regardless of the on-screen toggle, so the branded design never
  actually printed.
- Default print output now keeps the visual layout, teal/amber branding, and
  typography, re-themed onto a white background with print-safe contrast
  (darker teal/amber, dark text) — no dark background.
- Toggling "ATS view" first still gives the clean plain-text ATS export,
  optimised for print, on its own.

## Files changed (this pass)
- `src/content.config.ts` — new, defines the `skills` collection
- `src/content/skills/*.md` — new, starter skills taxonomy (14 entries)
- `src/lib/skills.ts` — new, tag/project resolver helpers
- `src/lib/schemas/experience.schema.ts` — `skills`/`projects` made optional
- `src/lib/schemas/education.schema.ts` — `skills`/`projects` made optional
- `src/lib/schemas/project.schema.ts` — added runtime Zod schema + optional `skills` field
- `src/lib/api.ts` — added `getProjects()`
- `src/components/Projects.astro` — new
- `src/components/Memberships.astro` — rewritten (was rendering a broken blog-card template)
- `src/components/Skills.astro` — cross-referenced against the skills collection, fixed markup/CSS mismatch
- `src/components/Experience.astro` — cross-referenced skills/projects, added "More detail" dropdown
- `src/components/Education.astro` — cross-referenced skills/projects, added "More detail" dropdown
- `src/components/AtsView.astro` — added Projects section
- `src/layouts/Layout.astro` — SEO meta pass
- `src/styles/global.css` — removed dead blog-card CSS, added membership/role-list/dropdown/skill-tag styles
- `src/data/nav.ts` — added Projects link
- `src/pages/index.astro` — added Projects section
- `README.md` — rewritten to match the actual (API-driven) architecture
