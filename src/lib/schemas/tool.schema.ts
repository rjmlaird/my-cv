import { z } from "zod";

export const toolItemSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  logo: z.string(),
  color: z.string(),
  logoColor: z.string().optional(),
});

export const toolCategorySchema = z.object({
  name: z.string(),
  items: z.array(toolItemSchema),
});

export const techStackSchema = z.object({
  categories: z.array(toolCategorySchema),
});

export type ToolItem = z.infer<typeof toolItemSchema>;
export type ToolCategory = z.infer<typeof toolCategorySchema>;
export type TechStack = z.infer<typeof techStackSchema>;
