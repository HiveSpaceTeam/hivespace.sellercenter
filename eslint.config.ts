import iconsIndexPlugin from './scripts/eslint-plugin-icons-index';
// Custom rule suggestion:
// To enforce updating src/icons/index.ts when adding new icon files, consider using eslint-plugin-custom-rules or a script in your CI pipeline.
// Example: Warn if a .vue file in src/icons is not exported in index.ts
// This is not a built-in ESLint rule, but you can add a script or use a plugin for this purpose.
import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  skipFormatting,
  
  {
    name: 'app/vue-rules',
    files: ['**/*.vue'],
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/block-lang': 'off',
    },
  },
  {
    name: 'icons-index-consistency',
    plugins: {
      'icons-index': iconsIndexPlugin,
    },
    rules: {
      'icons-index/icons-index-consistency': 'error',
    },
    files: ['src/icons/index.ts'],
  },
)
