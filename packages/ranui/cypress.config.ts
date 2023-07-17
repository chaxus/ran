import { defineConfig } from "cypress";
import coverage from "@cypress/code-coverage/task"
export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:6006/",
    setupNodeEvents(on, config) {
      // implement node event listeners here
      coverage(on, config);
      return config
    },
    defaultCommandTimeout: 10000,
  },
});
