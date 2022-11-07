import clsx from "clsx";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

interface CompProps {
  userId?: string;
}

const BrowserEmbedView: React.FC<CompProps> = () => {
  // const latestMessage = useLatestPusherMessage(userId);
  const [show] = useState(false);

  // if (!latestMessage) return null;

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Head>
        <title>Embed</title>
      </Head>
      <div className="max-w-xs">
        <div className="w-full max-w-xs border-t-2 border-cyan-300 bg-black/90">
          <h1 className="px-2 uppercase text-cyan-300">Final</h1>
          <div className="flex">
            <h3 className="bg-cyan-300 px-2 uppercase text-black">
              Men&#39;s hammer throw
            </h3>
            <h4 className="px-2 uppercase">Distance</h4>
          </div>
          <ul className="">
            <li className="flex justify-between border-t-2 border-black/50 px-4 py-1">
              1 Sauli Niinisto
              <span>80.50m</span>
            </li>
            <li className="flex justify-between border-t-2 border-black/50 px-4 py-1">
              2 Stuart Little
              <span>80.10m</span>
            </li>
            <li className="flex justify-between border-t-2 border-black/50 px-4 py-1">
              3 Logan Paul
              <span>79.10m</span>
            </li>
            <li className="flex justify-between border-t-2 border-black/50 px-4 py-1">
              4 Warren Buffet
              <span>79.06m</span>
            </li>
            <li className="flex justify-between border-t-2 border-black/50 px-4 py-1">
              5 Rudy Wrinkler
              <span>75.69m</span>
            </li>
            <li className=" flex flex-wrap justify-between border-t-2 border-black/50">
              <div
                className={clsx(
                  "flex flex-[1_1_100%] justify-between px-4 py-1",
                  show ? "bg-cyan-300 text-black" : ""
                )}
              >
                6 Aaron Kangas
                <span className={show ? "hidden" : "block"}>75.10m</span>
              </div>
              <ul
                className={clsx(
                  "ml-1 flex-[1_1_100%] bg-gray-300 text-black",
                  show ? "flex" : "hidden"
                )}
              >
                <li className="px-1 py-3">69.50</li>
                <li className="bg-gray-200 px-1 py-3">69.55</li>
                <li className="bg-cyan-300/50 px-1 py-3">75.10</li>
                <li className="px-1 py-3">55.55</li>
                <li className="bg-gray-200 px-1 py-3">70.69</li>
                <li className="px-1 py-3">67.59</li>
              </ul>
            </li>
            <li className="flex justify-between border-t-2 border-black/50 px-4 py-1">
              7 Pavel Fajdek
              <span>70.10m</span>
            </li>
            <li className="flex justify-between border-t-2 border-black/50 px-4 py-1">
              8 Kokhan
              <span>70.09m</span>
            </li>
            <li className="flex justify-between border-t-2 border-black/50 px-4 py-1">
              9 Sean Donnelly
              <span>70.08m</span>
            </li>
            <li className="flex justify-between border-t-2 border-black/50 px-4 py-1">
              10 Bob Ross
              <span>70.05m</span>
            </li>
          </ul>
        </div>
        <h1 className="mt-1 inline-flex bg-black/90 p-1 uppercase text-cyan-300">
          Tour De Hammer 2023
        </h1>
      </div>
    </div>
  );
};

const LazyEmbedView = dynamic(() => Promise.resolve(BrowserEmbedView), {
  ssr: false,
});

const BrowserEmbedQuestionView = () => {
  const { query } = useRouter();
  if (!query.uid || typeof query.uid !== "string") {
    return null;
  }

  return <LazyEmbedView userId={query.uid} />;
};

export default BrowserEmbedQuestionView;
