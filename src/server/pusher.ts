import PusherServer from "pusher";
import { env } from "~/env.mjs";

export const pusherServerClient = new PusherServer({
  appId: env.PUSHER_APP_ID,
  key: env.PUSHER_APP_KEY,
  secret: env.PUSHER_APP_SECRET,
  host: env.PUSHER_SERVER_HOST,
  port: env.PUSHER_SERVER_PORT,
  useTLS: env.PUSHER_SERVER_TLS === "true",
  cluster: env.PUSHER_SERVER_CLUSTER,
});
