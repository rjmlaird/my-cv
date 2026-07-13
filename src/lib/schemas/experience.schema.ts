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
  responsibilities: z.array(z.string()).optional().default([]),
  achievements: z.array(z.string()).optional().default([]),
  skills: z.array(z.string()).optional().default([]),
  projects: z.array(z.string()).optional().default([]),
  clients: z.array(z.string()).optional().default([]),
  articles: z.array(z.string()).optional().default([]),
  talks: z.array(z.string()).optional().default([]),
  technologies: z.array(z.string()).optional().default([]),
  media: z.array(z.string()).optional().default([]),
  featured: z.boolean(),
  order: z.number().int(),
});

export const experienceSchema = z.array(experienceItemSchema);
export type ExperienceItem = z.infer<typeof experienceItemSchema>;
export type Experience = z.infer<typeof experienceSchema>;
