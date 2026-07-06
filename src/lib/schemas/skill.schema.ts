import { z } from "zod";

export const skillSchema = z.object({
  name: z.string(),

  category: z.string(),

  proficiency: z.enum([
    "Beginner",
    "Intermediate",
    "Advanced",
    "Expert",
  ]),

  years: z.number().optional(),

  featured: z.boolean().default(false),
});

export type Skill = z.infer<typeof skillSchema>;