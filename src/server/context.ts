import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { prisma } from '../server/db/client';

export async function createContext(opts?: trpcNext.CreateNextContextOptions) {
  return {
    token: opts?.req.cookies['result-token'],
    req: opts?.req,
    res: opts?.res,
    prisma,
  };
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
