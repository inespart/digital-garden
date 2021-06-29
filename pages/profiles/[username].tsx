import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { pageContainer } from '../../util/sharedStyles';
import { ApplicationError, User } from '../../util/types';
import { SingleUserResponseType } from '../api/users-by-username/[username]';

type Props = {
  user?: User;
  errors?: ApplicationError[];
  username?: string;
};

export default function SingleUserProfile(props: Props) {
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
        <h1 data-cy="profile-page-h1">Profile Page</h1>

        <div>
          id: <span data-cy="profile-page-id">{props.user.id}</span>
        </div>

        <div>
          username: <span data-cy="profile-page-id">{props.user.username}</span>
        </div>
        <div>first_name: {props.user.firstName}</div>
        <div>last_name: {props.user.lastName}</div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // TODO: Verify the user's token (from the cookie) and
  // retrieve the user that matches the token

  // TODO: Test if the token user's username matches the username in the URL

  // API design here is not so great, maybe don't copy
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
  // console.log('sessionToken inside GSSP', context.req.cookies.sessionToken);
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
