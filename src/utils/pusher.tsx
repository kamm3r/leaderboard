import React, { useEffect, createContext, useContext, useRef } from "react";
import Pusher, {
  type Members,
  type PresenceChannel,
  type Channel,
} from "pusher-js";
import { useStore } from "zustand";
import { createStore, type StoreApi } from "zustand/vanilla";

type MembersType = Pick<Members, "members">;

type PusherStore = {
  pusherClient: Pusher;
  channel: Channel;
  presenceChannel: PresenceChannel;
  members: Map<string, MembersType>;
};

type PusherState = StoreApi<PusherStore> extends { getState: () => infer T }
  ? T
  : never;

type MemberDict = Record<string, MembersType>;

const pusher_key = process.env.NEXT_PUBLIC_PUSHER_APP_KEY!;
const pusher_server_tls = process.env.NEXT_PUBLIC_PUSHER_SERVER_TLS === "true";
const pusher_server_cluster = process.env.NEXT_PUBLIC_PUSHER_SERVER_CLUSTER!;

function createPusherStore(slug: string): StoreApi<PusherStore> {
  let pusherClient: Pusher;
  if (Pusher.instances.length) {
    pusherClient = Pusher.instances[0]!;
    pusherClient.connect();
  } else {
    const randomUserId = `random-user-id:${Math.random().toFixed(7)}`;
    pusherClient = new Pusher(pusher_key, {
      wsHost: "localhost",
      wsPort: 6001,
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

  const channel = pusherClient.subscribe(slug);

  const presenceChannel = pusherClient.subscribe(
    `presence-${slug}`,
  ) as PresenceChannel;

  const store = createStore<PusherStore>()(() => ({
    pusherClient,
    channel,
    presenceChannel,
    members: new Map<string, MembersType>(),
  }));

  const updateMembers = (): void => {
    store.setState(() => ({
      members: new Map(
        Object.entries(presenceChannel.members.members as MemberDict),
      ),
    }));
    console.log("members lookup", presenceChannel.members.members);
  };

  presenceChannel.bind("pusher:subscription_succeeded", updateMembers);
  presenceChannel.bind("pusher:member_added", updateMembers);
  presenceChannel.bind("pusher:member_removed", updateMembers);

  return store;
}

const PusherContext = createContext<ReturnType<
  typeof createPusherStore
> | null>(null);
function usePusherStore<StateSlice = PusherState>(
  selector: (state: PusherState) => StateSlice,
  equalityFn?: (left: StateSlice, right: StateSlice) => boolean,
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
      const pusher = storeRef.current?.getState().pusherClient;
      console.log("disconnecting pusher and destroying store", pusher);
      console.log(
        "(Expect a warning in terminal after this, React Dev Mode and all)",
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
  callback: (data: MessageType) => void,
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
