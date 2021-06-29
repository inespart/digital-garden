import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { isContext } from 'vm';
import Layout from '../components/Layout';
import { pageContainer } from '../util/sharedStyles';
import { RegisterResponse } from './api/register';

type Props = {
  refreshUsername: () => void;
  username?: string;
};

export default function CreateSeed(props: Props) {
  const [title, setTitle] = useState('');
  // const [slug, setSlug] = useState('');
  const [publicNoteId, setPublicNoteId] = useState('');
  const [privateNoteId, setPrivateNoteId] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  // Do I need them?
  // const [imageUrl, setImageUrl] = useState('');
  // const [userId, setUserId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  // brain links?
  // End
  const [error, setError] = useState('');
  const router = useRouter();

  return (
    <Layout username={props.username}>
      <Head>
        <title>Create Seed | Digital Garden</title>
      </Head>
      <div css={pageContainer}>
        <h1>Create Seed</h1>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            const response = await fetch(`/api/create-seed`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                title: title,
                // slug: slug,
                publicNote: publicNoteId,
                privateNote: privateNoteId,
                resourceUrl: resourceUrl,
                // imageUrl: imageUrl,
                // userId: props.user.id,
                categoryId: categoryId,
                isPublished: isPublished,
              }),
            });
            const json = (await response.json()) as RegisterResponse;

            if ('errors' in json) {
              setError(json.errors[0].message);
              return;
            }

            props.refreshUsername();

            // TODO: Navigate to [title].tsx page when new seed has been successfully created
            router.push(`/registration-successful`);
          }}
        >
          <div>
            <label>
              Category:
              {/* TODO: Map over categories */}
              <select>
                <option value="business">Business</option>
                <option value="technology">Technology</option>
                <option value="psychology">Psychology</option>
              </select>
            </label>
          </div>

          <div>
            <label>
              Title:
              <input
                value={title}
                placeholder="Difference between arrays and objects"
                onChange={(event) => {
                  setTitle(event.currentTarget.value);
                }}
              />
            </label>
          </div>

          <div>
            <label>
              Resource URL:
              <input
                value={resourceUrl}
                placeholder="https://www.khanacademy.org/computing/computer-programming/programming/arrays/a/review-arrays"
                onChange={(event) => {
                  setResourceUrl(event.currentTarget.value);
                }}
              />
            </label>
          </div>

          <div>
            <label>
              Public Note:
              <input
                value={publicNoteId}
                type="text"
                placeholder="Key take-aways"
                onChange={(event) => {
                  setPublicNoteId(event.currentTarget.value);
                }}
              />
            </label>
          </div>

          <div>
            <label>
              Private Note:
              <input
                value={privateNoteId}
                type="text"
                placeholder="No one will ever see these links."
                onChange={(event) => {
                  setPrivateNoteId(event.currentTarget.value);
                }}
              />
            </label>
          </div>

          <button
            className="button-default-ghost"
            onClick={() => {
              setIsPublished(false);
            }}
          >
            Save as draft
          </button>
          <button
            className="button-default"
            onClick={() => {
              setIsPublished(true);
            }}
          >
            Create seed
          </button>
          <div style={{ color: 'red' }}>{error}</div>
        </form>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      // user,
    },
  };
}
