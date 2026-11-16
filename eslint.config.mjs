import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import playwright from 'eslint-plugin-playwright';
import tseslint from 'typescript-eslint';

const typeChecked = tseslint.configs.strictTypeChecked.map((config) => ({
  ...config,
  files: ['**/*.ts'],
}));

export default tseslint.config(
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'playwright-report/**',
      'test-results/**',
      'blob-report/**',
      'allure-results/**',
      'allure-report/**',
      '_site/**',
    ],
  },
  eslint.configs.recommended,
  ...typeChecked,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
    },
  },
  {
    files: ['tests/**/*.ts'],
    ...playwright.configs['flat/recommended'],
  },
  prettier,
);
