import { z } from 'zod';

export const addAthleteInput = z.object({
  firstName: z.string(),
  lastName: z.string(),
  club: z.string(),
  pb: z.string().optional(),
  sb: z.string().optional(),
});

export type AddAthleteInputType = z.infer<typeof addAthleteInput>;

export const addAttemptInput = z.object({
  attempt1: z.string(),
  athleteId: z.string().cuid()
});

export type AddAttemptInputType = z.infer<typeof addAttemptInput>;
