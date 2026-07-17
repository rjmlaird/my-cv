import { z } from "zod";

export const volunteeringItemSchema = z.object({
  id: z.string(),
  organisation: z.string(),
  role: z.string(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  current: z.boolean().default(false),
  city: z.string().optional(),
  country: z.string().optional(),
  summary: z.string().default(""),
  responsibilities: z.array(z.string()).default([]),
  achievements: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
  projects: z.array(z.string()).default([]),
  
  // Normalized support fields
  articles: z.array(z.string()).default([]),
  talks: z.array(z.string()).default([]),
  
  // Legacy/Extended support fields
  clients: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  media: z.array(z.string()).default([]),
  
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
  
  // Relational mappings
  relatedOrg: z.array(z.string()).default([]),
  relatedEducation: z.array(z.string()).default([]),
  relatedMemberships: z.array(z.string()).default([]),
  relatedCertifications: z.array(z.string()).default([]),
  relatedAwards: z.array(z.string()).default([]),
});

export const volunteeringSchema = z.array(volunteeringItemSchema).default([]);

export type VolunteeringItem = z.infer<typeof volunteeringItemSchema>;
export type Volunteering = z.infer<typeof volunteeringSchema>;