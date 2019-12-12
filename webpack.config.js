const Path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');
const webpack = require('webpack');

const WebpackQcIconfontPlugin = require('./src/index')
const HookTestPlugin = require('./test/hookTestPlugin')

module.exports = {
  mode: 'development',
  entry: './test/index.js',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    hot: true
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Hot Module Replacement'
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),

    // 插件测试
    new WebpackQcIconfontPlugin({
      url: '//at.alicdn.com/t/font_1425510_3v068prmkkw.css',
      isDev: false,
      // iconPrefix: '.cu-icon-',
      // fontPath: './iconfont/iconfont',
      keepIconFontStyle: true,
      // fontExt: ['.svg', '.woff', '.woff2']
    }),

    // 插件钩子测试
    new HookTestPlugin()
  ],
  output: {
    filename: '[name].bundle.js',
    path: Path.resolve(__dirname, 'dist')
  }
};
