module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'plugin:prettier/recommended', 'prettier/react'],
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jest: true,
    node: true,
  },
  rules: {
    // disable camel case beacause API has queries without
    // camel case because of Hivemind table names
    camelcase: [0, { ignoreDestructuring: true }],
    'react/destructuring-assignment': [0, 'always'],
    'react/jsx-fragments': ['off'],
    'prefer-object-spread': ['off'],
    'react/jsx-props-no-spreading': ['off'],
    'react/forbid-prop-types': ['off'],
    'react/require-default-props': ['off'],
    // Next js needs empty <a> inside Link
    'jsx-a11y/anchor-is-valid': ['off'],
    'jsx-a11y/href-no-hash': ['off'],
    'react/no-unused-state': ['off'],
    'react/state-in-constructor': ['off'],
    'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx'] }],
    'max-len': [
      'warn',
      {
        code: 80,
        tabWidth: 2,
        comments: 80,
        ignoreComments: false,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      },
    ],
  },
};
