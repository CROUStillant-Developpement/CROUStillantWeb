import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [...nextCoreWebVitals, ...nextTypescript, {
  settings: {
    react: {
      version: "19.0.0"
    }
  },
  rules: {
    "react-hooks/exhaustive-deps": "off",
    "react-hooks/set-state-in-effect": "off",
    "react-hooks/refs": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { "varsIgnorePattern": "^_", "argsIgnorePattern": "^_", "destructuredArrayIgnorePattern": "^_" }]
  },
}, {
  ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "coverage/**", "next-env.d.ts"]
}];

export default eslintConfig;
