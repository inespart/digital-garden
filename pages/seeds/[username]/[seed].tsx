import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Layout from '../../../components/Layout';
import { green, pageContainer } from '../../../util/sharedStyles';
import { SingleSeedResponseType } from '../../api/seeds/[username]/[seed]';

type Props = SingleSeedResponseType & {
  username?: string;
  errors?: Error[];
};

const seedContainer = css`
  margin-top: 64px;
  background-color: white;
  border-radius: 16px;
  border: 1px solid ${green};
  padding: 16px;

  img {
    width: 20%;
  }
`;

export default function SeedDisplay(props: Props) {
  // console.log('props in seed.ts', props);
  // Function to remove html tags from notes
  function createMarkup(content: string) {
    return { __html: content };
  }
  return (
    <Layout username={props.username}>
      <Head>
        <title>Seed | Digital Garden</title>
      </Head>
      <div css={pageContainer}>
        <div css={seedContainer}>
          <h1>{props.seed.title}</h1>
          <p>Author: {props.author.username}</p>

          <div
            dangerouslySetInnerHTML={createMarkup(
              props.publicNoteContent.content,
            )}
          />

          <div
            dangerouslySetInnerHTML={createMarkup(
              props.privateNoteContent.content,
            )}
          />

          {/* {props.privateNoteContent?.content ? (
            <p>Private Note Content: {props.privateNoteContent.content}</p>
          ) : (
            ''
          )} */}
          <p>Resource URL: {props.seed.resourceUrl}</p>
          {/* <p>Image URL: </p>
          <img src={props.seed.imageUrl} alt="Note" /> */}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const response = await fetch(
    `${process.env.API_BASE_URL}/seeds/${context.query.username}/${context.query.seed}`,
    {
      method: 'GET',
      headers: {
        // This forwards the cookie to the API route
        cookie: context.req.headers.cookie || '',
      },
    },
  );

  // console.log('cookie inside GSSP on title.tsx', context.req.headers.cookie);
  const json = (await response.json()) as SingleSeedResponseType;

  console.log('API decoded JSON from response', json);

  // checking for a property called errors inside object json
  if ('errors' in json) {
    context.res.statusCode = 403;
    return {
      redirect: {
        destination: `/404`,
        permanent: false,
      },
    };
  } else if (!json.seed) {
    // Return a proper status code for a response
    // with a null user (which indicates it has
    // not been found in the database)
    context.res.statusCode = 404;
    return {
      redirect: {
        destination: `/404`,
        permanent: false,
      },
    };
  }
  // console.log('json', json);
  return {
    props: {
      // json is an object with a user property OR an error property
      // if it has an error property, it's still rendering
      ...json,
    },
  };
}
