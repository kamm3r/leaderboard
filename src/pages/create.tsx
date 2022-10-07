import Layout from '../components/layout';
import { useRouter } from 'next/router';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export default function Create() {
  const router = useRouter();

  // const { mutate, error, isLoading, isError, reset } = trpc.useMutation(
  //   ['results.create-results'],
  //   {
  //     onSuccess: () => router.push(`/`),
  //   }
  // );

  // const {
  //   handleSubmit,
  //   register,
  //   control,
  //   formState: { errors },
  // } = useForm<CreateResultInput>({
  //   resolver: zodResolver(createSchema),
  //   defaultValues: {
  //     attempts: [],
  //   },
  // });

  // const { fields, append, prepend, remove, swap, move, insert } =
  //   useFieldArray<CreateResultInputType>({
  //     name: 'attempts', // unique name for your Field Array,
  //     control, // control props comes from useForm (optional: if you are using FormContext)
  //   });

  // const onSubmit = (data: CreateResultInput) =>
  //   mutate(data, { onSuccess: () => reset() });

  // if (isLoading)
  //   return (
  //     <div className='antialiased min-h-screen flex items-center justify-center'>
  //       <p className='text-white/40'>Loading...</p>
  //     </div>
  //   );
  // if (isError)
  //   return (
  //     <div className='antialiased min-h-screen flex items-center justify-center'>
  //       <p className='text-white/40'>{error.message}</p>
  //     </div>
  //   );
  // // Works W in the chat

  return (
    <Layout>
      <div className='max-w-xl mx-auto py-12 md:max-w-2xl'>
        {/* <form onSubmit={handleSubmit(onSubmit)} className='w-full'> */}
        <form className='w-full'>
          {/* {isError && error.message} */}
          <fieldset className='col-span-6 sm:col-span-4 border border-gray-200'>
            <legend>Create Results</legend>
            <ul className='grid grid-cols-1 w-full gap-x-5 gap-y-3 md:grid-cols-2 mt-4'>
              <li className='flex items-end space-x-3'>
                <div className='col-span-6 sm:col-span-3'>
                  <label className='block text-sm font-medium'>Name:</label>
                  <input
                    className='py-2 px-3 text-black mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                    // {...register('athlete.athleteName')}
                    // defaultValue='marco'
                  />
                </div>
              </li>

              <li className='flex items-end space-x-3'>
                <div className='col-span-6 sm:col-span-3'>
                  <label className='block text-sm font-medium'>
                    Club name:
                  </label>

                  <input
                    className='py-2 px-3 text-black mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                    // {...register('athlete.club.clubName')}
                    // defaultValue='HIFK'
                  />
                </div>
              </li>
              <li className='flex items-end space-x-3'>
                <div className='col-span-6 sm:col-span-3'>
                  <label className='block text-sm font-medium'>PB:</label>

                  <input
                    className='py-2 px-3 text-black mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                    // {...register('athlete.PB')}
                    // defaultValue='90.00m'
                  />
                </div>
              </li>

              <li className='flex items-end space-x-3'>
                <div className='col-span-6 sm:col-span-3'>
                  <label className='block text-sm font-medium'>SB:</label>

                  <input
                    className='py-2 px-3 text-black mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                    // {...register('athlete.SB')}
                    // defaultValue='70.00m'
                  />
                </div>
              </li>
            </ul>

            <ul className='grid grid-cols-1 w-full gap-x-5 gap-y-3 md:grid-cols-2 mt-4'>
              {/* <label className='block text-sm font-medium'>Attempts:</label> */}
              {/* {fields.map((field, index) => (
                <li className='flex items-end space-x-3' key={field.id}>
                  <div className='col-span-6 sm:col-span-3'>
                    <label className='block text-sm font-medium text-gray-300'>
                      Attempt {index + 1}
                    </label>
                    <input
                      placeholder='name'
                      {...register(`attempts.${index}.line1`, {
                        required: true,
                      })}
                      className='py-2 px-3 text-black mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                    />
                  </div>
                  <button onClick={() => remove(index)}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6 text-gray-500'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                      />
                    </svg>
                  </button>
                </li>
              ))} */}
            </ul>

            <button
              type='button'
              value='Add more options'
              className='inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium   my-3'
              // onClick={() => append({ line1: 'Another attempt' })}
            >
              Add attempt
            </button>
          </fieldset>

          <input
            type='submit'
            // disabled={isLoading}
            className='my-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            value='Create Result'
          />
        </form>
      </div>
    </Layout>
  );
}
