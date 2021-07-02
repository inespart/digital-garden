import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { green, pageContainer } from '../../util/sharedStyles';

type Props = {
  username?: string;
  fullSeed: SeedObject[];
};

type SeedObject = {
  id: number;
  title: string;
  imageUrl: string;
  publicNoteId: number;
  content: string;
  username: string;
  resourceUrl: string;
  slug: string;
};

const seedsContainer = css`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
`;

const seedContainer = css`
  border: 1px solid ${green};
  border-radius: 16px;
  width: 350px;
  height: 500px;
  margin-bottom: 32px;
  padding: 16px;
`;

const publicNoteStyle = css`
  margin-bottom: 16px;
`;

const usernameAndCategoryContainer = css`
  font-size: 0.8rem;
`;

export default function AllSeeds(props: Props) {
  // console.log('props inside /seeds/index.ts', props);
  return (
    <Layout username={props.username}>
      <Head>
        <title>All Seeds | Digital Garden</title>
      </Head>
      <div css={pageContainer}>
        <h1>All Seeds</h1>
        <div css={seedsContainer}>
          {props.fullSeed.map((seedObject) => {
            return (
              <div key={seedObject.id} css={seedContainer}>
                <h3>{seedObject.title}</h3>
                <div css={publicNoteStyle}>
                  {seedObject.content}{' '}
                  <Link
                    href={`seeds/${seedObject.username}/${seedObject.slug}`}
                  >
                    Read full seed
                  </Link>
                </div>

                <div css={usernameAndCategoryContainer}>
                  <div>
                    Resource URL:{' '}
                    <a href={seedObject.resourceUrl}>
                      {seedObject.resourceUrl}
                    </a>
                  </div>
                  <div>Curated by: {seedObject.username}</div>
                  <div>Published in:</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const response = await fetch(`${process.env.API_BASE_URL}/seeds`, {
    method: 'GET',
  });

  // Wait for the response of the fetch inside /seeds/index.ts and then transform it into json
  const json = await response.json();
  // console.log('API decoded JSON from response', json);

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
      ...json,
    },
  };
}
