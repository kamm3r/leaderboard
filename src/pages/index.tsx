import clsx from "clsx";
import { type NextPage } from "next";
import { signIn } from "next-auth/react";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import React, { useState } from "react";
import { FaDiscord } from "react-icons/fa";
import {
    HiOutlineClipboardCheck,
    HiOutlineClipboardCopy,
    HiOutlineEye,
    HiOutlineEyeOff,
    HiOutlineLogout,
    HiOutlinePlus,
    HiOutlineTrash,
    HiOutlineUserAdd,
    HiPlus,
    HiSortAscending,
    HiSortDescending,
    HiX,
} from "react-icons/hi";
import * as portals from "react-reverse-portal";
import { useTRPCForm } from "trpc-form";

import { AutoAnimate } from "../components/auto-animate";
import Button from "../components/button";
import { Card } from "../components/card";
import { TextInput } from "../components/text-input";
import {
    addAthleteInput,
    addAttemptInput,
} from "../shared/add-athlete-validator";
import { api, type RouterOutputs } from "../utils/api";
import { PusherProvider } from "../utils/pusher";
import { useMeetNameStore } from "../utils/store";

const AddAthlete: React.FC<{ onClose: () => void }> = ({
    onClose,
}): JSX.Element => {
    const utils = api.useContext();

    const form = useTRPCForm({
        mutation: api.athletes.addAthlete,
        validator: addAthleteInput,
        onSuccess: () => {
            void utils.athletes.invalidate();
            onClose();
        },
        onSubmit: async () => {
            await new Promise((r) => setTimeout(r, 2000));
        },
    });

    return (
        <div
            className="fixed inset-0 z-30 flex flex-grow items-center justify-center overflow-y-auto"
            onClick={onClose}
        >
            <div className="fixed inset-0 bg-black/50 backdrop-blur transition-opacity" />
            <dialog
                open
                onClick={(e) => e.stopPropagation()}
                className="rounded bg-neutral-800 p-0 text-gray-300"
            >
                <form
                    className="grid grid-rows-[auto_1fr_auto] items-start"
                    ref={form.ref}
                >
                    <header className="flex items-center justify-between px-6 py-4">
                        <section className="flex items-center gap-4">
                            <HiOutlineUserAdd className="text-xl" />
                            <h3 className="flex-1 text-xl font-bold">New Athlete</h3>
                        </section>
                        <Button
                            variant="ghost"
                            // bg-neutral-600
                            className="rounded-full !p-2"
                            onClick={onClose}
                        >
                            <HiX className="text-xl" />
                        </Button>
                    </header>
                    <menu className="grid grid-cols-1 justify-items-start gap-6 overflow-y-auto bg-neutral-700/50 px-6 py-4 md:grid-cols-2">
                        <li className="flex flex-col">
                            <label
                                className="block text-sm font-medium"
                                htmlFor={form.firstName.id()}
                            >
                                First name:
                            </label>
                            <input
                                className="mt-1 rounded-md border-gray-300 bg-neutral-900/50 px-3 py-2 focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm"
                                type="text"
                                name={form.firstName.name()}
                                placeholder="Tim"
                            />
                            {form.firstName.error((e) => (
                                <p className="py-2 text-xs text-red-400">{e.message}</p>
                            ))}
                        </li>
                        <li className="flex flex-col">
                            <label
                                className="block text-sm font-medium"
                                htmlFor={form.lastName.id()}
                            >
                                Last name:
                            </label>
                            <input
                                className="mt-1 rounded border-gray-300 bg-neutral-900/50 px-3 py-2 focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm"
                                type="text"
                                name={form.lastName.name()}
                                placeholder="Apple"
                            />
                            {form.lastName.error((e) => (
                                <p className="py-2 text-xs text-red-400">{e.message}</p>
                            ))}
                        </li>
                        <li className="flex flex-col">
                            <label
                                className="block text-sm font-medium"
                                htmlFor={form.club.id()}
                            >
                                Club name:
                            </label>
                            <input
                                className="mt-1 rounded border-gray-300 bg-neutral-900/50 px-3 py-2 focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm"
                                type="text"
                                name={form.club.name()}
                                placeholder="HIFK"
                            />
                            {form.club.error((e) => (
                                <p className="py-2 text-xs text-red-400">{e.message}</p>
                            ))}
                        </li>
                        <li className="flex flex-wrap gap-4">
                            <div className="flex w-1/3 flex-col">
                                <label
                                    className="block text-sm font-medium"
                                    htmlFor={form.pb?.id()}
                                >
                                    PB:
                                </label>
                                <input
                                    className="mt-1 rounded border-gray-300 bg-neutral-900/50 px-3 py-2 focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm"
                                    name={form.pb?.name()}
                                    placeholder="10.20"
                                />
                            </div>

                            <div className="flex w-1/3 flex-col">
                                <label
                                    className="block text-sm font-medium"
                                    htmlFor={form.sb?.id()}
                                >
                                    SB:
                                </label>
                                <input
                                    className="mt-1 rounded border-gray-300 bg-neutral-900/50 px-3 py-2 focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm"
                                    name={form.sb?.name()}
                                    placeholder="9.10"
                                />
                            </div>
                            {(form.pb ?? form.sb)?.error((e) => (
                                <p className="py-2 text-xs text-red-400">{e.message}</p>
                            ))}
                        </li>
                    </menu>
                    <footer className="flex flex-wrap items-center justify-center px-6 py-4">
                        <menu className="flex flex-1 flex-wrap justify-end gap-4 pl-0">
                            <Button
                                type="button"
                                onClick={onClose}
                                size="lg"
                                variant="danger"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={form.isSubmitting}
                                loading={form.isSubmitting}
                                size="lg"
                                variant="primary"
                            >
                                Confirm
                            </Button>
                        </menu>
                    </footer>
                </form>
            </dialog>
        </div>
    );
};

