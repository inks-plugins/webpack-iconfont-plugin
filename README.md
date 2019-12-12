# iconfont-webpack-plugin
iconfont-webpack-plugin是一个[webpack](https://www.webpackjs.com/)插件，可以轻松地帮你将[阿里icon](https://www.iconfont.cn/)的图标项目下载至本地

## Install
```
$ npm install iconfont-webpack-plugin
```

## Usage

- webpack.config.js 文件：
```
const Path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

// 引入插件
const IconfontWebpackPlugin = require('iconfont-webpack-plugin')

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

    // 插件调用代码
    new IconfontWebpackPlugin({
      url: '//at.alicdn.com/t/font_xxxxxxx_xxxxxx.css',
      isDev: true,
     fontPath: './iconfont/iconfont',
     iconPrefix: '.cu-icon-',
     keepIconFontStyle: false,
     fontExt: ['.eot', '.ttf', '.svg', '.woff', '.woff2'],
     template: 'index.html'
    }),
  ],
  output: {
    filename: '[name].bundle.js',
    path: Path.resolve(__dirname, 'dist')
  }
};
```

### Options
- ``url``
  - 类型：String
  - 默认：无，该参数是必须（没有将会报错）
  - 描述：为阿里图标中 - 我的图标项目 - 中获取的css代码url
  - 基础用法： new IconfontWebpackPlugin({url: '//at.alicdn.com/t/font_xxxxxxx_xxxxxx.css' })

- ``isDev``
  - 类型：String，
  - 默认：``true``
  - 描述：当前是否为开发模式

- ``fontPath``
  - 类型：String
  - 默认：``'./iconfont/iconfont'``
  - 描述：下载的字体图标文件保存路径，只有在 ``isDev`` 为false，也就是生产环境才有效

- ``iconPrefix``
  - 类型：String
  - 默认：与源文件保持一致 ``.icon-``
  - 描述：字体图标统一前缀，如设置为 ``{ iconPrefix: '.cu-icon-' }``,则图标调用为：``<i class="iconfont cu-icon-XXX"></i>``

- ``keepIconFontStyle``
  - 类型：Boolean
  - 默认：undefined，即未开启，不保留
  - 描述：是否保留css源文件中的 ``.iconfont{/*...*/}`` 中的样式，该属性多用于与vant等类似已有自己字体图标相关初始设置的组件库配合使用，如您没有与类似组件使用，建议开启或自定义一个，否则您的图标将不会有初始样式

- ``fontExt``
  - 类型：Array
  - 默认：['.eot', '.ttf', '.svg', '.woff', '.woff2'] ，即全部下载
  - 描述：需要下载的字体图标格式扩展名，只有在 ``isDev`` 为false时有效

- ``template``
  - 类型：String
  - 默认：``index.html``
  - 描述：生成的图标css将自动注入模板文件，图标生成后会根据该配置自动注入到模板文件中，无需手动调用，如不需要自动注入，可以将该值设置为 null
  - 补充：开发模式下会css会以 ``<style> ... </style>`` 形式注入，生成模式下会以 ``<link rel="stylesheet" href="./iconfont.css">`` 方式注入

## 开发模式(基础用法)：
 将自动获取css源文件注入到定义的模板中。
### webpack.config.js
```
const IconfontWebpackPlugin = require('iconfont-webpack-plugin')

module.exports = {
  plugins: [
    new IconfontWebpackPlugin({ url: '//at.alicdn.com/t/font_xxxxxxx_xxxxxx.css' })
  ]
}
```

### Output:
将在 ``index.html`` 文件夹下以 ``<style> ... </style>`` 形式注入css，注入css结构如下：
```
@font-face {font-family: "iconfont";
  src: url('//at.alicdn.com/t/font_xxxxxxx_xxxxxx.eot?t=xxx');
  src: url('//at.alicdn.com/t/font_xxxxxxx_xxxxxx.eot?t=xxx#iefix') format('embedded-opentype'),
  url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgA...') format('woff2'),
  url('//at.alicdn.com/t/font_xxxxxxx_xxxxxx.woff?t=xxx') format('woff'),
  url('//at.alicdn.com/t/font_xxxxxxx_xxxxxx.ttf?t=xxx') format('truetype'),
  url('//at.alicdn.com/t/font_xxxxxxx_xxxxxx.svg?t=xxx#iconfont') format('svg');
}
.icon-waimai1:before {
  content: "\e6c3";
}
```

## 非开发模式下：
1. 将自动获取css源文件保存至 ``fontPath`` 配置路径下，并将图标引用路径自动更改为 ``fontPath`` 本地路径。
2. 将自动获取字体图标需要的文件保存至指定位置下的 ``fontPath`` 路径中。

### webpack.config.js
```
const IconfontWebpackPlugin = require('iconfont-webpack-plugin')

module.exports = {
  plugins: [
    new IconfontWebpackPlugin({
      url: '//at.alicdn.com/t/font_xxxxxxx_xxxxxx.css',
      isDev: false,
      iconPrefix: '.cu-icon-'
    })
  ]
}
```

### Output:
将在配置的输出文件下输出字体图标文件（这里我们以``dist``文件夹为例）：
```
- dist
  - iconfont
    - iconfont.eot
    - iconfont.ttf
    - iconfont.svg
    - iconfont.woff
    - iconfont.woff2
  - iconfont.css
```

``iconfont.css`` 生成结构如下：
```
@font-face {font-family: "iconfont";
  src: url('./iconfont/iconfont.eot?t=xxx'); /* IE9 */
  src: url('./iconfont/iconfont.eot?t=xxx#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgA...') format('woff2'),
  url('./iconfont/iconfont.woff?t=xxx') format('woff'),
  url('./iconfont/iconfont.ttf?t=xxx') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
  url('./iconfont/iconfont.svg?t=xxx#iconfont') format('svg'); /* iOS 4.1- */
}
.cu-icon-waimai1:before {
  content: "\e6c3";
}
```

``index.html`` 模板文件下head将自动引入该css：
```
<head>
  <meta charset="UTF-8">
  <title>IconfontWebpackPlugin Template</title>
  <link rel="stylesheet" href="./iconfont.css">
</head>
```
