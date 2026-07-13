import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Canonical skills taxonomy. Each entry is a single tag/skill that can be
// referenced by slug (the filename, e.g. "sustainable-marketing") from the
// `skills` arrays returned by the API for experience, education, and
// projects. Keeping this local (rather than API-driven) means the tag set
// is version-controlled, gets its own anchor + description on the Skills
// section, and degrades gracefully: any tag string from the API that has no
// matching entry here just renders as plain text instead of a linked pill.
const skills = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/skills" }),
  schema: z.object({
    name: z.string(),
    category: z.enum([
      "Marketing & Communications",
      "Space Sector",
      "Sustainability",
      "Science Communication",
      "Leadership & Strategy",
      "Web & Development",
      "Data & Research",
    ]),
    proficiency: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]).optional(),
    years: z.number().optional(),
    featured: z.boolean().default(false),
    description: z.string().optional(),
    relatedSkills: z.array(z.string()).default([]),
  }),
});

export const collections = { skills };
