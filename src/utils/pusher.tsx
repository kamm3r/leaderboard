import React, { useEffect, createContext, useContext, useRef } from "react";
import Pusher, {
  type Members,
  type PresenceChannel,
  type Channel,
} from "pusher-js";
import { create, type StoreApi, useStore } from "zustand";

const pusher_key = process.env["NEXT_PUBLIC_PUSHER_APP_KEY"];
const pusher_server_host = process.env["NEXT_PUBLIC_PUSHER_SERVER_HOST"];
const pusher_server_port = parseInt(
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  process.env["NEXT_PUBLIC_PUSHER_SERVER_PORT"]!,
  10
);
const pusher_server_tls =
  process.env["NEXT_PUBLIC_PUSHER_SERVER_TLS"] === "true";
const pusher_server_cluster = process.env["NEXT_PUBLIC_PUSHER_SERVER_CLUSTER"];

type MembersType = Pick<Members, "members">;

type PusherStore = {
  pusher: Pusher;
  channel: Channel;
  presenceChannel: PresenceChannel;
  members: Map<string, MembersType>;
};

type PusherState = StoreApi<PusherStore> extends { getState: () => infer T }
  ? T
  : never;

const createPusherStore = (slug: string) => {
  let pusher: Pusher;
  if (Pusher.instances.length) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    pusher = Pusher.instances[0]!;
    pusher.connect();
  } else {
    const randomUserId = `random-user-id:${Math.random().toFixed(7)}`;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    pusher = new Pusher(pusher_key!, {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      wsHost: pusher_server_host!,
      wsPort: pusher_server_port,
      enabledTransports: pusher_server_tls ? ["ws", "wss"] : ["ws"],
      forceTLS: pusher_server_tls,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      cluster: pusher_server_cluster!,
      disableStats: true,
      authEndpoint: "/api/pusher/auth-channel",
      auth: {
        headers: { user_id: randomUserId },
      },
    });
  }

  const channel = pusher.subscribe(slug);

  const presenceChannel = pusher.subscribe(
    `presence-${slug}`
  ) as PresenceChannel;

  const store = create<PusherStore>()(() => ({
    pusher,
    channel,
    presenceChannel,
    members: new Map<string, MembersType>(),
  }));

  console.log(
    "presenceChannel members lookup",
    presenceChannel.members.members
  );
  type MemberDict = Record<string, MembersType>;
  console.log(
    "test",
    new Map<string, MembersType>(
      Object.entries(presenceChannel.members.members as MemberDict)
    )
  );

  const updateMembers = () => {
    store.setState(() => ({
      members: new Map(
        Object.entries(presenceChannel.members.members as MemberDict)
      ),
    }));
  };

  presenceChannel.bind("pusher:subscription_succeeded", updateMembers);
  presenceChannel.bind("pusher:member_added", updateMembers);
  presenceChannel.bind("pusher:member_removed", updateMembers);

  return store;
};

const PusherContext = createContext<StoreApi<PusherStore> | undefined>(
  undefined
);
function usePusherStore<StateSlice = PusherState>(
  selector: (state: PusherState) => StateSlice,
  equalityFn?: (left: StateSlice, right: StateSlice) => boolean
): StateSlice {
  const store = useContext(PusherContext);
  if (!store) {
    throw new Error("Missing PusherContext.Provider in the tree");
  }
  return useStore(store, selector, equalityFn);
}

export const PusherProvider: React.FC<
  React.PropsWithChildren<{ slug: string }>
> = ({ slug, children }) => {
  const storeRef = useRef<ReturnType<typeof createPusherStore>>();
  useEffect(() => {
    storeRef.current = createPusherStore(slug);

    return () => {
      const pusher = storeRef.current?.getState().pusher;
      pusher?.disconnect();
    };
  }, [slug]);

  return (
    <PusherContext.Provider value={storeRef.current}>
      {children}
    </PusherContext.Provider>
  );
};

export function useSubscribeToEvent<MessageType>(
  eventName: string,
  callback: (data: MessageType) => void
) {
  const channel = usePusherStore((state) => state.channel);
  const stableCallback = React.useRef(callback);

  useEffect(() => {
    stableCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const reference = (data: MessageType) => {
      stableCallback.current(data);
    };
    channel.bind(eventName, reference);
    return () => {
      channel.unbind(eventName, reference);
    };
  }, [channel, eventName]);
}

export function useCurrentMemberCount() {
  return usePusherStore((state) => state);
}
