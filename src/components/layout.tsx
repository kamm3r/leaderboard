import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import {
  HiOutlineClipboardCheck,
  HiOutlineClipboardCopy,
  HiOutlineLogout,
} from 'react-icons/hi';

const Header = () => {
  const [copy, setCopy] = React.useState(false);

  const copyUrlToClipboard = (path: string) => () => {
    if (!navigator.clipboard) {
      console.warn('Clipboard not supported');
      return;
    }
    setCopy(true);
    navigator.clipboard.writeText(`${window.location.origin}${path}`);
    setTimeout(() => {
      setCopy(false);
    }, 2000);
  };

  return (
    <header className='flex w-full justify-between items-center bg-neutral-800 px-8 py-4 shadow'>
      <Link href='/'>
        <h1 className='text-2xl font-bold'>Tablo</h1>
      </Link>
      <nav className='flex gap-2 justify-center items-center'>
        <Link href='/create'>
          <a className='flex gap-2 text-gray-400 p-1 sm:px-3 sm:py-2 rounded-lg hover:bg-neutral-900/50 transition-all'>
            Create
          </a>
        </Link>
        <button
          className='flex gap-2 text-gray-400 p-1 sm:px-3 sm:py-2 rounded-lg hover:bg-neutral-900/50 transition-all'
          onClick={copyUrlToClipboard(`/embed/1`)}
        >
          Embed url
          {copy ? (
            <HiOutlineClipboardCheck className='text-xl text-gray-100' />
          ) : (
            <HiOutlineClipboardCopy className='text-xl' />
          )}
        </button>

        <button
          // onClick={() => signOut()}
          className='flex gap-2 text-gray-400 p-1 sm:px-3 sm:py-2 rounded-lg hover:bg-neutral-900/50 transition-all'
        >
          <span className='sr-only'>Open user menu</span>
          <HiOutlineLogout className='text-xl' />
        </button>
      </nav>
    </header>
  );
};
const Footer = () => {
  return (
    <footer className='flex justify-between bg-black/40 py-4 px-8 w-full'>
      <span>
        created by{' '}
        <a
          href='https://twitter.com/kamm3r'
          className='text-slate-500 hover:text-slate-300'
        >
          Marco
        </a>
      </span>
      <div className='flex gap-4'>
        <a
          href='https://github.com/kamm3r/tablo'
          className='text-slate-500 hover:text-slate-300'
        >
          Github
        </a>
        <a href='nuts' className='text-slate-500 hover:text-slate-300'>
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
    <div className='p-6 md:p-0 flex flex-col h-screen bg-neutral-700 text-neutral-100'>
      <Head>
        <title>{title}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <main className='flex flex-col flex-grow'>{children}</main>
      <Footer />
    </div>
  );
}
