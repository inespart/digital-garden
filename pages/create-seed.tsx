import Head from 'next/head';
import Layout from '../components/Layout';
import { pageContainer } from '../util/sharedStyles';

type Props = {
  username?: string;
};

export default function CreateSeed(props: Props) {
  return (
    <Layout username={props.username}>
      <Head>
        <title>Create Seed | Digital Garden</title>
      </Head>
      <div css={pageContainer}>
        <h1>Create Seed</h1>
      </div>
    </Layout>
  );
}
