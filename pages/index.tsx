import { css } from '@emotion/react';
import Head from 'next/head';
import React from 'react';
import Layout from '../components/Layout';

type Props = {
  username?: string;
};

const heroSection = css`
  background-image: url('/Background.svg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  height: 100vh;
  width: 100%;
  min-height: 100%;
  display: flex;
  padding-top: 100px;

  @media (max-width: 1024px) {
    background-image: url('/Background.svg');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    height: 100vh;
    width: 100%;
    min-height: 100%;
  }

  @media (max-width: 400px) {
    background-image: none;

    h1 {
      font-size: 2rem;
      line-height: 48px;
    }

    h3 {
      font-size: 1rem;
      text-align: center;
    }
  }

  h3 {
    text-align: left;
  }
`;

const heroSectionHeadingImageContainer = css`
  display: flex;
  flex-direction: row;
  padding: 0px 128px;

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: center;
    padding-top: 64px;
  }
`;

const heroSectionHeading = css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60%;
  padding: 0px 32px;

  @media (max-width: 1260px) {
    h1 {
      font-size: 2.5rem;
    }
  }

  @media (max-width: 1024px) {
    padding-bottom: 64px;

    h1 {
      font-size: 3.5rem;
      text-align: center;
    }

    h3 {
      text-align: center;
    }
  }
`;

const heroSectionImage = css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 35%;
  padding-left: 64px;

  img {
    display: flex;
    width: 100%;
    height: auto;

    /* @media (max-width: 1125px) {
      width: 300px;
    } */

    @media (max-width: 1024px) {
      /* justify-content: center; */
      width: 400px;
      padding-left: 0;
      padding-right: 0;
    }
  }
`;

// const advantagesSection = css`
//   height: 100vh;
// `;

export default function Home(props: Props) {
  return (
    <Layout username={props.username}>
      <Head>
        <title>Home | Digital Garden</title>
      </Head>
      <section css={heroSection}>
        <div css={heroSectionHeadingImageContainer}>
          <div css={heroSectionHeading}>
            <div>
              <h1>
                Do you consume lots of interesting information, but feel like
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
      {/* <section css={advantagesSection}>testtestjkösadklfjöaslkdfjösldk</section> */}
    </Layout>
  );
}
