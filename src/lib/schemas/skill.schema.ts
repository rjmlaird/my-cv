import { z } from "zod";

export const skillItemSchema = z.object({
  name: z.string(),
  category: z.string(),
  proficiency: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]),
  years: z.number().optional(),
  featured: z.boolean().default(false),
});

export const skillsSchema = z.record(z.string(), skillItemSchema).default({});

export type SkillItem = z.infer<typeof skillItemSchema>;
export type Skills = z.infer<typeof skillsSchema>;
