import dynamic from "next/dynamic";
import Head from "next/head";
// import { useRouter } from "next/router";
import { api } from "../../utils/api";
import { PusherProvider } from "../../utils/pusher";
import { useMeetNameStore } from "../../utils/store";
import { Board } from "../index";

type CompProps = {
  userId?: string;
};

const BrowserEmbedView: React.FC<CompProps> = () => {
  // const latestMessage = useLatestPusherMessage(userId);

  const meetName = useMeetNameStore((state) => state.meet);
  const { data, isLoading } = api.athletes.getAll.useQuery();
  const {
    // mutate: pinAthleteMutation,
    variables: currentlyPinned,
    // reset,
  } = api.athletes.pin.useMutation();
  const pinndedId = currentlyPinned?.id ?? data?.find((a) => a.id)?.id;

  // if (!latestMessage) return null;
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

const LazyEmbedView = dynamic(() => Promise.resolve(BrowserEmbedView), {
  ssr: false,
});

const BrowserEmbedQuestionView = () => {
  // const { query } = useRouter();
  // if (!query.uid || typeof query.uid !== "string") {
  //   return null;
  // }

  return (
    <PusherProvider slug={" "}>
      <LazyEmbedView />
    </PusherProvider>
  );
};

export default BrowserEmbedQuestionView;
