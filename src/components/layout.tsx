import Head from "next/head";
import Link from "next/link";
import React from "react";
import {
  HiOutlineClipboardCheck,
  HiOutlineClipboardCopy,
  HiOutlineLogout,
} from "react-icons/hi";

const Header = () => {
  const [copy, setCopy] = React.useState(false);

  const copyUrlToClipboard = (path: string) => () => {
    if (!navigator.clipboard) {
      console.warn("Clipboard not supported");
      return;
    }
    setCopy(true);
    navigator.clipboard.writeText(`${window.location.origin}${path}`);
    setTimeout(() => {
      setCopy(false);
    }, 2000);
  };

  return (
    <header className="flex w-full items-center justify-between bg-neutral-800 px-8 py-4 shadow">
      <Link href="/">
        <h1 className="text-2xl font-bold">Tablo</h1>
      </Link>
      <nav className="flex items-center justify-center gap-2">
        <Link
          href="/create"
          className="flex gap-2 rounded-lg p-1 text-gray-400 transition-all hover:bg-neutral-900/50 sm:px-3 sm:py-2"
        >
          Create
        </Link>
        <button
          className="flex gap-2 rounded-lg p-1 text-gray-400 transition-all hover:bg-neutral-900/50 sm:px-3 sm:py-2"
          onClick={copyUrlToClipboard(`/embed/1`)}
        >
          Embed url
          {copy ? (
            <HiOutlineClipboardCheck className="text-xl text-gray-100" />
          ) : (
            <HiOutlineClipboardCopy className="text-xl" />
          )}
        </button>

        <button
          // onClick={() => signOut()}
          className="flex gap-2 rounded-lg p-1 text-gray-400 transition-all hover:bg-neutral-900/50 sm:px-3 sm:py-2"
        >
          <span className="sr-only">Open user menu</span>
          <HiOutlineLogout className="text-xl" />
        </button>
      </nav>
    </header>
  );
};
const Footer = () => {
  return (
    <footer className="flex w-full justify-between bg-black/40 py-4 px-8">
      <span>
        created by{" "}
        <a
          href="https://twitter.com/kamm3r"
          className="text-slate-500 hover:text-slate-300"
        >
          Marco
        </a>
      </span>
      <div className="flex gap-4">
        <a
          href="https://github.com/kamm3r/tablo"
          className="text-slate-500 hover:text-slate-300"
        >
          Github
        </a>
        <a href="nuts" className="text-slate-500 hover:text-slate-300">
          Deez
        </a>
      </div>
    </footer>
  );
};

export default function Layout({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="flex h-screen flex-col bg-neutral-700 p-6 text-neutral-100 md:p-0">
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="flex flex-grow flex-col">{children}</main>
      <Footer />
    </div>
  );
}
