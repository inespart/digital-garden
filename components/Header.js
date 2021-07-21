import 'intro.js/introjs.css';
import { css } from '@emotion/react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState } from 'react';
import { FaRegLightbulb } from 'react-icons/fa';
import { darkGrey, green } from '../util/sharedStyles';

// eslint-disable-next-line @typescript-eslint/naming-convention
const Steps = dynamic(
  () => {
    return import('intro.js-react').then((mod) => mod.Steps);
  },
  { ssr: false },
);

const headerStyles = css`
  width: 100%;
  height: 100px;
  padding: 12px 128px;
  display: flex;
  justify-content: space-between;
  background-color: ${green};
  font-weight: 400;
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
`;

const logoContainer = css`
  display: flex;
  align-items: center;
  text-transform: uppercase;
  letter-spacing: 5px;
  font-weight: 500;
  color: ${darkGrey};
  font-size: 1.2rem;

  a {
    text-decoration: none;
    color: ${darkGrey};
  }

  img {
    width: 90px;
  }

  .button-default {
    margin-left: 24px;
    padding: 8px;
    border-radius: 6px;
    /* color: ${darkGrey};
    background-color: #f7f57c; */
    border: none;
  }
`;

const navContainer = css`
  display: flex;

  ul {
    list-style: none;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    padding: 0;
  }

  li {
    padding: 12px 24px;
  }

  .button-default,
  .button-default-ghost {
    margin: 12px 24px;
  }

  a {
    text-decoration: none;
    color: ${darkGrey};

    :hover {
      font-weight: 400;
    }
  }
`;

export default function Header(props) {
  const [stepsEnabled, setStepsEnabled] = useState(false);
  const [initialStep] = useState(0);
  const [steps] = useState([
    {
      element: '#step-one',
      intro: 'Find out how to build your personal knowledge base',
      position: 'bottom',
    },
    {
      element: '#step-two',
      intro: 'Register for free to use all features',
      position: 'bottom',
    },
    {
      element: '#step-three',
      intro: 'Create your own seed and build a second brain',
      position: 'bottom',
    },
  ]);
  const onExit = () => {
    setStepsEnabled(false);
  };
  const startIntro = () => {
    setStepsEnabled(true);
  };

  return (
    <header css={headerStyles}>
      <div css={logoContainer}>
        <Steps
          steps={steps}
          enabled={stepsEnabled}
          initialStep={initialStep}
          onExit={onExit}
        />
        <Link href="/">
          <a>
            <img src="/digital-garden-logo.png" alt="Digital Garden Logo" />
          </a>
        </Link>
        {!props.username ? (
          <button className="button-default" onClick={() => startIntro()}>
            <FaRegLightbulb /> How to get started
          </button>
        ) : (
          ''
        )}
      </div>

      <div css={navContainer}>
        <ul>
          <Link href="/seeds">
            <a data-cy="header-seeds-link">
              <li>Digital Seeds</li>
            </a>
          </Link>
          {props.username ? (
            <Link href={`/profiles/${props.username}`}>
              <a data-cy="header-my-profile-link">
                <li>My Profile</li>
              </a>
            </Link>
          ) : (
            ''
          )}
          <Link href="/about">
            <a>
              <li id="step-one">About</li>
            </a>
          </Link>
          <Link href="/seeds/create">
            <a>
              <li id="step-three" className="button-default">
                + Create Seed
              </li>
            </a>
          </Link>
          {props.username ? (
            <Link href="/logout">
              <a>
                <li className="button-default-ghost">Logout</li>
              </a>
            </Link>
          ) : (
            <Link href="/login">
              <a data-cy="header-login-link">
                <li id="step-two" className="button-default-ghost">
                  Login
                </li>
              </a>
            </Link>
          )}{' '}
          {/* {props.username && `Hello, ${props.username}`}{' '} */}
        </ul>
      </div>
    </header>
  );
}
