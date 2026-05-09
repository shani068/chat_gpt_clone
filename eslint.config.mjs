// ============================================================
//  Frontend ESLint Config — Production Grade
//  Next.js 15 + TypeScript + Tailwind + shadcn/ui
//
//  Covers:
//   - Next.js core web vitals
//   - TypeScript strict rules
//   - React + React Hooks best practices
//   - JSX Accessibility (a11y)
//   - Import order / sorting
//   - Tailwind CSS class sorting
//   - Naming conventions
//   - Security rules
//   - Prettier formatting
// ============================================================

import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import tailwind from "eslint-plugin-tailwindcss";
import security from "eslint-plugin-security";
import prettier from "eslint-config-prettier";
import nextPlugin from "@next/eslint-plugin-next";

export default [
  // ── Next.js core web vitals — must be first ──────────────────────────────
  {
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },

  // ── Main config ──────────────────────────────────────────────────────────
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "dist/**",
      "*.config.{js,mjs,ts}",
      "next-env.d.ts",
    ],

    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },

    plugins: {
      "@typescript-eslint": tseslint,
      react:                reactPlugin,
      "react-hooks":        reactHooks,
      import:               importPlugin,
      "jsx-a11y":           jsxA11y,
      tailwindcss:          tailwind,
      security,
    },

    settings: {
      react: { version: "detect" },
      "import/resolver": {
        typescript: { project: "./tsconfig.json" },
      },
    },

    rules: {

      // ══════════════════════════════════════════════════════════════════════
      //  TYPESCRIPT — STRICT
      // ══════════════════════════════════════════════════════════════════════

      "@typescript-eslint/no-explicit-any":          "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-non-null-assertion":    "error",
      "@typescript-eslint/prefer-nullish-coalescing":"error",
      "@typescript-eslint/prefer-optional-chain":    "error",
      "@typescript-eslint/no-floating-promises":     "error",
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } }, // Next.js Server Actions ke liye
      ],
      "@typescript-eslint/require-await":            "error",
      "@typescript-eslint/return-await": [
        "error",
        "in-try-catch",
      ],
      "@typescript-eslint/use-unknown-in-catch-callback-variable": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/no-unsafe-assignment":     "error",
      "@typescript-eslint/no-unsafe-member-access":  "error",
      "@typescript-eslint/no-unsafe-call":           "error",
      "@typescript-eslint/no-unsafe-return":         "error",


      // ══════════════════════════════════════════════════════════════════════
      //  REACT RULES
      // ══════════════════════════════════════════════════════════════════════

      // React 17+ — JSX transform, import not needed
      "react/react-in-jsx-scope":       "off",
      "react/prop-types":               "off", // TypeScript handles this

      // No array index as key — causes re-render bugs
      "react/no-array-index-key":       "error",

      // No dangerous HTML — XSS risk
      "react/no-danger":                "error",

      // Self-close empty components — <Component /> not <Component></Component>
      "react/self-closing-comp":        "error",

      // No deprecated string refs
      "react/no-string-refs":           "error",

      // Fragments — use <> over React.Fragment when no key needed
      "react/jsx-no-useless-fragment": ["error", { allowExpressions: true }],

      // No target="_blank" without rel="noreferrer" — security
      "react/jsx-no-target-blank":      "error",

      // Boolean props — value not needed <Component isActive /> not <Component isActive={true} />
      "react/jsx-boolean-value":       ["error", "never"],

      // No multi-spaces in JSX
      "react/jsx-no-duplicate-props":   "error",

      // Consistent JSX curly braces
      "react/jsx-curly-brace-presence": [
        "error",
        { props: "never", children: "never" },
      ],


      // ══════════════════════════════════════════════════════════════════════
      //  REACT HOOKS RULES
      // ══════════════════════════════════════════════════════════════════════

      // Rules of hooks — must be called at top level
      "react-hooks/rules-of-hooks":  "error",

      // Exhaustive deps — missing dependencies in useEffect
      "react-hooks/exhaustive-deps": "error",


      // ══════════════════════════════════════════════════════════════════════
      //  NAMING CONVENTIONS
      // ══════════════════════════════════════════════════════════════════════

      "@typescript-eslint/naming-convention": [
        "error",

        // Default — camelCase
        {
          selector: "default",
          format: ["camelCase"],
          leadingUnderscore: "allow",
        },

        // Variables — camelCase or UPPER_CASE
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE", "PascalCase"], // PascalCase for React components
          leadingUnderscore: "allow",
        },

        // Boolean variables — is/has/should prefix
        {
          selector: "variable",
          types: ["boolean"],
          format: ["camelCase"],
          prefix: ["is", "has", "should", "can", "did", "will", "are", "show"],
        },

        // Functions — camelCase or PascalCase (React components)
        {
          selector: "function",
          format: ["camelCase", "PascalCase"],
        },

        // Parameters — camelCase
        {
          selector: "parameter",
          format: ["camelCase"],
          leadingUnderscore: "allow",
        },

        // Classes — PascalCase
        {
          selector: "class",
          format: ["PascalCase"],
        },

        // Interfaces — PascalCase, NO I prefix
        {
          selector: "interface",
          format: ["PascalCase"],
          custom: { regex: "^I[A-Z]", match: false },
        },

        // Type aliases — PascalCase
        {
          selector: "typeAlias",
          format: ["PascalCase"],
        },

        // Generic type params — T prefix
        {
          selector: "typeParameter",
          format: ["PascalCase"],
          prefix: ["T"],
        },

        // Enum members — UPPER_CASE
        {
          selector: "enumMember",
          format: ["UPPER_CASE"],
        },

        // Object properties — camelCase (snake_case for API responses)
        {
          selector: "objectLiteralProperty",
          format: ["camelCase", "snake_case", "UPPER_CASE"],
          leadingUnderscore: "allow",
        },
      ],


      // ══════════════════════════════════════════════════════════════════════
      //  IMPORT ORDER
      // ══════════════════════════════════════════════════════════════════════

      "import/no-duplicates":  "error",
      "import/no-cycle":      ["error", { maxDepth: 5 }],
      "import/no-self-import": "error",

      "import/order": [
        "error",
        {
          groups: [
            "builtin",   // node built-ins
            "external",  // react, next, etc.
            "internal",  // @/* aliases
            "parent",    // ../
            "sibling",   // ./
            "index",     // ./index
            "type",      // import type
          ],
          pathGroups: [
            // Next.js — treat as external
            {
              pattern: "next",
              group: "external",
              position: "before",
            },
            {
              pattern: "next/**",
              group: "external",
              position: "before",
            },
            // React — treat as external
            {
              pattern: "react",
              group: "external",
              position: "before",
            },
            // @/* aliases — internal
            {
              pattern: "@/**",
              group: "internal",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["react", "next"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],


      // ══════════════════════════════════════════════════════════════════════
      //  JSX ACCESSIBILITY (a11y)
      // ══════════════════════════════════════════════════════════════════════

      // img must have alt
      "jsx-a11y/alt-text":                "error",

      // Anchor must have content
      "jsx-a11y/anchor-has-content":      "error",

      // Button must have accessible text
      "jsx-a11y/aria-role":               "error",

      // No invalid ARIA props
      "jsx-a11y/aria-props":              "error",

      // No access key — confusing for screen readers
      "jsx-a11y/no-access-key":           "error",

      // Interactive elements must be focusable
      "jsx-a11y/interactive-supports-focus": "warn",

      // onClick must have keyboard equivalent
      "jsx-a11y/click-events-have-key-events": "warn",

      // No static elements with interaction handlers without role
      "jsx-a11y/no-static-element-interactions": "warn",


      // ══════════════════════════════════════════════════════════════════════
      //  TAILWIND CSS
      // ══════════════════════════════════════════════════════════════════════

      // No unknown Tailwind classes
      "tailwindcss/no-unknown-class":        "off", // shadcn custom classes ke liye off

      // Enforce class order — consistent sorting
      "tailwindcss/classnames-order":        "warn",

      // No contradicting classes — e.g. flex + block
      "tailwindcss/no-contradicting-classname": "error",


      // ══════════════════════════════════════════════════════════════════════
      //  SECURITY
      // ══════════════════════════════════════════════════════════════════════

      "no-eval":                                   "error",
      "no-implied-eval":                           "error",
      "@typescript-eslint/no-implied-eval":        "error",
      "security/detect-object-injection":          "warn",
      "security/detect-non-literal-regexp":        "warn",
      "security/detect-unsafe-regex":              "error",
      "security/detect-possible-timing-attacks":   "error",


      // ══════════════════════════════════════════════════════════════════════
      //  NEXT.JS SPECIFIC
      // ══════════════════════════════════════════════════════════════════════

      // Use next/image instead of <img>
      "@next/next/no-img-element":               "error",

      // Use next/link instead of <a> for internal links
      "@next/next/no-html-link-for-pages":       "error",

      // No sync scripts in Head
      "@next/next/no-sync-scripts":              "error",

      // No document import outside _document
      "@next/next/no-document-import-in-page":   "error",

      // No duplicate Head tags
      "@next/next/no-duplicate-head":            "error",


      // ══════════════════════════════════════════════════════════════════════
      //  GENERAL BEST PRACTICES
      // ══════════════════════════════════════════════════════════════════════

      "prefer-const":    "error",
      "no-var":          "error",
      "prefer-template": "error",
      eqeqeq:           ["error", "always"],
      "no-console": [
        "error",
        { allow: ["warn", "error"] },
      ],
      "no-unreachable":        "error",
      "no-unused-expressions": [
        "error",
        { allowShortCircuit: true, allowTernary: true },
      ],
      "@typescript-eslint/no-throw-literal": "error",
    },
  },

  // ── Prettier — LAST (disable formatting conflicts) ───────────────────────
  prettier,
];
