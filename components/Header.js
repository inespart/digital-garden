import 'intro.js/introjs.css';
import { css } from '@emotion/react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { darkGrey, green } from '../util/sharedStyles';

const Steps = dynamic(
  () => {
    return import('intro.js-react').then((mod) => mod.Controlled);
  },
  { ssr: false },
);

const Hints = dynamic(
  () => {
    return import('intro.js-react').then((mod) => mod.Controlled);
  },
  { ssr: false },
);

// const intro = introJs();

const steps = [
  {
    element: '#step-one',
    intro: 'Read about the Digital Garden',
    position: 'bottom',
    // tooltipClass: 'myTooltipClass',
    // highlightClass: 'myHighlightClass',
  },
  // {
  //   element: '.selector2',
  //   intro: 'test 2',
  // },
  // {
  //   element: '.selector3',
  //   intro: 'test 3',
  // },
];

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
  return (
    <header css={headerStyles}>
      <div css={logoContainer}>
        <Link href="/">
          <a>
            <img src="/digital-garden-logo.png" alt="Digital Garden Logo" />
          </a>
        </Link>
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
              <li
                className="button-default"
                data-title="Welcome!"
                data-intro="Hello World!"
              >
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
                <li className="button-default-ghost">Login</li>
              </a>
            </Link>
          )}{' '}
          {/* {props.username && `User: ${props.username}`}{' '} */}
        </ul>
      </div>
      {console.log('steps', steps)}
      <Steps steps={steps} />
      {/* <Steps
        enabled={stepsEnabled}
        steps={steps}
        initialStep={initialStep}
        onExit={this.onExit}
      /> */}
    </header>
  );
}
