// import { zodResolver } from "@hookform/resolvers/zod";
import Head from "next/head";
// import Image from "next/image";
import { useRouter } from "next/router";
// import { useForm } from "react-hook-form";
import { useTRPCForm } from "trpc-form";

import {
  // type AddAthleteInputType,
  addAthleteInput,
} from "../../shared/add-athlete-validator";
import { api } from "../../utils/api";
// import LoadingSVG from "../assets/puff.svg";

const AddAthleteForm = () => {
  const utils = api.useContext();
  const router = useRouter();

  const form = useTRPCForm({
    mutation: api.athletes.addAthlete,
    validator: addAthleteInput,
    onSuccess: () => {
      void utils.athletes.invalidate();
      void router.push(`/`);
    },
    onSubmit: async () => {
      await new Promise((r) => setTimeout(r, 2000));
    },
  });

  // const { mutate, isLoading } = api.athletes.addAthlete.useMutation({
  //   onSuccess: (data) => {
  //     console.log("submitted", data);
  //     void router.push(`/`);
  //   },
  // });

  // const {
  //   handleSubmit,
  //   register,
  //   formState: { errors },
  // } = useForm<AddAthleteInputType>({
  //   resolver: zodResolver(addAthleteInput),
  // });

  // if (isLoading) {
  //   return (
  //     <div className="animate-fade-in-delay flex justify-center p-8">
  //       {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
  //       <Image src={LoadingSVG} alt="loading..." width={200} height={200} />
  //     </div>
  //   );
  // }

  return (
    <>
      <Head>
        <title>Add an Athlete</title>
      </Head>
      <div className="m-auto max-w-xl">
        <div className="rounded bg-neutral-800 p-5">
          <h1 className="text-xl font-semibold">Add athlete</h1>
          <form
            className="flex w-full flex-col gap-10"
            ref={form.ref}
            // onSubmit={handleSubmit(async (data) => {
            //   mutate(data);
            // })}
          >
            <ul className="mt-4 grid w-full grid-cols-1 gap-5 md:grid-cols-2">
              <li className="flex flex-col">
                <label
                  className="block text-sm font-medium"
                  htmlFor={form.firstName.id()}
                >
                  First name:
                </label>
                <input
                  className="mt-1 rounded-md border-gray-300 bg-neutral-900/50 py-2 px-3 focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm"
                  type="text"
                  name={form.firstName.name()}
                  // {...register("firstName", { required: true })}
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
                  className="mt-1 rounded border-gray-300 bg-neutral-900/50 py-2 px-3 focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm"
                  type="text"
                  name={form.lastName.name()}
                  // {...register("lastName", { required: true })}
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
                  className="mt-1 rounded border-gray-300 bg-neutral-900/50 py-2 px-3 focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm"
                  type="text"
                  name={form.club.name()}
                  // {...register("club", { required: true })}
                  placeholder="HIFK"
                />
                {form.club.error((e) => (
                  <p className="py-2 text-xs text-red-400">{e.message}</p>
                ))}
              </li>
              <li className="flex gap-5">
                <div className="flex w-1/3 flex-col">
                  <label
                    className="block text-sm font-medium"
                    htmlFor={form.pb?.id()}
                  >
                    PB:
                  </label>
                  <input
                    className="rounded border-gray-300 bg-neutral-900/50 py-2 px-3 focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm"
                    name={form.pb?.name()}
                    // {...register("pb", { required: false })}
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
                    className="rounded border-gray-300 bg-neutral-900/50 py-2 px-3 focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm"
                    name={form.sb?.name()}
                    // {...register("sb", { required: false })}
                    placeholder="9.10"
                  />
                </div>
                {/* {errors.pb && errors.sb && (
                  <p className="py-2 text-xs text-red-400">
                    {errors.sb.message ?? errors.pb.message}
                  </p>
                )} */}
                {(form.pb ?? form.sb)?.error((e) => (
                  <p className="py-2 text-xs text-red-400">{e.message}</p>
                ))}
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
    </>
  );
};

const Athlete: React.FC = () => {
  return <AddAthleteForm />;
};

export default Athlete;
