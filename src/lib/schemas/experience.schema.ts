import { z } from "zod";

// Legacy shape, still accepted so older API payloads keep working.
const legacyOrganisationSchema = z
  .union([
    z.object({
      name: z.string().optional(),
      slug: z.string().optional(),
    }),
    z.string(),
  ])
  .nullish();

const locationSchema = z
  .object({
    city: z.string().optional(),
    country: z.string().optional(),
  })
  .nullish();

export const experienceSourceSchema = z.object({
  id: z.string(),
  /** Employer (registry slug). Optional for self-employed / unattributed roles. */
  organisationSlug: z.string().optional(),
  // Legacy field, superseded by `organisationSlug`; normalised in `experienceItemSchema` below.
  organisation: legacyOrganisationSchema,
  department: z.string().optional(),
  role: z.string(),
  employmentType: z.string(),
  startDate: z.string(),
  endDate: z.string().nullable(),
  current: z.boolean(),
  // Keep these as optional if some legacy items don't have them
  city: z.string().optional(),
  country: z.string().optional(),
  workMode: z.string().optional(),
  location: locationSchema.optional(),
  summary: z.string(),
  responsibilities: z.array(z.string()).default([]),
  achievements: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
  projects: z.array(z.string()).default([]),
  clients: z.array(z.string()).default([]),
  articles: z.array(z.string()).default([]),
  talks: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  media: z.array(z.string()).default([]),
  featured: z.boolean(),
  order: z.number().int(),
  relatedOrg: z.array(z.string()).default([]),
  relatedEducation: z.array(z.string()).default([]),
  relatedMemberships: z.array(z.string()).default([]),
  relatedCertifications: z.array(z.string()).default([]),
  relatedAwards: z.array(z.string()).default([]),
});

/**
 * Normalises the organisation reference: prefers `organisationSlug`, otherwise
 * falls back to the legacy `organisation` ({ name, slug } or a plain string).
 * The name is kept only so it can be matched against the registry.
 */
export const experienceItemSchema = experienceSourceSchema.transform(
  ({ organisation, organisationSlug, ...rest }) => {
    const legacy = typeof organisation === "string" ? { name: organisation } : (organisation ?? {});

    return {
      ...rest,
      organisationSlug: organisationSlug ?? legacy.slug,
      legacyOrganisationName: legacy.name,
    };
  },
);

export const experienceSchema = z.array(experienceItemSchema);

export type ExperienceItem = z.infer<typeof experienceItemSchema>;
export type Experience = z.infer<typeof experienceSchema>;