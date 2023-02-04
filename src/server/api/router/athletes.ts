import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  addAthleteInput,
  addAttemptInput,
} from "../../../shared/add-athlete-validator";
import { prisma } from "../../db";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const athletesRouter = createTRPCRouter({
  addAthlete: publicProcedure
    .input(addAthleteInput)
    .mutation(async ({ input }) => {
      const addAthlete = await prisma.athlete.create({
        data: {
          name: input.firstName + " " + input.lastName,
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
  getAthlete: publicProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .query(async ({ input }) => {
      const results = await prisma.athlete.findUnique({
        where: { id: input.id },
      });
      return results;
    }),
  addAttempt: publicProcedure
    .input(addAttemptInput)
    .mutation(async ({ input }) => {
      const attempt = await prisma.attempt.create({
        data: { ...input },
        select: { athleteId: true },
      });
      return attempt;
    }),
  edit: publicProcedure
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
          message: "NOT YOUR ATTEMPT",
          code: "UNAUTHORIZED",
        });
      }
      return edit;
    }),
  pin: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const athlete = await prisma.athlete.findFirst({
        where: { id: input.id },
      });
      if (athlete?.id !== ctx.session.user.id) {
        throw new TRPCError({
          message: "NOT YOUR ATTEMPT",
          code: "UNAUTHORIZED",
        });
      }
      return athlete;
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .mutation(async ({ input }) => {
      const removeAttempts = prisma.attempt.deleteMany({
        where: { athleteId: input.id },
      });
      const removeAthlete = prisma.athlete.delete({
        where: { id: input.id },
      });
      const remove = await prisma.$transaction([removeAttempts, removeAthlete]);
      return remove;
    }),
  deleteAll: publicProcedure.mutation(async () => {
    const removeAttempts = prisma.attempt.deleteMany();
    const removeAthletes = prisma.athlete.deleteMany();
    const remove = await prisma.$transaction([removeAttempts, removeAthletes]);
    return remove;
  }),
});

export type resultsRouter = typeof athletesRouter;
