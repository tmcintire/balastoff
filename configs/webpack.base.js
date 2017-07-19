// eslint-disable-next-line import/no-extraneous-dependencies
const autoprefixer = require('autoprefixer');
const babelConfig = require('./babelrc.js');
// eslint-disable-next-line import/no-extraneous-dependencies
const HtmlWebpackPlugin = require('html-webpack-plugin');
// eslint-disable-next-line import/no-extraneous-dependencies
const webpack = require('webpack');
const path = require('path');
const envFile = require('node-env-file');

// Detect the node environment and then set the webpack version to that env
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
try {
  envFile(path.join(__dirname, `../firebase/${process.env.NODE_ENV}.env`));
} catch (e) {

}

module.exports = {
  entry: {
    app: [
      './src/index.jsx',
    ],
    vendor: [
      'script!jquery/dist/jquery.min.js',
      'script!bootstrap/dist/js/bootstrap.min.js',
      './src/vendor.js',
    ],
  },
  externals: {
    jquery: 'jQuery',
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      applicationStyles: '../src/styles/index.scss',
    },
  },
  module: {
    loaders: [
      // Files
      { test: /\.svg$/, loader: 'url?limit=65000&mimetype=image/svg+xml&name=fonts/[name].[hash].[ext]' },
      { test: /\.woff$/, loader: 'url?limit=65000&mimetype=application/font-woff&name=fonts/[name].[hash].[ext]' },
      { test: /\.woff2$/, loader: 'url?limit=65000&mimetype=application/font-woff2&name=fonts/[name].[hash].[ext]' },
      { test: /\.[ot]tf$/, loader: 'url?limit=65000&mimetype=application/octet-stream&name=fonts/[name].[hash].[ext]' },
      { test: /\.eot$/, loader: 'url?limit=65000&mimetype=application/vnd.ms-fontobject&name=fonts/[name].[hash].[ext]' },
      {
        test: /\.json$/,
        loader: 'json',
        exclude: /node_modules/,
      },
      // Styles
      {
        test: /\.css$/,
        loader: 'style!css',
      },
      {
        test: /\.scss$/,
        loader: 'style!css!postcss!resolve-url!sass?sourceMap',
      },
      {
        test: /\.js|\.jsx$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: babelConfig,
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
    new webpack.optimize.OccurenceOrderPlugin(true),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor'],
      minChunks: Infinity,
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        API_KEY: JSON.stringify(process.env.API_KEY),
        AUTH_DOMAIN: JSON.stringify(process.env.AUTH_DOMAIN),
        DATABASE_URL: JSON.stringify(process.env.DATABASE_URL),
        STORAGE_BUCKET: JSON.stringify(process.env.STORAGE_BUCKET),
      },
    }),
  ],
  postcss() {
    return [autoprefixer];
  },
};
