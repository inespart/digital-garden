import { css } from '@emotion/react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import { pageContainer } from '../util/sharedStyles';

type Props = {
  username?: string;
};

const contentContainer = css`
  display: flex;
`;

const containerLeft = css`
  width: 65%;
  margin-right: 24px;

  h3 {
    margin-bottom: 64px;
  }

  .button-default,
  .button-default-ghost {
    font-size: 1.3rem;
    margin-right: 24px;
  }
`;

const containerRight = css`
  width: 35%;
  img {
    width: 100%;
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
        <div css={contentContainer}>
          <div css={containerLeft}>
            <h3>
              You’ve successfully created your account and everything’s set up
              to plant your first seed.
            </h3>

            <Link href="/seeds">
              <a className="button-default-ghost"> Go to all Seeds</a>
            </Link>
            <Link href="/seeds/create">
              <a className="button-default">+ Create Seed</a>
            </Link>
          </div>
          <div css={containerRight}>
            <img
              src="/registration-successful.svg"
              alt="Woman reaching for the sky"
              className="registrationImageStyle"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
