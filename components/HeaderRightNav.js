import { css } from '@emotion/react';
import Link from 'next/link';
import { darkGrey, green } from '../util/sharedStyles';

const navContainer = (open) => css`
  display: flex;

  @media (max-width: 1125px) {
  }

  ul {
    list-style: none;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    padding: 0;

    @media (max-width: 1125px) {
      flex-flow: column nowrap;
      background-color: ${green};
      position: fixed;
      top: 0px;
      right: 0;
      height: 100vh;
      width: 200px;
      margin-top: 0;
      padding-top: 5rem;
      transform: ${open ? 'translateX(0)' : 'translateX(100%)'};
      transition: transform 0.3s ease-in-out;
    }
  }

  li {
    padding: 12px 24px;
  }

  .button-default,
  .button-default-ghost {
    margin: 12px 24px;

    @media (max-width: 1125px) {
      width: 140px;
      margin: 12px;
      text-align: center;
      padding: 6px 12px;
    }
  }

  a {
    text-decoration: none;
    color: ${darkGrey};

    :hover {
      font-weight: 400;
    }
  }
`;

export default function HeaderRightNav(props) {
  return (
    <div css={navContainer(props.open)}>
      <ul>
        <Link href="/seeds">
          <a data-cy="header-seeds-link">
            <li id="step-zero">Digital Seeds</li>
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
        {props.username && `Hello, ${props.username}`}{' '}
      </ul>
    </div>
  );
}
