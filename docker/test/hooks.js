const { addCustomHtmlRule } = require('../customHtmlRules');

exports.mochaHooks = {
  async beforeAll() {
    await addCustomHtmlRule(null, 'https://ssw.com.au/');
  },
};
