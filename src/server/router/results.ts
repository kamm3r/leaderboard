import { TRPCError } from '@trpc/server';
import EventEmitter from 'events';
import { z } from 'zod';
import { t } from '../trpc';
import { prisma } from '../db/client';
import { observable } from '@trpc/server/observable';
import { addAthleteInput } from '../../shared/add-athlete-validator';

type Result = {
  attempt: number;
};

const ee = new EventEmitter();

export const resultsRouter = t.router({
  addAthlete: t.procedure.input(addAthleteInput).mutation(async ({ input }) => {
    const addAthlete = await prisma.athlete.create({
      data: {
        athleteName: input.firstName + ' ' + input.lastName,
        club: input.club,
        PB: input.pb,
        SB: input.sb,
      },
    });

    return addAthlete;
  }),
  getAllAthletes: t.procedure.query(async () => {
    const athletes = await prisma.athlete.findMany({
      include: { result: true },
    });
    return athletes;
  }),
  getAllAttempts: t.procedure.query(async () => {
    const results = await prisma.result.findMany({
      include: { athlete: true, attempts: true },
    });
    return results;
  }),
  onAddAttempt: t.procedure.subscription(() => {
    return observable<Result>((emit) => {
      const onAdd = (data: Result) => emit.next(data);
      ee.on('addAttempt', onAdd);
      return () => {
        ee.off('addAttempt', onAdd);
      };
    });
  }),
  addAttempt: t.procedure
    .input(
      z.object({
        id: z.number().optional(),
        attempt1: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const attempt = await prisma.attempt.create({
        data: { ...input },
      });
      ee.emit('addResult', attempt);
      // const result = await prisma.result;
      return attempt;
    }),
  // isTyping: t.procedure
  //   .input(z.object({ typing: z.boolean() }))
  //   .mutation(({ input, ctx }) => {
  //     const name = 'dude';
  //     if (!input.typing) {
  //       delete currentlyTyping[name];
  //     } else {
  //       currentlyTyping[name] = {
  //         lastTyped: new Date(),
  //       };
  //     }
  //     ee.emit('isTypingUpdate');
  //   }),
  pin: t.procedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const edit = await prisma.result.findFirst({
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
  edit: t.procedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const edit = await prisma.result.findFirst({
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
  // achive: t.procedure
  //   .input(
  //     z.object({
  //       id: z.number(),
  //     })
  //   )
  //   .mutation(async ({ input }) => {
  //     const edit = await prisma.result.updateMany({
  //       where: { id: input.id },
  //       data: {
  //         status: 'COMPLETED',
  //       },
  //     });
  //   }),
  unpin: t.procedure.mutation(async () => {
    return 'unpin';
  }),
});

export type resultsRouter = typeof resultsRouter;
