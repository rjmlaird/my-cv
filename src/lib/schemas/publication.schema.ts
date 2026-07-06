import { z } from "zod";
import { baseSchema } from "./base.schema";

export const publicationSchema = baseSchema.extend({
  outlet: z.string(),

  type: z.enum([
    "Article",
    "Podcast",
    "Interview",
    "Paper",
    "Press Release",
  ]),

  author: z.string(),

  published: z.string(),

  url: z.string().url(),
});

export type Publication = z.infer<typeof publicationSchema>;