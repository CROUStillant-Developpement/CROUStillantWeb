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
    "react-hooks/refs": "off"
  },
}, {
  ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"]
}];

export default eslintConfig;
