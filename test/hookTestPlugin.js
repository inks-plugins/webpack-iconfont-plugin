const WebpackQcIconfontPlugin = require('../src/index')
const pluginName = 'hook-test-plugin';
class HookTestPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      // 测试 iconfontCssCreateEnd 钩子
      WebpackQcIconfontPlugin.getHooks.for('iconfontCssCreateEnd').tapAsync(pluginName, (result, cb) => {
        result += '// 222'
        cb(result)
      })

      // 测试 iconfontFileDownloadEnd 钩子
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

// 导出plugin
module.exports = HookTestPlugin;
