import { TRPCError } from '@trpc/server';
import EventEmitter from 'events';
import { z } from 'zod';
import { t } from '../trpc';
import { prisma } from '../../db/client';
import { observable } from '@trpc/server/observable';
import { addAthleteInput } from '../../../shared/add-athlete-validator';
import { Prisma } from '@prisma/client';

type Result = {
  attempt: number
}

const athleteValidator = Prisma.validator<Prisma.AttemptSelect>()
const ee = new EventEmitter();

export const athletesRouter = t.router({
  addAthlete: t.procedure.input(addAthleteInput).mutation(async ({ input }) => {
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
  getAll: t.procedure.query(async () => {
    const results = await prisma.athlete.findMany({
      include: { attempts: true },
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
        attempt1: z.string(),
        athleteId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const attempt = await prisma.attempt.create({
        data: { ...input },
        select: { Athlete: true }
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
  edit: t.procedure
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
  // achive: t.procedure
  //   .input(
  //     z.object({
  //       id: z.string().cuid(),
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

export type resultsRouter = typeof athletesRouter;
