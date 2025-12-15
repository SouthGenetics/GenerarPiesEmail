import js from "@eslint/js";
import globals from "globals";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import css from "@eslint/css";
import html from "eslint-plugin-html";
import eslintConfigPrettier from "eslint-config-prettier"; // <--- ESTO ES NUEVO
import { defineConfig } from "eslint/config";

export default defineConfig([
  // 1. IGNORES
  {
    ignores: ["package-lock.json", "package.json", "dist/", "build/"],
  },

  // 2. JAVASCRIPT & HTML (Lógica)
  {
    files: ["**/*.{js,mjs,cjs}", "**/*.html"],
    plugins: { html },
    languageOptions: {
      globals: {
        ...globals.browser,
        XLSX: "readonly",
        JSZip: "readonly",
        html2canvas: "readonly",
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      ...js.configs.recommended.rules,

      // REGLAS DE LÓGICA (Clean Code) - ESLint se encarga de esto
      "max-params": ["error", 3],
      complexity: ["error", 15],
      eqeqeq: ["error", "always"],
      "no-var": "error",
      "prefer-const": "error",
      "max-lines-per-function": ["warn", { max: 80, skipBlankLines: true, skipComments: true }],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-undef": "error",

      // NOTA: Ya no ponemos reglas de indentación aquí, Prettier se encarga.
    },
  },

  // 3. DESACTIVAR REGLAS DE ESTILO CONFLICTIVAS (PRETTIER)
  // Esto debe ir después de la configuración de JS para "apagar" lo que sobre.
  eslintConfigPrettier,

  // 4. OTROS FORMATOS (JSON, MD, CSS)
  {
    files: ["**/*.json"],
    ignores: ["package-lock.json", "package.json"],
    plugins: { json },
    language: "json/json",
    ...json.configs.recommended,
  },
  {
    files: ["**/*.jsonc"],
    plugins: { json },
    language: "json/jsonc",
    ...json.configs.recommended,
  },
  {
    files: ["**/*.json5"],
    plugins: { json },
    language: "json/json5",
    ...json.configs.recommended,
  },
  {
    files: ["**/*.md"],
    plugins: { markdown },
    language: "markdown/commonmark",
    ...markdown.configs.recommended,
  },
  {
    files: ["**/*.css"],
    plugins: { css },
    language: "css/css",
    ...css.configs.recommended,
    rules: {
      ...css.configs.recommended.rules,
      "css/no-empty-blocks": "error",
    },
  },
]);
