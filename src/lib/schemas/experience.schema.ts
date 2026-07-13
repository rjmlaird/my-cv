import { z } from "zod";

const organisationSchema = z
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

export const experienceItemSchema = z.object({
  id: z.string(),
  organisation: organisationSchema,
  department: z.string().optional(),
  role: z.string(),
  employmentType: z.string(),
  startDate: z.string(),
  endDate: z.string().nullable(),
  current: z.boolean(),
  city: z.string(),
  country: z.string(),
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

export const experienceSchema = z.array(experienceItemSchema);

export type ExperienceItem = z.infer<typeof experienceItemSchema>;
export type Experience = z.infer<typeof experienceSchema>;
