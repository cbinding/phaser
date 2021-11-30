module.exports = {
  crossorigin: "anonymous",
  publicPath: process.env.NODE_ENV === 'production'
    ? '/tmp123/' // for github.io deployment
    : '/',
    /*chainWebpack: config => {
      //config.resolve.alias.set('vue', '@vue/compat')
  
      config.module
        .rule('vue')
        .use('vue-loader')
        .tap(options => {
          return {
            ...options,
            compilerOptions: {
              compatConfig: {
                MODE: 2
              }
            }
          }
        })
    }*/
} // vue.config.js