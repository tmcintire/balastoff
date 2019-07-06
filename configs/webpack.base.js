// eslint-disable-next-line import/no-extraneous-dependencies
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
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
  mode: process.env.NODE_ENV,
  entry: {
    app: [
      './src/index.tsx',
    ],
    vendor: [
      'script-loader!jquery/dist/jquery.min.js',
      'script-loader!bootstrap/dist/js/bootstrap.min.js',
      './src/vendor.js',
    ],
  },
  externals: {
    jquery: 'jQuery',
    'foundation-sites': 'foundation-sites',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.tsx', '.ts'],
    alias: {
      applicationStyles: '../src/styles/index.scss',
    },
  },
  module: {
    rules: [
      // Files
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 65000,
              mimetype: 'image',
              name: 'svg+xml&name=fonts/[name].[hash].[ext]',
            },
          },
        ],
      },
      {
        test: /\.woff$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 65000,
              mimetype: 'application',
              name: 'font-woff&name=fonts/[name].[hash].[ext]',
            },
          },
        ],
      },
      {
        test: /\.woff2$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 65000,
              mimetype: 'application',
              name: 'font-woff2&name=fonts/[name].[hash].[ext]',
            },
          },
        ],
      },
      {
        test: /\.[ot]tf$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 65000,
              mimetype: 'application',
              name: 'octet-stream&name=fonts/[name].[hash].[ext]',
            },
          },
        ],
      },
      {
        test: /\.eot$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 65000,
              mimetype: 'application',
              name: 'vnd.ms-fontobject&name=fonts/[name].[hash].[ext]',
            },
          },
        ],
      },
      {
        test: /\.json$/,
        loader: 'json',
        exclude: /node_modules/,
      },
      // Styles
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader', // creates style nodes from JS strings
          'css-loader', {
            loader: 'sass-loader',
            query: {
              includePaths: [path.resolve(__dirname, 'node_modules')],
            },
          },
        ],
      },
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
      },
      {
        test: /\.js|\.jsx$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: [
              '@babel/plugin-proposal-class-properties',
              'react-hot-loader/babel',
              '@babel/plugin-transform-runtime'],
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
    // new webpack.optimize.OccurenceOrderPlugin(true),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: ['app', 'vendor'],
    //   minChunks: Infinity,
    // }),
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
    new CopyWebpackPlugin([
      {
        from: 'src/images',
        to: 'images',
      },
    ]),
  ],
  // postcss() {
  //   return [autoprefixer];
  // },
  // externals: {
  //     "react": "React",
  //     "react-dom": "ReactDOM"
  // }
};
