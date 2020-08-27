const { getReversedTick } = require('./utils');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
test('getReversedTick() must return string with 19 characters', () => {
	expect(getReversedTick().length).toBe(19);
});
test('getReversedTick() must return 2 different strings', async () => {
  const str1 = getReversedTick();
  await sleep(200);
  const str2 = getReversedTick();
	expect(str1 === str2).toBe(false);
});
