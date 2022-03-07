module.exports = {
  devServer: { 
    disableHostCheck: true, 
    allowedHosts: ['all'],
  },  
  crossorigin: "anonymous",
  publicPath: process.env.NODE_ENV === 'production'
    ? '/tmp123/' // for github.io deployment
    : '/',
  productionSourceMap: process.env.NODE_ENV !== 'production',
  lintOnSave: false,
}