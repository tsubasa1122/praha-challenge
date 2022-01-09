import type { NextPage } from 'next';
import Head from 'next/head';
import { TopPage } from '../components/page/home/Top';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Home</title>
        <meta name='description' content='Home page' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <TopPage />
    </>
  );
};

export default Home;
