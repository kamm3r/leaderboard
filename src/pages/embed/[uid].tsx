import clsx from 'clsx';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';

interface CompProps {
  userId: string;
}

const BrowserEmbedView: React.FC<CompProps> = ({ userId }) => {
  // const latestMessage = useLatestPusherMessage(userId);
  const [show, setShow] = useState(false);

  // if (!latestMessage) return null;

  return (
    <div className='w-screen h-screen flex justify-center items-center'>
      <Head>
        <title>Embed</title>
      </Head>
      <div className='max-w-xs'>
        <div className='max-w-xs w-full bg-black/90 border-t-2 border-cyan-300'>
          <h1 className='text-cyan-300 uppercase px-2'>Final</h1>
          <div className='flex'>
            <h3 className='uppercase bg-cyan-300 text-black px-2'>
              Men&#39;s hammer throw
            </h3>
            <h4 className='uppercase px-2'>Distance</h4>
          </div>
          <ul className=''>
            <li className='flex justify-between border-t-2 border-black/50 px-4 py-1'>
              1 Sauli Niinisto
              <span>80.50m</span>
            </li>
            <li className='flex justify-between border-t-2 border-black/50 px-4 py-1'>
              2 Stuart Little
              <span>80.10m</span>
            </li>
            <li className='flex justify-between border-t-2 border-black/50 px-4 py-1'>
              3 Logan Paul
              <span>79.10m</span>
            </li>
            <li className='flex justify-between border-t-2 border-black/50 px-4 py-1'>
              4 Warren Buffet
              <span>79.06m</span>
            </li>
            <li className='flex justify-between border-t-2 border-black/50 px-4 py-1'>
              5 Rudy Wrinkler
              <span>75.69m</span>
            </li>
            <li className=' flex flex-wrap justify-between border-t-2 border-black/50'>
              <div
                className={clsx(
                  'flex justify-between flex-[1_1_100%] px-4 py-1',
                  show ? 'bg-cyan-300 text-black' : ''
                )}
              >
                6 Aaron Kangas
                <span className={show ? 'hidden' : 'block'}>75.10m</span>
              </div>
              <ul
                className={clsx(
                  'bg-gray-300 text-black flex-[1_1_100%] ml-1',
                  show ? 'flex' : 'hidden'
                )}
              >
                <li className='px-1 py-3'>69.50</li>
                <li className='px-1 py-3 bg-gray-200'>69.55</li>
                <li className='px-1 py-3 bg-cyan-300/50'>75.10</li>
                <li className='px-1 py-3'>55.55</li>
                <li className='px-1 py-3 bg-gray-200'>70.69</li>
                <li className='px-1 py-3'>67.59</li>
              </ul>
            </li>
            <li className='flex justify-between border-t-2 border-black/50 px-4 py-1'>
              7 Pavel Fajdek
              <span>70.10m</span>
            </li>
            <li className='flex justify-between border-t-2 border-black/50 px-4 py-1'>
              8 Kokhan
              <span>70.09m</span>
            </li>
            <li className='flex justify-between border-t-2 border-black/50 px-4 py-1'>
              9 Sean Donnelly
              <span>70.08m</span>
            </li>
            <li className='flex justify-between border-t-2 border-black/50 px-4 py-1'>
              10 Bob Ross
              <span>70.05m</span>
            </li>
          </ul>
        </div>
        <h1 className='inline-flex uppercase bg-black/90 text-cyan-300 p-1 mt-1'>
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
  if (!query.uid || typeof query.uid !== 'string') {
    return null;
  }

  return <LazyEmbedView userId={query.uid} />;
};

export default BrowserEmbedQuestionView;
