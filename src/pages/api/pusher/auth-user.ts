import { NextApiRequest, NextApiResponse } from "next";
import { pusherServerClient } from "../../../server/pusher";

export default function pusherAuthUserEndpoint(
  req: NextApiRequest,
  res: NextApiResponse
): void {
  const { socket_id } = req.body as { socket_id: string };
  const { user_id } = req.headers;

  if (!user_id || typeof user_id !== "string") {
    res.status(404).send("KEKW");
    return;
  }
  const auth = pusherServerClient.authenticateUser(socket_id, {
    id: user_id,
    name: "marco",
  });
  res.send(auth);
}
