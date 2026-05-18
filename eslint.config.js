import { createConfigForNuxt } from '@nuxt/eslint'
import pluginOxlint from 'eslint-plugin-oxlint'

export default createConfigForNuxt([
  {
    files: ['**/*.{vue,js,mjs,jsx,ts,tsx}'],
    rules: {
      'vue/multi-word-component-names': 'off',
      'no-undef': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-dynamic-delete': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { 
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],
    },
  },
  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),
])
