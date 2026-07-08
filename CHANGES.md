# Changes made

## Content bugs fixed
- `Research.astro` was accidentally rendering the Teaching data (copy-paste bug),
  so the real research content never appeared, "Teaching" showed twice, and the
  `#research` nav anchor was dead. Now renders your actual research paragraphs + ORCID.
- Nav bar was missing links to Research, Awards, and Volunteering sections that
  exist on the page. Added.
- `Awards.astro` and the ATS view referenced a `.label` field that doesn't exist
  on the award schema (real fields: `title`, `issuer`, `date`, `description`) —
  every award would have rendered as `undefined`. Fixed.
- `Memberships.astro` expected a `{title, items}` grouping that doesn't match the
  real (flat) membership schema (`organisation`, `role`, `type`). Rewritten to
  group by membership type correctly.
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

## Files changed
- `src/components/Research.astro` — fixed content bug
- `src/components/Awards.astro` — fixed field mismatch
- `src/components/Memberships.astro` — rewritten to match real schema
- `src/components/AtsView.astro` — rewritten, multiple fixes
- `src/data/profile.ts` — added missing nav links
- `src/pages/index.astro` — reordered sections (Research/Teaching now follow Education)
- `src/styles/global.css` — new print theme
- Removed: `src/lib/data.ts`, `src/data/{experience,education,skills,certifications,memberships}.ts`
