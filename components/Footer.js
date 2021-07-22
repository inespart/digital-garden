import { css } from '@emotion/react';
import Link from 'next/link';
import { darkGrey } from '../util/sharedStyles';

const footerStyles = css`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 32px;
  background-color: #e7f4e1;

  @media (max-width: 400px) {
    display: none;
  }
`;

const navItemsContainer = css`
  padding-top: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  ul {
    display: inline-grid;
    grid-auto-flow: row;
    list-style: none;
    grid-gap: 24px;
    justify-items: center;
    margin: auto;

    @media (min-width: 500px) {
      grid-auto-flow: column;
    }
  }

  a {
    color: #a9a9a9;
    font-weight: 300;
    text-decoration: none;
    box-shadow: inset 0 -1px 0 hsla(0, 0%, 100%, 0.4);

    :hover {
      font-weight: 400;
      color: ${darkGrey};
    }
  }

  li:last-child {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
  }

  li:hover ~ li p {
    animation: wave-animation 0.3s infinite;
  }
`;

export default function Footer() {
  return (
    <div css={footerStyles}>
      {' '}
      <div css={navItemsContainer}>
        <ul>
          <Link href="/">
            <a>
              <li>Home</li>
            </a>
          </Link>
          <Link href="/seeds">
            <a>
              <li>Digital Seeds</li>
            </a>
          </Link>
          <Link href="/seeds/create">
            <a>
              <li>Create Seed</li>
            </a>
          </Link>
          <Link href="/about">
            <a>
              <li>About</li>
            </a>
          </Link>
        </ul>
      </div>
    </div>
  );
}
