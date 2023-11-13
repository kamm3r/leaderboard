import clsx from "clsx";
import {
  ClipboardCheckIcon,
  ClipboardCopyIcon,
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  LogOutIcon,
  PlusIcon,
  SortAscIcon,
  SortDescIcon,
  Trash2Icon,
} from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import { useTRPCForm } from "node_modules/trpc-form/dist";
import React, { useState } from "react";
import { FaDiscord } from "react-icons/fa";
import { z } from "zod";
import { AutoAnimate } from "~/@/components/auto-animate";
import { Card, CardContent, CardFooter, CardHeader } from "~/@/components/ui/card";
import { Input } from "~/@/components/ui/input";
import { api, type RouterOutputs } from "~/utils/api";
import { PusherProvider } from "~/utils/pusher";
import { useMeetNameStore } from "~/utils/store";
import { Label } from "~/@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "~/@/components/ui/avatar";
import { Button } from "~/@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/@/components/ui/dialog";
import { ThemeToggle } from "~/@/components/themeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const addAthleteInput = z.object({
  firstName: z.string(),
  lastName: z.string(),
  club: z.string(),
  pb: z.string().optional().default(""),
  sb: z.string().optional().default(""),
});

const addAttemptInput = z.object({
  attempt1: z.string(),
  athleteId: z.string().cuid(),
});

