import { z } from 'zod';

/**
 * Schema for updating a member's basic info and spheres
 */
export const updateMemberSchema = z.object({
  spheres: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        color: z.string(),
        desc: z.string(),
      })
    )
    .max(5)
    .optional(),
  setupDone: z.boolean().optional(),
  logs: z.any().optional(), // Allow logs to be updated through the general endpoint
  notes: z.any().optional(), // Allow notes to be updated through the general endpoint
}).strict();

/**
 * Schema for updating a single log entry
 */
export const updateLogSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  sphereId: z.string().max(50),
  completed: z.boolean(),
}).strict();

/**
 * Schema for adding a note
 */
export const addNoteSchema = z.object({
  content: z.string().max(1000),
  date: z.string(),
  sphereId: z.string().optional(),
}).strict();
