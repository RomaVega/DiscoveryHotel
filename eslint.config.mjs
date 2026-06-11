import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Build output and generated files — next lint ignored these implicitly;
  // the ESLint CLI needs them spelled out.
  { ignores: [".next/**", "out/**", ".netlify/**", "next-env.d.ts", "lib/image-manifest.ts"] },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Build/check scripts are plain Node CommonJS — require() is the norm there.
  {
    files: ["scripts/**/*.js"],
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
];

export default eslintConfig;
