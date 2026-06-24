import { z } from 'zod';

const imagePathSchema = z
  .string()
  .refine(
    (val) => val === '' || val.startsWith('/') || /^https?:\/\//.test(val),
    'URL ou chemin local invalide (ex: https://... ou /images/...)'
  );

export const projectSchema = z.object({
  title: z.string().min(1, 'Titre requis').max(100, 'Trop long'),
  description: z.string().min(1, 'Description requise').max(1000, 'Trop long'),
  image: imagePathSchema.optional(),
  tags: z.array(z.string()).min(1, 'Minimum 1 tag').max(20, 'Max 20 tags'),
  link: z.string().url('URL invalide').optional().or(z.literal('')),
  github: z.string().url('URL invalide').optional().or(z.literal('')),
  featured: z.boolean().optional().default(false),
});

export const projectUpdateSchema = projectSchema.partial().extend({
  id: z.union([z.string(), z.number()]),
});

export const skillSchema = z.object({
  name: z.string().min(1, 'Nom requis').max(50, 'Trop long'),
  category: z.string().min(1, 'Catégorie requise'),
  icon: z.string().min(1, 'Icône requise').max(10, 'Trop long'),
  description: z.string().max(500, 'Trop long').optional().or(z.literal('')),
  order: z.number().int().min(0).optional().default(0),
});

export const skillUpdateSchema = skillSchema.partial().extend({
  id: z.union([z.string(), z.number()]),
});

export const profileSchema = z.object({
  name: z.string().min(1, 'Nom requis').max(100, 'Trop long'),
  title: z.string().min(1, 'Titre requis').max(100, 'Trop long'),
  bio: z.string().min(1, 'Bio requise').max(1000, 'Trop long'),
  email: z.string().email('Email invalide'),
  phone: z.string().max(20, 'Trop long').optional().or(z.literal('')),
  location: z.string().max(100, 'Trop long').optional().or(z.literal('')),
  github: z.string().url('URL invalide').optional().or(z.literal('')),
  linkedin: z.string().url('URL invalide').optional().or(z.literal('')),
  twitter: z.string().url('URL invalide').optional().or(z.literal('')),
});

export const settingsSchema = z.object({
  defaultTheme: z.enum(['obsidian', 'nebula', 'emerald', 'crimson', 'amber', 'sapphire', 'rose']),
});

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Nom trop court').max(100, 'Nom trop long'),
  email: z.string().trim().email('Email invalide').max(200, 'Email trop long'),
  message: z.string().trim().min(10, 'Message trop court').max(2000, 'Message trop long'),
});

// Types
export type ProjectInput = z.infer<typeof projectSchema>;
export type ProjectUpdate = z.infer<typeof projectUpdateSchema>;
export type SkillInput = z.infer<typeof skillSchema>;
export type SkillUpdate = z.infer<typeof skillUpdateSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
