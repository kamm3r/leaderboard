import Head from "next/head";
import Link from "next/link";

const Content = () => {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex items-center justify-between px-4 pt-4 pb-2 sm:py-4 sm:px-8">
        <Link
          href="/"
          className="relative whitespace-nowrap text-2xl font-bold"
        >
          Tablo{" "}
          <sup className="absolute top-0 left-[calc(100%+.25rem)] text-xs font-extrabold text-gray-400">
            [BETA]
          </sup>
        </Link>
      </header>
      <main className="mx-auto flex min-h-0 max-w-2xl flex-1 flex-col items-center justify-center">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-black dark:text-white md:text-5xl">
          451 – Unavailable For Legal Reasons
        </h1>
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          Why show a generic 404 when I can make it sound mysterious? It seems
          you&#39;ve found something that used to exist, or you spelled
          something wrong. I&#39;m guessing you spelled something wrong. Can you
          double check that URL?
        </p>
        <Link
          href="/"
          className="w-64 rounded-md bg-slate-200 p-1 text-center font-bold text-black sm:p-4"
        >
          Return Home
        </Link>
      </main>
    </div>
  );
};

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Page Not Found</title>
        <meta name="description" content="Page Not Found" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="justify-betwee relative flex h-screen w-screen flex-col">
        <Content />
        <footer className="flex justify-between py-4 px-8">
          <span>
            created by &hearts;{" "}
            <a
              href="https://twitter.com/kamm3r"
              className="font-bold text-slate-300 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Marco
            </a>
          </span>
          <div className="flex gap-4">
            <a
              href="https://github.com/kamm3r/tablo"
              className="font-bold text-slate-300 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Github
            </a>
            <a
              href="nuts"
              className="font-bold text-slate-300 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Deez
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}
