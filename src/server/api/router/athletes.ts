import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { pusherServerClient } from "~/server/pusher";

const addAthleteInput = z.object({
  firstName: z.string(),
  lastName: z.string(),
  club: z.string(),
  pb: z.string().optional().default(""),
  sb: z.string().optional().default(""),
});
 
const addAttemptInput = z.object({
  attempt1: z.string(),
  athleteId: z.string().cuid(),
});

export const athletesRouter = createTRPCRouter({
  addAthlete: publicProcedure
    .input(addAthleteInput)
    .mutation(async ({ ctx, input }) => {
      const addAthlete = await ctx.db.athlete.create({
        data: {
          name: input.firstName + " " + input.lastName,
          club: input.club,
          PB: input.pb,
          SB: input.sb,
        },
      });

      return addAthlete;
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    const results = await ctx.db.athlete.findMany({
      include: { attempts: true },
    });
    return results;
  }),
  getAthlete: publicProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const results = await ctx.db.athlete.findUnique({
        where: { id: input.id },
      });
      return results;
    }),
  addAttempt: publicProcedure
    .input(addAttemptInput)
    .mutation(async ({ ctx, input }) => {
      const attempt = await ctx.db.attempt.create({
        data: { ...input },
        select: { athleteId: true },
      });
      return attempt;
    }),
  edit: publicProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const edit = await ctx.db.athlete.findFirst({
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
      const athlete = await ctx.db.athlete.findFirst({
        where: { id: input.id },
      });
      if (athlete?.id !== ctx.session.user.id) {
        throw new TRPCError({
          message: "NOT YOUR ATTEMPT",
          code: "UNAUTHORIZED",
        });
      }
      await pusherServerClient.trigger(`user-${athlete.id}`, "athlete-pinned", {
        athlete,
      });
      return athlete;
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const removeAttempts = ctx.db.attempt.deleteMany({
        where: { athleteId: input.id },
      });
      const removeAthlete = ctx.db.athlete.delete({
        where: { id: input.id },
      });
      const remove = await ctx.db.$transaction([removeAttempts, removeAthlete]);
      return remove;
    }),
  deleteAll: publicProcedure.mutation(async ({ ctx }) => {
    const removeAttempts = ctx.db.attempt.deleteMany();
    const removeAthletes = ctx.db.athlete.deleteMany();
    const remove = await ctx.db.$transaction([removeAttempts, removeAthletes]);
    return remove;
  }),
});
