const {
  AsyncParallelHook,
  HookMap
} = require('tapable');
const Request = require('request');
const pluginName = 'iconfont-webpack-plugin';
const asyncHooks = new HookMap(key => new AsyncParallelHook(['result', 'callback']))

class IconfontWebpackPlugin {
  constructor(options) {
    this.options = options || {};
    if (!this.options.url) throw new Error('[' + pluginName + '] Missing options url!');
    this.options.urlPrefix = options.url.replace('.css', '');
    this.options.isDev = typeof options.isDev === 'boolean' ? options.isDev : true;
    this.options.fontPath = options.fontPath || './iconfont/iconfont';
    this.options.fontExtList = options.fontExt || ['.eot', '.ttf', '.svg', '.woff', '.woff2'];
    this.options.template = options.template || 'index.html'
    this.options.cssName = 'iconfont.css'
  }
  apply(compiler) {
    const options = this.options
    const isDev = options.isDev
    const fontExtList = options.fontExtList
    const cssName = options.cssName
    const template = options.template

    // 执行icon css生成 与 字体文件下载
    compiler.hooks.compilation.tap(pluginName, compilation => {
      new IconfontDownloadCss().apply(compilation, options);
      if (!isDev && fontExtList && fontExtList.length > 0) new IconfontDownloadFontFile().apply(compilation, options);
    })

    // 将生成icon css 注入到html模板中
    if (template) {
      compiler.hooks.emit.tap(pluginName, compilation => {
        for (var filename in compilation.assets) {
          if (filename === template) {
            const htmlData = compilation.assets[filename].source()
            if (!htmlData) return

            const headLinkCss = '<link rel="stylesheet" href="./' + cssName + '">'
            const findHeadLinkCss = htmlData.includes(headLinkCss)

            const htmlArr = htmlData.split('</head>')
            let htmlHeadBefore = htmlArr[0]

            if (isDev) {
              const iconCss = compilation.assets[cssName].source()
              if (!iconCss) return
              htmlHeadBefore += '<style>' + iconCss + '</style>'
            } else if (!findHeadLinkCss) {
              htmlHeadBefore += headLinkCss
            }

            const handledHtml = htmlHeadBefore + '</head>' + htmlArr[1]
            compilation.assets[template] = {
              source: function () {
                return handledHtml;
              },
              size: function () {
                return handledHtml.length;
              }
            };
          }
        }
      })
    }
  }
}

// 钩子获取
IconfontWebpackPlugin.getHooks = asyncHooks

// 下载并处理生成字体图标css并存储到资源输出列表
class IconfontDownloadCss {
  apply(compilation, options) {
    const url = options.url;
    const isDev = options.isDev;
    const urlPrefix = options.urlPrefix;
    const fontPath = options.fontPath;
    const iconPrefix = options.iconPrefix;
    const keepIconFontStyle = options.keepIconFontStyle;
    const cssName = options.cssName;

    compilation.hooks.additionalAssets.tapAsync(pluginName, callback => {
      Request({
        url: 'http:' + url,
        encoding: 'binary'
      }, (err, res, body) => {
        let rawData = body;
        if (!isDev) rawData = rawData.replace(new RegExp(urlPrefix, 'g'), fontPath)
        var result = '/* 字体图标，来源路径："' + url + '"*/ \r\n';
        var delUnnecessary = rawData.replace(/\.iconfont[\s\S]*?\}/, '');
        var iconCss = delUnnecessary.match(/\.icon\-[\s\S]*?\}/g);
        var handlerData = keepIconFontStyle ? rawData : delUnnecessary;
        result += handlerData.replace(/\.icon\-[\s\S]*?\}/g, '');
        for (var i in iconCss) {
          var item = iconCss[i];
          if (iconPrefix) item = item.replace(/\.icon\-/, iconPrefix);
          result += item + '\r\n';
        }
        result = result.replace(/\r{2,}/g, '\r');
        result = result.replace(/\n{2,}/g, '\n');

        const resultHandle = lastResult => {
          compilation.assets[cssName] = {
            source: function () {
              return lastResult;
            },
            size: function () {
              return lastResult.length;
            }
          };
          console.log('字体图标css文件生成成功!')
          callback();
        }

        const iconCssCreateEndHooks = asyncHooks.get('iconfontCssCreateEnd')
        if (iconCssCreateEndHooks) {
          iconCssCreateEndHooks.callAsync(result, handledData => {
            if (!handledData) return callback()
            resultHandle(handledData)
          })
        } else {
          resultHandle(result)
        }
      }, {
        throttle: 1000,
        delay: 1000
      })
    });
  }
}

// 下载相关文件并存储到资源输出列表
class IconfontDownloadFontFile {
  apply(compilation, options) {
    const fontPath = options.fontPath;
    const urlPrefix = options.urlPrefix;
    const fontExtList = options.fontExtList;


    compilation.hooks.additionalAssets.tapAsync(pluginName, callback => {
      let fontFileList = []

      function resultHandle(lastResult) {
        lastResult.forEach(file => {
          compilation.assets[file.filename] = file.data
        });
        console.log('字体图标字体文件下载成功，共' + (lastResult.length) + '个文件！')
        callback();
      }

      function downloadMain(index) {
        const ext = fontExtList[index];
        Request('http:' + urlPrefix + ext, (err, res, body) => {
          let dataObj = {}
          dataObj.filename = fontPath + ext
          dataObj.data = {
            source: function () {
              return body;
            },
            size: function () {
              return body.length;
            }
          };
          fontFileList.push(dataObj)

          if (index === fontExtList.length - 1) {
            const iconfontFileDownloadEndHooks = asyncHooks.get('iconfontFileDownloadEnd')
            if (iconfontFileDownloadEndHooks) {
              iconfontFileDownloadEndHooks.callAsync(fontFileList, handledData => {
                if (!handledData) return callback()
                resultHandle(handledData)
              })
            } else {
              resultHandle(fontFileList)
            }
          } else {
            index++;
            downloadMain(index);
          }
        }), {
          throttle: 1000,
          delay: 1000
        }
      }
      downloadMain(0);
    });
  }
}

// 导出plugin
module.exports = IconfontWebpackPlugin;
