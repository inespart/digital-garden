import '../styles/globals.css';
import { css, Global } from '@emotion/react';
import Head from 'next/head';
import { blue, darkGrey, lightBlue } from '../util/sharedStyles';

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
            font-family: 'Poppins', sans-serif;
            font-size: 16px;
            color: black;
          }
          h1,
          h2,
          h3 {
            font-weight: 500;
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
