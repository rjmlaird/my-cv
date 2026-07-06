import { z } from "zod";
import { baseSchema } from "./base.schema";

export const articleSchema = baseSchema.extend({
  source: z.string().optional(),

  author: z.string().optional(),

  publishedAt: z.string().optional(),

  url: z.string().url().optional(),

  readingTime: z.number().optional(),

  topics: z.array(z.string()).default([]),
});

export type Article = z.infer<typeof articleSchema>;