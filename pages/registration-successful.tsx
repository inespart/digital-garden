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
  flex-direction: row;
  padding-bottom: 92px;

  @media (max-width: 400px) {
    flex-direction: column;
  }
`;

const containerLeft = css`
  width: 65%;
  margin-right: 24px;

  @media (max-width: 400px) {
    width: 100%;
  }

  h3 {
    margin-bottom: 64px;
  }

  .button-default,
  .button-default-ghost {
    font-size: 1.3rem;
    margin-right: 24px;
    display: inline-block;

    @media (max-width: 768px) {
      margin-right: 12px;
    }

    @media (max-width: 400px) {
      margin-right: 12px;
      margin-bottom: 12px;
      width: 200px;
    }
  }
`;

const containerRight = css`
  width: 35%;

  @media (max-width: 400px) {
    padding-top: 48px;
    width: 100%;
  }

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
        <h1>Welcome! </h1>
        <div css={contentContainer}>
          <div css={containerLeft}>
            <h3>
              You’ve successfully created your account and everything’s set up
              to plant your first seed.
            </h3>

            <Link href="/seeds">
              <a
                data-cy="go-to-all-seeds-link"
                className="button-default-ghost"
              >
                {' '}
                Go to all Seeds
              </a>
            </Link>
            <Link href="/seeds/create">
              <a
                data-cy="registration-successful-create-seed"
                className="button-default"
              >
                + Create Seed
              </a>
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