function AddAthlete() {
  const utils = api.useUtils();
  const [open, setOpen] = useState(false);
  const addAthlete = api.athletes.addAthlete.useMutation({
    onSuccess: async () => {
      await new Promise((r) => setTimeout(r, 2000)).then(() => setOpen(false))
    }
  });

  const form = useForm<z.infer<typeof addAthleteInput>>({
    resolver: zodResolver(addAthleteInput)
  })


  function onSubmit(values: z.infer<typeof addAthleteInput>) {
    addAthlete.mutate(values);
    utils.athletes.invalidate();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <PlusIcon className="-mx-1.5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Athlete</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="grid grid-rows-[auto_1fr_auto] items-start"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <menu className="grid grid-cols-1 justify-items-start gap-6 overflow-y-auto px-6 py-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input placeholder="tim" {...field} />
                    </FormControl>
                    <FormDescription>
                      <b>*</b> dude dude
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input placeholder="apple" {...field} />
                    </FormControl>
                    <FormDescription>
                      <b>*</b> dude dude
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="club"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Club name</FormLabel>
                    <FormControl>
                      <Input placeholder="HIFK" {...field} />
                    </FormControl>
                    <FormDescription>
                      <b>*</b> dude dude
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <li className="flex flex-wrap gap-4">
                <FormField
                  control={form.control}
                  name="pb"
                  render={({ field }) => (
                    <FormItem className="w-1/3">
                      <FormLabel>PB</FormLabel>
                      <FormControl>
                        <Input placeholder="20.34" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sb"
                  render={({ field }) => (
                    <FormItem className="w-1/3">
                      <FormLabel>SB</FormLabel>
                      <FormControl>
                        <Input placeholder="20.20" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </li>
            </menu>
            <DialogFooter>
              <Button type="button" variant="destructive">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <><Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> please wait</>
                ) :
                  'Confirm'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};


function AddAttempt({ athleteId }: { athleteId?: string }) {
  const utils = api.useUtils();
  const [open, setOpen] = useState(false);
  const addAttempt = api.athletes.addAttempt.useMutation({
    onSuccess: async () => {
      await new Promise((r) => setTimeout(r, 2000)).then(() => setOpen(false))
    }
  });

  const form = useForm<z.infer<typeof addAttemptInput>>({
    resolver: zodResolver(addAttemptInput),
    defaultValues: {
      athleteId,
    },
  })


  function onSubmit(values: z.infer<typeof addAttemptInput>) {
    addAttempt.mutate(values);
    utils.athletes.invalidate();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-auto px-2 py-1 text-sm">
          <PlusIcon className="mr-2 h-4 w-4" /> Add
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Attempt</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-rows-[auto_1fr_auto] items-start"
          >
            <FormField
              control={form.control}
              name="attempt1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attempt</FormLabel>
                  <FormControl>
                    <Input placeholder="type attempt" {...field} />
                  </FormControl>
                  <FormDescription>
                    <b>*</b> Have to use period not comma
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="destructive"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isLoading ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    please wait
                  </>
                ) :
                  "Confirm"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

type StatusProp = "Qualification" | "Semi-Final" | "Final";

type BoardType = {
  data: RouterOutputs["athletes"]["getAll"];
  status: StatusProp;
  meetName: string;
  pinned: string;
};

export function Board({ data, status, meetName, pinned }: BoardType) {
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
                      ...a.attempts.map((cock) => parseFloat(cock.attempt1)),
                    )
                    : "-"}
                </span>
              </div>
              <ul
                className={clsx(
                  "ml-1  flex-[1_1_100%] bg-gray-300 text-black",
                  pinned === a.id ? "flex" : "hidden",
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
}

function AthleteView() {
  const bigT = useMeetNameStore((state) => state.meet);
  const willy = useMeetNameStore((state) => state.setNewMeetName);
  const isaac = useMeetNameStore((state) => state.addMeetName);

  const [reverseSort, setReverseSort] = useState(false);
  const [show, setShow] = useState(false);
  const [test, setTest] = useState(false);

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

  if (isLoading) {
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
              <Button />
              <Button />
              <Button />
              <Button />
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
  }
  // mutable not good TODO: make data immutable

  //  const selectedAthlete = data?.find((a) => a.id === pinndedId)
  const otherAthlete = data?.filter((a) => a.id) ?? [];

  const athletesSorted = reverseSort
    ? [...otherAthlete].reverse()
    : otherAthlete;

  return (
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
          </Card>
          <Card className="animate-fade-in-down relative flex flex-col gap-4 p-4">
            <Button>Submit</Button>
            <Button variant="secondary">Submit</Button>
            <Button variant="outline">Submit</Button>
            <Button variant="ghost">Submit</Button>
            <Button variant="link">Submit</Button>
            <Button variant="destructive">Cancel</Button>
            <Button variant="outline">
              <PlusIcon className="mr-2 h-4 w-4" /> Add
            </Button>
            <Input placeholder="type..." className="w-full" type="text" />
          </Card>
        </AutoAnimate>
      </div>
      {/* Preview window */}
      <div className="row-span-1 flex sm:col-span-4">
        <Card className="flex flex-1 flex-col divide-y divide-neutral-900">
          <div className="flex">
            <Input
              placeholder="type name here..."
              className="w-full rounded-b-none border-none shadow-none focus:border focus:shadow-sm"
              type="text"
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
                        pinned={pinndedId ? pinndedId : ""}
                      />
                    )
                  ) : (
                    <p className="text-sm font-medium text-neutral-600">
                      No active tablo
                    </p>
                  )}
                </AutoAnimate>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 divide-x divide-neutral-900">
            <Button
              variant="ghost"
              className="flex items-center justify-center gap-2 rounded-none !rounded-bl p-3 text-sm sm:p-4 sm:text-base"
              onClick={() => setTest(!test)}
            >
              {test ? (
                <><EyeIcon className="h-4 w-4" /> Show</>
              ) : (
                <><EyeOffIcon className="h-4 w-4" /> Hide</>
              )}
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
              variant="ghost"
              size="icon"
              onClick={() => setReverseSort(!reverseSort)}
              // onClick={() => Sorted()}
              className="!p-2"
            >
              {reverseSort ? <SortDescIcon className="h-4 w-4" /> : <SortAscIcon className="h-4 w-4" />}
            </Button>
          </menu>
          <AddAthlete />
        </div>
        <AutoAnimate className="flex min-h-0 flex-1 flex-col rounded-lg bg-neutral-800/25">
          <Tabs defaultValue="men">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="men">Men</TabsTrigger>
              <TabsTrigger value="women">Women</TabsTrigger>
              <TabsTrigger value="child">Child</TabsTrigger>
            </TabsList>
            <TabsContent value="men">
              <AutoAnimate
                as="ul"
                className="flex flex-col gap-2 overflow-y-auto p-2"
              >
                {athletesSorted.map((ath) => (
                  <li key={ath.id}>
                    <Card className="animate-fade-in-down relative flex flex-col gap-4 p-4">
                      <CardHeader className="flex-row items-center gap-3 break-words p-0">
                        <p className="">{ath.name}</p>
                        <span className="text-xs opacity-70">
                          PB: {ath.PB} SB: {ath.SB}
                        </span>
                      </CardHeader>
                      <CardContent className="flex items-center gap-2 p-0">
                        {ath.attempts.map((at) => (
                          <p
                            key={at.id}
                            className="-my-1 rounded bg-neutral-800/50 px-2 py-1 text-sm"
                          >
                            {at.attempt1}
                          </p>
                        ))}
                        {ath.attempts.length < 6 && (
                          <AddAttempt athleteId={ath.id} />
                        )}
                      </CardContent>
                      <CardFooter className="flex items-center justify-between p-0">
                        <Button
                          onClick={() => pinAthlete({ athleteId: ath.id })}
                          variant="ghost"
                          className="-mx-2 -my-1 px-2 py-1 text-sm"
                        >
                          {/* // 1 === 1 ? ( */}
                          <EyeIcon className="mr-2 h-4 w-4" />
                          {/* // ) : ( */}
                          {/* //   <EyeOffIcon className="text-xl" /> */}
                          {/* // ) */}
                          Show athlete
                        </Button>
                        <Button
                          variant="ghost"
                          className="-mx-2 -my-1 px-2 py-1 text-sm"
                          onClick={() => deleted.mutate({ id: ath.id })}
                        >
                          <Trash2Icon className="mr-2 h-4 w-4" /> Remove
                        </Button>
                      </CardFooter>
                    </Card>
                  </li>
                ))}
                {data?.length === 0 ? (
                  <AddAthlete />
                ) : (
                  <Button
                    onClick={() => clearAll.mutate()}
                    disabled={clearAll.isLoading}
                    className="sticky bottom-0 z-10 shadow"
                  >
                    {clearAll.isLoading ? (
                      <>
                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                        please wait
                      </>
                    ) : (
                      "Clear all"
                    )}
                  </Button>
                )}
              </AutoAnimate>
            </TabsContent>
          </Tabs>
        </AutoAnimate>
      </div>
    </div>
  );
}

function AthleteViewWrapper() {
  const { data: sessionData } = useSession();

  if (!sessionData?.user.id) return null;

  return (
    // <PusherProvider slug={`user-${sessionData.user.id}`}>
    <AthleteView />
    // </PusherProvider>
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
      size="icon"
    >
      {copy ? (
        <ClipboardCheckIcon className="h-4 w-4" />
      ) : (
        <ClipboardCopyIcon className="h-4 w-4" />
      )}
      <span className="sr-only">Embed url</span>
    </Button>
  );
}

function NavButtons() {
  const { data: sessionData } = useSession();
  return (
    <nav className="flex gap-6">
      <ThemeToggle />
      <h1 className="flex items-center gap-2 text-base font-medium">
        {sessionData?.user.image && (
          <Avatar>
            <AvatarImage
              src={sessionData.user.image}
              alt={sessionData.user.name!}
            />
            <AvatarFallback>
              {sessionData.user.name
                ?.match(/\b(\w)/g)
                ?.join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
        <span className="sr-only sm:not-sr-only">{sessionData?.user.name}</span>
      </h1>
      <Button onClick={() => void signOut()}>
        <LogOutIcon />
        <span className="sr-only sm:not-sr-only">&nbsp; Logout</span>
      </Button>
    </nav>
  );
}

function HomeContent() {
  const { data: sessionData } = useSession();

  if (!sessionData) {
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
        <Button variant="secondary" onClick={() => signIn("discord")}>
          <FaDiscord className="mr-2 h-4 w-4" /> &nbsp; Sign In
        </Button>
      </div>
    );
  }
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
}

export default function Home() {
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
              Kammer
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
