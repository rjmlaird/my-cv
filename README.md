# Ryan Laird — CV

Source for [cv.rjmlaird.co.uk](https://cv.rjmlaird.co.uk), built with [Astro](https://astro.build).

## Stack

- **Astro** (static output, no client-side framework needed)
- Content is fetched at build time from `api.rjmlaird.co.uk` and validated
  with Zod schemas (`src/lib/schemas/`) — see "Content" below
- One local **content collection** (`src/content/skills/`) for the skills
  taxonomy, defined in `src/content.config.ts`
- Plain CSS with design tokens (no Tailwind/build-step CSS framework — see `src/styles/global.css`)
- Fonts: Space Grotesk (display), Inter (body), JetBrains Mono (data/labels)

## Structure

```
src/
├── content.config.ts     # Defines the local `skills` content collection
├── content/
│   └── skills/            # One markdown file per skill (name, category,
│                           # description, etc.) — the canonical skills
│                           # taxonomy, referenced by slug from the API's
│                           # experience/education/project `skills` arrays
├── lib/
│   ├── api.ts             # Fetches + validates every collection from the API
│   ├── skills.ts           # Resolves raw skill/project tag strings against
│   │                        # the skills collection and the projects list
│   └── schemas/            # One Zod schema per API collection
├── layouts/
│   └── Layout.astro       # <head>, fonts, SEO meta, JSON-LD schema, global CSS
├── components/
│   ├── Nav.astro            # Sticky nav + ATS view toggle + print button
│   ├── Hero.astro
│   ├── Experience.astro
│   ├── Education.astro
│   ├── Projects.astro       # Cross-referenced from Experience/Education
│   ├── Skills.astro
│   ├── Certifications.astro
│   ├── Memberships.astro
│   ├── Languages.astro
│   ├── Research.astro
│   ├── Teaching.astro
│   ├── Awards.astro
│   ├── Causes.astro
│   ├── Volunteering.astro
│   ├── Contact.astro
│   ├── Footer.astro
│   └── AtsView.astro       # Plain-text single-column version, built from the
│                            # same API data, shown via the ATS toggle and
│                            # @media print
├── styles/
│   └── global.css          # All design tokens + component styles
└── pages/
    └── index.astro          # Assembles everything above
```

## Content

Almost everything on the page comes from `api.rjmlaird.co.uk` at build time
(see `src/lib/api.ts` for the full list of collections and endpoints). The
one exception is the **skills taxonomy**, which lives locally as a content
collection in `src/content/skills/*.md` so each skill gets a stable slug,
category, and optional description without needing an API round-trip.

**The Skills section is not manually curated.** It's built by scanning the
`skills` array on every experience, education, and project entry returned by
the API, deduping and counting the tags (`src/lib/skills.ts`,
`aggregateSkills`/`groupSkillsByCategory`) — a skill only appears if
something on the CV is actually tagged with it. The local skills collection
only supplies enrichment (category, description) when a tag matches a known
slug/name; it never adds a skill to the section on its own.

To tag a role, education entry, or project with a skill, add its slug (the
markdown filename, e.g. `sustainable-marketing`) to that item's `skills`
array in the API response. The field is optional — omit it and it just
doesn't contribute a tag. Unrecognised tags (a name that doesn't match a
slug in `src/content/skills/`) still show up in the Skills section (grouped
under "Other"), just without a description, so the site never breaks while
tags are being backfilled.

The same cross-referencing applies to `projects`: add a project's `slug`
(or its exact title) to an experience/education entry's `projects` array and
it renders as a link into the Projects section, once that project exists in
the API's `/projects` collection.

## Commands

Run these from the project root, in a terminal:

| Command             | Action                                       |
|----------------------|-----------------------------------------------|
| `pnpm install`        | Install dependencies                          |
| `pnpm dev`             | Start local dev server at `localhost:4321`    |
| `pnpm build`           | Build production site to `./dist/`            |
| `pnpm preview`         | Preview the production build locally          |
| `pnpm typecheck`       | Type-check `.astro`/`.ts` files and the content collection |

## Deploying

`pnpm build` outputs a fully static site to `dist/` — deploy it to Netlify,
Vercel, Cloudflare Pages, GitHub Pages, or any static host. Update `site` in
`astro.config.mjs` if the domain changes.

## ATS / print view

The "ATS view" button (and printing the page via Cmd/Ctrl+P) switches to a
plain black-on-white, single-column layout with proper heading hierarchy —
built for resume parsers and for producing a clean PDF.

## SEO

`Layout.astro` sets canonical URLs, Open Graph + Twitter card meta, and
`Person` JSON-LD structured data. Add a 1200×630 `og-image.png` to `public/`
to complete the social preview image (referenced but not yet included).
