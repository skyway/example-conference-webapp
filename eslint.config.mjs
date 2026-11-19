import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";

export default tseslint.config(
  {
    ignores: ["node_modules/", "dist/"],
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  prettierRecommended,
  {
    files: ["**/*.{js,mjs,ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      "react-hooks": reactHooks,
    },
    settings: {
      react: {
        // eslint-plugin-react 7.37.x の "detect" は ESLint 10 で削除された API を使うため明示指定
        version: "18.3",
      },
    },
    rules: {
      "prettier/prettier": [
        "error",
        { trailingComma: "all", singleQuote: false, semi: true },
      ],
      "no-console": "off",
      "no-debugger": "off",
      "no-dupe-class-members": "off",
      "no-else-return": "error",
      "no-self-compare": "error",
      "no-void": "error",
      "no-var": "error",
      "no-lonely-if": "error",
      "prefer-const": "error",

      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-member-accessibility": [
        "error",
        { accessibility: "no-public" },
      ],
      "@typescript-eslint/no-use-before-define": "off",

      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
      "react/no-unknown-property": ["error", { ignore: ["css"] }],
    },
  },
  {
    // CommonJS の設定ファイル（webpack.config.js など）
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
);
