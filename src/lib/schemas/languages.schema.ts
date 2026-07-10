import { z } from "zod";

export const languageItemSchema = z.object({
  name: z.string(),
  level: z.string(),
  proficiency: z.number().int().min(0).max(100),
});

export const languagesSchema = z.array(languageItemSchema).default([]);

export type LanguageItem = z.infer<typeof languageItemSchema>;
export type Languages = z.infer<typeof languagesSchema>;

export const languages: Languages = [
  { name: "English", level: "C2 — Native", proficiency: 100 },
  { name: "French", level: "B1 — Intermediate", proficiency: 55 },
  { name: "Spanish", level: "B1 — Intermediate", proficiency: 55 },
  { name: "German", level: "A2 — Basic", proficiency: 30 },
];
