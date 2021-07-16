import { css } from '@emotion/react';
import { Editor } from '@tinymce/tinymce-react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { BiErrorCircle } from 'react-icons/bi';
import Layout from '../../components/Layout';
import { getCategory } from '../../util/database';
import { darkGrey, green, pageContainer } from '../../util/sharedStyles';

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
    margin-bottom: 32px;
    margin-top: 16px;
  }
`;

const containerLeft = css`
  display: flex;
  flex-direction: column;
  width: 65%;
  margin-right: 32px;

  div {
    margin: 4px 0 24px 0;
  }
`;

const containerRight = css`
  display: flex;
  flex-direction: column;
  width: 35%;

  img {
    padding-left: 96px;
  }
`;

const errorStyle = css`
  color: red;
  font-size: 0.8rem;
  font-style: italic;
`;

export default function CreateSeed(props: Props) {
  const [title, setTitle] = useState('');
  const [publicNoteId, setPublicNoteId] = useState('');
  const [privateNoteId, setPrivateNoteId] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [errors, setErrors] = useState<any[]>();
  const router = useRouter();

  async function clickHandler(isPublished: boolean) {
    const response = await fetch(`/api/seeds/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // send the request body to the API route
      body: JSON.stringify({
        title: title,
        publicNoteId: publicNoteId,
        privateNoteId: privateNoteId,
        resourceUrl: resourceUrl,
        categoryId: Number(categoryId),
        imageUrl: '',
        isPublished: isPublished,
      }),
    });

    // Wait for the response of the fetch inside create.ts and then transform it into json
    const {
      user,
      sluggedTitle,
      errors: [errorMessage],
    } = await response.json();

    // errorMessage = [
    //   {field: , message: },
    //   {}
    // ]

    // if (errorMessage) {
    //   console.log('errors after fetch in create.tsx', errorMessage);
    // } else {
    //   console.log('no errors sent to the frontend, juhu');
    // }

    // Check if there is an errorMessage inside the json and update state
    if (errorMessage) {
      // console.log('error in create.tsx', errorMessage);
      setErrors(errorMessage);
      return;
    }
    // Navigate to /seeds/[username]/[title].tsx page when new seed has been successfully created
    router.push(`/seeds/${user.username}/${sluggedTitle}`);
  }

  const errorObject = {
    // validSession, category, title, publicNote is either an error object or undefined
    validSession: errors?.find((e: any) => e.field === 'validSession'),
    category: errors?.find((e: any) => e.field === 'categoryId'),
    title: errors?.find((e: any) => e.field === 'title'),
    publicNote: errors?.find((e: any) => e.field === 'publicNoteId'),
  };
  // console.log('errorObject', errorObject);
  // console.log('errorObject.category', errorObject.category);
  // console.log('errorObject.title', errorObject.title);
  // console.log('errorObject.publicNote', errorObject.publicNote);

  return (
    <Layout username={props.username}>
      <Head>
        <title>Create Seed | Digital Garden</title>
        <script src="/path/to/tinymce.min.js" />
      </Head>
      <div css={pageContainer}>
        <h1>Create Seed</h1>

        <div>
          <div css={formStyle}>
            <div css={containerLeft}>
              {errorObject.validSession
                ? !window.alert(
                    `It seems like you're not logged in. Please log in to create a seed.`,
                  )
                : ''}
              <div>
                <label>
                  Category: {/* Map over categories */}
                  <select
                    data-cy="create-category"
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
                {errorObject.category ? (
                  <span css={errorStyle}>{errorObject.category.message}</span>
                ) : (
                  ''
                )}
              </div>

              <div>
                <label>
                  Title:
                  <input
                    data-cy="create-title"
                    value={title}
                    placeholder="Insert title of your seed"
                    required
                    minLength={3}
                    maxLength={40}
                    onChange={(event) => {
                      setTitle(event.currentTarget.value);
                    }}
                  />
                </label>
                {errorObject.title ? (
                  <span css={errorStyle}>{errorObject.title.message}</span>
                ) : (
                  ''
                )}
              </div>

              <div>
                <label>
                  Resource URL: (optional)
                  <input
                    data-cy="create-resource-url"
                    value={resourceUrl}
                    placeholder="www.khanacademy.org/review-arrays"
                    onChange={(event) => {
                      setResourceUrl(event.currentTarget.value);
                    }}
                  />
                </label>
              </div>

              {/* <div>
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
              </div> */}

              <div>
                <label>
                  Public Note:
                  <Editor
                    apiKey={process.env.API_KEY}
                    // onInit={(evt, editor) => (editorRef.current = editor)}
                    // initialValue="<p>What are your key takeaways?</p>"
                    init={{
                      height: 500,
                      menubar: false,
                      encoding: 'xml',
                      plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount',
                      ],
                      toolbar:
                        'undo redo | formatselect | ' +
                        'bold italic backcolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                      content_style:
                        'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                    }}
                    data-cy="create-public-note"
                    value={publicNoteId}
                    onEditorChange={(newValue) => setPublicNoteId(newValue)}
                  />
                  {/* <input
                    css={largeInput}
                    type="text"
                    placeholder="Key take-aways and main learnings"
                    required
                    value={publicNoteId}
                    onChange={(event) => {
                      setPublicNoteId(event.currentTarget.value);
                    }}
                  /> */}
                </label>
                {errorObject.publicNote ? (
                  <span css={errorStyle}>{errorObject.publicNote.message}</span>
                ) : (
                  ''
                )}
              </div>

              <div>
                <br />
                <label>
                  Private Note: (optional)
                  <Editor
                    apiKey={process.env.API_KEY}
                    // onInit={(evt, editor) => (editorRef.current = editor)}
                    // initialValue="<p>No one will ever see your private notes</p>"
                    init={{
                      height: 500,
                      menubar: false,
                      plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount',
                      ],
                      toolbar:
                        'undo redo | formatselect | ' +
                        'bold italic backcolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                      content_style:
                        'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                    }}
                    value={privateNoteId}
                    onEditorChange={(newValue) => setPrivateNoteId(newValue)}
                  />
                  {/* <input
                    css={largeInput}
                    value={privateNoteId}
                    type="text"
                    placeholder="No one will ever see your private notes"
                    onChange={(event) => {
                      setPrivateNoteId(event.currentTarget.value);
                    }}
                  /> */}
                </label>
              </div>

              <div css={buttonStyles}>
                {/* Keep this */}

                {/* <button
                  className="button-default-ghost"
                  onClick={() => {
                    clickHandler(false);
                  }}
                >
                  Save as draft
                </button> */}

                {errors ? (
                  <div css={errorStyle}>
                    {' '}
                    <BiErrorCircle /> Please fill out all required fields above.
                  </div>
                ) : (
                  ''
                )}

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
