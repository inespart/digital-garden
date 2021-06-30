import Head from 'next/head';
import Layout from '../../../components/Layout';
import { pageContainer } from '../../../util/sharedStyles';

type Props = {
  username?: string;
};

export default function Seed(props: Props) {
  return (
    <Layout username={props.username}>
      <Head>
        <title>Seed | Digital Garden</title>
      </Head>
      <div css={pageContainer}>
        <h1>Seed Page</h1>
      </div>
    </Layout>
  );
}
