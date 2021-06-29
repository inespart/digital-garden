import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout from '../components/Layout';
import { generateCsrfSecretByToken } from '../util/auth';
import {
  deleteExpiredSessions,
  getValidSessionByToken,
} from '../util/database';
import { pageContainer } from '../util/sharedStyles';
import { RegisterResponse } from './api/register';

type Props = {
  refreshUsername: () => void;
  username?: string;
  csrfToken: string;
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

export default function Register(props: Props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  return (
    <Layout username={props.username}>
      <Head>
        <title>Create Account | Digital Garden</title>
      </Head>
      <div css={pageContainer}>
        <div css={wrapper}>
          <div css={registrationForm}>
            <h1>Create Account</h1>
            <form
              onSubmit={async (event) => {
                event.preventDefault();
                const response = await fetch(`/api/register`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    username: username,
                    password: password,
                    email: email,
                    csrfToken: props.csrfToken,
                  }),
                });
                const json = (await response.json()) as RegisterResponse;

                if ('errors' in json) {
                  setError(json.errors[0].message);
                  return;
                }

                props.refreshUsername();

                // Navigate to registration successful page when
                // new account has been successfully created
                router.push(`/registration-successful`);
              }}
            >
              <div>
                <label>
                  First Name:
                  <input
                    value={firstName}
                    onChange={(event) => {
                      setFirstName(event.currentTarget.value);
                    }}
                  />
                </label>
              </div>

              <div>
                <label>
                  Last Name:
                  <input
                    value={lastName}
                    onChange={(event) => {
                      setLastName(event.currentTarget.value);
                    }}
                  />
                </label>
              </div>

              <div>
                <label>
                  Email:
                  <input
                    value={email}
                    type="email"
                    onChange={(event) => {
                      setEmail(event.currentTarget.value);
                    }}
                  />
                </label>
              </div>

              <div>
                <label>
                  Username:
                  <input
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
                    value={password}
                    type="password"
                    onChange={(event) => {
                      setPassword(event.currentTarget.value);
                    }}
                  />
                </label>
              </div>
              <button>Create Account</button>
              <div style={{ color: 'red' }}>{error}</div>
            </form>
          </div>
          <div css={imageContainer}>
            <img src="register.svg" alt="Man on skateboard" />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Import needed libraries and functions
  // eslint-disable-next-line unicorn/prefer-node-protocol
  const crypto = await import('crypto');

  const { createSerializedRegisterSessionTokenCookie } = await import(
    '../util/cookies'
  );

  const { insertFiveMinuteSessionWithoutUserId } = await import(
    '../util/database'
  );

  // Import and initialize the `csrf` library
  const Tokens = await (await import('csrf')).default;
  const tokens = new Tokens();

  // Get session information if user is already logged in
  const sessionToken = context.req.cookies.sessionToken;
  // why is this undefined???
  console.log(
    'sessionToken inside gSSP of register.tsx',
    context.req.cookies.sessionToken,
  );

  const session = await getValidSessionByToken(sessionToken);
  // why is this undefined???
  console.log('session inside gSSP of register.tsx', session);

  if (session) {
    // Redirect the user when they have a session
    // token by returning an object with the `redirect` prop
    // https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
    return {
      redirect: {
        destination: `/`,
        permanent: false,
      },
    };
  }

  await deleteExpiredSessions();

  // Generate 5-min short-lived session ONLY for the registration
  // User needs to complete registration process within 5 minutes
  const shortLivedSession = await insertFiveMinuteSessionWithoutUserId(
    crypto.randomBytes(64).toString('base64'),
  );
  console.log('short lived session token', shortLivedSession.token);

  // Set new cookie for the short-lived session
  const cookie = createSerializedRegisterSessionTokenCookie(
    shortLivedSession.token,
  );
  context.res.setHeader('Set-Cookie', cookie);

  // Use token from short-lived session to generate secret for the CSRF token
  const csrfSecret = generateCsrfSecretByToken(shortLivedSession.token);
  console.log('csrfSecret', csrfSecret);

  // Create CSRF token to the props
  const csrfToken = tokens.create(csrfSecret);
  console.log('csrfToken', csrfToken);

  return {
    props: {
      // Pass CSRF Token via props
      csrfToken,
    },
  };
}
