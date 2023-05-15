import { createTRPCRouter } from "./trpc";
import { athletesRouter } from "./router/athletes";
import { authRouter } from "./router/auth";

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
