import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { AiOutlineTag, AiOutlineUser } from 'react-icons/ai';
import { BsLink45Deg } from 'react-icons/bs';
import Layout from '../../components/Layout';
import { getCategory } from '../../util/database';
import { generateTitle } from '../../util/generateTitle';
import { darkGrey, green, pageContainer } from '../../util/sharedStyles';
import { Category } from '../../util/types';

type Props = {
  username?: string;
  categories: Category[];
  allSeeds: SeedObject[];
  allSeedsByValidSessionUser: SeedObject[];
  isSessionValid: Boolean;
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
  categoryId: string;
};

const seedsContainer = css`
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
`;

const buttonContainer = css`
  margin-bottom: 64px;

  button,
  select {
    margin-right: 32px;

    @media (max-width: 450px) {
      margin-bottom: 12px;
      margin-right: 6px;
    }
  }
`;

const seedContainer = css`
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 16px;
  border: 1px solid ${green};
  box-shadow: 5px 5px 8px #a5cc8252;
  width: 330px;
  height: 470px;
  margin: 0 32px 64px 32px;

  :hover {
    transform: translate(0, -10px);
  }

  @media (max-width: 768px) {
    margin: 0 18px 64px 18px;
    width: 300px;
    height: 500px;
  }

  @media (max-width: 450px) {
    margin: 0 18px 64px 18px;
    width: 300px;
    height: 480px;
  }

  h3 {
    margin-bottom: 0px;
    padding: 6px;
    text-align: center;
  }
`;

const seedTopStyle = css`
  background-color: ${green};
  border-radius: 16px 16px 0 0;

  a {
    color: ${darkGrey};
  }

  h3 {
    margin-bottom: 12px;
  }
`;

const seedBottomStyle = css`
  background-color: white;
  border-radius: 0 0 16px 16px;
  padding: 32px;

  @media (max-width: 400px) {
    padding: 18px;
  }
`;

const userAndCategoryStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 0 12px;
  text-align: center;
  font-size: 0.7rem;
  margin-bottom: 16px;

  .userInfo {
    margin-right: 6px;
  }

  .resourceInfo {
    padding-top: 6px;
  }
`;

const publicNoteStyle = css`
  margin-bottom: 16px;
`;

export default function AllSeeds(props: Props) {
  const [categoryId, setCategoryId] = useState('');
  const [data, setData] = useState(props.allSeeds);
  const [allSeedsActive, setAllSeedsActive] = useState(true);
  const [byCategoryActive, setByCategoryActive] = useState(false);
  const [mySeedActive, setMySeedActive] = useState(false);

  // Functions to remove html tags from notes
  function createMarkup(content: string) {
    return { __html: content };
  }

  const handleAllSeedsClick = () => {
    return setData(props.allSeeds);
  };

  // Handle click on "Select By Category" Button
  const handleSeedsByCategoryClick = (id: string) => {
    // Filter seeds by category on the frontend
    function getSeedsByCategoryId(seed: SeedObject) {
      // returns a boolean
      const seedCategoryId = seed.categoryId.toString();
      return seedCategoryId === id;
    }
    const seedsByCategoryId = props.allSeeds.filter(getSeedsByCategoryId);
    // event.preventDefault();
    return setData(seedsByCategoryId);
  };

  // Handle click on My Seeds Button
  const handleMySeedsClick = () => {
    return setData(props.allSeedsByValidSessionUser);
  };

  return (
    <Layout username={props.username}>
      <Head>
        <title>All Seeds | Digital Garden</title>
      </Head>
      <div css={pageContainer}>
        <h1>All Seeds</h1>

        {/* Filter Options START */}
        <div css={buttonContainer}>
          <button
            className={
              byCategoryActive || mySeedActive
                ? 'button-default-ghost'
                : 'button-default'
            }
            onClick={() => {
              handleAllSeedsClick();
              setAllSeedsActive(!allSeedsActive);
              setByCategoryActive(false);
              setMySeedActive(false);
            }}
          >
            All Seeds
          </button>

          <select
            id="category"
            value={categoryId}
            onChange={(event) => {
              setCategoryId(event.currentTarget.value);
              handleSeedsByCategoryClick(event.currentTarget.value);
              setByCategoryActive(true);
              setAllSeedsActive(false);
              setMySeedActive(false);
            }}
            className={
              byCategoryActive ? 'button-default' : 'button-default-ghost'
            }
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
          {props.isSessionValid === true ? (
            <button
              className={
                byCategoryActive || allSeedsActive
                  ? 'button-default-ghost'
                  : 'button-default'
              }
              onClick={() => {
                handleMySeedsClick();
                setMySeedActive(!mySeedActive);
                setAllSeedsActive(false);
                setByCategoryActive(false);
              }}
            >
              My Seeds
            </button>
          ) : (
            ''
          )}
        </div>
        {/* Filter Options END */}

        <div css={seedsContainer}>
          {data.map((seedObject) => {
            return (
              <div key={seedObject.id} css={seedContainer}>
                <div css={seedTopStyle}>
                  <h3>{seedObject.title}</h3>
                  <div css={userAndCategoryStyle}>
                    <div>
                      <span className="userInfo">
                        <AiOutlineUser /> {seedObject.username}
                      </span>{' '}
                      <AiOutlineTag />
                      {seedObject.categoriesTitle}
                    </div>

                    <div className="resourceInfo">
                      {seedObject.resourceUrl ? (
                        <>
                          <BsLink45Deg />
                          <a
                            target="_blank"
                            href={seedObject.resourceUrl}
                            rel="noopener noreferrer"
                          >
                            {seedObject.resourceUrl}
                          </a>
                        </>
                      ) : (
                        <br />
                      )}
                    </div>
                  </div>
                </div>

                <div css={seedBottomStyle}>
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
    headers: {
      cookie: context.req.headers.cookie || '',
    },
  });

  // Wait for the response of the fetch inside /seeds/index.ts and then transform it into json
  const json = await response.json();

  // checking for a property called errors inside object json
  if ('errors' in json) {
    context.res.statusCode = 403;
  }

  const categories = await getCategory();

  return {
    props: {
      ...json,
      categories,
    },
  };
}
