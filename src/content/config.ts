import { defineCollection, z } from "astro:content";

const date = z
  .string()
  .or(z.date())
  .transform((val) => new Date(val));

const jobPositions = defineCollection({
  schema: z.object({
    title: z.string(),
    organization: z.string(),
    orgURL: z.string().url(),
    from: date,
    to: date.optional(),
  }),
});

const institutePositions = defineCollection({
  schema: z.object({
    title: z.string(),
    organization: z.string(),
    orgURL: z.string().url(),
    from: date,
    to: date.optional(),
  }),
});

const volunteerActivities = defineCollection({
  schema: z.object({
    title: z.string(),
    organization: z.string(),
    orgURL: z.string().url(),
    from: date,
    to: date.optional(),
  }),
});

export const collections = {
  ["job-positions"]: jobPositions,
  ["education"]: institutePositions,
  ["volunteer-activities"]: volunteerActivities,
};
