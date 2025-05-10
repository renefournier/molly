const path = require("path");

module.exports = {
  kit: {
    // hydrate the <div id="svelte"> element in src/app.html
    target: "#svelte",
    vite: {
      resolve: {
        alias: {
          // Defining some sample path aliases
          $components: path.resolve(__dirname, "src/components"),
          $utils: path.resolve(__dirname, "src/utils"),
          $styles: path.resolve(__dirname, "src/styles"),
        },
      },
    },
  },
};
