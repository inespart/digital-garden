import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
// import ReadMoreReact from 'read-more-react';
import Layout from '../../components/Layout';
import { getCategory } from '../../util/database';
import { generateTitle } from '../../util/generateTitle';
import { darkGrey, pageContainer } from '../../util/sharedStyles';
import { Category } from '../../util/types';

type Props = {
  username?: string;
  allSeeds: SeedObject[];
  categories: Category[];
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
  categoriesTitle: string;
};

const seedsContainer = css`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
`;

const buttonContainer = css`
  margin-bottom: 64px;

  button {
    margin-right: 32px;
  }
`;

const seedContainer = css`
  display: flex;
  flex-direction: column;
  background-color: white;
  box-shadow: 0 0 8px #acacac;
  border-radius: 16px;
  width: 350px;
  height: 500px;
  margin-bottom: 32px;
  padding: 32px;

  h3 {
    margin-bottom: 0px;
  }
`;

const userAndCategoryStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.7rem;
  margin-bottom: 16px;

  .usernameCircle {
    border: 1px solid ${darkGrey};
    border-radius: 50%;
    padding: 3px;
    margin-right: 3px;
  }
`;

const publicNoteStyle = css`
  margin-bottom: 16px;
`;

export default function AllSeeds(props: Props) {
  // console.log('props inside /seeds/index.ts', props);
  const [categoryId, setCategoryId] = useState('');
  // const [showSeeds, setShowSeeds] = useState('');

  // Function to remove html tags from notes
  function createMarkup(content: string) {
    return { __html: content };
  }

  return (
    <Layout username={props.username}>
      <Head>
        <title>All Seeds | Digital Garden</title>
      </Head>
      <div css={pageContainer}>
        <h1>All Seeds</h1>
        <div css={buttonContainer}>
          <button className="button-default-ghost">All Seeds</button>
          <button className="button-default-ghost">My Seeds</button>
          <select
            className="button-default-ghost"
            id="category"
            value={categoryId}
            onChange={(event) => {
              setCategoryId(event.currentTarget.value);
            }}
          >
            <option value="">Select category</option>
            {props.categories.map((category) => {
              return (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              );
            })}
          </select>
        </div>

        <div css={seedsContainer}>
          {props.allSeeds.map((seedObject) => {
            return (
              <div key={seedObject.id} css={seedContainer}>
                <h3>{seedObject.title}</h3>
                <div css={userAndCategoryStyle}>
                  <span className="usernameCircle">{seedObject.username}</span>{' '}
                  curated in {seedObject.categoriesTitle}
                </div>
                {/* {console.log('url:', seedObject.resourceUrl)} */}
                <div>
                  Resource URL:{' '}
                  <a
                    target="_blank"
                    href={seedObject.resourceUrl}
                    rel="noopener noreferrer"
                  >
                    {seedObject.resourceUrl}
                  </a>
                  {/* <Link href={seedObject.resourceUrl} passHref={true}>
                    <a>{seedObject.resourceUrl}</a>
                  </Link> */}
                </div>

                <div
                  css={publicNoteStyle}
                  dangerouslySetInnerHTML={createMarkup(
                    seedObject.content.slice(0, 300),
                  )}
                />

                <Link
                  href={`seeds/${seedObject.username}/${generateTitle(
                    seedObject.title,
                  )}`}
                >
                  Read full seed
                </Link>

                {/* <div css={publicNoteStyle}>
                  <ReadMoreReact
                    text={seedObject.content}
                    min={100}
                    ideal={200}
                    max={300}
                    readMoreText=" "
                  />
                  <Link
                    href={`seeds/${seedObject.username}/${seedObject.slug}`}
                  >
                    Read full seed
                  </Link>
                </div> */}
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
    headers: {
      cookie: context.req.headers.cookie || '',
    },
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

  const categories = await getCategory();

  return {
    props: {
      ...json,
      categories,
    },
  };
}
