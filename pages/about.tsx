import { css } from '@emotion/react';
import Head from 'next/head';
import Layout from '../components/Layout';
import { pageContainer } from '../util/sharedStyles';

type Props = {
  username?: string;
};

const iconsContainer = css`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  @media (max-width: 450px) {
    flex-direction: column;
  }
`;

const iconStyle = css`
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 300px;
  margin: 32px;

  img {
    width: 200px;
  }
`;

export default function About(props: Props) {
  return (
    <Layout username={props.username}>
      <Head>
        <title>About | Digital Garden</title>
      </Head>
      <div css={pageContainer}>
        <h1>About Page</h1>
        <h2>Take learning into your hands</h2>
        <p>
          Do you belong to the group of people that loves to read, listen to
          podcasts and consume articles, and want to get the most out it? Then
          the Digital Garden knowlegde base is for you.
        </p>
        <p>
          It is a pinboard where you can capture all the resources that are
          meaningful to you. It also makes it easier for your brain to retain
          your key take-aways by creating meaningful connections with your
          personal experiences. You decide, which part of your notes is public
          and which is only visible to you.
        </p>
        <h2>How it works - 3 simple steps</h2>
        <p>
          First, create a new seed (= resource) and save the url and your key
          take-aways from it. Why did it catch your attention? What exactly do
          you want to remember from it?{' '}
        </p>
        <p>
          Second, think of a situation or story in your life that connects to
          the message of the seed. Does it support or contradict it?{' '}
        </p>{' '}
        <p>
          Lastly, use the digital garden (= pinboard) to get inspired by
          likeminded learners in the areas you are interested in.
        </p>
        <div css={iconsContainer}>
          <div css={iconStyle}>
            <img src="/capture.png" alt="Woman sitting on her computer" />
            <p>Capture your key take-aways</p>
          </div>
          <div css={iconStyle}>
            <img src="/connect.png" alt="Woman next to pinboard" />
            <p>Create meaningful connections</p>
          </div>
          <div css={iconStyle}>
            <img
              src="/inspired.png"
              alt="Woman and man drawing connections between notes"
            />
            <p>Get inspired by fellow learners</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
