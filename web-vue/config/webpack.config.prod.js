const glob = require('glob');
const path = require('path');
const helpers = require('./helpers');
const webpackBaseConfig = require('./webpack.config.base');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const autoprefixer = require('autoprefixer');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const env = require('../environment/prod.env');

const webpackProdConfig = Object.assign({}, webpackBaseConfig);

const extractSass = new ExtractTextPlugin({
  filename: 'assets/css/[name].[contenthash].css',
  disable: process.env.NODE_ENV === 'development'
});
const purifyCss = new PurifyCSSPlugin({
  paths: glob.sync(path.join(__dirname, '../src/**/*.html')),
  minimize: true,
  purifyOptions: {
    info: true,
    whitelist: []
  }
});

webpackProdConfig.module.rules = [
  ...webpackBaseConfig.module.rules,
  {
    test: /\.scss$/,
    use: extractSass.extract({
      use: [{
          loader: 'css-loader',
          options: {
            minimize: true,
            sourceMap: true,
            importLoaders: 2
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            plugins: () => [autoprefixer],
            sourceMap: true
          }
        },
        {
          loader: 'sass-loader',
          options: {
            outputStyle: 'expanded',
            sourceMap: true,
            sourceMapContents: true
          }
        }
      ],
      // use style-loader in development
      fallback: 'style-loader'
    })
  },
  {
    test: /\.(jpg|png|gif)$/,
    loader: 'file-loader?name=assets/img/[name].[ext]'
  },
  {
    test: /\.(eot|svg|ttf|woff|woff2)$/,
    loader: 'file-loader?name=assets/fonts/[name].[ext]'
  }
];

// ensure ts lint fails the build
webpackProdConfig.module.rules[0].options = {
  failOnHint: true
};

webpackProdConfig.plugins = [
  ...webpackBaseConfig.plugins,
  extractSass,
  purifyCss,
  new HtmlWebpackPlugin({
    inject: true,
    template: helpers.root('/src/index.html'),
    favicon: helpers.root('/src/favicon.ico'),
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeRedundantAttributes: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      removeStyleLinkTypeAttributes: true,
      keepClosingSlash: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true
    }
  }),
  new UglifyJsPlugin({
    include: /\.js$/,
    minimize: true
  }),
  new CompressionPlugin({
    asset: '[path].gz[query]',
    test: /\.min\.js$/
  }),
  new DefinePlugin({
    'process.env': env
  }),
  new FaviconsWebpackPlugin({
    logo: helpers.root('/src/icon.png'),
    prefix: 'assets/icons-[hash]/'
  })
];

module.exports = webpackProdConfig;