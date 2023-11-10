import { athletesRouter } from "~/server/api/router/athletes";
import { authRouter } from "~/server/api/router/auth";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  athletes: athletesRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