const AddAttempt: React.FC<{
    onClose: () => void;
    athleteId?: string;
}> = ({ onClose, athleteId }): JSX.Element => {
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
        <div
            className="fixed inset-0 z-30 flex flex-grow items-center justify-center overflow-y-auto"
            onClick={onClose}
        >
            <div className="fixed inset-0 bg-black/50 transition-opacity" />
            <dialog
                open
                onClick={(e) => e.stopPropagation()}
                className="rounded bg-neutral-800 p-0 text-gray-300"
            >
                <form
                    ref={form.ref}
                    className="grid grid-rows-[auto_1fr_auto] items-start"
                >
                    <header className="flex items-center justify-between px-6 py-4">
                        <h3 className="flex-1 text-xl font-bold">Add Attempt</h3>
                        <Button variant="ghost" onClick={onClose}>
                            L + Ratio
                        </Button>
                    </header>
                    <article className="grid justify-items-start gap-4 overflow-y-auto bg-neutral-700/50 px-6 py-4">
                        {/* TODO: Remove it or change it to a name??? */}
                        <div className="hidden">
                            <TextInput name={form.athleteId.name()} value={athleteId} />
                            {form.athleteId.error((e) => (
                                <p className="py-2 text-xs text-red-400">{e.message}</p>
                            ))}
                        </div>
                        <section className="flex flex-wrap items-center gap-4">
                            {/* className="mt-1 rounded bg-neutral-900/50 py-2 px-3 focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm" */}
                            <label htmlFor={form.attempt1.id()}>Type Attempt</label>
                            <TextInput
                                className="bg-neutral-900/50"
                                name={form.attempt1.name()}
                                placeholder="60.69"
                            />
                            {form.attempt1.error((e) => (
                                <p className="py-2 text-xs text-red-400">{e.message}</p>
                            ))}
                        </section>
                        <small>
                            <b>*</b> Have to use period not comma
                        </small>
                    </article>
                    <footer className="flex flex-wrap items-center justify-center px-6 py-4">
                        <menu className="flex flex-1 flex-wrap justify-end gap-4 pl-0">
                            <Button
                                type="button"
                                onClick={onClose}
                                size="lg"
                                variant="danger"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={form.isSubmitting}
                                loading={form.isSubmitting}
                                size="lg"
                                variant="primary"
                            >
                                Confirm
                            </Button>
                        </menu>
                    </footer>
                </form>
            </dialog>
        </div>
    );
};

type StatusProp = "Qualification" | "Semi-Final" | "Final";

type BoardType = {
    data: RouterOutputs["athletes"]["getAll"];
    status: StatusProp;
    meetName: string;
    pinned: string;
};

