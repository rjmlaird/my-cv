import { z } from "zod";

export const skillItemSchema = z.object({
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

export const skillsSchema = z.record(skillItemSchema).default({});

export type SkillItem = z.infer<typeof skillItemSchema>;
export type Skills = z.infer<typeof skillsSchema>;

/* Optional sample data */
export const skills: Skills = {
  typescript: {
    name: "TypeScript",
    category: "Development",
    proficiency: "Expert",
    years: 6,
    featured: true,
  },
  astro: {
    name: "Astro",
    category: "Development",
    proficiency: "Advanced",
    years: 3,
    featured: true,
  },
  react: {
    name: "React",
    category: "Development",
    proficiency: "Advanced",
    years: 5,
  },
};
