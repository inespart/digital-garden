import { css } from '@emotion/react';
import Head from 'next/head';
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
  position: relative;
  min-height: 100%;
  display: flex;
  padding-top: 100px;

  h3 {
    text-align: left;
  }
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
  padding: 0px 32px;
`;

const heroSectionImage = css`
  display: flex;
  justify-content: flex-end;
  width: 70%;
  padding: 0px 64px;

  img {
    width: 100%;
    height: auto;
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
