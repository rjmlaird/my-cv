import { z } from "zod";

export const membershipItemSchema = z.object({
  organisation: z.string(),
  slug: z.string(),
  organisationSlug: z.string(),
  role: z.string(),
  type: z.enum([
    "chartered_body",
    "professional_body",
    "scientific_body",
    "security_body",
    "industry_association",
    "climate_network",
    "research_network",
    "media_network",
    "creative_network",
    "space_network",
    "urban_network",
    "sustainability_network",
    "business_association",
    "startup_network",
    "community_network",
    "ethics_framework",
    "education_network",
    "framework_network",
    "economic_network",
    "advocacy_network",
    "climate_lab",
    "industry_initiative",
    "nonprofit_network",
    "ethics_network",
    "business_climate_network",
    "urban_innovation_network",
  ]),
  description: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  links: z
    .object({
      website: z.string().url().optional(),
      profile: z.string().url().optional(),
    })
    .optional(),
  activeFrom: z.string().optional(),
  activeTo: z.string().optional(),
  verified: z.boolean().optional(),
});

export type MembershipItem = z.infer<typeof membershipItemSchema>;
