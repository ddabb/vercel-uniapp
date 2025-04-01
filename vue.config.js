const path = require('path')

module.exports = {
  outputDir: path.resolve(__dirname, 'dist/build/h5'),
  configureWebpack: {
    entry: path.resolve(__dirname, 'main.js'),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    }
  },
  chainWebpack: config => {
    config.plugin('define').tap(args => {
      args[0]['process.env'].NODE_ENV = JSON.stringify(process.env.NODE_ENV)
      return args
    })
    
    // 添加静态文件复制配置
    config.plugin('copy').use(require('copy-webpack-plugin'), [{
      patterns: [
        {
          from: path.resolve(__dirname, 'static'),
          to: 'static'
        }
      ]
    }])
  },
  devServer: {
    hot: true,
    client: {
      webSocketURL: 'ws://localhost:8080/ws',
      overlay: false
    }
  }
}