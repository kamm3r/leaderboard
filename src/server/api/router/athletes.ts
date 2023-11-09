import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { pusherServerClient } from "~/server/pusher";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const addAthleteInput = z.object({
  firstName: z.string(),
  lastName: z.string(),
  club: z.string(),
  pb: z.string().optional().default(""),
  sb: z.string().optional().default(""),
});

export type AddAthleteInputType = z.infer<typeof addAthleteInput>;

export const addAttemptInput = z.object({
  attempt1: z.string(),
  athleteId: z.string().cuid(),
});

export type AddAttemptInputType = z.infer<typeof addAttemptInput>;

export const athletesRouter = createTRPCRouter({
  addAthlete: publicProcedure
    .input(addAthleteInput)
    .mutation(async ({ ctx, input }) => {
      const addAthlete = await ctx.athlete.create({
        data: {
          name: input.firstName + " " + input.lastName,
          club: input.club,
          PB: input.pb,
          SB: input.sb,
        },
      });

      return addAthlete;
    }),
  getAll: publicProcedure.query(async ({ctx}) => {
    const results = await ctx.athlete.findMany({
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
    .query(async ({ctx, input }) => {
      const results = await ctx.athlete.findUnique({
        where: { id: input.id },
      });
      return results;
    }),
  addAttempt: publicProcedure
    .input(addAttemptInput)
    .mutation(async ({ ctx,input }) => {
      const attempt = await ctx.attempt.create({
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
    .mutation(async ({ ctx,input }) => {
      const edit = await ctx.athlete.findFirst({
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
      const athlete = await ctx.athlete.findFirst({
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
      })
    )
    .mutation(async ({ctx, input }) => {
      const removeAttempts = ctx.attempt.deleteMany({
        where: { athleteId: input.id },
      });
      const removeAthlete = ctx.athlete.delete({
        where: { id: input.id },
      });
      const remove = await ctx.$transaction([removeAttempts, removeAthlete]);
      return remove;
    }),
  deleteAll: publicProcedure.mutation(async ({ctx}) => {
    const removeAttempts = ctx.attempt.deleteMany();
    const removeAthletes = ctx.athlete.deleteMany();
    const remove = await ctx.$transaction([removeAttempts, removeAthletes]);
    return remove;
  }),
});

export type resultsRouter = typeof athletesRouter;
