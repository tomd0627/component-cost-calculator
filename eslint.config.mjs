import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Enforce explicit return types on exported functions to aid readability.
      "@typescript-eslint/explicit-module-boundary-types": "off",
      // No console.log in production code — use a proper logger or remove.
      "no-console": "warn",
    },
  },
];

export default eslintConfig;
