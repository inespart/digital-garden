import Head from 'next/head';
import Layout from '../../components/Layout';
import { pageContainer } from '../../util/sharedStyles';

type Props = {
  username?: string;
};

export default function About(props: Props) {
  return (
    <Layout username={props.username}>
      <Head>
        <title>All Seeds | Digital Garden</title>
      </Head>
      <div css={pageContainer}>
        <h1>All Seeds</h1>
      </div>
    </Layout>
  );
}
