const path = require('path')

module.exports = {
  outputDir: path.resolve(__dirname, 'dist/build/h5'),
  configureWebpack: {
    entry: path.resolve(__dirname, 'main.js'),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        // 添加 uni-app 相关别名
        '@dcloudio/uni-app': path.resolve(__dirname, 'node_modules/@dcloudio/uni-app/dist/uni-app.es.js')
      }
    },
    // 添加模块解析配置
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: [path.resolve(__dirname, 'src')]
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: [path.resolve(__dirname, 'pages')]
        }
      ]
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

module.exports = {
  configureWebpack: {
    externals: process.env.VUE_APP_PLATFORM === 'h5' ? {} : {
      '@chenfengyuan/vue-qrcode': 'VueQrcode'
    }
  },
  transpileDependencies: ['@chenfengyuan/vue-qrcode']
};