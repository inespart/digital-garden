import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import { pageContainer } from '../util/sharedStyles';

export default function Error(props) {
  return (
    <Layout username={props.username}>
      <Head>
        <title>404 not found</title>
      </Head>
      <div css={pageContainer}>
        <h1>404 not found</h1>
        <h2>Oooops - this page does not exist</h2>
        <Link href="/">
          <a>
            <button className="button-default">Back Home</button>
          </a>
        </Link>
      </div>
    </Layout>
  );
}
