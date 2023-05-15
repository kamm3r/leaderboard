import { createNextApiHandler } from "@trpc/server/adapters/next";

import { env } from "~/env.mjs";
import { createTRPCContext } from "~/server/api/trpc";
import { appRouter } from "~/server/api/root";

// export API handler
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error
export default createNextApiHandler({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  router: appRouter,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  createContext: createTRPCContext,
  onError:
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    env.NODE_ENV === "development"
      ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
          );
        }
      : undefined,
});
