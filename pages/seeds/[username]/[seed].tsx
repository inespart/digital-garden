import { css } from '@emotion/react';
import { Editor } from '@tinymce/tinymce-react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { AiOutlineTag, AiOutlineUser } from 'react-icons/ai';
import { BsLink45Deg, BsLock } from 'react-icons/bs';
import { GoLightBulb } from 'react-icons/go';
import Layout from '../../../components/Layout';
import { green, lightGreen } from '../../../util/sharedStyles';
import { Author, Content, Seed } from '../../../util/types';
import { SingleSeedResponseType } from '../../api/seeds/[username]/[seed]';

type Props = {
  seed: Seed;
  author: Author;
  categoryName: string | undefined;
  publicNoteContent: Content;
  privateNoteContent: Content | undefined;
  slugTitle: string | undefined;
  username?: string;
  // errors?: Error[];
};

export const smallPageContainer = css`
  background-color: ${lightGreen};
  height: 100vh;
  padding-top: 128px;
  padding-left: 192px;
  padding-right: 192px;

  @media (max-width: 768px) {
    padding: 96px 24px;
  }
`;

const seedContainer = css`
  padding-top: 32px;

  h1 {
    margin-bottom: 12px;

    @media (max-width: 400px) {
      font-size: 2rem;
      line-height: 32px;
    }
  }

  input {
    width: 89%;
    padding: 12px 6px;
    border: 1px solid #a3a3a3;
    border-radius: 16px;

    :focus {
      border: 2px solid ${green};
    }

    :disabled {
      border: none;
      background-color: transparent;
      padding: 0;
    }
  }
`;

const seedHeadingContainer = css`
  border: 1px solid ${green};
  border-radius: 32px;
  display: flex;

  .authorCategoryStyle {
    font-size: 0.8rem;
    font-style: italic;
  }

  .urlStyle {
    font-size: 0.8rem;
    margin-bottom: 32px;
  }
`;

const seedInfoContainer = css`
  padding: 0 32px;
  width: 65%;

  @media (max-width: 400px) {
    width: 100%;
  }
`;

const seedImageContainer = css`
  width: 35%;
  display: flex;
  justify-content: flex-end;

  @media (max-width: 400px) {
    width: 0%;
  }

  img {
    width: 300px;
    padding: 0 62px 0 0;

    @media (max-width: 400px) {
      display: none;
    }
  }
`;

const iconStyle = css`
  font-size: 1rem;
`;

const publicNoteContentStyle = css`
  margin: 64px 0;

  @media (max-width: 768px) {
    padding: 0 12px;
  }

  @media (max-width: 400px) {
    margin: 32px 0;
  }
`;

const privateNoteContentStyle = css`
  margin: 64px 0;

  @media (max-width: 768px) {
    padding: 0 12px;
  }

  @media (max-width: 400px) {
    margin: 32px 0;
  }
`;

const buttonContainer = css`
  margin-top: 24px;
  padding-bottom: 32px;

  @media (max-width: 768px) {
    padding: 0 12px;
  }

  button {
    margin-right: 16px;
  }
`;

