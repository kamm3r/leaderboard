import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "../../utils/trpc";
import {
  addAthleteInput,
  type AddAthleteInputType,
} from "../../shared/add-athlete-validator";
import Layout from "../../components/layout";

const AddAthleteForm = () => {
  const router = useRouter();

  const { mutate, isLoading, data } = trpc.athletes.addAthlete.useMutation({
    onSuccess: (data) => {
      console.log("submitted", data);

      router.push(`/`);
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<AddAthleteInputType>({
    resolver: zodResolver(addAthleteInput),
  });

  if (isLoading || data)
    return (
      <div className="flex min-h-screen items-center justify-center antialiased">
        <p className="text-white/40">Loading...</p>
      </div>
    );
  // // Works W in the chat

  return (
    <Layout title="Create Athlete">
      <div className="m-auto max-w-xl">
        <div className="rounded bg-neutral-800 p-5">
          <h1 className="text-xl font-semibold">Add athlete</h1>
          <form
            className="flex w-full flex-col gap-10"
            onSubmit={handleSubmit((data) => {
              mutate(data);
            })}
          >
            <ul className="mt-4 grid w-full grid-cols-1 gap-5 md:grid-cols-2">
              <li className="flex flex-col">
                <label className="block text-sm font-medium">First name:</label>
                <input
                  className="mt-1 rounded-md border-gray-300 bg-neutral-900/50 py-2 px-3 focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm"
                  type="text"
                  {...register("firstName", { required: true })}
                  placeholder="Tim"
                />
                {errors.firstName && (
                  <p className="py-2 text-xs text-red-400">
                    {errors.firstName.message}
                  </p>
                )}
              </li>
              <li className="flex flex-col">
                <label className="block text-sm font-medium">Last name:</label>
                <input
                  className="mt-1 rounded border-gray-300 bg-neutral-900/50 py-2 px-3 focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm"
                  type="text"
                  {...register("lastName", { required: true })}
                  placeholder="Apple"
                />
                {errors.lastName && (
                  <p className="py-2 text-xs text-red-400">
                    {errors.lastName.message}
                  </p>
                )}
              </li>

              <li className="flex flex-col">
                <label className="block text-sm font-medium">Club name:</label>
                <input
                  className="mt-1 rounded border-gray-300 bg-neutral-900/50 py-2 px-3 focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm"
                  type="text"
                  {...register("club", { required: true })}
                  placeholder="HIFK"
                />
                {errors.club && (
                  <p className="py-2 text-xs text-red-400">
                    {errors.club.message}
                  </p>
                )}
              </li>
              <li className="flex gap-5">
                <div className="flex w-1/3 flex-col">
                  <label className="block text-sm font-medium">PB:</label>
                  <input
                    className="rounded border-gray-300 bg-neutral-900/50 py-2 px-3 focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm"
                    {...register("pb", { required: false })}
                    placeholder="10.20"
                  />
                </div>

                <div className="flex w-1/3 flex-col">
                  <label className="block text-sm font-medium">SB:</label>
                  <input
                    className="rounded border-gray-300 bg-neutral-900/50 py-2 px-3 focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm"
                    {...register("sb", { required: false })}
                    placeholder="9.10"
                  />
                </div>
                {errors.pb && errors.sb && (
                  <p className="py-2 text-xs text-red-400">
                    {errors.sb.message || errors.pb.message}
                  </p>
                )}
              </li>
            </ul>
            <button
              type="submit"
              className="rounded bg-neutral-500 py-2 px-4 text-sm font-medium hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2"
            >
              Add Athlete
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

const Athlete: React.FC = () => {
  return <AddAthleteForm />;
};

export default Athlete;
