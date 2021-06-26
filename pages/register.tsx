import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout from '../components/Layout';
import { getValidSessionByToken } from '../util/database';
import { pageContainer } from '../util/sharedStyles';

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

export default function Register(props: Props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
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
                console.log('email', email);
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
                  }),
                });
                const { user: createdUser } = await response.json();

                props.refreshUsername();

                // Navigate to the user's page when
                // they have been successfully created
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
  const sessionToken = context.req.cookies.sessionToken;

  const session = await getValidSessionByToken(sessionToken);

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

  return {
    props: {},
  };
}
