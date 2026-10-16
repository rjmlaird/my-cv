// lib/schemas/organisation-refs.schema.ts
// One vocabulary for "which organisation is this content about", shared by every content type.
// Names are resolved through the registry (organisations.json); never store organisation names inline.
import { z } from "zod";

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const organisationRefsSchema = z.object({
  /** Primary organisation: employer, issuer, publisher, organiser, institution. */
  organisationSlug: slug.optional(),
  /** Further organisations alongside the primary one (joint issuers, co-clients). */
  additionalOrganisationSlugs: z.array(slug).default([]),
  /** Who the work was done for (projects, videos, case studies, events, awards). */
  clientOrganisationSlug: slug.optional(),
});

/** Events only: venue/host and co-organising bodies. */
export const eventOrganisationRefsSchema = organisationRefsSchema.extend({
  hostOrganisationSlugs: z.array(slug).default([]),
  coOrganisationSlugs: z.array(slug).default([]),
  /** Only when the organiser is a person rather than an organisation. */
  organiser: z.string().optional(),
});

// Usage: projectSchema.extend(organisationRefsSchema.shape) and drop the old
// `client`, `organisation` and `institution` string fields from projectSchema.
