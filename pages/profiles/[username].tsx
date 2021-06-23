import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { ApplicationError, User } from '../../util/types';

type Props = {
  user?: User;
  errors?: ApplicationError[];
};

export default function SingleUserProfile(props: Props) {
  // Show message if user not allowed
  const errors = props.errors;
  if (errors) {
    return (
      <Layout>
        <Head>
          <title>Error</title>
        </Head>
        Error: {errors[0].message}
      </Layout>
    );
  }

  // Show message if user does not exist
  if (!props.user) {
    return (
      <Layout>
        <Head>
          <title>User not found!</title>
        </Head>
        User not found
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>
          Profile page for {props.user.firstName} {props.user.lastName}
        </title>
      </Head>

      <h1 data-cy="profile-page-h1">Profile Page</h1>

      <div>
        id: <span data-cy="profile-page-id">{props.user.id}</span>
      </div>

      <div>
        username: <span data-cy="profile-page-id">{props.user.username}</span>
      </div>
      <div>first_name: {props.user.firstName}</div>
      <div>last_name: {props.user.lastName}</div>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // TODO: Verify the user's token (from the cookie) and
  // retrieve the user that matches the token

  // TODO: Test if the token user's username matches the username in the URL

  // API design here is not so great, maybe don't copy
  const response = await fetch(
    `${process.env.API_BASE_URL}/users-by-username/${context.query.username}`,
  );
  const { user } = await response.json();
  console.log('API decoded JSON from response', user);

  return {
    props: {
      user: user,
    },
  };
}
