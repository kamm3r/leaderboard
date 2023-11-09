import React, { useEffect, createContext, useContext, useRef } from "react";
import Pusher, {
  type Members,
  type PresenceChannel,
  type Channel,
} from "pusher-js";
import { create, type StoreApi, useStore } from "zustand";

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

type MemberDict = Record<string, MembersType>;

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const pusher_key = process.env.PUSHER_APP_KEY!;
const pusher_server_host =
  process.env.PUSHER_SERVER_HOST ?? "localhost";
const pusher_server_port = parseInt(
  process.env.PUSHER_SERVER_PORT ?? "6001",
  10
);
const pusher_server_tls =
  process.env.PUSHER_SERVER_TLS === "true";
const pusher_server_cluster = process.env.PUSHER_CLUSTER ?? "eu";

function createPusher(slug: string): Omit<PusherStore, "members"> {
  let pusher: Pusher;
  if (Pusher.instances.length) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/non-nullable-type-assertion-style
    pusher = Pusher.instances[0] as Pusher;
    pusher.connect();
  } else {
    const randomUserId = `random-user-id:${Math.random().toFixed(7)}`;
    pusher = new Pusher(pusher_key, {
      wsHost: pusher_server_host,
      wsPort: pusher_server_port,
      enabledTransports: pusher_server_tls ? ["ws", "wss"] : ["ws"],
      forceTLS: pusher_server_tls,
      cluster: pusher_server_cluster,
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

  return { pusher, channel, presenceChannel };
}

function createPusherStore(slug: string) {
  const { pusher, channel, presenceChannel } = createPusher(slug);
  const store = create<PusherStore>()(() => ({
    pusher,
    channel,
    presenceChannel,
    members: new Map<string, MembersType>(),
  }));

  const updateMembers = (): void => {
    store.setState(() => ({
      members: new Map(
        Object.entries(presenceChannel.members.members as MemberDict)
      ),
    }));
    console.log("members lookup", presenceChannel.members.members);
  };

  presenceChannel.bind("pusher:subscription_succeeded", updateMembers);
  presenceChannel.bind("pusher:member_added", updateMembers);
  presenceChannel.bind("pusher:member_removed", updateMembers);

  return store;
}

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

export function PusherProvider({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const storeRef = useRef<ReturnType<typeof createPusherStore>>();
  useEffect(() => {
    storeRef.current = createPusherStore(slug);

    return () => {
      const pusher = storeRef.current?.getState().pusher;
      console.log("disconnecting pusher and destroying store", pusher);
      console.log(
        "(Expect a warning in terminal after this, React Dev Mode and all)"
      );
      pusher?.disconnect();
    };
  }, [slug]);

  if (!storeRef.current) {
    return null;
  }

  return (
    <PusherContext.Provider value={storeRef.current}>
      {children}
    </PusherContext.Provider>
  );
}

export function useSubscribeToEvent<MessageType>(
  eventName: string,
  callback: (data: MessageType) => void
): void {
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
  return usePusherStore((state) => state.members.size);
}
