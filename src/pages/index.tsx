import { useState } from 'react';
import Link from 'next/link';
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

export default function Home() {
  const [reverseSort, setReverseSort] = useState(false);
  const [show, setShow] = useState(false);
  const [but, setBut] = useState(false);
  const { data, isLoading, refetch } = trpc.result.getAllAttempts.useQuery();
  return (
    <Layout title='Tablo'>
      <div className='grid min-h-0 flex-1 grid-cols-7'>
        <div className='col-span-1 flex flex-col gap-4 overflow-y-auto py-4 pl-6 pr-3'>
          <div className='flex items-center justify-between'>
            <h2 className='flex items-center gap-1.5 font-medium'>
              <span>Timetable</span>
              {/* <span className='inline-flex h-6 w-6 items-center justify-center rounded-full bg-neutral-800 text-xs font-extrabold'>
                {otherQuestions.length}2
              </span> */}
            </h2>
          </div>

          <AutoAnimate className='flex gap-4 flex-col'>
            <Card className='relative flex animate-fade-in-down flex-col gap-4 p-4'>
              <div className='break-words'>Men&apos;s hammer throw 14.00</div>
              <div className='break-words'>Women&apos;s hammer throw 16.00</div>
              <div className='flex items-center justify-between text-gray-300'>
                {/* <div className="text-sm">{dayjs(q.createdAt).fromNow()}</div> */}
                <div className='text-sm'>1 days ago</div>
                <button className='relative z-10 -my-1 -mx-2 flex items-center gap-1.5 rounded py-1 px-2 text-sm hover:bg-neutral-900/50 hover:text-white'>
                  <HiOutlineTrash className='text-xl' />
                  <span>Edit</span>
                </button>
              </div>
              <button
                className='absolute w-full inset-0 z-0 flex items-center justify-center bg-neutral-900/75 opacity-0 transition-opacity hover:opacity-100'
                // onClick={() => pinQuestion({ questionId: q.id })}
              >
                <span className='flex items-center gap-1.5'>
                  <HiOutlineEye />
                  Show athlete
                </span>
              </button>
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
                {/* {otherQuestions.length} */}4
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
            // className='flex gap-4 flex-col'
            className={clsx(
              'flex gap-4',
              reverseSort ? 'flex-col-reverse' : 'flex-col'
            )}
          >
            {/* {otherQuestions.map((q) => ( */}
            <Card
              // key={q.id}
              className='relative flex animate-fade-in-down flex-col gap-4 p-4'
            >
              <div className='break-words'>Henri Liipola</div>
              <div className='flex gap-2'>
                <p className='bg-neutral-900/50 px-2 py-1 rounded'>14.20</p>
                <p className='bg-neutral-900/50 px-2 py-1 rounded'>x</p>
                <p className='bg-neutral-900/50 px-2 py-1 rounded'>-</p>
                <p className='bg-neutral-900/50 px-2 py-1 rounded'>53.69</p>
                <p className='bg-neutral-900/50 px-2 py-1 rounded'>64.20</p>
                <p className='bg-neutral-900/50 px-2 py-1 rounded'>74.20</p>
                <button
                  className='relative z-10 -my-1 -mx-2 flex items-center gap-1.5 rounded py-1 px-2 text-sm hover:bg-neutral-900/50 hover:text-white'
                  // onClick={() => removeQuestion({ questionId: q.id })}
                >
                  {/* Show only when less then 6 attempts added */}
                  <HiOutlinePlus className='text-xl' />
                  <span>Add</span>
                </button>
              </div>
              <div className='flex items-center justify-between text-gray-300'>
                {/* <div className="text-sm">{dayjs(q.createdAt).fromNow()}</div> */}
                <div className='text-sm'>1 days ago</div>

                <button
                  className='relative z-10 -my-1 -mx-2 flex items-center gap-1.5 rounded py-1 px-2 text-sm hover:bg-neutral-900/50 hover:text-white'
                  // onClick={() => removeQuestion({ questionId: q.id })}
                >
                  <HiOutlineTrash className='text-xl' />
                  <span>Remove</span>
                </button>
              </div>
              {/* <button
                className='absolute w-full inset-0 z-0 flex items-center justify-center bg-neutral-900/75 opacity-0 transition-opacity hover:opacity-100'
                // onClick={() => pinQuestion({ questionId: q.id })}
              > */}
              <button
                // className='absolute top-4 right-5 z-0'
                // onClick={() => pinQuestion({ questionId: q.id })}
                onClick={() => setBut(!but)}
              >
                <span className='flex items-center gap-1.5 text-sm'>
                  {!but ? (
                    <HiOutlineEye className='text-xl' />
                  ) : (
                    <HiOutlineEyeOff className='text-xl' />
                  )}
                  Show athlete
                </span>
                {/* <span className='flex items-center gap-1.5'>
                  <HiOutlineEye />          
                Show athlete
                </span> */}
              </button>
            </Card>

            {/* ))} */}
          </AutoAnimate>
        </div>
      </div>
    </Layout>
  );
}

function AddAttempt() {
  const AllAttempts = trpc.result.getAllAttempts.useQuery(undefined, {
    staleTime: 3000,
  });
  const utils = trpc.useContext();
  const addAttempt = trpc.result.addAttempt.useMutation({
    async onMutate({ attempt1 }) {
      await utils.result.getAllAttempts.cancel();
      const all = AllAttempts.data ?? [];
      utils.result.getAllAttempts.setData([
        //   ...all,
        // {
        //     attempts: [
        //       {attempt1}
        //     ],
        //   },
      ]);
    },
  });
  // const editAttempt = trpc.result.addAttempt.useMutation({
  //   async onMutate({ id, data }) {
  //     await utils.todo.all.cancel();
  //     const allTasks = utils.todo.all.getData();
  //     if (!allTasks) {
  //       return;
  //     }
  //     utils.todo.all.setData(
  //       allTasks.map((t) =>
  //         t.id === id
  //           ? {
  //               ...t,
  //               ...data,
  //             }
  //           : t,
  //       ),
  //     );
  //   },
  // });
  return (
    <div className='absolute z-50 bg-black/50 h-screen w-screen'>
      <div className='max-w-xl mx-auto py-12 md:max-w-2xl'>
        {/* <form onSubmit={handleSubmit(onSubmit)} className='w-full'> */}
        <form className='w-full'>
          {/* {isError && error.message} */}

          <div className='col-span-6 sm:col-span-3'>
            <label className='block text-sm font-medium'>Add Result</label>
            <input
              className='py-2 px-3 text-black mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
              // {...register('athlete.athleteName')}
              // defaultValue='marco'
            />
          </div>

          <input
            type='submit'
            // disabled={isLoading}
            className='my-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            value='Create Result'
          />
        </form>
      </div>
    </div>
  );
}
