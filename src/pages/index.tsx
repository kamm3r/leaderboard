import React, { useState } from 'react';
import clsx from 'clsx';
import {
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlinePlus,
  HiOutlineTrash,
  HiSortAscending,
  HiSortDescending,
} from 'react-icons/hi';

import Layout from '../components/layout';
import { AutoAnimate } from '../components/auto-animate';
import { Card } from '../components/card';
import { trpc } from '../utils/trpc';
import * as portals from 'react-reverse-portal';
import dynamic from 'next/dynamic';

const Added = dynamic(() => Promise.resolve(AddAttempt), { ssr: false });
const Audi = dynamic(() => Promise.resolve(Outey), { ssr: false });

export default function Home() {
  const isSSR = typeof window === 'undefined';

  const portalNode = React.useMemo(() => {
    if (isSSR) {
      return null;
    }
    return portals.createHtmlPortalNode();
  }, []);
  const [reverseSort, setReverseSort] = useState(false);
  const [show, setShow] = useState(false);
  const [but, setBut] = useState(false);
  const [modal, setModal] = useState(false);
  const toggle = React.useCallback(() => {
    setModal((modal) => !modal);
  }, []);
  const { data, isLoading, refetch } = trpc.result.getAllAttempts.useQuery();
  const athletes = trpc.result.getAllAthletes.useQuery();

  const allAthletes =
    data?.filter((ath) => ath.athlete.filter((a) => a.id)) || [];

  console.log('attempts', data);
  console.log('athlete', athletes.data);

  return (
    <Layout title='Tablo'>
      <div className='grid min-h-0 flex-1 grid-cols-7'>
        <div className='col-span-1 flex flex-col gap-4 overflow-y-auto py-4 pl-6 pr-3'>
          <div className='flex items-center justify-between'>
            <h2 className='flex items-center gap-1.5 font-medium'>
              <span>Timetable</span>
            </h2>
          </div>

          <AutoAnimate className='flex gap-4 flex-col'>
            <Card className='relative flex animate-fade-in-down flex-col gap-4 p-4'>
              <div className='break-words'>Men&apos;s hammer throw 14.00</div>
              <div className='break-words'>Women&apos;s hammer throw 16.00</div>
              <div className='flex items-center justify-between text-gray-300'>
                <button onClick={() => setBut(!but)}>
                  <span className='flex items-center gap-1.5 text-sm'>
                    {!but ? (
                      <HiOutlineEye className='text-xl' />
                    ) : (
                      <HiOutlineEyeOff className='text-xl' />
                    )}
                    Show athlete
                  </span>
                </button>
                <button className='relative z-10 -my-1 -mx-2 flex items-center gap-1.5 rounded py-1 px-2 text-sm hover:bg-neutral-900/50 hover:text-white'>
                  <HiOutlineTrash className='text-xl' />
                  <span>Edit</span>
                </button>
              </div>
            </Card>
          </AutoAnimate>
        </div>
        {/* Preview window */}
        <div className='col-span-4 flex py-4 pl-3 pr-3'>
          <Card className='flex flex-1 flex-col divide-y divide-neutral-900'>
            <AutoAnimate className='flex flex-1 items-center justify-center p-4 text-lg font-medium'>
              {/* <span></span> */}
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
                        <span className={show ? 'hidden' : 'block'}>
                          75.10m
                        </span>
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
            </AutoAnimate>
            <div className='grid grid-cols-3 divide-x divide-neutral-900'>
              <button
                className='flex items-center justify-center gap-2 rounded-bl p-4 hover:bg-neutral-700'
                // onClick={() => unpinQuestion()}
              >
                <HiOutlineEyeOff />
                Hide
              </button>
              <button
                className='flex items-center justify-center gap-2 rounded-bl p-4 hover:bg-neutral-700'
                // onClick={() => unpinQuestion()}
              >
                {/* <FaEyeSlash /> */}
                All Results
              </button>

              <button
                className='flex items-center justify-center gap-2 rounded-br p-4 hover:bg-neutral-700'
                onClick={() => setShow(!show)}
              >
                {/* <FaCaretSquareRight /> */}
                Next Athlete
              </button>
            </div>
          </Card>
        </div>
        {/* Athletes column */}
        <div className='col-span-2 flex flex-col gap-4 overflow-y-auto py-4 pl-3 pr-6'>
          <div className='flex items-center justify-between'>
            <h2 className='flex items-center gap-1.5 font-medium'>
              <span>Athletes</span>
              <span className='inline-flex h-6 w-6 items-center justify-center rounded-full bg-neutral-800 text-xs font-extrabold'>
                {athletes.data?.length}
                {/* 4 */}
              </span>
            </h2>
            <button
              className='relative z-10 -my-2 flex items-center gap-1.5 rounded py-2 px-2 text-sm hover:bg-neutral-900/50 hover:text-white'
              onClick={() => setReverseSort(!reverseSort)}
            >
              {/* {reverseSort ? <FaSortAmountUp /> : <FaSortAmountDown />} */}

              {reverseSort ? (
                <HiSortDescending className='text-xl' />
              ) : (
                <HiSortAscending className='text-xl' />
              )}
            </button>
          </div>
          <AutoAnimate
            className={clsx(
              'flex gap-4',
              reverseSort ? 'flex-col-reverse' : 'flex-col'
            )}
          >
            {data?.map((q) => (
              <Card
                key={q.id}
                className='relative flex animate-fade-in-down flex-col gap-4 p-4'
              >
                {q.athlete.map((ath) => (
                  <div key={ath.id} className='break-words'>
                    {ath.athleteName}
                  </div>
                ))}
                <div className='flex gap-2'>
                  {q.attempts.map((at) => (
                    <p
                      key={at.id}
                      className='bg-neutral-900/50 px-2 py-1 rounded'
                    >
                      {at.attempt1}
                    </p>
                  ))}
                  {q.attempts.length < 6 && (
                    <>
                      <button
                        className='relative px-2 py-1 flex items-center gap-1.5 rounde text-sm hover:bg-neutral-900/50 hover:text-white'
                        onClick={toggle}
                      >
                        <HiOutlinePlus className='text-base' />
                        <span>Add</span>
                      </button>
                    </>
                  )}
                </div>
                <div className='flex items-center justify-between text-gray-300'>
                  {/* <div className="text-sm">{dayjs(q.createdAt).fromNow()}</div> */}
                  <button onClick={() => setBut(!but)}>
                    <span className='flex items-center gap-1.5 text-sm'>
                      {!but ? (
                        <HiOutlineEye className='text-xl' />
                      ) : (
                        <HiOutlineEyeOff className='text-xl' />
                      )}
                      Show athlete
                    </span>
                  </button>

                  <button
                    className='relative z-10 -my-1 -mx-2 flex items-center gap-1.5 rounded py-1 px-2 text-sm hover:bg-neutral-900/50 hover:text-white'
                    // onClick={() => removeQuestion({ questionId: q.id })}
                  >
                    <HiOutlineTrash className='text-xl' />
                    <span>Remove</span>
                  </button>
                </div>
              </Card>
            ))}
          </AutoAnimate>
        </div>
      </div>
      <Added portalNode={portalNode} />
      {modal && <Audi portalNode={portalNode} />}
    </Layout>
  );
}

function AddAttempt({ portalNode }: { portalNode: any }) {
  return (
    <portals.InPortal node={portalNode}>
      <div className='absolute top-0 right-0 left-0 bottom-0 z-50 flex justify-center items-center bg-black/50 h-screen w-screen'>
        <div className='bg-neutral-800 p-5 rounded'>
          <form className='flex flex-col gap-5'>
            <div className='flex flex-col gap-2'>
              <label className='font-normal'>Add attempt</label>
              <input
                className='py-2 px-3 mt-1 focus:ring-neutral-500 focus:border-neutral-500 sm:text-sm bg-neutral-900/50 rounded'
                type='number'
                step={0.01}
                // {...register('attempt1',{require:true})}
                placeholder='60.69'
              />
            </div>

            <button
              type='submit'
              className='py-2 px-4 text-sm font-medium rounded bg-neutral-500 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500'
            >
              Add
            </button>
          </form>
        </div>
      </div>
    </portals.InPortal>
  );
}

function Outey({ portalNode }: { portalNode: any }) {
  return <portals.OutPortal node={portalNode} />;
}
