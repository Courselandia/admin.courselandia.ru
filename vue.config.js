const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  devServer: {
    port: 7000,
  },
  transpileDependencies: true,
  configureWebpack: {
    performance: {
      hints: false,
    },
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
          },
          javascriptEnabled: true,
        },
      },
    },
  },
});
