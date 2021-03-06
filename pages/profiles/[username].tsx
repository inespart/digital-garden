import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { RiDeleteBin2Line } from 'react-icons/ri';
import Layout from '../../components/Layout';
import { pageContainer } from '../../util/sharedStyles';
import { ApplicationError, User } from '../../util/types';
import { SingleUserResponseType } from '../api/users-by-username/[username]';

type Props = {
  user: User;
  username?: string;
  errors?: ApplicationError[];
};

const contentContainer = css`
  display: flex;
  flex-direction: row;
  height: 100vh;

  @media (max-width: 450px) {
    flex-direction: column;
  }
`;

const containerLeft = css`
  width: 65%;
  margin-right: 24px;

  @media (max-width: 450px) {
    width: 100%;
  }

  h3 {
    margin-bottom: 64px;
  }

  .button-default,
  .button-default-ghost {
    font-size: 1.3rem;
    margin-right: 24px;

    @media (max-width: 768px) {
      margin-right: 12px;
    }

    @media (max-width: 450px) {
      margin-right: 0px;
      margin-top: 32px;
      width: 220px;
    }
  }

  .userInformation {
    margin-bottom: 64px;

    p {
      margin: 6px 0;
    }
  }
`;

const containerRight = css`
  width: 35%;
  padding-top: 48px;

  @media (max-width: 450px) {
    width: 100%;
  }

  img {
    width: 100%;
  }
`;

export default function SingleUserProfile(props: Props) {
  const router = useRouter();

  // Show message if user not allowed
  const errors = props.errors;

  if (errors) {
    return (
      <Layout username={props.username}>
        <Head>
          <title>Error</title>
        </Head>
        <div css={pageContainer}>
          <h1>Error: {errors[0].message}</h1>
        </div>
      </Layout>
    );
  }

  // Show message if user does not exist
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!props.user) {
    return (
      <Layout username={props.username}>
        <Head>
          <title>User not found!</title>
        </Head>
        <div css={pageContainer}>
          <h1>User not found</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout username={props.username}>
      <Head>
        <title>
          Profile page for {props.user.firstName} {props.user.lastName}
        </title>
      </Head>
      <div css={pageContainer}>
        <div css={contentContainer}>
          <div css={containerLeft}>
            <h1>Welcome, {props.user.firstName}!</h1>

            <div className="userInformation">
              <p>Username: {props.user.username}</p>
              <p>First name: {props.user.firstName}</p>
              <p>Last name: {props.user.lastName}</p>
            </div>

            {/* CREATE Seed */}
            <Link href="/seeds/create">
              <a data-cy="create-seed-button" className="button-default">
                + Create Seed
              </a>
            </Link>

            {/* DELETE Account */}
            <button
              className="button-default-ghost"
              onClick={async (event) => {
                event.preventDefault();
                if (
                  !window.confirm(
                    `Do you really want to delete your account? It will be gone forever.`,
                  )
                ) {
                  return;
                }

                const response = await fetch(
                  `/api/users-by-username/${props.user.username}`,
                  {
                    method: 'DELETE',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      username: props.user.username,
                    }),
                  },
                );

                await response.json();

                // Navigate to seeds overview after having deleted a seed
                router.push(`/`);
              }}
            >
              {' '}
              <RiDeleteBin2Line /> Delete account
            </button>
          </div>
          <div css={containerRight}>
            <img
              src="/register.svg"
              alt="Person skateboarding"
              className="registrationImageStyle"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const response =
    // Since we're fetching on the server side,
    // the browser is not a part of this fetch
    // and it is therefore not sending the cookies along
    //
    // This is using the node-fetch library internally
    //
    await fetch(
      `${process.env.API_BASE_URL}/users-by-username/${context.query.username}`,
      {
        method: 'GET',
        headers: {
          // This forwards the cookie to the API route
          cookie: context.req.headers.cookie || '',
        },
      },
    );
  const json = (await response.json()) as SingleUserResponseType;

  console.log('API decoded JSON from response', json);

  // checking for a property called errors inside object json
  if ('errors' in json) {
    context.res.statusCode = 403;
  } else if (!json.user) {
    // Return a proper status code for a response
    // with a null user (which indicates it has
    // not been found in the database)
    context.res.statusCode = 404;
  }

  return {
    props: {
      // json is an object with a user property OR an error property
      // if it has an error property, it's still rendering
      ...json,
    },
  };
}
