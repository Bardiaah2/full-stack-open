import js from '@eslint/js'
import globals from 'globals'
import pluginReact from 'eslint-plugin-react'
import { defineConfig } from 'eslint/config'
import stylisticJs from '@stylistic/eslint-plugin-js'

export default defineConfig([
  js.configs.recommended,
  { files: ['**/*.{js,mjs,cjs,jsx}'], 
    plugins: {'@stylistic/js': stylisticJs,
      js
    },
    rules: { 
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/linebreak-style': ['error', 'unix'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/semi': ['error', 'never'],
    }, 
    extends: ['js/recommended'], 
    languageOptions: { globals: globals.browser } 
  },
  pluginReact.configs.flat.recommended,
  { 
    ignores: ['dist/**'], 
  },
])
