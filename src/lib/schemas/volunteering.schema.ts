import { z } from "astro/zod";

export const volunteeringItemSchema = z.object({
  id: z.string(),
  organisation: z.string(),
  role: z.string(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  current: z.boolean().default(false),
  city: z.string().default(""),
  country: z.string().default(""),
  summary: z.string().default(""),
  responsibilities: z.array(z.string()).default([]),
  achievements: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
  projects: z.array(z.string()).default([]),
  clients: z.array(z.string()).default([]),
  articles: z.array(z.string()).default([]),
  talks: z.array(z.string()).default([]),
  awards: z.array(z.string()).default([]),
  certifications: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  media: z.array(z.string()).default([]),
  employmentType: z.string().default("Volunteer"),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
});

export const volunteeringSchema = z.array(volunteeringItemSchema).default([]);

export type VolunteeringItem = z.infer<typeof volunteeringItemSchema>;
export type Volunteering = z.infer<typeof volunteeringSchema>;
