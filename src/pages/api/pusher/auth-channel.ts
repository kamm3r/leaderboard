import { NextApiRequest, NextApiResponse } from "next";
import { pusherServerClient } from "../../../server/pusher";

export default function pusherAuthChannel(
  req: NextApiRequest,
  res: NextApiResponse
): void {
  const { channel_name, socket_id } = req.body as {
    channel_name: string;
    socket_id: string;
  };

  const { user_id } = req.headers;

  if (!user_id || typeof user_id !== "string") {
    res.status(404).send("KEKW");
    return;
  }

  const auth = pusherServerClient.authorizeChannel(socket_id, channel_name, {
    user_id,
    user_info: {
      name: "deez",
    },
  });
  res.send(auth);
}
