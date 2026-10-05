import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// The stock Next.js flat config. ESLint 9 refuses to run without a config
// file, and this repo had none, so `npm run lint` failed before it looked at
// a single file.
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    // Defaults from eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Claude worktrees live inside the repo and carry their own build output.
    ".claude/**",
  ]),
]);

export default eslintConfig;
