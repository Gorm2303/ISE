const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000', // Your application's base URL
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
