import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["node_modules/", ".worktrees/", "scripts/", "modelos/"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
);
