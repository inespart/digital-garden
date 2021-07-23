import 'intro.js/introjs.css';
import { css } from '@emotion/react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState } from 'react';
import { FaRegLightbulb } from 'react-icons/fa';
import { darkGrey, green } from '../util/sharedStyles';
import HeaderBurger from './HeaderBurger';
import HeaderRightNav from './HeaderRightNav';

// eslint-disable-next-line @typescript-eslint/naming-convention
const Steps = dynamic(
  () => {
    return import('intro.js-react').then((mod) => mod.Steps);
  },
  { ssr: false },
);

const headerStyles = css`
  width: 100%;
  height: 112px;
  padding: 12px 128px;
  display: flex;
  justify-content: space-between;
  background-color: ${green};

  font-weight: 400;
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;

  @media (max-width: 768px) {
    padding: 32px 24px;
  }
`;

const tourButton = css`
  .button-default {
    margin-left: 24px;
    padding: 8px;
    border-radius: 6px;
    border: none;
  }

  @media (max-width: 450px) {
    display: none;
  }
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

export default function Header(props) {
  const [open, setOpen] = useState(false);
  const [stepsEnabled, setStepsEnabled] = useState(false);
  const [initialStep] = useState(0);
  const [steps] = useState([
    {
      element: '#step-zero',
      intro: 'A seed is a resource with your personal notes',
      position: 'bottom',
    },
    {
      element: '#step-one',
      intro: 'Find out how personal notes help you retain information',
      position: 'bottom',
    },
    {
      element: '#step-three',
      intro: 'Create your own seed and start building your second brain',
      position: 'bottom',
    },
    {
      element: '#step-two',
      intro: 'Register for free to use all features',
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
            <img
              src="/digital-garden-logo-transparent.png"
              alt="Digital Garden Logo"
            />
          </a>
        </Link>
        {!props.username ? (
          <div css={tourButton}>
            <button className="button-default" onClick={() => startIntro()}>
              <FaRegLightbulb /> Get started
            </button>
          </div>
        ) : (
          ''
        )}
      </div>
      <HeaderRightNav username={props.username} open={open} />
      <HeaderBurger open={open} setOpen={setOpen} />
    </header>
  );
}
