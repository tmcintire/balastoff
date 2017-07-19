// eslint-disable-next-line import/no-extraneous-dependencies
const webpackMerge = require('webpack-merge');
const baseConfig = require('./webpack.base.js');

module.exports = webpackMerge(baseConfig, {
  devtool: 'source-map',
  output: {
    path: 'dist',
    publicPath: 'http://localhost:8080/',
    filename: '[name].js',
    chunkFilename: '[id].bundle.js',
  },
  devServer: {
    historyApiFallback: true,
    stats: 'minimal',
  },
});
