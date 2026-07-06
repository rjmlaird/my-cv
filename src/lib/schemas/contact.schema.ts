import { z } from "zod";

export const contactSchema = z.object({
  email: z.string().email(),

  phone: z.string().optional(),

  location: z.string().optional(),

  timezone: z.string().optional(),

  preferredContactMethod: z.enum([
    "email",
    "phone",
    "linkedin",
  ]).optional(),

  availability: z.string().optional(),
});

export type Contact = z.infer<typeof contactSchema>;