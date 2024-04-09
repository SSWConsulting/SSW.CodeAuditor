const { countryCodes } = require('./countries.js');

const RuleType = {
  Warning: 'Warning',
  Error: 'Error',
};

const customOptionInputType = {
  dropDown: 'dropDown',
  singleTextBox: 'singleTextBox',
  multipleTextBoxes: 'multipleTextBoxes',
};

const htmlHintRules = [
  {
    rule: 'tagname-lowercase',
    displayName: 'Tags - Tag names must be lowercase',
    ruleLink: 'https://htmlhint.com/docs/user-guide/rules/tagname-lowercase',
    type: RuleType.Error,
  },
  {
    rule: 'tag-pair',
    displayName: 'Tags - Tags must be paired',
    ruleLink: 'https://htmlhint.com/docs/user-guide/rules/tag-pair',
    type: RuleType.Error,
  },
  {
    rule: 'empty-tag-not-self-closed',
    displayName: 'Tags - Empty tags should not be closed by itself',
    ruleLink:
      'https://htmlhint.com/docs/user-guide/rules/empty-tag-not-self-closed',
    type: RuleType.Warning,
  },
  {
    rule: 'id-class-ad-disabled',
    displayName: "Tags - Id and class must not use the 'ad' keyword",
    ruleLink: 'https://htmlhint.com/docs/user-guide/rules/id-class-ad-disabled',
    type: RuleType.Warning,
  },
  {
    rule: 'id-unique',
    displayName: 'Tags - Id attributes must be unique',
    ruleLink: 'https://htmlhint.com/docs/user-guide/rules/id-unique',
    type: RuleType.Error,
  },
  {
    rule: 'attr-lowercase',
    displayName: 'Attributes - Attribute names must be lowercase',
    ruleLink: 'https://htmlhint.com/docs/user-guide/rules/attr-lowercase',
    type: RuleType.Error,
  },
  {
    rule: 'attr-value-double-quotes',
    displayName: 'Attributes - Attribute values must be in double quotes',
    ruleLink:
      'https://htmlhint.com/docs/user-guide/rules/attr-value-double-quotes',
    type: RuleType.Error,
  },
  {
    rule: 'attr-value-not-empty',
    displayName: 'Attributes - All attributes must have values',
    ruleLink: 'https://htmlhint.com/docs/user-guide/rules/attr-value-not-empty',
    type: RuleType.Warning,
  },
  {
    rule: 'attr-no-duplication',
    displayName: 'Attributes - Element cannot contain duplicate attributes',
    ruleLink: 'https://htmlhint.com/docs/user-guide/rules/attr-no-duplication',
    type: RuleType.Error,
  },
  {
    rule: 'attr-unsafe-chars',
    displayName: 'Attributes - Attributes cannot contain unsafe characters',
    ruleLink: 'https://htmlhint.com/docs/user-guide/rules/attr-unsafe-chars',
    type: RuleType.Warning,
  },
  {
    rule: 'doctype-first',
    displayName: 'Header - DOCTYPE must be declared first',
    ruleLink: 'https://htmlhint.com/docs/user-guide/rules/doctype-first',
    type: RuleType.Error,
  },
  {
    rule: 'title-require',
    displayName: 'Header - Missing title tag',
    ruleLink: 'https://htmlhint.com/docs/user-guide/rules/title-require',
    type: RuleType.Error,
  },
  {
    rule: 'doctype-html5',
    displayName: 'Header - DOCTYPE must be HTML5',
    ruleLink: 'https://htmlhint.com/docs/user-guide/rules/doctype-html5',
    type: RuleType.Warning,
  },
  {
    rule: 'head-script-disabled',
    displayName: 'Syntax - Script tags cannot be used inside another tag',
    ruleLink: 'https://htmlhint.com/docs/user-guide/rules/head-script-disabled',
    type: RuleType.Warning,
  },
  {
    rule: 'spec-char-escape',
    displayName: 'Syntax - Special characters must be escaped',
    ruleLink: 'https://htmlhint.com/docs/user-guide/rules/spec-char-escape',
    type: RuleType.Error,
  },
  {
    rule: 'style-disabled',
    displayName: 'Syntax - Style tags should not be used outside of header',
    ruleLink: 'https://htmlhint.com/docs/user-guide/rules/style-disabled',
    type: RuleType.Warning,
  },
  {
    rule: 'inline-style-disabled',
    displayName: 'Syntax - Inline styling should not be used',
    ruleLink:
      'https://htmlhint.com/docs/user-guide/rules/inline-style-disabled',
    type: RuleType.Warning,
  },
  {
    rule: 'inline-script-disabled',
    displayName: 'Syntax - Inline scripts should not be used',
    ruleLink:
      'https://htmlhint.com/docs/user-guide/rules/inline-script-disabled',
    type: RuleType.Warning,
  },
  {
    rule: 'alt-require',
    displayName: 'Images - Missing alt attribute',
    ruleLink: 'https://htmlhint.com/docs/user-guide/rules/alt-require',
    type: RuleType.Warning,
  },
  // Disabled on 20/09/2023
  // {
  //   rule: "href-abs-or-rel",
  //   displayName: "Links - Href attribute must be either absolute or relative",
  //   ruleLink: "https://htmlhint.com/docs/user-guide/rules/href-abs-or-rel",
  //   type: RuleType.Warning
  // },
  {
    rule: 'src-not-empty',
    displayName: 'Content - The image src attribute must have a value',
    ruleLink: 'https://htmlhint.com/docs/user-guide/rules/src-not-empty',
    type: RuleType.Error,
  },
];

