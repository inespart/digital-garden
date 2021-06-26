import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout from '../components/Layout';
import { getValidSessionByToken } from '../util/database';
import { pageContainer } from '../util/sharedStyles';
import { LoginResponse } from './api/login';

type Props = {
  refreshUsername: () => void;
  username?: string;
};

const wrapper = css`
  display: flex;
  /* grid-template-columns: 2fr 2fr; */
  /* column-gap: 2.5em; */
  padding: 64px 0;
`;

const registrationForm = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
`;

const imageContainer = css`
  width: 50%;

  img {
    width: 90%;
  }
`;

export default function Login(props: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  return (
    <Layout username={props.username}>
      <Head>
        <title>Login | Digital Garden</title>
      </Head>
      <div css={pageContainer}>
        <div css={wrapper}>
          <div css={imageContainer}>
            <img src="login.svg" alt="Woman holding a book and reading" />
          </div>
          <div css={registrationForm}>
            <h1>Login</h1>

            <form
              onSubmit={async (event) => {
                event.preventDefault();

                // Send the username and password to the API
                // for verification
                const response = await fetch(`/api/login`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    username: username,
                    password: password,
                  }),
                });

                const json = (await response.json()) as LoginResponse;

                if ('errors' in json) {
                  setError(json.errors[0].message);
                  return;
                }

                props.refreshUsername();

                // Navigate to the user's page when
                // they have been successfully created
                router.push(`/profiles/${json.user.username}`);
              }}
            >
              <div>
                <label>
                  Username:
                  <input
                    data-cy="users-management-create-username"
                    value={username}
                    onChange={(event) => {
                      setUsername(event.currentTarget.value);
                    }}
                  />
                </label>
              </div>

              <div>
                <label>
                  Password:
                  <input
                    data-cy="users-management-create-password"
                    value={password}
                    type="password"
                    onChange={(event) => {
                      setPassword(event.currentTarget.value);
                    }}
                  />
                </label>
              </div>

              <button>Login</button>

              <div style={{ color: 'red' }}>{error}</div>
            </form>
            <br />
            <div>
              <Link href="/register">
                <a>
                  <p>Create new account</p>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // get the session token from cookie
  const sessionToken = context.req.cookies.sessionToken;
  console.log('sessionToken on login.tsx in gSSP', sessionToken);

  const session = await getValidSessionByToken(sessionToken);
  // if the session is undefined, we allow the person to log in
  // because they don't have a valid session
  // but if they DO have a valid session,
  // we redirect them
  if (session) {
    // Redirect the user when they have a session
    // token by returning an object with the `redirect` prop
    // https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
    return {
      redirect: {
        // destination: `/users/management/${session.userId}/read`,
        destination: `/create-seed`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
