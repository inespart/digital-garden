import { css } from '@emotion/react';
import Footer from './Footer';
import Header from './Header';

const containerStyles = css``;

export default function Layout(props) {
  return (
    <>
      <Header username={props.username} />
      <div css={containerStyles}>{props.children}</div>
      {/* <Footer /> */}
    </>
  );
}
