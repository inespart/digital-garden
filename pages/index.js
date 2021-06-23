import { css } from '@emotion/react';
import Head from 'next/head';
import Layout from '../components/Layout';

const heroSection = css`
  background-image: url('/Background.svg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  height: 100vh;
  width: 100%;
  position: relative;
  min-height: 100%;
  display: flex;
  padding-top: 100px;
`;

const heroSectionHeadingImageContainer = css`
  display: flex;
  /* justify-content: center; */
  /* align-items: center; */
  padding: 0px 128px;
`;

const heroSectionHeading = css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80%;
  padding: 0px 64px;
`;

const heroSectionImage = css`
  display: flex;
  justify-content: flex-end;
  width: 50%;
  padding: 0px 64px;

  img {
    width: 100%;
    height: auto;
  }
`;

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Home</title>
      </Head>
      <section css={heroSection}>
        <div css={heroSectionHeadingImageContainer}>
          <div css={heroSectionHeading}>
            <div>
              <h1>
                Do you consume a lot of interesting information, but feel like
                it’s not leading to results?
              </h1>
              <h3>
                Discover how the Digital Garden can help you build a second
                brain.
              </h3>
            </div>
          </div>
          <div css={heroSectionImage}>
            <img
              src="digital-garden-home.svg"
              alt="Woman holding a book and reading"
            />
          </div>
        </div>
      </section>
    </Layout>
  );
}
