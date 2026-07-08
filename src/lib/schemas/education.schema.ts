import { z } from "astro/zod";

export const educationItemSchema = z.object({
  id: z.string(),
  institution: z.string(),
  role: z.string(),
  qualification: z.string(),
  field: z.string().optional(),
  institutionType: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().nullable().default(null),
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
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
});

export const educationSchema = z.array(educationItemSchema).default([]);

export type EducationItem = z.infer<typeof educationItemSchema>;
export type Education = z.infer<typeof educationSchema>;
