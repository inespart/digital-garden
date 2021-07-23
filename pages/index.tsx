import { css } from '@emotion/react';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import Header from '../components/Header';

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
  position: relative;
  padding-top: 120px;

  @media (max-width: 400px) {
    padding-top: 10px;
  }
`;

const heroSectionHeadingImageContainer = css`
  display: flex;
  flex-direction: row;
  padding: 0px 128px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }

  @media (max-width: 400px) {
    padding: 96px 24px;
  }
`;

const heroSectionHeading = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 60%;
  padding: 0px 32px;

  @media (max-width: 768px) {
    width: 100%;
    /* padding-bottom: 64px; */
    padding: 0px 0px;
  }

  @media (max-width: 400px) {
    width: 100%;
    padding: 0px 0px;
  }
`;

const headingStyle = css`
  display: flex;
  flex-direction: column;

  @media (max-width: 1260px) {
    h1 {
      font-size: 2.5rem;
    }
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 3.5rem;
      text-align: center;
    }

    h3 {
      align-self: center;
      text-align: center;
    }
  }

  @media (max-width: 400px) {
    h1 {
      font-size: 2rem;
      line-height: 48px;
      margin-bottom: 0;
    }

    h3 {
      font-size: 1rem;
      align-self: center;
      text-align: center;
    }
  }

  h1 {
    margin-bottom: 12px;
  }

  h3 {
    text-align: left;

    @media (max-width: 768px) {
      text-align: center;
    }
  }
`;

const buttonContainer = css`
  display: flex;
  flex-direction: row;

  .button-default-ghost {
    margin-right: 12px;
  }

  @media (max-width: 768px) {
    justify-content: center;
    padding-bottom: 32px;
  }

  @media (max-width: 400px) {
    justify-content: center;
    padding-bottom: 32px;
  }
`;

const heroSectionImage = css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 35%;
  padding-left: 64px;

  @media (max-width: 768px) {
    width: 100%;
    padding: 0px 0px;
  }

  @media (max-width: 400px) {
    width: 100%;
    padding: 0px 0px;
  }

  img {
    width: 100%;
    height: auto;

    @media (max-width: 768px) {
      width: 400px;
    }

    @media (max-width: 400px) {
      width: 200px;
    }
  }
`;

export default function Home(props: Props) {
  return (
    <>
      <Head>
        <title>Home | Digital Garden</title>
      </Head>
      <Header username={props.username} />
      <section css={heroSection}>
        <div css={heroSectionHeadingImageContainer}>
          <div css={heroSectionHeading}>
            <div css={headingStyle}>
              <h1>
                Discover how the Digital Garden can help you build a second
                brain.
              </h1>
              <h3>
                Do you consume lots of interesting information, but feel like
                it’s not leading to results? Take learning into your hands now!
              </h3>
              <div css={buttonContainer}>
                <Link href="/about">
                  <a className="button-default-ghost">Learn More</a>
                </Link>
                <Link href="/seeds">
                  <a className="button-default-ghost">Digital Garden</a>
                </Link>
              </div>
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
    </>
  );
}
