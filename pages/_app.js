import '../styles/globals.css';
import { css, Global } from '@emotion/react';
import Head from 'next/head';
import {
  blue,
  darkGrey,
  lightBlue,
  normalFontSize,
} from '../util/sharedStyles';

require('typeface-poppins');

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Global
        styles={css`
          *,
          *::after,
          *::before {
            box-sizing: border-box;
          }
          body {
            margin: 0;
            font-family: 'Roboto', sans-serif;
            font-size: ${normalFontSize};
            color: ${darkGrey};
            width: 100%;
            height: 100vh;
            background-color: #f8fff8;
          }

          .page-container {
            padding: 100px 128px;
          }

          h1,
          h2,
          h3 {
            font-weight: 500;
          }

          h1 {
            font-size: 2.5rem;
            line-height: 58px;
          }

          h2 {
            font-size: 1.7rem;
          }

          h3 {
            font-size: 1.5rem;
            line-height: 40px;
          }

          .button-default {
            padding: 12px 24px;
            background-color: ${blue};
            border: 1px solid ${blue};
            border-radius: 32px;
            cursor: pointer;
            color: white;

            :hover {
              background-color: ${lightBlue};
              border: 1px solid ${lightBlue};
            }
          }

          .button-default-ghost {
            padding: 12px 24px;
            background-color: none;
            border: 1px solid ${darkGrey};
            border-radius: 32px;
            cursor: pointer;
            color: ${darkGrey};
          }
        `}
      />
      <Head>
        <link icon="favicon" href="favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
