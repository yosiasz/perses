import { defineConfig } from 'i18next-cli';

export default defineConfig({
  locales: [
    "en",
    "fr",
    "de",
    "am",
    "es"
  ],
  extract: {
    functions: ['t', '*.t', 'i18next.t'],    
    nsSeparator: ':',
    input: "ui/app/src/**/*.{tsx}",
    output: "ui/app/src/locales/{{language}}/{{namespace}}.json"
  }
});