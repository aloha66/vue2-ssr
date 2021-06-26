// 两个插件分别负责打包客户端和服务端
const VueSSRServerPlugin = require("vue-server-renderer/server-plugin")
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin")
const nodeExternals = require("webpack-node-externals")
const merge = require("lodash.merge")
// 根据传⼊环境变量决定⼊⼝⽂件和相应配置项
const TARGET_NODE = process.env.WEBPACK_TARGET === "node"
const target = TARGET_NODE ? "server" : "client"
module.exports = {
  css: {
    extract: false,
  },
  outputDir: "./dist/" + target,
  configureWebpack: () => ({
    // 将 entry 指向应⽤程序的 server / client ⽂件
    entry: `./src/entry-${target}.js`,
    // 对 bundle renderer 提供 source map ⽀持
    devtool: "source-map",
    // target设置为node使webpack以Node适⽤的⽅式处理动态导⼊，
    // 并且还会在编译Vue组件时告知`vue-loader`输出⾯向服务器代码。
    target: TARGET_NODE ? "node" : "web",
    // 是否模拟node全局变量
    node: TARGET_NODE ? undefined : false,
    output: {
      // 此处使⽤Node⻛格导出模块
      libraryTarget: TARGET_NODE ? "commonjs2" : undefined,
    },
    // https://webpack.js.org/configuration/externals/#function
    // https://github.com/liady/webpack-node-externals
    // 外置化应⽤程序依赖模块。可以使服务器构建速度更快，并⽣成较⼩的打包⽂件。
    externals: TARGET_NODE
      ? nodeExternals({
          // 不要外置化webpack需要处理的依赖模块。
          // 可以在这⾥添加更多的⽂件类型。例如，未处理 *.vue 原始⽂件，
          // 还应该将修改`global`（例如polyfill）的依赖模块列⼊⽩名单
          allowlist: [/\.css$/],
        })
      : undefined,
    optimization: {
      splitChunks: undefined,
    },
    // 这是将服务器的整个输出构建为单个 JSON ⽂件的插件。
    // 服务端默认⽂件名为 `vue-ssr-server-bundle.json`
    // 客户端默认⽂件名为 `vue-ssr-client-manifest.json`。
    plugins: [
      TARGET_NODE ? new VueSSRServerPlugin() : new VueSSRClientPlugin(),
    ],
  }),
  chainWebpack: (config) => {
    // cli4项⽬添加
    if (TARGET_NODE) {
      config.optimization.delete("splitChunks")
    }
    config.module
      .rule("vue")
      .use("vue-loader")
      .tap((options) => {
        merge(options, {
          optimizeSSR: false,
        })
      })
  },
}
