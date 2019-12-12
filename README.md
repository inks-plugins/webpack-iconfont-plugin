# webpack-qc-iconfont-plugin
webpack-qc-iconfont-plugin是一个[webpack](https://www.webpackjs.com/)插件，可以轻松地帮你将[阿里icon](https://www.iconfont.cn/)的图标项目下载至本地

## Install
```
$ npm install webpack-qc-iconfont-plugin
```

## 该插件提供 gulp 插件版
- [gulp-qc-iconfont](https://github.com/qc-web-y/gulp-qc-iconfont)

## Usage

- webpack.config.js 文件：
```
const Path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

// 引入插件
const WebpackQcIconfontPlugin = require('iconfont-webpack-plugin')

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
    new WebpackQcIconfontPlugin({
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
  - 基础用法：``new WebpackQcIconfontPlugin({url: '//at.alicdn.com/t/font_xxxxxxx_xxxxxx.css' })``

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
const WebpackQcIconfontPlugin = require('iconfont-webpack-plugin')

module.exports = {
  plugins: [
    new WebpackQcIconfontPlugin({ url: '//at.alicdn.com/t/font_xxxxxxx_xxxxxx.css' })
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
const WebpackQcIconfontPlugin = require('iconfont-webpack-plugin')

module.exports = {
  plugins: [
    new WebpackQcIconfontPlugin({
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
  <title>WebpackQcIconfontPlugin Template</title>
  <link rel="stylesheet" href="./iconfont.css">
</head>
```

## Events
插件开发时预留了两个事件，以便开发人员可以更个性化的使用，在阅读事件用法的时候，请确保您具备编写简单 [Webpack Plugin](https://www.webpackjs.com/contribute/writing-a-plugin/) 的能力,以及对 [Tapable](https://github.com/webpack/tapable) 有初步的认识。

- ``iconfontCssCreateEnd`` hook
  - hook类型： AsyncParallelHook
  - 描述：字体文件css创建结束后调用。hook注册时将接收以下参数：
    - arg1： ``result`` 创建的图标css文件字符串
    - arg2： ``callback`` 回调函数，该函数可接受再次处理后的 ``result``，便于您对css文件进行压缩，合并等处理，当然您还可以不传入 ``result``，这时插件将不会再把生成的css文件加入到输出资源列表中，该资源就成为您的盘中餐，可以为所欲为了。

  - 示例一：利用回调函数返回处理后的css，为其添加css代码
  ```
  WebpackQcIconfontPlugin.getHooks.for('iconfontCssCreateEnd').tapAsync('MyPlugin', (result, cb) => {
    result += '.test { width: 500px; }';
    cb(result);
  })
  ```
  - 示例二：利用回调函数不返回值，自定义输出资源路径及名字
  ```
  WebpackQcIconfontPlugin.getHooks.for('iconfontCssCreateEnd').tapAsync('MyPlugin', (result, cb) => {
    compilation.assets['css/myIconFont.css'] = {
      source: function () {
        return result;
      },
      size: function () {
        return result.length;
      }
    };
    cb();
  })
  ```

- ``iconfontFileDownloadEnd`` hook
  - hook类型： AsyncParallelHook
  - 描述：相关引用的字体文件下载完成结束后调用。hook注册时将接收以下参数：
    - arg1： ``fontFileList`` 准备输出字体文件资源数组列表
    - arg2： ``callback`` 回调函数，该函数可接受再次处理后的 ``fontFileList``，便于您对 ``fontFileList`` 进行增删改等操作，当然您还可以不传入 ``fontFileList``，这时插件将不会再把下载的引用的字体文件加入到输出资源列表中，该资源就成为您的盘中餐，可以为所欲为了。

  - 示例一：利用回调函数返回处理后的fontFileList，为其添加输出资源
  ```
  WebpackQcIconfontPlugin.getHooks.for('iconfontFileDownloadEnd').tapAsync(pluginName, (fontFileList, cb) => {
    const testFile = '测试使用的文件而已'
    fontFileList.push({
      filename: 'test.text',
      data: {
        source: function () {
          return testFile;
        },
        size: function () {
          return testFile.length;
        }
      }
    })
    cb(fontFileList)
  })
  ```

  - 示例二：用回调函数不返回值，自定义输出资源路径
  ```
  WebpackQcIconfontPlugin.getHooks.for('iconfontFileDownloadEnd').tapAsync(pluginName, (fontFileList, cb) => {
    fontFileList.forEach(file => {
      const name = file.filename.replace('./iconfont/iconfont','./css/iconfont/iconfont')
        compilation.assets[name] = file.data
    });
    cb()
  })
  ```

- plugin.js
```
const WebpackQcIconfontPlugin = require('../src/index')
const pluginName = 'hook-test-plugin';

class HookTestPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      // 测试 iconfontCssCreateEnd Hook
      WebpackQcIconfontPlugin.getHooks.for('iconfontCssCreateEnd').tapAsync(pluginName, (result, cb) => {
        result += '.test { width: 500px; }'
        cb(result)
      })

      // 测试 iconfontFileDownloadEnd Hook
      WebpackQcIconfontPlugin.getHooks.for('iconfontFileDownloadEnd').tapAsync(pluginName, (fontFileList, cb) => {
        const testFile = '测试使用的文件而已'
        fontFileList.push({
          filename: 'test.text',
          data: {
            source: function () {
              return testFile;
            },
            size: function () {
              return testFile.length;
            }
          }
        })
        cb(fontFileList)
      })
    })
  }
}
```
