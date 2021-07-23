import { css } from '@emotion/react';
import Link from 'next/link';
import { darkGrey } from '../util/sharedStyles';

const footerStyles = css`
  width: 100%;
  height: 62px;
  /* border: 1px solid grey; */
  background-color: #e6f4e1;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 400px) {
    display: none;
  }
`;

const navItemsContainer = css`
  padding-top: 4px;
  display: flex;

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

  div {
    color: ${darkGrey};
    font-size: 0.9rem;
    font-weight: 300;
    text-decoration: none;
    padding-right: 24px;
  }

  a {
    color: grey;
    font-size: 0.9rem;
    font-weight: 300;
    text-decoration: none;

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
        <div>Digital Garden | 2021</div>
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
