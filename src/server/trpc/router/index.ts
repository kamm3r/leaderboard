// src/server/router/index.ts
import { t } from '../trpc';
import { athletesRouter } from './athletes';

export const appRouter = t.router({
  athletes: athletesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
