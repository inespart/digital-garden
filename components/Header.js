import { css } from '@emotion/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { darkGrey, green } from '../util/sharedStyles';

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
    /* z-index: 1200; */
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
  const router = useRouter();

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
              <li>About</li>
            </a>
          </Link>
          <Link href="/seeds/create">
            <a>
              <li class="button-default">+ Create Seed</li>
            </a>
          </Link>
          {props.username ? (
            <Link href="/logout">
              <a>
                <li class="button-default-ghost">Logout</li>
              </a>
            </Link>
          ) : (
            <Link href="/login">
              <a data-cy="header-login-link">
                <li class="button-default-ghost">Login</li>
              </a>
            </Link>
          )}{' '}
          {/* {props.username && `User: ${props.username}`}{' '} */}
        </ul>
      </div>
    </header>
  );
}
