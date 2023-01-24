import clsx from "clsx";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import React, { useState } from "react";
import {
  HiOutlineClipboardCheck,
  HiOutlineClipboardCopy,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineLogout,
  HiOutlinePlus,
  HiOutlineTrash,
  HiSortAscending,
  HiSortDescending,
} from "react-icons/hi";
import * as portals from "react-reverse-portal";
import { useTRPCForm } from "trpc-form";

import { AutoAnimate } from "../components/auto-animate";
import Button from "../components/button";
import { Card } from "../components/card";
import { TextInput } from "../components/text-input";
import { addAttemptInput } from "../shared/add-athlete-validator";
import { type RouterOutputs, api } from "../utils/api";
import { quicksort } from "../utils/quicksort";

const AddAttempt: React.FC<{
  onClose: () => void;
  athleteId?: string;
}> = ({ onClose, athleteId }) => {
  const utils = api.useContext();

  const form = useTRPCForm({
    mutation: api.athletes.addAttempt,
    validator: addAttemptInput,
    onSuccess: () => {
      void utils.athletes.invalidate();
      onClose();
    },
    onSubmit: async () => {
      await new Promise((r) => setTimeout(r, 1000));
    },
  });

  return (
    <dialog
      onClick={onClose}
      className="absolute top-0 right-0 left-0 bottom-0 z-50 flex h-screen w-screen items-center justify-center bg-black/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative rounded bg-neutral-800 p-5"
      >
        <button onClick={onClose} className="absolute top-5 right-5">
          L + Ratio
        </button>
        <form ref={form.ref} className="flex flex-col gap-5">
          {/* TODO: Remove it or change it to a name??? */}
          <div className="flex flex-col gap-2">
            <label className="font-normal" htmlFor={form.athleteId?.id()}>
              Athlete ID
            </label>
            <input
              className="mt-1 rounded bg-neutral-900/50 py-2 px-3 focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm"
              type="text"
              name={form.athleteId?.name()}
              value={athleteId}
            />
            {form.athleteId?.error((e) => (
              <p className="py-2 text-xs text-red-400">{e.message}</p>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-normal" htmlFor={form.attempt1.id()}>
              Add attempt
            </label>
            <input
              className="mt-1 rounded bg-neutral-900/50 py-2 px-3 focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm"
              type="text"
              name={form.attempt1.name()}
              placeholder="60.69"
            />
            {form.attempt1.error((e) => (
              <p className="py-2 text-xs text-red-400">{e.message}</p>
            ))}
          </div>
          <Button
            type="submit"
            disabled={form.isSubmitting}
            loading={form.isSubmitting}
            size="lg"
            variant="primary"
          >
            Add
          </Button>
        </form>
      </div>
    </dialog>
  );
};

type StatusProp = "Qualification" | "Semi-Final" | "Final";

const Board: React.FC<{
  data: RouterOutputs["athletes"]["getAll"];
  status: StatusProp;
  meetName: string;
  onShow: boolean;
}> = ({ data, status, meetName, onShow }) => {
  return (
    <div className="max-w-xs">
      <div className="w-full max-w-xs border-t-2 border-cyan-300 bg-black/90">
        <h1 className="px-2 uppercase text-cyan-300">{status}</h1>
        <div className="flex">
          <h3 className="bg-cyan-300 px-2 uppercase text-black">
            Men&#39;s hammer throw
          </h3>
          <h4 className="px-2 uppercase">Distance</h4>
        </div>
        <ul className="flex flex-col">
          {data.map((a) => (
            <li
              key={a.id}
              className=" flex flex-wrap justify-between border-t-2 border-black/50"
            >
              <div className="flex flex-[1_1_100%] justify-between px-4 py-1">
                {a.name}
                <span>75.10m</span>
              </div>
              <ul
                className={clsx(
                  "ml-1  flex-[1_1_100%] bg-gray-300 text-black",
                  onShow ? "flex" : "hidden"
                )}
              >
                {/* bg-cyan-300/50 is for highest value */}
                <li className="min-w-[16.7%] px-1 py-3">
                  {a.attempts[0]?.attempt1}
                </li>
                <li className="min-w-[16.7%] bg-gray-200 px-1 py-3">
                  {a.attempts[1]?.attempt1}
                </li>
                <li className="min-w-[16.7%] bg-cyan-300/50 px-1 py-3">
                  {a.attempts[2]?.attempt1}
                </li>
                <li className="min-w-[16.6%] px-1 py-3">
                  {a.attempts[3]?.attempt1}
                </li>
                <li className="min-w-[16.7%] bg-gray-200 px-1 py-3">
                  {a.attempts[4]?.attempt1}
                </li>
                <li className="min-w-[16.7%] px-1 py-3">
                  {a.attempts[5]?.attempt1}
                </li>
              </ul>
            </li>
          ))}
        </ul>
      </div>
      <h1 className="mt-1 inline-flex bg-black/90 p-1 uppercase text-cyan-300">
        {meetName}
      </h1>
    </div>
  );
};

const AthleteView = () => {
  const portalNode = React.useMemo(() => {
    if (typeof window === "undefined") console.log("no bitch");
    return portals.createHtmlPortalNode();
  }, []);
  const [reverseSort, setReverseSort] = useState(false);
  const [show, setShow] = useState(false);
  const [test, setTest] = useState(false);
  const [but, setBut] = useState(false);
  const [modal, setModal] = useState(false);
  const [id, setId] = useState<string>();
  const [meetName, setMeetName] = useState("");
  const toggle = React.useCallback(
    (id: string) => {
      setModal(!modal);
      setId(id);
    },
    [modal]
  );

  const { data, isLoading, refetch } = api.athletes.getAll.useQuery();

  const deleted = api.athletes.delete.useMutation({
    onSuccess: (data) => {
      console.log("deleted an athlete", data);
      void refetch();
    },
  });
  const clearAll = api.athletes.deleteAll.useMutation({
    onSuccess: (data) => {
      console.log("Clear all", data);
      void refetch();
    },
  });

  if (isLoading)
    return (
      <div className="grid min-h-0 flex-1 grid-rows-3 gap-4 p-4 sm:grid-cols-7 sm:grid-rows-1 sm:gap-8 sm:p-8">
        {/* timetable */}
        <div className="col-span-1 row-span-1 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 font-medium" />
          </div>

          <AutoAnimate className="flex flex-col gap-4">
            <Card className="relative flex animate-pulse flex-col gap-4 p-4">
              <div className="break-words" />
              <div className="break-words" />
              <div className="flex items-center justify-between text-gray-300">
                <button />
                <button className="relative z-10 -my-1 -mx-2 flex items-center gap-1.5 rounded py-1 px-2 text-sm hover:bg-neutral-900/50 hover:text-white" />
              </div>
            </Card>
            <Card className="relative flex animate-pulse flex-col gap-4 p-4">
              <Button size="lg" variant="text" />
              <Button size="lg" variant="text" />
              <Button size="lg" variant="text" />
              <Button size="lg" variant="text" />
            </Card>
            <Card className="relative flex animate-pulse flex-col gap-4 p-4" />
          </AutoAnimate>
        </div>
        {/* Preview window */}
        <div className="row-span-1 flex sm:col-span-4">
          <Card className="flex flex-1 animate-pulse flex-col divide-y divide-neutral-900">
            <div className="flex min-h-0 flex-1 flex-col p-4">
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="flex items-baseline justify-between">
                  <h2 className="font-bold" />
                  <Button className="-m-2 !p-2" variant="ghost">
                    <div className="flex items-center" />
                  </Button>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto">
                  <AutoAnimate className="flex min-h-full items-center justify-center" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 divide-x  divide-neutral-900">
              <button className="flex items-center justify-center gap-2 rounded-br p-3 text-sm hover:bg-neutral-700 sm:p-4 sm:text-base" />
              <button className="flex items-center justify-center gap-2 rounded-br p-3 text-sm hover:bg-neutral-700 sm:p-4 sm:text-base" />

              <button className="flex items-center justify-center gap-2 rounded-br p-3 text-sm hover:bg-neutral-700 sm:p-4 sm:text-base" />
            </div>
          </Card>
        </div>
        {/* Athletes column */}
        <div className="row-span-2 flex flex-col gap-2 sm:col-span-2 sm:row-span-1">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 font-medium">
              <span />
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-neutral-800 text-xs font-extrabold" />
              <button className="relative z-10 -my-2 flex items-center gap-1.5 rounded py-2 px-2  hover:bg-neutral-900/50 hover:text-white" />
            </h2>
          </div>
          <AutoAnimate className="flex min-h-0 flex-1 flex-col rounded-lg bg-neutral-800/25">
            <AutoAnimate
              as="ul"
              className="flex flex-col gap-2 overflow-y-auto p-2"
            >
              <li>
                <Card className="relative flex animate-pulse flex-col gap-4 p-4">
                  <div className="flex items-center gap-3 break-words">
                    <p className="" />
                    <span className="text-xs opacity-70" />
                  </div>

                  <div className="flex gap-2">
                    <p className="-my-1 rounded bg-neutral-900/50 px-2 py-1 text-sm" />
                    <button className="relative -my-1 flex items-center gap-1.5 rounded px-2 py-1 text-sm" />
                  </div>
                  <div className="flex items-center justify-between text-gray-300">
                    <button className="relative z-10 -my-1 -mx-2 flex items-center gap-1.5 rounded py-1 px-2 text-sm" />
                    <button className="relative z-10 -my-1 -mx-2 flex items-center gap-1.5 rounded py-1 px-2 text-sm" />
                  </div>
                </Card>
              </li>
            </AutoAnimate>
          </AutoAnimate>
        </div>
      </div>
    );

  const Sorted = () => {
    if (reverseSort) {
      console.log("pass");
      data?.sort((a, b) => {
        const BValue = b.attempts.map((at) => parseFloat(at.attempt1));
        const AValue = a.attempts.map((at) => parseFloat(at.attempt1));
        return Math.max.apply(null, AValue) - Math.max.apply(null, BValue);
      });
      setReverseSort(!reverseSort);
    } else {
      console.log("smash");
      data
        ?.sort((a, b) => {
          const BValue = b.attempts.map((at) => parseFloat(at.attempt1));
          const AValue = a.attempts.map((at) => parseFloat(at.attempt1));
          return Math.max.apply(null, AValue) - Math.max.apply(null, BValue);
        })
        .reverse();
      setReverseSort(!reverseSort);
    }
  };
  // const Sorted = () => {
  //   if (reverseSort) {
  //     data?.sort((a, b) => {
  //       const BValue = b.attempts.map((at) => parseFloat(at.attempt1));
  //       const AValue = a.attempts.map((at) => parseFloat(at.attempt1));
  //       return Math.max.apply(null, AValue) - Math.max.apply(null, BValue);
  //     });
  //     setReverseSort(!reverseSort);
  //   } else {
  //     data?.sort((a, b) => {
  //       const BValue = b.attempts.map((at) => parseFloat(at.attempt1));
  //       const AValue = a.attempts.map((at) => parseFloat(at.attempt1));
  //       return Math.max.apply(null, BValue) - Math.max.apply(null, AValue);
  //     });
  //     setReverseSort(!reverseSort);
  //   }
  // };

  // const otherAthlete = data;

  // const athletesSorted = reverseSort
  //   ? [...otherAthlete].reverse()
  //   : otherAthlete;

  const ass = data?.map((a) => a.attempts);

  const ssd = ass?.map((a) => a.map((at) => at.attempt1));
  const s = ssd?.map((as) => as.map(parseFloat));
  const ff: any[] = new Array(s?.flat());

  console.log("BOBSBefore", ff);
  quicksort(ff, 0, ff.length - 1);
  console.log("BOBSorVagana", ssd);
  console.log("BOBS", ff);

  return (
    <>
      <div className="grid min-h-0 flex-1 grid-rows-3 gap-4 p-4 sm:grid-cols-7 sm:grid-rows-1 sm:gap-8 sm:p-8">
        {/* timetable */}
        <div className="col-span-1 row-span-1 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 font-medium">
              <span>Timetable</span>
            </h2>
          </div>

          <AutoAnimate className="flex flex-col gap-4">
            <Card className="animate-fade-in-down relative flex flex-col gap-4 p-4">
              <div className="break-words">Men&apos;s hammer throw 14.00</div>
              <div className="break-words">Women&apos;s hammer throw 16.00</div>
              <div className="flex items-center justify-between text-gray-300">
                <button onClick={() => setBut(!but)}>
                  <span className="flex items-center gap-1.5 text-sm">
                    {!but ? (
                      <HiOutlineEye className="text-xl" />
                    ) : (
                      <HiOutlineEyeOff className="text-xl" />
                    )}
                    Show athlete
                  </span>
                </button>
                <button className="relative z-10 -my-1 -mx-2 flex items-center gap-1.5 rounded py-1 px-2 text-sm hover:bg-neutral-900/50 hover:text-white">
                  <HiOutlineTrash className="text-xl" />
                  <span>Edit</span>
                </button>
              </div>
            </Card>
            <Card className="animate-fade-in-down relative flex flex-col gap-4 p-4">
              <Button onClick={() => setBut(!but)} size="lg" variant="primary">
                Submit
              </Button>
              <Button
                onClick={() => setBut(!but)}
                size="lg"
                variant="secondary"
              >
                Submit
              </Button>
              <Button onClick={() => setBut(!but)} size="lg" variant="ghost">
                Submit
              </Button>
              <Button onClick={() => setBut(!but)} size="lg" variant="danger">
                Cancel
              </Button>
              <Button onClick={() => setBut(!but)} size="lg" variant="text">
                <div className="flex items-center gap-2">
                  <HiOutlinePlus />
                  Add
                </div>
              </Button>
            </Card>
            <Card className="animate-fade-in-down relative flex flex-col gap-4 p-4">
              <Button
                onClick={() => setBut(!but)}
                size="lg"
                variant="primary-inverted"
              >
                Submit
              </Button>
              <Button
                onClick={() => setBut(!but)}
                size="lg"
                variant="secondary-inverted"
              >
                Submit
              </Button>
              <TextInput
                placeholder="type..."
                className="w-full"
                type="text"
                prefixEl="Name"
                suffixEl="Asmondgold"
                maxLength={400}
              />
            </Card>
          </AutoAnimate>
        </div>
        {/* Preview window */}
        <div className="row-span-1 flex sm:col-span-4">
          <Card className="flex flex-1 flex-col divide-y divide-neutral-900">
            <TextInput
              placeholder="type name here..."
              className="w-full rounded-b-none border-none shadow-none focus:border focus:shadow-sm"
              type="text"
              prefixEl="Competition"
              maxLength={400}
              value={meetName}
              onChange={(e) => setMeetName(e.target.value)}
            />
            <div className="flex min-h-0 flex-1 flex-col p-4">
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="flex items-baseline justify-between">
                  <h2 className="font-bold">Active Tablo</h2>
                  <Button className="-m-2 !p-2" variant="ghost">
                    <div className="flex items-center">
                      <HiOutlineClipboardCopy />
                      &nbsp; Copy embed url
                    </div>
                  </Button>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto">
                  <AutoAnimate className="flex min-h-full items-center justify-center ">
                    {test ? (
                      <div className="max-w-xs">
                        <div className="w-full max-w-xs border-t-2 border-cyan-300 bg-black/90">
                          <h1 className="px-2 uppercase text-cyan-300">
                            Final
                          </h1>
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
                                <span className={show ? "hidden" : "block"}>
                                  75.10m
                                </span>
                              </div>
                              <ul
                                className={clsx(
                                  "ml-1 flex-[1_1_100%] bg-gray-300 text-black",
                                  show ? "flex" : "hidden"
                                )}
                              >
                                <li className="px-1 py-3">69.50</li>
                                <li className="bg-gray-200 px-1 py-3">69.55</li>
                                <li className="bg-cyan-300/50 px-1 py-3">
                                  75.10
                                </li>
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
                          {meetName}
                        </h1>
                      </div>
                    ) : (
                      <>
                        {/* <p className="text-sm font-medium text-gray-600">
                        No active tablo
                       </p> */}
                        {data && (
                          <Board
                            data={data}
                            status={"Final"}
                            meetName={meetName}
                            onShow={show}
                          />
                        )}
                      </>
                    )}
                  </AutoAnimate>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 divide-x  divide-neutral-900">
              <button
                className="flex items-center justify-center gap-2 rounded-br p-3 text-sm hover:bg-neutral-700 sm:p-4 sm:text-base"
                // onClick={() => unpinAthlete()}
                onClick={() => setTest(!test)}
              >
                {test ? (
                  <>
                    <HiOutlineEye /> Show
                  </>
                ) : (
                  <>
                    <HiOutlineEyeOff /> Hide
                  </>
                )}
              </button>
              <button className="flex items-center justify-center gap-2 rounded-br p-3 text-sm hover:bg-neutral-700 sm:p-4 sm:text-base">
                {/* TODO maybe fix */}
                **All Athlete Results**
              </button>

              <button
                className="flex items-center justify-center gap-2 rounded-br p-3 text-sm hover:bg-neutral-700 sm:p-4 sm:text-base"
                onClick={() => setShow(!show)}
              >
                Next Athlete
              </button>
            </div>
          </Card>
        </div>
        {/* Athletes column */}
        <div className="row-span-2 flex flex-col gap-2 sm:col-span-2 sm:row-span-1">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 font-medium">
              <span>Athletes</span>
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-neutral-800 text-xs font-extrabold">
                {data?.length}
              </span>
              <button
                className="relative z-10 -my-2 flex items-center gap-1.5 rounded py-2 px-2  hover:bg-neutral-900/50 hover:text-white"
                onClick={() => Sorted()}
              >
                {reverseSort ? <HiSortDescending /> : <HiSortAscending />}
              </button>
            </h2>
          </div>
          <AutoAnimate className="flex min-h-0 flex-1 flex-col rounded-lg bg-neutral-800/25">
            <AutoAnimate
              as="ul"
              className="flex flex-col gap-2 overflow-y-auto p-2"
            >
              {data?.map((ath) => (
                <li key={ath.id}>
                  <Card className="animate-fade-in-down relative flex flex-col gap-4 p-4">
                    <div className="flex items-center gap-3 break-words">
                      <p className="">{ath.name}</p>
                      <span className="text-xs opacity-70">
                        PB: {ath.PB} SB: {ath.SB}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      {ath.attempts.map((at) => (
                        <p
                          key={at.id}
                          className="-my-1 rounded bg-neutral-900/50 px-2 py-1 text-sm"
                        >
                          {at.attempt1}
                        </p>
                      ))}
                      {ath.attempts.length < 6 && (
                        <button
                          className="relative -my-1 flex items-center gap-1.5 rounded px-2 py-1 text-sm hover:bg-neutral-900/50 hover:text-white"
                          onClick={() => toggle(ath.id)}
                        >
                          <HiOutlinePlus className="text-base" />
                          <span>Add</span>
                        </button>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-gray-300">
                      <button
                        onClick={() => setBut(!but)}
                        className="relative z-10 -my-1 -mx-2 flex items-center gap-1.5 rounded py-1 px-2 text-sm hover:bg-neutral-900/50 hover:text-white"
                      >
                        {!but ? (
                          <HiOutlineEye className="text-xl" />
                        ) : (
                          <HiOutlineEyeOff className="text-xl" />
                        )}
                        <span>Show athlete</span>
                      </button>

                      <button
                        className="relative z-10 -my-1 -mx-2 flex items-center gap-1.5 rounded py-1 px-2 text-sm hover:bg-neutral-900/50 hover:text-white"
                        onClick={() => deleted.mutate({ id: ath.id })}
                      >
                        <HiOutlineTrash className="text-xl" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </Card>
                </li>
              ))}
              {data?.length === 0 ? (
                <Link
                  href="/create"
                  className="flex items-center gap-1.5 rounded px-2 py-1 text-sm hover:bg-neutral-900/50 hover:text-white"
                >
                  <HiOutlinePlus className="text-base" />
                  <span>Add an athlete</span>
                </Link>
              ) : (
                <Button
                  onClick={() => clearAll.mutate()}
                  disabled={clearAll.isLoading}
                  loading={clearAll.isLoading}
                  size="lg"
                  variant="primary"
                  className="sticky bottom-0 z-50 shadow"
                >
                  Clear all
                </Button>
              )}
            </AutoAnimate>
          </AutoAnimate>
        </div>
      </div>
      <portals.InPortal node={portalNode}>
        <AddAttempt onClose={() => setModal(!modal)} athleteId={id} />
      </portals.InPortal>
      {modal && <portals.OutPortal node={portalNode} />}
    </>
  );
};

function AthleteViewWrapper() {
  // const { data: sesh } = useSession();

  // if (!sesh || !sesh.user?.id) return null;

  return (
    // <PusherProvider slug={`user-${sesh.user?.id}`}>
    <AthleteView />
    // </PusherProvider>
  );
}

const LazyAthleteView = dynamic(() => Promise.resolve(AthleteViewWrapper), {
  ssr: false,
});

const NavButtons = () => {
  const [copy, setCopy] = useState<boolean>(false);
  const copyUrlToClipboard = (path: string) => {
    setCopy(true);
    void navigator.clipboard.writeText(`${window.location.origin}${path}`);
    setTimeout(() => setCopy(false), 1000);
  };

  return (
    <nav className="flex gap-6">
      <Link
        href="/create"
        className="flex items-center gap-2 text-base font-medium transition-all hover:underline"
      >
        Create
      </Link>
      <Button
        onClick={() => copyUrlToClipboard(`/embed/1`)}
        variant="primary"
        size="lg"
      >
        <div className="flex items-center">
          {copy ? (
            <HiOutlineClipboardCheck className="text-xl text-gray-100" />
          ) : (
            <HiOutlineClipboardCopy className="text-xl" />
          )}
          <span className="sr-only sm:not-sr-only">&nbsp; Embed url</span>
        </div>
      </Button>

      <Button variant="primary" size="lg">
        <div className="flex items-center">
          <HiOutlineLogout />
          <span className="sr-only sm:not-sr-only">&nbsp; Logout</span>
        </div>
      </Button>
    </nav>
  );
};

const HomeContent = () => {
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
        <NavButtons />
      </header>
      <LazyAthleteView />
    </div>
  );
};

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>{"Stream Leaderboard Tool"}</title>
        <meta name="description" content="Tablo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="justify-betwee relative flex h-screen w-screen flex-col">
        <HomeContent />
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
};

export default Home;
