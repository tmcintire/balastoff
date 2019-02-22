// eslint-disable-next-line import/no-extraneous-dependencies
const webpackMerge = require('webpack-merge');
const baseConfig = require('./webpack.base.js');
const path = require('path');

module.exports = webpackMerge(baseConfig, {
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist'), // string
    publicPath: 'http://localhost:8080/',
    filename: '[name].js',
    chunkFilename: '[id].bundle.js',
  },
  devServer: {
    historyApiFallback: true,
    stats: 'minimal',
  },
});
