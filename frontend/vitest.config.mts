import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
<<<<<<< HEAD
    setupFiles: "./vitest.setup.ts",
=======
    globals: true,
>>>>>>> 6cb34e4 (test: Added tests for signup-page-form. Tested input fields to be updated correctly after input and checked for submit buttonexistence.)
    environment: "jsdom",
  },
});