const customHtmlHintRules = [
  {
    rule: 'code-block-missing-language',
    displayName: 'Syntax - Code blocks must have a language',
    ruleLink: 'https://www.ssw.com.au/rules/set-language-on-code-blocks',
    type: RuleType.Warning,
  },
  // {
  //   rule: "youtube-url-must-be-used-correctly",
  //   displayName: "Syntax - YouTube videos must not be under an embed URL",
  //   ruleLink: "https://ssw.com.au/rules/optimize-videos-for-youtube/",
  //   type: RuleType.Warning
  // },
  {
    rule: 'figure-must-use-the-right-code',
    displayName: 'Syntax - Use the right HTML/CSS figure markup',
    ruleLink: 'https://www.ssw.com.au/rules/use-the-right-html-figure-caption',
    type: RuleType.Warning,
  },
  {
    rule: 'font-tag-must-not-be-used',
    displayName: 'Tags - Font tags must not be used',
    ruleLink:
      'https://www.ssw.com.au/rules/do-you-know-font-tags-are-no-longer-used',
    type: RuleType.Warning,
  },
  {
    rule: 'link-must-be-descriptive',
    displayName: 'Content - Links must be descriptive',
    ruleLink: 'https://www.ssw.com.au/rules/descriptive-links/',
    type: RuleType.Warning,
  },
  {
    rule: 'grammar-scrum-terms',
    displayName: 'Content - Use the correct Scrum terms',
    ruleLink: 'https://www.ssw.com.au/rules/scrum-should-be-capitalized',
    type: RuleType.Warning,
  },
  {
    rule: 'common-spelling-mistakes',
    displayName: 'Content - Avoid common spelling and syntax mistakes',
    ruleLink: 'https://www.ssw.com.au/rules/avoid-common-mistakes',
    type: RuleType.Warning,
    isEnableCustomOptions: true,
    customOptionsMessage: 'Please enter the terms to be reported:',
    customOptionInputType: customOptionInputType.multipleTextBoxes,
    customOptionDefaultValue: [
      'e-mail',
      'EMail',
      'can not',
      'web site',
      'user name',
      'task bar',
      'Ok',
      'Okay',
      'okay',
      'o.k',
    ],
  },
  {
    rule: 'page-must-not-show-email-addresses',
    displayName: 'Content - Text must not display any email addresses',
    ruleLink:
      'https://www.ssw.com.au/rules/avoid-clear-text-email-addresses-in-web-pages',
    type: RuleType.Warning,
  },
  {
    rule: 'phone-numbers-without-links',
    displayName: 'Content - Phone numbers must be in hyperlinks',
    ruleLink:
      'https://www.ssw.com.au/rules/do-you-know-to-hyperlink-your-phone-numbers',
    type: RuleType.Warning,
    isEnableCustomOptions: true,
    customOptionsMessage: 'Please choose the country code:',
    customOptionInputType: customOptionInputType.dropDown,
    customOptionDropdownValues: countryCodes,
    customOptionDefaultValue: 'AU',
  },
  {
    rule: 'use-unicode-hex-code-for-special-html-characters',
    displayName: 'Content - Use Unicode Hex code for special HTML characters',
    ruleLink: 'https://ssw.com.au/rules/html-unicode-hex-codes/',
    type: RuleType.Error,
  },
  {
    rule: 'auth-terms-spelling-mistakes',
    displayName: 'Content - Do you use right terms for user authentication?',
    ruleLink: 'https://www.ssw.com.au/rules/user-authentication-terms/',
    type: RuleType.Warning,
  },
  {
    rule: 'anchor-names-must-be-valid',
    displayName: 'Links - Anchor links’ names must be valid',
    ruleLink: 'https://www.ssw.com.au/rules/chose-efficient-anchor-names',
    type: RuleType.Warning,
  },
  {
    rule: 'url-must-be-formatted-correctly',
    displayName:
      'Links - URLs should not include full stop or slash at the end',
    ruleLink:
      'https://ssw.com.au/rules/no-full-stop-or-slash-at-the-end-of-urls/',
    type: RuleType.Warning,
  },
  {
    rule: 'detect-absolute-references-url-path-correctly',
    displayName: 'Links - Avoid absolute internal URLs',
    ruleLink: 'https://ssw.com.au/rules/avoid-absolute-internal-links/',
    type: RuleType.Warning,
    isEnableCustomOptions: true,
    customOptionsMessage: 'Please enter the website internal URL:',
    customOptionInputType: customOptionInputType.singleTextBox,
    customOptionInputValueType: 'url',
  },
  {
    rule: 'url-must-not-have-space',
    displayName: 'Links - URLs must not have space',
    ruleLink: 'https://www.ssw.com.au/rules/use-dashes-in-urls',
    type: RuleType.Warning,
  },
  {
    rule: 'link-must-not-show-unc',
    displayName: 'Links - URLs must not have UNC paths',
    ruleLink: 'https://www.ssw.com.au/rules/urls-must-not-have-unc-paths/',
    type: RuleType.Warning,
  },
  {
    rule: 'meta-tag-must-not-redirect',
    displayName: 'Header - Must not refresh or redirect',
    ruleLink: 'https://rules.sonarsource.com/html/RSPEC-1094',
    type: RuleType.Warning,
  },
  {
    rule: 'favicon-must-be-added',
    displayName: 'Header - Must include favicon',
    ruleLink: 'https://www.ssw.com.au/rules/favicon/',
    type: RuleType.Warning,
  },
  // Add new rule id below
];

module.exports = { RuleType, customOptionInputType, htmlHintRules, customHtmlHintRules };