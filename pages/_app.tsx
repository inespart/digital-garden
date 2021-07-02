import '../styles/globals.css';
import { css, Global } from '@emotion/react';
import { AppProps } from 'next/dist/next-server/lib/router/router';
import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';
import {
  blue,
  darkGrey,
  green,
  lightBlue,
  normalFontSize,
} from '../util/sharedStyles';

require('typeface-inter');
require('typeface-petrona');

export default function MyApp({ Component, pageProps }: AppProps) {
  const [username, setUsername] = useState<string>();

  // Declare a function that we will use in any page or
  // component (via passing props) to refresh the
  // username (if it has gotten out of date)
  const refreshUsername =
    // useCallback: Prevent this function from getting
    // a different reference on every rerender
    //
    // We do this to prevent calls to the API on
    // every page navigation
    useCallback(async () => {
      // Call the API to retrieve the user information
      // by automatically passing along the sessionToken cookie
      const response = await fetch('/api/profile');
      const json = await response.json();

      // If there are errors, return early
      if ('errors' in json) {
        // TODO: Handle errors - show to the user
        return;
      }

      // Set the username state variable which we can use
      // in other components via passing props
      setUsername(json.user?.username);
    }, []);

  // Retrieve username information ONCE the first time
  // that a user loads the page
  useEffect(() => {
    refreshUsername();
  }, [refreshUsername]);

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
            font-family: 'Inter', sans-serif;
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
          }

          h1 {
            font-size: 4rem;
            line-height: 64px;
            font-family: 'Petrona', sans-serif;
            font-weight: 800;
          }

          h2 {
            font-size: 1.7rem;
            font-weight: 500;
          }

          h3 {
            font-size: 1.5rem;
            line-height: 32px;
            font-weight: 400;
            text-align: center;
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
            background-color: transparent;
            border: 1px solid ${darkGrey};
            border-radius: 32px;
            cursor: pointer;
            color: ${darkGrey};
          }

          a {
            color: ${green};
            font-weight: 500;
          }

          .a-no-highlight-color {
            color: ${darkGrey};
          }
        `}
      />
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component
        refreshUsername={refreshUsername}
        username={username}
        {...pageProps}
      />
    </>
  );
}
