import Link from 'next/link';
import Layout from '../components/layout';

export default function NotFound() {
  return (
    <Layout title='Page Not Found'>
      <div className='flex flex-col justify-center items-start max-w-2xl mx-auto mb-16'>
        <h1 className='font-bold text-3xl md:text-5xl tracking-tight mb-4 text-black dark:text-white'>
          451 – Unavailable For Legal Reasons
        </h1>
        <p className='text-gray-600 dark:text-gray-400 mb-8'>
          Why show a generic 404 when I can make it sound mysterious? It seems
          you&#39;ve found something that used to exist, or you spelled
          something wrong. I&#39;m guessing you spelled something wrong. Can you
          double check that URL?
        </p>
        <Link
          href='/'
          className='p-1 sm:p-4 w-64 font-bold mx-auto bg-slate-200 text-center rounded-md text-black'
        >
          Return Home
        </Link>
      </div>
    </Layout>
  );
}
