import { z } from "zod";

export const locationSchema = z.object({
  city: z.string(),
  country: z.string(),
});

export const experienceItemSchema = z.object({
  id: z.string(),
  organisation: z.string().nullish(),
  department: z.string().nullish(),
  role: z.string(),
  employmentType: z.string(),
  startDate: z.string(),
  endDate: z.string().nullish(),
  current: z.boolean(),
  location: locationSchema,
  workMode: z.string(),
  summary: z.string(),
  responsibilities: z.array(z.string()),
  achievements: z.array(z.string()),
  skills: z.array(z.string()),
  projects: z.array(z.string()),
  clients: z.array(z.string()),
  articles: z.array(z.string()),
  talks: z.array(z.string()),
  awards: z.array(z.string()),
  certifications: z.array(z.string()),
  technologies: z.array(z.string()),
  media: z.array(z.string()),
  featured: z.boolean(),
  order: z.number().int(),
});

export const experienceSchema = z.array(experienceItemSchema);

export type Location = z.infer<typeof locationSchema>;
export type ExperienceItem = z.infer<typeof experienceItemSchema>;
export type Experience = z.infer<typeof experienceSchema>;
