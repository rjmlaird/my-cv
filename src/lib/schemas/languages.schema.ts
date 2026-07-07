import { z } from "zod";

export const languageItemSchema = z.object({
  name: z.string(),
  level: z.string(),
  proficiency: z.number(),
});

export type LanguageItem = z.infer<typeof languageItemSchema>;
