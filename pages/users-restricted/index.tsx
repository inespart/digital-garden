import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { pageContainer } from '../../util/sharedStyles';
import { ApplicationError, User } from '../../util/types';
import { UsersRestrictedResponseType } from '../api/users-restricted';

type Props = {
  users?: User[];
  username?: string;
  errors?: ApplicationError[];
};

export default function UsersRestricted(props: Props) {
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

  return (
    <Layout username={props.username}>
      <Head>
        <title>Users</title>
      </Head>

      <h1 data-cy="users-page-h1">Users</h1>
      <ul>
        {props.users?.map((user) => (
          <li key={`user-${user.id}`}>
            <Link href={`/users/${user.id}`}>
              <a data-cy={`users-page-user-${user.id}`}>
                {user.firstName} {user.lastName}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const response =
    // Since we're fetching on the server side,
    // the browser is not a part of this `fetch`
    // and it is therefore not sending the cookies along
    //
    // This is using the node-fetch library
    // internally
    await fetch(`${process.env.API_BASE_URL}/users-restricted`, {
      method: 'GET',
      headers: {
        // This forwards the cookie to the API route
        cookie: context.req.headers.cookie || '',
      },
    });

  const json = (await response.json()) as UsersRestrictedResponseType;

  console.log('API decoded JSON from response', json);

  if ('errors' in json) {
    // Better would be to return the status code
    // in the error itself
    context.res.statusCode = 403;
  }

  return {
    props: {
      ...json,
    },
  };
}
