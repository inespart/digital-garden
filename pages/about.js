import Head from 'next/head';
import Layout from '../components/Layout';

export default function About() {
  return (
    <Layout>
      <Head>
        <title>About</title>
      </Head>
      <div className="page-container">
        {' '}
        <h1>About Page</h1>
      </div>
    </Layout>
  );
}