export default function SeedDisplay(props: Props) {
  const [showEdit, setShowEdit] = useState(true);
  const [resourceUrl, setResourceUrl] = useState(props.seed.resourceUrl);
  const [publicNoteContent, setPublicNoteContent] = useState(
    props.publicNoteContent.content,
  );
  const [privateNoteContent, setPrivateNoteContent] = useState(
    props.privateNoteContent?.content,
  );
  const [errors, setErrors] = useState('');
  const router = useRouter();

  const handleResourceUrlChange = (event: any) =>
    setResourceUrl(event.currentTarget.value);

  // Function to remove html tags from notes
  function createMarkup(content: string) {
    return { __html: content };
  }

  return (
    <Layout username={props.username}>
      <Head>
        <title>Seed | Digital Garden</title>
      </Head>
      <div css={smallPageContainer}>
        <div css={seedContainer}>
          <div css={seedHeadingContainer}>
            <div css={seedInfoContainer}>
              <h1>{props.seed.title}</h1>
              <p className="authorCategoryStyle">
                <AiOutlineUser css={iconStyle} /> Curated by{' '}
                {props.author.username}
              </p>

              <p className="authorCategoryStyle">
                {' '}
                <AiOutlineTag css={iconStyle} />
                Category: {props.categoryName}
              </p>
              <div className="urlStyle">
                {showEdit && resourceUrl ? (
                  <>
                    <BsLink45Deg css={iconStyle} />
                    <a
                      target="_blank"
                      href={props.seed.resourceUrl}
                      rel="noopener noreferrer"
                    >
                      {resourceUrl}
                    </a>
                  </>
                ) : (
                  <input
                    data-cy="edit-resource-url"
                    onChange={handleResourceUrlChange}
                    value={resourceUrl}
                    disabled={showEdit ? true : false}
                  />
                )}
              </div>
            </div>
            <div css={seedImageContainer}>
              <img src="/writing.svg" alt="Person writing in a notebook" />
            </div>
          </div>

          {/* If button EDIT has been clicked, show public note editor */}
          <div css={publicNoteContentStyle}>
            <h2>
              <GoLightBulb />
              Key take-aways:
            </h2>
            {!showEdit ? (
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
                value={publicNoteContent}
                // onEditorChange={(newValue, editor) =>
                //   setPublicNoteContent(newValue)
                // }
                onEditorChange={(newValue) => setPublicNoteContent(newValue)}
              />
            ) : (
              // If button EDIT hasn't been clicked, just show the content
              <div dangerouslySetInnerHTML={createMarkup(publicNoteContent)} />
            )}
          </div>

          {/* If button EDIT has been clicked, show private notes editor */}
          {props.privateNoteContent ? (
            <div css={privateNoteContentStyle}>
              <h2>
                <BsLock />
                Private Note:
              </h2>
              {!showEdit ? (
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
                  value={privateNoteContent}
                  onEditorChange={(newValue) => setPrivateNoteContent(newValue)}
                />
              ) : // If button EDIT hasn't been clicked, just show the content
              privateNoteContent ? (
                <div
                  dangerouslySetInnerHTML={createMarkup(privateNoteContent)}
                />
              ) : (
                ''
              )}
            </div>
          ) : (
            ''
          )}

          {props.privateNoteContent ? (
            <div css={buttonContainer}>
              {/* Edit Seed */}
              <button
                className="button-default-ghost"
                onClick={async () => {
                  if (showEdit) {
                    setShowEdit(false);
                  } else {
                    setShowEdit(true);
                    const response = await fetch(
                      `/api/seeds/${props.author.username}/${props.slugTitle}`,
                      {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          resourceUrl: resourceUrl,
                          publicNoteContent: publicNoteContent,
                          privateNoteContent: privateNoteContent,
                        }),
                      },
                    );
                    const json = await response.json();

                    if ('errors' in json) {
                      setErrors(json.errors[0].message);
                      return;
                    }
                  }
                }}
              >
                {showEdit ? 'Edit' : 'Save Changes'}
              </button>

              {/* Delete Seed */}
              <button
                data-cy="delete-seed-button"
                className="button-default-ghost"
                onClick={async (event) => {
                  event.preventDefault();
                  if (
                    !window.confirm(
                      `Do you really want to delete this piece of wisdom? It will be gone forever.`,
                    )
                  ) {
                    return;
                  }

                  const response = await fetch(
                    `/api/seeds/${props.author.username}/${props.slugTitle}`,
                    {
                      method: 'DELETE',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        id: props.seed.id,
                      }),
                    },
                  );

                  const json = await response.json();

                  if ('errors' in json) {
                    setErrors(json.errors[0].message);
                    return;
                  }

                  // Navigate to seeds overview after having deleted a seed
                  router.push(`/seeds`);
                }}
              >
                Delete
              </button>
            </div>
          ) : (
            ''
          )}
        </div>
        {errors ? errors : ''}
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

  const json = (await response.json()) as SingleSeedResponseType;

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
    // Return a proper status code for a response with a null user (which indicates it has not been found in the database)
    context.res.statusCode = 404;
    return {
      redirect: {
        destination: `/404`,
        permanent: false,
      },
    };
  }
  return {
    props: {
      // json is an object with a user property OR an error property
      // if it has an error property, it's still rendering
      ...json,
    },
  };
}
