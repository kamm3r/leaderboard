import { athletesRouter } from "./router/athletes";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  athletes: athletesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
