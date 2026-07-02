# Ryan Laird — CV

Source for [cv.rjmlaird.co.uk](https://cv.rjmlaird.co.uk), built with [Astro](https://astro.build).

## Stack

- **Astro** (static output, no client-side framework needed)
- Plain CSS with design tokens (no Tailwind/build-step CSS framework — see `src/styles/global.css`)
- Fonts: Space Grotesk (display), Inter (body), JetBrains Mono (data/labels)

## Structure

```
src/
├── data/            # All CV content lives here as typed .ts files.
│   ├── profile.ts       # Name, summary, tags, contact links, nav links
│   ├── experience.ts     # Work history (timeline)
│   ├── education.ts
│   ├── skills.ts
│   ├── certifications.ts
│   ├── memberships.ts
│   ├── languages.ts
│   ├── awards.ts          # Also exports causes, teaching, research
│   └── volunteering.ts
├── layouts/
│   └── Layout.astro     # <head>, fonts, JSON-LD schema, global CSS import
├── components/
│   ├── Nav.astro          # Sticky nav + ATS view toggle + print button
│   ├── Hero.astro
│   ├── Experience.astro
│   ├── Education.astro
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
│   └── AtsView.astro     # Plain-text single-column version, built from the
│                          # same data files, shown via the ATS toggle and
│                          # @media print
├── styles/
│   └── global.css        # All design tokens + component styles
└── pages/
    └── index.astro        # Assembles everything above
```

## Updating content

Everything you'd normally edit lives in `src/data/*.ts` — add a role, a
certification, a membership, etc. there and it flows through to both the
visual site and the ATS/print view automatically, since `AtsView.astro`
reads from the same files rather than duplicating content.

## Commands

Run these from the project root, in a terminal:

| Command             | Action                                       |
|----------------------|-----------------------------------------------|
| `npm install`        | Install dependencies                          |
| `npm run dev`         | Start local dev server at `localhost:4321`    |
| `npm run build`       | Build production site to `./dist/`            |
| `npm run preview`     | Preview the production build locally          |

## Deploying

`npm run build` outputs a fully static site to `dist/` — deploy it to
Netlify, Vercel, Cloudflare Pages, GitHub Pages, or any static host. Update
`site` in `astro.config.mjs` if the domain changes.

## ATS / print view

The "ATS view" button (and printing the page via Cmd/Ctrl+P) switches to a
plain black-on-white, single-column layout with proper heading hierarchy —
built for resume parsers and for producing a clean PDF.
