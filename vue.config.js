/**
 * Created by daphneli on 2020/04/30.
 */

module.exports = {
  devServer: {
    proxy: {
      '/logcheck': {
        target: 'http://9.134.51.19:8666/mmsearchtest/logcheck', // 源地址
        changeOrigin: true, // 改变源
        pathRewrite: {
          '^/logcheck': '' // 路径重写
        }
      }
    }
  }
}
