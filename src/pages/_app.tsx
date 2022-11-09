import type { AppType } from "next/app";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
// import { Montserrat } from "@next/font/google";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";

// const inter = Montserrat();

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      {/* <div className={inter.className}> */}
      <Component {...pageProps} />
      {/* </div> */}
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
