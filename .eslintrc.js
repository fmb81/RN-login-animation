module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 10,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
      modules: true
    }
  },
  "env": {
    "es6": true
  },
  "extends": [
    "eslint:recommended",
  ],
  plugins: ["react", "react-native"],
  rules: {
    "indent": ["error", 4],
    "object-curly-spacing": ["error", "always"],
    "linebreak-style": ["error", "unix"],
    "quotes": ["error", "single"],
    "semi": ["error", "always"],
    "jsx-quotes": ["error", "prefer-double"],
    "arrow-parens": ["error", "always"],
    "max-lines": ["error", { "max": 1000, "skipComments": true, "skipBlankLines": true }],
    "comma-dangle": ["error", "always-multiline"],
    "prefer-object-spread": "error",
    "padding-line-between-statements": [
      "error",
      {
        "blankLine": "always",
        "prev": "*",
        "next": ["throw", "return"]
      }
    ],
    //
    "react-native/no-unused-styles": 2,
    "react-native/split-platform-components": 2,
    "react-native/no-inline-styles": 2,
    "react-native/no-raw-text": 2,
    //
    "react/jsx-tag-spacing": [ "error", { "beforeSelfClosing": "always" }],
    "react/jsx-closing-tag-location": 2,
    "react/jsx-closing-bracket-location": 2,
    "react/jsx-curly-spacing": ["error", { "when": "never", "children": true }],
    "react/self-closing-comp": 2,
    "react/require-render-return": 2
  }
};
