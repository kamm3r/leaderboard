import { TRPCError } from '@trpc/server';
import EventEmitter from 'events';
import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { prisma } from '../../db/client';
import { observable } from '@trpc/server/observable';
import { addAthleteInput, addAttemptInput } from '../../../shared/add-athlete-validator';

type Result = {
  attempt: number
}

const ee = new EventEmitter();

const currentlyTyping: Record<string, { lastTyped: Date }> =
  Object.create(null);

export const athletesRouter = router({
  addAthlete: publicProcedure.input(addAthleteInput).mutation(async ({ input }) => {
    const addAthlete = await prisma.athlete.create({
      data: {
        name: input.firstName + ' ' + input.lastName,
        club: input.club,
        PB: input.pb,
        SB: input.sb,
      },
    });

    return addAthlete;
  }),
  getAll: publicProcedure.query(async () => {
    const results = await prisma.athlete.findMany({
      include: { attempts: true },
    });
    return results;
  }),
  getAthlete: publicProcedure.input(z.object({
    id: z.string().cuid(),
  })).query(async ({ input }) => {
    const results = await prisma.athlete.findUnique({
      where: { id: input.id }
    });
    return results;
  }),
  onAddAttempt: publicProcedure.subscription(() => {
    return observable<Result>((emit) => {
      const onAdd = (data: Result) => emit.next(data);
      ee.on('addAttempt', onAdd);
      return () => {
        ee.off('addAttempt', onAdd);
      };
    });
  }),
  addAttempt: publicProcedure
    .input(addAttemptInput)
    .mutation(async ({ input }) => {
      const name = 'dude'
      const attempt = await prisma.attempt.create({
        data: { ...input },
        select: { athleteId: true }
      });
      ee.emit('addResult', attempt);
      delete currentlyTyping[name]
      ee.emit('isTypingUpdate')
      return attempt;
    }),
  isTyping: publicProcedure
    .input(z.object({ typing: z.boolean() }))
    .mutation(({ input }) => {
      const name = 'dude';
      if (!input.typing) {
        delete currentlyTyping[name];
      } else {
        currentlyTyping[name] = {
          lastTyped: new Date(),
        };
      }
      ee.emit('isTypingUpdate');
    }),
  pin: publicProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .mutation(async ({ input }) => {
      const edit = await prisma.athlete.findFirst({
        where: { id: input.id },
      });
      if (!edit) {
        throw new TRPCError({
          message: 'NOT YOUR ATTEMPT',
          code: 'UNAUTHORIZED',
        });
      }
      return edit;
    }),
  edit: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .mutation(async ({ input }) => {
      const edit = await prisma.athlete.findFirst({
        where: { id: input.id },
      });
      if (!edit) {
        throw new TRPCError({
          message: 'NOT YOUR ATTEMPT',
          code: 'UNAUTHORIZED',
        });
      }
      return edit;
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .mutation(async ({ input }) => {
      const removeAttempts = prisma.attempt.deleteMany({
        where: { athleteId: input.id }
      })
      const removeAthlete = prisma.athlete.delete({
        where: { id: input.id },
      })
      const remove = await prisma.$transaction([removeAttempts, removeAthlete])
      if (!remove) {
        throw new TRPCError({
          message: 'NOT YOUR ATTEMPT',
          code: 'UNAUTHORIZED',
        });
      }
      return remove
    }),
  deleteAll: publicProcedure
    .mutation(async () => {
      const removeAttempts = prisma.attempt.deleteMany()
      const removeAthletes = prisma.athlete.deleteMany()
      const remove = await prisma.$transaction([removeAttempts, removeAthletes])
      if (!remove) {
        throw new TRPCError({
          message: 'NOT YOUR ATTEMPT',
          code: 'UNAUTHORIZED',
        });
      }
      return remove
    }),
});

export type resultsRouter = typeof athletesRouter;
