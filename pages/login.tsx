import { css } from '@emotion/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout from '../components/Layout';
import { lightGreen } from '../util/sharedStyles';
import { LoginResponse } from './api/login';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const loginPageContainer = css`
    background-color: ${lightGreen};
    height: 100vh;
    padding-top: 100px;
    padding-left: 128px;
    padding-right: 128px;
  `;

  return (
    <Layout>
      <Head>
        <title>Login</title>
      </Head>
      <div css={loginPageContainer}>
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
      </div>
    </Layout>
  );
}
