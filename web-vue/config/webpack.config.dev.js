const helpers = require('./helpers');
const webpackBaseConfig = require('./webpack.config.base');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const env = require('../environment/dev.env');
const webpackDevConfig = Object.assign({}, webpackBaseConfig);
webpackDevConfig.module.rules = [
  ...webpackBaseConfig.module.rules,
  {
    test: /\.scss$/,
    use: [{
        loader: 'style-loader'
      },
      {
        loader: 'css-loader'
      },
      {
        loader: 'sass-loader'
      }
    ]
  },
  {
    test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)$/,
    loader: 'file-loader'
  }
];

webpackDevConfig.plugins = [
  ...webpackBaseConfig.plugins,
  new HtmlWebpackPlugin({
    inject: true,
    template: helpers.root('/src/index.html'),
    favicon: helpers.root('/src/favicon.ico')
  }),
  new DefinePlugin({
    'process.env': env
  })
];

webpackDevConfig.devServer = {
  port: 8963,
  host: 'localhost',
  historyApiFallback: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  contentBase: helpers.root('./src'),
  open: true
};

module.exports = webpackDevConfig;