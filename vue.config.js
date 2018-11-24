webpack = require('webpack');

module.exports = {
  baseUrl: process.env.NODE_ENV === 'production' ? '/dist/' : '/',
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
      })
    ]
  }
}