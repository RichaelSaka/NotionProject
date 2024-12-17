import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "module", 
      globals: {
        console: "readonly",
        process: "readonly",
      },
    },
  },
  {
    files: ["tests/**/*.test.js"],
    languageOptions: {
      globals: {
        describe: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
      },
    },
  },
  {
    ignores: ["**/node_modules/**"],
  },
  pluginJs.configs.recommended,
];
