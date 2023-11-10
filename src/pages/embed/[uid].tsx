import dynamic from "next/dynamic";
import Head from "next/head";
import { Board } from "~/pages";
import { api } from "~/utils/api";
import { PusherProvider } from "~/utils/pusher";
import { useMeetNameStore } from "~/utils/store";

const BrowserEmbedViewCore = () => {
  const meetName = useMeetNameStore((state) => state.meet);
  const { data, isLoading } = api.athletes.getAll.useQuery();
  const { variables: currentlyPinned } = api.athletes.pin.useMutation();
  const pinndedId = currentlyPinned?.id ?? data?.find((a) => a.id)?.id;
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Head>
        <title>Embed</title>
      </Head>
      {isLoading || !data ? (
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
      ) : (
        <Board
          data={data}
          status={"Final"}
          meetName={meetName}
          pinned={pinndedId ? pinndedId : ""}
        />
      )}
    </div>
  );
};

const LazyEmbedView = dynamic(() => Promise.resolve(BrowserEmbedViewCore), {
  ssr: false,
});

const BrowserEmbedView = ({ userId }: { userId?: string }) => {
  if (!userId) return null;

  return (
    <PusherProvider slug={`user-${userId}`}>
      <LazyEmbedView />
    </PusherProvider>
  );
};

export default BrowserEmbedView;
