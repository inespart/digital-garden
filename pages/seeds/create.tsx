import { css } from '@emotion/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout from '../../components/Layout';
import { getCategory } from '../../util/database';
import { generateSlug } from '../../util/generateSlug';
import { darkGrey, green, pageContainer } from '../../util/sharedStyles';
import { RegisterResponse } from '../api/register';

type Props = {
  username?: string;
  categories: Category[];
};

type Category = {
  id: number;
  title: string;
};

const formStyle = css`
  display: flex;
  flex-direction: row;

  label {
    color: ${darkGrey};
    font-weight: 500;

    :focus {
      border: 1px solid ${green};
    }

    input,
    option,
    select {
      margin: 4px 0 24px 0;
      width: 100%;
      padding: 12px 8px;
      border: 1px solid ${green};
      border-radius: 16px;
    }
  }
`;

const buttonStyles = css`
  .button-default,
  .button-default-ghost {
    font-size: 1.3rem;
    padding: 16px 24px;
    width: 48%;
    margin-left: 4px;
    margin-right: 4px;
    margin-bottom: 64px;
    margin-top: 32px;
  }
`;

const largeInput = css`
  line-height: 128px;
`;

const containerLeft = css`
  display: flex;
  flex-direction: column;
  width: 65%;
  margin-right: 32px;
`;

const containerRight = css`
  display: flex;
  flex-direction: column;
  width: 35%;
`;

export default function CreateSeed(props: Props) {
  const [title, setTitle] = useState('');
  const [publicNoteId, setPublicNoteId] = useState('');
  const [privateNoteId, setPrivateNoteId] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const router = useRouter();

  async function clickHandler(isPublished: boolean) {
    const response = await fetch(`/api/seeds/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title,
        publicNoteId: publicNoteId,
        privateNoteId: privateNoteId,
        resourceUrl: resourceUrl,
        categoryId: Number(categoryId),
        imageUrl: 'www.google.at',
        isPublished: isPublished,
      }),
    });

    // Wait for the response of the fetch inside create.ts and then transform into json
    const { seed, user } = await response.json();
    console.log('json inside create.tsx', seed);

    // TODO: Navigate to [title].tsx page when new seed has been successfully created
    router.push(`/seeds/${user.username}/${generateSlug(title)}`);
  }

  return (
    <Layout username={props.username}>
      <Head>
        <title>Create Seed | Digital Garden</title>
      </Head>
      <div css={pageContainer}>
        <h1>Create Seed</h1>

        <div>
          <div css={formStyle}>
            <div css={containerLeft}>
              <div>
                <label>
                  Category:
                  {/* Map over categories */}
                  <select
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
                </label>
              </div>

              <div>
                <label>
                  Title:
                  <input
                    value={title}
                    placeholder="Insert title of your seed"
                    required
                    onChange={(event) => {
                      setTitle(event.currentTarget.value);
                    }}
                  />
                </label>
              </div>

              <div>
                <label>
                  Public Note:
                  <input
                    css={largeInput}
                    value={publicNoteId}
                    type="text"
                    placeholder="Key take-aways and main learnings"
                    required
                    onChange={(event) => {
                      setPublicNoteId(event.currentTarget.value);
                    }}
                  />
                </label>
              </div>

              <div>
                <label>
                  Resource URL: (optional)
                  <input
                    value={resourceUrl}
                    placeholder="www.khanacademy.org/review-arrays"
                    onChange={(event) => {
                      setResourceUrl(event.currentTarget.value);
                    }}
                  />
                </label>
              </div>

              <div>
                <label>
                  Private Note: (optional)
                  <input
                    css={largeInput}
                    value={privateNoteId}
                    type="text"
                    placeholder="No one will ever see your private notes"
                    onChange={(event) => {
                      setPrivateNoteId(event.currentTarget.value);
                    }}
                  />
                </label>
              </div>

              <div>
                <label>
                  Brain Links: (optional)
                  <input
                  // value={resourceUrl}
                  // placeholder="https://www.khanacademy.org/computing/computer-programming/programming/arrays/a/review-arrays"
                  // onChange={(event) => {
                  //   setResourceUrl(event.currentTarget.value);
                  // }}
                  />
                </label>
              </div>

              <div css={buttonStyles}>
                <button
                  className="button-default-ghost"
                  onClick={() => {
                    clickHandler(false);
                  }}
                >
                  Save as draft
                </button>

                <button
                  className="button-default"
                  onClick={() => {
                    clickHandler(true);
                  }}
                >
                  Create seed
                </button>
              </div>
            </div>

            <div css={containerRight}>
              <img
                src="/create-seed.svg"
                alt="Person arranges notes on a wall"
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  const categories = await getCategory();
  return {
    props: { categories },
  };
}