export const Board: React.FC<BoardType> = ({
    data,
    status,
    meetName,
    pinned,
}) => {
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
                                <span>
                                    {a.attempts.length > 0
                                        ? Math.max(
                                            ...a.attempts.map((cock) => parseFloat(cock.attempt1))
                                        )
                                        : "-"}
                                </span>
                            </div>
                            <ul
                                className={clsx(
                                    "ml-1  flex-[1_1_100%] bg-gray-300 text-black",
                                    pinned === a.id ? "flex" : "hidden"
                                )}
                            >
                                {/* bg-cyan-300/50 is for highest value */}
                                <li className="min-w-[16.7%] px-1 py-2">
                                    {a.attempts[0]?.attempt1}
                                </li>
                                <li className="min-w-[16.7%] bg-gray-200 px-1 py-2">
                                    {a.attempts[1]?.attempt1}
                                </li>
                                <li className="min-w-[16.7%] bg-cyan-300/50 px-1 py-2">
                                    {a.attempts[2]?.attempt1}
                                </li>
                                <li className="min-w-[16.6%] px-1 py-2">
                                    {a.attempts[3]?.attempt1}
                                </li>
                                <li className="min-w-[16.7%] bg-gray-200 px-1 py-2">
                                    {a.attempts[4]?.attempt1}
                                </li>
                                <li className="min-w-[16.7%] px-1 py-2">
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
    const bigT = useMeetNameStore((state) => state.meet);
    const willy = useMeetNameStore((state) => state.setNewMeetName);
    const isaac = useMeetNameStore((state) => state.addMeetName);

    const portalNode = React.useMemo(() => {
        if (typeof window === "undefined") console.log("no bitch");
        return portals.createHtmlPortalNode();
    }, []);
    const portalSnob = React.useMemo(() => {
        if (typeof window === "undefined") console.log("no bitch");
        return portals.createHtmlPortalNode();
    }, []);
    const [reverseSort, setReverseSort] = useState(false);
    const [show, setShow] = useState(false);
    const [test, setTest] = useState(false);
    const [athlete, setAthlete] = useState(false);
    const [modal, setModal] = useState(false);
    // TODO:get the athlete id maybe better way
    const [id, setId] = useState<string>();
    const [tab, setTab] = useState("1");
    // TODO:kind of poitless functions assIn, toggle
    const assIn = (): void => setAthlete(!athlete);
    const toggle = (id: string): void => {
        setModal(!modal);
        setId(id);
    };

    const { data: session } = api.auth.getSession.useQuery()
    const { data, isLoading, refetch } = api.athletes.getAll.useQuery();

    // Refetch when new questions come through
    // useSubscribeToEvent("new-athlete", ()=> refetch())

    const { mutate: pinAthleteMutation, variables: currentlyPinned } =
        api.athletes.pin.useMutation();
    const pinndedId = currentlyPinned?.id ?? data?.find((a) => a.id)?.id;

    const deleted = api.athletes.delete.useMutation({
        // TODO:maybe just invalidate?
        onSuccess: () => void refetch(),
    });
    const clearAll = api.athletes.deleteAll.useMutation({
        // TODO:maybe just invalidate?
        onSuccess: () => void refetch(),
    });

    const pinAthlete = ({ athleteId }: { athleteId: string }) => {
        return pinAthleteMutation({ id: athleteId });
    };

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
                                <button className="relative z-10 -mx-2 -my-1 flex items-center gap-1.5 rounded px-2 py-1 text-sm hover:bg-neutral-900/50 hover:text-white" />
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
                            <button className="relative z-10 -my-2 flex items-center gap-1.5 rounded px-2 py-2  hover:bg-neutral-900/50 hover:text-white" />
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
                                        <button className="relative z-10 -mx-2 -my-1 flex items-center gap-1.5 rounded px-2 py-1 text-sm" />
                                        <button className="relative z-10 -mx-2 -my-1 flex items-center gap-1.5 rounded px-2 py-1 text-sm" />
                                    </div>
                                </Card>
                            </li>
                        </AutoAnimate>
                    </AutoAnimate>
                </div>
            </div>
        );
    // mutable not good TODO: make data immutable
    // const Sorted = (): void => {
    //   if (reverseSort) {
    //     console.log("pass");
    //     data?.sort(
    //       (a, b) =>
    //         Math.max(...a.attempts.map((at) => parseFloat(at.attempt1))) -
    //         Math.max(...b.attempts.map((at) => parseFloat(at.attempt1)))
    //     );
    //     setReverseSort(!reverseSort);
    //   } else {
    //     console.log("smash");
    //     data
    //       ?.sort(
    //         (a, b) =>
    //           Math.max(...a.attempts.map((at) => parseFloat(at.attempt1))) -
    //           Math.max(...b.attempts.map((at) => parseFloat(at.attempt1)))
    //       )
    //       .reverse();
    //     setReverseSort(!reverseSort);
    //   }
    // };

    //  const selectedAthlete = data?.find((a) => a.id === pinndedId)
    const otherAthlete = data?.filter((a) => a.id) ?? [];

    const athletesSorted = reverseSort
        ? [...otherAthlete].reverse()
        : otherAthlete;

    return (
        <>
            <div className="grid min-h-0 flex-1 grid-rows-3 gap-4 p-4 sm:grid-cols-7 sm:grid-rows-1 sm:gap-8 sm:p-8">
                {/* timetable */}
                <div className="col-span-1 row-span-1 flex flex-col gap-4">
                    <header className="flex items-center justify-between">
                        <h3 className="flex items-center gap-1.5 font-medium">Timetable</h3>
                    </header>
                    <AutoAnimate className="flex flex-col gap-4">
                        <Card className="animate-fade-in-down relative flex flex-col gap-4 p-4">
                            <div className="break-words">Men&apos;s hammer throw 14.00</div>
                            <div className="break-words">Women&apos;s hammer throw 16.00</div>
                            <div className="flex items-center justify-between text-gray-300">
                                <Button
                                    variant="ghost"
                                    icon={<HiOutlineEye className="text-xl" />}
                                    className="!px-2 !py-1 text-sm"
                                >
                                    Show athlete
                                </Button>
                                <Button
                                    variant="ghost"
                                    icon={<HiOutlineTrash className="text-xl" />}
                                    className="!px-2 !py-1 text-sm"
                                >
                                    Edit
                                </Button>
                            </div>
                        </Card>
                        <Card className="animate-fade-in-down relative flex flex-col gap-4 p-4">
                            <Button size="lg" variant="primary">
                                Submit
                            </Button>
                            <Button size="lg" variant="primary-inverted">
                                Submit
                            </Button>
                            <Button size="lg" variant="secondary">
                                Submit
                            </Button>
                            <Button size="lg" variant="secondary-inverted">
                                Submit
                            </Button>
                            <Button size="lg" variant="ghost">
                                Submit
                            </Button>
                            <Button size="lg" variant="danger">
                                Cancel
                            </Button>
                            <Button size="lg" variant="text" icon={<HiOutlinePlus />}>
                                Add
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
                        <div className="flex">
                            <TextInput
                                placeholder="type name here..."
                                className="w-full rounded-b-none border-none shadow-none focus:border focus:shadow-sm"
                                type="text"
                                prefixEl="Competition"
                                maxLength={400}
                                value={bigT}
                                onChange={(e) => willy(e.target.value)}
                            />
                            <Button variant="ghost" onClick={() => isaac()}>
                                Set
                            </Button>
                        </div>
                        <div className="flex min-h-0 flex-1 flex-col p-4">
                            <div className="flex min-h-0 flex-1 flex-col">
                                <div className="flex items-baseline justify-between">
                                    <h2 className="font-bold">
                                        {test ? "Active" : "Inactive"} Tablo{" "}
                                    </h2>
                                    <Embed />
                                </div>
                                <div className="min-h-0 flex-1 overflow-y-auto">
                                    <AutoAnimate className="flex min-h-full items-center justify-center ">
                                        {test ? (
                                            data && (
                                                <Board
                                                    data={data}
                                                    status={"Final"}
                                                    meetName={bigT}
                                                    pinned={pinndedId ? pinndedId : ''}
                                                />
                                            )
                                        ) : (
                                            <p className="text-sm font-medium text-neutral-600">
                                                No active tablo {session?.user.name?.toLowerCase()}
                                            </p>
                                        )}
                                    </AutoAnimate>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 divide-x divide-neutral-900">
                            <Button
                                variant="ghost"
                                // onClick={() => unpinAthlete()}
                                icon={test ? <HiOutlineEye /> : <HiOutlineEyeOff />}
                                className="flex items-center justify-center gap-2 rounded-none !rounded-bl p-3 text-sm sm:p-4 sm:text-base"
                                onClick={() => setTest(!test)}
                            >
                                {test ? "Show" : "Hide"}
                            </Button>
                            <Button
                                variant="ghost"
                                className="flex items-center justify-center gap-2 rounded-none border-b-0 border-t-0 p-3 text-sm sm:p-4 sm:text-base"
                            //  TODO maybe fix
                            >
                                **All Athlete Results**
                            </Button>
                            <Button
                                variant="ghost"
                                className="flex items-center justify-center gap-2 rounded-none !rounded-br border-b-0 border-t-0 p-3 text-sm sm:p-4 sm:text-base"
                                onClick={() => setShow(!show)}
                            >
                                Timetable
                            </Button>
                            <Button
                                variant="ghost"
                                className="flex items-center justify-center gap-2 rounded-none !rounded-br border-b-0 border-t-0 p-3 text-sm sm:p-4 sm:text-base"
                                onClick={() => setShow(!show)}
                            >
                                Next Athlete
                            </Button>
                        </div>
                    </Card>
                </div>
                {/* Athletes column */}
                <div className="flex flex-col gap-2 sm:col-span-2">
                    <div className="flex items-center justify-between">
                        <menu className="flex items-center gap-1.5 font-medium">
                            <li>Athletes</li>
                            <li className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-neutral-800 text-xs font-extrabold">
                                {data?.length}
                            </li>
                            <Button
                                // className="relative z-10 -my-2 flex items-center gap-1.5 rounded py-2 px-2  hover:bg-neutral-900/50 hover:text-white"
                                variant="ghost"
                                size="xl"
                                onClick={() => setReverseSort(!reverseSort)}
                                // onClick={() => Sorted()}
                                className="!p-2"
                            >
                                {reverseSort ? <HiSortDescending /> : <HiSortAscending />}
                            </Button>
                        </menu>
                        <Button variant="primary" onClick={() => assIn()}>
                            <HiPlus className="-mx-1.5" />
                        </Button>
                    </div>
                    <AutoAnimate className="flex min-h-0 flex-1 flex-col rounded-lg bg-neutral-800/25">
                        <header className="p-2">
                            <nav className="flex">
                                <button
                                    className={clsx(
                                        "inline-flex rounded-lg px-4 py-2 text-sm",
                                        tab === "1" && "bg-neutral-700"
                                    )}
                                    onClick={() => setTab("1")}
                                >
                                    Men
                                </button>
                                <button
                                    className={clsx(
                                        "inline-flex rounded-lg px-4 py-2 text-sm",
                                        tab === "2" && "bg-neutral-700"
                                    )}
                                    onClick={() => setTab("2")}
                                >
                                    Women
                                </button>
                                <button
                                    className={clsx(
                                        "inline-flex rounded-lg px-4 py-2 text-sm",
                                        tab === "3" && "bg-neutral-700"
                                    )}
                                    onClick={() => setTab("3")}
                                >
                                    Child
                                </button>
                            </nav>
                        </header>
                        <AutoAnimate
                            as="ul"
                            className="flex flex-col gap-2 overflow-y-auto p-2"
                        >
                            {athletesSorted.map((ath) => (
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
                                                <Button
                                                    variant="ghost"
                                                    icon={<HiPlus className="text-base" />}
                                                    className="-my-1 !px-2 !py-1 text-sm"
                                                    onClick={() => toggle(ath.id)}
                                                >
                                                    Add
                                                </Button>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between text-gray-300">
                                            <Button
                                                onClick={() => pinAthlete({ athleteId: ath.id })}
                                                variant="ghost"
                                                icon={
                                                    // 1 === 1 ? (
                                                    <HiOutlineEye className="text-xl" />
                                                    // ) : (
                                                    //   <HiOutlineEyeOff className="text-xl" />
                                                    // )
                                                }
                                                className="-mx-2 -my-1 !px-2 !py-1 text-sm"
                                            >
                                                Show athlete
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                icon={<HiOutlineTrash className="text-xl" />}
                                                className="-mx-2 -my-1 !px-2 !py-1 text-sm"
                                                onClick={() => deleted.mutate({ id: ath.id })}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    </Card>
                                </li>
                            ))}
                            {data?.length === 0 ? (
                                <Button
                                    onClick={() => assIn()}
                                    icon={<HiPlus className="text-base" />}
                                    variant="primary"
                                    size="lg"
                                >
                                    Add Athlete
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => clearAll.mutate()}
                                    disabled={clearAll.isLoading}
                                    loading={clearAll.isLoading}
                                    size="lg"
                                    variant="primary"
                                    className="sticky bottom-0 z-10 shadow"
                                >
                                    Clear all
                                </Button>
                            )}
                        </AutoAnimate>
                    </AutoAnimate>
                </div>
            </div>
            <portals.InPortal node={portalSnob}>
                <AddAthlete onClose={() => setAthlete(!athlete)} />
            </portals.InPortal>
            <portals.InPortal node={portalNode}>
                <AddAttempt onClose={() => setModal(!modal)} athleteId={id ?? ""} />
            </portals.InPortal>
            {modal && <portals.OutPortal node={portalNode} />}
            {athlete && <portals.OutPortal node={portalSnob} />}
        </>
    );
};

