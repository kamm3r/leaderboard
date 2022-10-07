import { GetStaticProps } from 'next';
import Layout from '../../components/layout';

const Competition = () => {
  return (
    <Layout>
      <div>
        <h1>athlete</h1>
        <form>
          <div>
            <label>First Name</label>
            <input type='text' placeholder='Joe' />
          </div>
          <div>
            <label>Last Name</label>
            <input type='text' placeholder='Mama' />
          </div>
          <div>
            <label>Club</label>
            <input type='text' placeholder='Deez' />
          </div>
          <div>
            <label>PB</label>
            <input type='text' placeholder='69.69m' />
          </div>
          <div>
            <label>SB</label>
            <input type='text' placeholder='4.20m' />
          </div>
          <button>Add athlete</button>
        </form>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params || !params.username || typeof params.username !== 'string') {
    return {
      notFound: true,
    };
  }
  const twitchName = params.username.toLowerCase();

  // const userInfo = await prisma.user.findFirst({
  //   where: { name: { equals: twitchName, mode: "insensitive" } },
  // });

  // if (!userInfo) {
  //   return {
  //     notFound: true,
  //   };
  // }

  //   return { props: { user: userInfo }, revalidate: 60 };
  return {};
};

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' };
}

export default Competition;
