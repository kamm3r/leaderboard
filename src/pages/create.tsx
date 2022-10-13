import Layout from '../components/layout';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from '../utils/trpc';
import {
  addAthleteInput,
  AddAthleteInputType,
} from '../shared/add-athlete-validator';

const AddAthleteForm = () => {
  const router = useRouter();

  const { mutate, isLoading, data } = trpc.athletes.addAthlete.useMutation({
    onSuccess: (data) => {
      console.log('submitted', data);

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
      <div className='antialiased min-h-screen flex items-center justify-center'>
        <p className='text-white/40'>Loading...</p>
      </div>
    );
  // // Works W in the chat

  return (
    <Layout title='Create Athlete'>
      <div className='max-w-xl m-auto'>
        <div className='bg-neutral-800 p-5 rounded'>
          <h1 className='font-semibold text-xl'>Add athlete</h1>
          <form
            className='flex flex-col gap-10 w-full'
            onSubmit={handleSubmit((data) => {
              mutate(data);
            })}
          >
            <ul className='grid grid-cols-1 w-full gap-5 md:grid-cols-2 mt-4'>
              <li className='flex flex-col'>
                <label className='block text-sm font-medium'>First name:</label>
                <input
                  className='py-2 px-3 mt-1 focus:ring-neutral-500 focus:border-neutral-500 sm:text-sm border-gray-300 bg-neutral-900/50 rounded-md'
                  type='text'
                  {...register('firstName', { required: true })}
                  placeholder='Tim'
                />
                {errors.firstName && (
                  <p className='py-2 text-xs text-red-400'>
                    {errors.firstName.message}
                  </p>
                )}
              </li>
              <li className='flex flex-col'>
                <label className='block text-sm font-medium'>Last name:</label>
                <input
                  className='py-2 px-3 mt-1 focus:ring-neutral-500 focus:border-neutral-500 sm:text-sm border-gray-300 bg-neutral-900/50 rounded'
                  type='text'
                  {...register('lastName', { required: true })}
                  placeholder='Apple'
                />
                {errors.lastName && (
                  <p className='py-2 text-xs text-red-400'>
                    {errors.lastName.message}
                  </p>
                )}
              </li>

              <li className='flex flex-col'>
                <label className='block text-sm font-medium'>Club name:</label>
                <input
                  className='py-2 px-3 mt-1 focus:ring-neutral-500 focus:border-neutral-500 sm:text-sm border-gray-300 bg-neutral-900/50 rounded'
                  type='text'
                  {...register('club', { required: true })}
                  placeholder='HIFK'
                />
                {errors.club && (
                  <p className='py-2 text-xs text-red-400'>
                    {errors.club.message}
                  </p>
                )}
              </li>
              <li className='flex gap-5'>
                <div className='flex flex-col w-1/3'>
                  <label className='block text-sm font-medium'>PB:</label>
                  <input
                    className='py-2 px-3 focus:ring-neutral-500 focus:border-neutral-500 sm:text-sm border-gray-300 bg-neutral-900/50 rounded'
                    {...register('pb', { required: false })}
                    placeholder='10.20'
                  />
                </div>

                <div className='flex flex-col w-1/3'>
                  <label className='block text-sm font-medium'>SB:</label>
                  <input
                    className='py-2 px-3 focus:ring-neutral-500 focus:border-neutral-500 sm:text-sm border-gray-300 bg-neutral-900/50 rounded'
                    {...register('sb', { required: false })}
                    placeholder='9.10'
                  />
                </div>
                {errors.pb && errors.sb && (
                  <p className='py-2 text-xs text-red-400'>
                    {errors.sb.message || errors.pb.message}
                  </p>
                )}
              </li>
            </ul>
            <button
              type='submit'
              className='py-2 px-4 text-sm font-medium rounded bg-neutral-500 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500'
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
