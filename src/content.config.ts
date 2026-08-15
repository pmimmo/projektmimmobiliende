import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const certificationSchema = z.object({
  title: z.string(),
  desc: z.string(),
  issuer: z.string().optional(),
  category: z.enum(['certification', 'membership', 'platform', 'education']),
  holder: z.string().optional(),
  belongsTo: z.array(z.string()).default([]),
  link: z.string().optional(),
  visibleOnStartPage: z.boolean().default(true),
});

const peopleSchema = z.object({
  name: z.string(),
  jobTitle: z.string(),
  role: z.enum(['owner', 'team']),
  locations: z.array(z.string()).default([]),
  serviceFocus: z.array(z.string()).default([]),
  certifications: z.array(z.string()).default([]),
  image: z.string().optional(),
  shortBio: z.string().optional(),
  showDetailPage: z.boolean().default(false),
});

const serviceSchema = z.object({
  title: z.string(),
  shortTitle: z.string().optional(),
  status: z.enum(['active', 'planned']).default('active'),
  locations: z.array(z.string()).default([]),
  relatedCertifications: z.array(z.string()).default([]),
  relatedPeople: z.array(z.string()).default([]),
  primarySearchIntent: z.string(),
  previewPage: z.boolean().default(false),
});

const locationSchema = z.object({
  title: z.string(),
  region: z.string(),
  office: z.boolean().default(false),
  services: z.array(z.string()).default([]),
  relatedPeople: z.array(z.string()).default([]),
  previewPage: z.boolean().default(false),
});

export const collections = {
  certifications: defineCollection({
    loader: glob({ pattern: '**/*.json', base: './src/content/certifications' }),
    schema: certificationSchema,
  }),
  people: defineCollection({
    loader: glob({ pattern: '**/*.json', base: './src/content/people' }),
    schema: peopleSchema,
  }),
  services: defineCollection({
    loader: glob({ pattern: '**/*.json', base: './src/content/services' }),
    schema: serviceSchema,
  }),
  locations: defineCollection({
    loader: glob({ pattern: '**/*.json', base: './src/content/locations' }),
    schema: locationSchema,
  }),
};
