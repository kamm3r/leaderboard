// src/server/router/index.ts
import { t } from '../trpc';
import { resultsRouter } from './results';

export const appRouter = t.router({
  result: resultsRouter,
});

export type AppRouter = typeof appRouter;
