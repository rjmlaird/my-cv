/**
 * ============================================================================
 * src/lib/schemas/index.ts
 * ----------------------------------------------------------------------------
 * Central export for all Zod schemas and inferred TypeScript types.
 *
 * Import throughout the application using:
 *
 *   import { projectSchema, profileSchema } from "@/lib/schemas";
 *
 * ============================================================================
 */

// Base
export * from "./base.schema";

// Personal
export * from "./profile.schema";
export * from "./personal.schema";
export * from "./contact.schema";

// Professional
export * from "./experience.schema";
export * from "./education.schema";
export * from "./project.schema";
export * from "./initiative.schema";
export * from "./publication.schema";
export * from "./article.schema";

// Skills & Credentials
export * from "./skill.schema";
export * from "./service.schema";
export * from "./tool.schema";
export * from "./certification.schema";
export * from "./award.schema";
export * from "./achievement.schema";
export * from "./languages.schema";

// Community
export * from "./organisation.schema";
export * from "./membership.schema";
export * from "./event.schema";
export * from "./review.schema";

// Navigation
export * from "./navigation.schema";