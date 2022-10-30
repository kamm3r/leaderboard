// src/server/router/index.ts
import { router } from '../trpc';
import { athletesRouter } from './athletes';

export const appRouter = router({
  athletes: athletesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
