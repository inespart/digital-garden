import Head from 'next/head';
import Layout from '../components/Layout';
import { pageContainer } from '../util/sharedStyles';

export default function RegistrationSuccessful() {
  return (
    <Layout>
      <Head>
        <title>Registration Successful | Digital Garden</title>
      </Head>
      <div css={pageContainer}>
        <h1>Registration Successful</h1>
      </div>
    </Layout>
  );
}
