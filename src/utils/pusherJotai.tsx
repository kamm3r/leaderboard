// import Pusher, { type Members, PresenceChannel, type Channel } from 'pusher-js'
// import { Provider, atom, createStore, useAtom } from 'jotai'
// import React from 'react';

// if (process.env["NEXT_PUBLIC_PUSHER_SERVER_PORT"] === undefined) {
//     process.env["NEXT_PUBLIC_PUSHER_SERVER_PORT"] = "6001";
// }

// const pusher_key = process.env["NEXT_PUBLIC_PUSHER_APP_KEY"];
// const pusher_server_host =
//     process.env["NEXT_PUBLIC_PUSHER_SERVER_HOST"] ?? "localhost";
// const pusher_server_port = parseInt(
//     process.env["NEXT_PUBLIC_PUSHER_SERVER_PORT"],
//     10
// );
// const pusher_server_tls =
//     process.env["NEXT_PUBLIC_PUSHER_SERVER_TLS"] === "true";
// const pusher_server_cluster = process.env["NEXT_PUBLIC_PUSHER_SERVER_CLUSTER"];

// const pusherStore = (slug: string) => {
//     let pusher: Pusher;
//     if (Pusher.instances.length && Pusher.instances[0] !== undefined) {
//         pusher = Pusher.instances[0];
//         pusher.connect();
//     } else {
//         // const randomUserId = `random-user-id:${Math.random().toFixed(7)}`

//         pusher = new Pusher(pusher_key ?? "", {
//             wsHost: pusher_server_host,
//             wsPort: pusher_server_port,
//             enabledTransports: pusher_server_tls ? ["ws", "wss"] : ["ws"],
//             forceTLS: pusher_server_tls,
//             cluster: pusher_server_cluster ?? "",
//             disableStats: true,
//             //   authEndpoint: "/api/pusher/auth-channel",
//             // auth: {
//             //     headers: { user_id: randomUserId }

//             // }
//         });
//     }

//     const channel = pusher.subscribe(slug);

//     const presenceChannel = pusher.subscribe(
//         `presence-${slug}`
//     ) as PresenceChannel;

//     const store = createStore()

//     // const pusherAtom = atom(pusher)
//     // const channelAtom = atom(channel)
//     // const presenceChannelAtom = atom(presenceChannel)
//     // const membersAtom = atom(new Map())
//     // const updateMembersAtom = atom((get, set) => {
//     //     set(membersAtom, get(membersAtom)presenceChannel.members.members))
//     //     })

//     // const [updateMembers] = useAtom(updateMembersAtom)

//     // presenceChannel.bind("pusher:subcription_succeeded", updateMembers)
//     // presenceChannel.bind("pusher:member_added", updateMembers)
//     // presenceChannel.bind("pusher:member_removed", updateMembers)

//     return store
// }

// export const PusherProvider: React.FC<
//     React.PropsWithChildren<{ slug: string }>
// > = ({ slug, children }) => {
//     const store = createStore()

//     return (
//         <Provider store={store}>
//             {children}
//         </Provider>
//     )
// }
