module.exports = {
  devServer: {
    disableHostCheck: true  // for when testing in gitpod 
  },
  crossorigin: "anonymous",
  publicPath: process.env.NODE_ENV === 'production'
    ? '/tmp123/' // for github.io deployment
    : '/',
  productionSourceMap: process.env.NODE_ENV !== 'production', //https://stackoverflow.com/questions/51482940/how-can-i-disable-source-maps-in-production-for-a-vue-js-app
  lintOnSave: false
} // vue.config.js