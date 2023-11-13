import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { ThemeProvider } from "next-themes"
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange>
      <SessionProvider session={session}>
        <main className={GeistSans.className}>
          <Component {...pageProps} />
        </main>
      </SessionProvider>
    </ThemeProvider>
  );
};

export default api.withTRPC(MyApp);
