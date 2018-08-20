const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const ChromeReloader = require('webpack-chrome-extension-reloader');
const baseWebpack = require('./webpack.base');
const { styleLoaders } = require('./tools');

module.exports = merge(baseWebpack, {
  watch: true,
  module: { rules: styleLoaders({ sourceMap: false, extract: true }) },
  devtool: '#cheap-module-source-map',
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"development"' }),
    new ExtractTextPlugin({ filename: 'css/[name].css' }),
    new FriendlyErrorsPlugin(),
    new ChromeReloader({
      port: 9090, // Which port use to create the server
      reloadPage: true, // Force the reload of the page also
      entries: {
        // The entries used for the content/background scripts
        contentScript: 'content', // Use the entry names, not the file name or the path
        background: 'background'
      }
    })
  ]
});
