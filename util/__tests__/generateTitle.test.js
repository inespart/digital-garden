/**
 * @jest-environment jsdom
 */

import { generateTitle } from '../generateTitle';

test('generateTitle returns correct title for the slug', () => {
  const title = 'Arrays vs. objects';
  const expectedResult = 'arrays-vs.-objects';

  const title2 = `Stephen King's On Writing`;
  const expectedResult2 = `stephen-king's-on-writing`;

  const result = generateTitle(title);
  expect(result).toBe(expectedResult);

  const result2 = generateTitle(title2);
  expect(result2).toBe(expectedResult2);
});
