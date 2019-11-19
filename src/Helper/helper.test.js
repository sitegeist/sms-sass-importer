import {isJSONfile, hasWildCards} from '.';
import HelperFixtures from './fixtures'

test('returns true if its contains the string json', () => {
  expect(isJSONfile(HelperFixtures.isJSONfile.url)).toBe(true);
});

test('returns true if its contains the string json', () => {
  expect(hasWildCards(HelperFixtures.hasWildCards.url)).toBe(true);
});

