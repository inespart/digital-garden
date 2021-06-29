import { css } from '@emotion/react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import { pageContainer } from '../util/sharedStyles';

type Props = {
  username?: string;
};

const buttonContainer = css`
  margin-top: 48px;

  .button-default,
  .button-default-ghost {
    font-size: 1.3rem;
    margin-right: 24px;
  }
`;

export default function RegistrationSuccessful(props: Props) {
  return (
    <Layout username={props.username}>
      <Head>
        <title>Registration Successful | Digital Garden</title>
      </Head>
      <div css={pageContainer}>
        <h1>Congratulations! </h1>
        <h3>
          You’ve successfully created your account and everything’s set up to
          plant your first seed.
        </h3>
        <div css={buttonContainer}>
          <Link href="/digital-garden">
            <a className="button-default-ghost"> Go to all seeds</a>
          </Link>
          <Link href="/create-seed">
            <a className="button-default">+ Create seed</a>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
