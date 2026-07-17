import { z } from 'zod';

// Schema for an individual tool
export const ToolSchema = z.object({
  name: z.string().trim().min(1),
  url: z.url(),
  logo: z.string().trim(),
  // Accepts 6-char hex, optionally with a leading '#'
  color: z.string().regex(/^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: "Must be a valid hex color code (e.g., #FFFFFF or FFFFFF)",
  }),
  logoColor: z.string().optional().nullable(),
});

// Schema for a category of tools
export const ToolCategorySchema = z.object({
  name: z.string().trim().min(1),
  items: z.array(ToolSchema),
});

// Schema for the root structure
export const ToolDataSchema = z.object({
  categories: z.array(ToolCategorySchema),
});

// TypeScript type inference
export type Tool = z.infer<typeof ToolSchema>;
export type ToolCategory = z.infer<typeof ToolCategorySchema>;
export type ToolData = z.infer<typeof ToolDataSchema>;

/**
 * Helper to validate raw data safely.
 * Returns the typed data or throws a descriptive error.
 */
export const validateTools = (data: unknown): ToolData => {
  return ToolDataSchema.parse(data);
};