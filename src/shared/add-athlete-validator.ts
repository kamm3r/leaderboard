import { z } from 'zod';

export const addAthleteInput = z.object({
  firstName: z.string(),
  lastName: z.string(),
  club: z.string(),
  pb: z.number().optional(),
  sb: z.number().optional(),
});

export type AddAthleteInputType = z.infer<typeof addAthleteInput>;
