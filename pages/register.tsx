import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout from '../components/Layout';

export default function CreateSingleUser() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  return (
    <Layout>
      <Head>
        <title>Create Account</title>
      </Head>

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
    </Layout>
  );
}