function AthleteViewWrapper() {
    const { data: session } = api.auth.getSession.useQuery();

    if (!session?.user.id) return null;

    return (
        <PusherProvider slug={`user-${session.user.id}`}>
            <AthleteView />
        </PusherProvider>
    );
}

const LazyAthleteView = dynamic(() => Promise.resolve(AthleteViewWrapper), {
    ssr: false,
});

function Embed() {
    const [copy, setCopy] = useState<boolean>(false);
    const copyUrlToClipboard = (path: string) => {
        setCopy(true);
        void navigator.clipboard.writeText(`${window.location.origin}${path}`);
        setTimeout(() => setCopy(false), 1000);
    };
    return (
        <Button
            className="-m-2 !p-2"
            onClick={() => copyUrlToClipboard(`/embed/1`)}
            variant="ghost"
            size="lg"
            icon={
                copy ? (
                    <HiOutlineClipboardCheck className="text-gray-100" />
                ) : (
                    <HiOutlineClipboardCopy />
                )
            }
        >
            <span className="sr-only text-sm sm:not-sr-only">Embed url</span>
        </Button>
    );
}

const NavButtons = () => {
    return (
        <nav className="flex gap-6">
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
    const { data: session } = api.auth.getSession.useQuery()

    if (session) {
        return (
            <div className="flex min-h-0 flex-1 flex-col">
                <header className="flex items-center justify-between px-4 pb-2 pt-4 sm:px-8 sm:py-4">
                    <Link
                        href="/"
                        className="relative whitespace-nowrap text-2xl font-bold"
                    >
                        Tablo{" "}
                        <sup className="absolute left-[calc(100%+.25rem)] top-0 text-xs font-extrabold text-gray-400">
                            [BETA]
                        </sup>
                    </Link>
                    <NavButtons />
                </header>
                <LazyAthleteView />
            </div>
        );
    } else {
        return (
            <div className="flex grow flex-col items-center justify-center p-4">
                <header className="flex items-center justify-between px-4 pb-2 pt-4 sm:px-8 sm:py-4">
                    <h1 className="relative mb-8 text-6xl font-bold">
                        Tablo{" "}
                        <sup className="absolute left-full top-0 text-xs font-extrabold text-gray-400">
                            [BETA]
                        </sup>
                    </h1>
                </header>

                <div className="mb-8 text-center text-lg">
                    An easy way to curate questions from your audience and embed them in
                    your OBS.
                </div>
                <Button
                    variant="secondary-inverted"
                    size="xl"
                    onClick={() => void signIn("discord")}
                >
                    <div className="flex items-center">
                        <FaDiscord /> &nbsp; Sign In
                    </div>
                </Button>
            </div>
        );
    }
};

const Home: NextPage = (): JSX.Element => {
    return (
        <>
            <Head>
                <title>{"Stream Leaderboard Tool"}</title>
                <meta name="description" content="Tablo" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="relative flex h-screen w-screen flex-col justify-between">
                <HomeContent />
                <footer className="flex justify-between px-8 py-4">
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
