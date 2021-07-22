import { css } from '@emotion/react';

// Color Palette
export const darkGrey = '#001c00';
export const green = '#A5CC82';
export const blue = '#2C6371';
export const lightBlue = '#2E7F82';
export const lightGreen = '#F8FFF8';

// Font sizes
export const normalFontSize = '16px';
export const smallFontSize = '0.8rem';

// Styles
export const pageContainer = css`
  background-color: ${lightGreen};
  height: 100vh;
  padding-top: 100px;
  padding-left: 128px;
  padding-right: 128px;

  @media (max-width: 768px) {
    padding: 96px 24px;
  }
`;

export const pageContainerWhite = css`
  background-color: white;
  height: 100vh;
  padding-top: 100px;
  padding-left: 128px;
  padding-right: 128px;
`;

// Form Styles
export const wrapper = css`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 64px;

  @media (max-width: 400px) {
    flex-direction: column-reverse;
    padding-top: 12px;
  }
`;

export const registrationForm = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;

  label {
    display: flex;
    flex-direction: column;
    text-align: left;
    color: ${darkGrey};
    font-weight: 500;

    input {
      margin: 5px 0 20px 0;
      width: 256px;
      padding: 12px 8px;

      :focus {
        border: 2px solid ${green};
      }
    }
  }

  button {
    display: flex;
    font-size: 1.5rem;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
`;

export const imageContainer = css`
  width: 50%;

  @media (max-width: 400px) {
    padding-top: 32px;
  }

  img {
    width: 90%;
  }
`;
