const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.lastprice.co.il',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,
    video: true,
    screenshotOnRunFailure: true,
    screenshotsFolder: 'output/screenshots',
    videosFolder: 'output/videos',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
})
