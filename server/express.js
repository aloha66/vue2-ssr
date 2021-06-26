const express = require("express")
const { createBundleRenderer } = require("vue-server-renderer")
const path = require("path")
const fs = require("fs")

const resolve = (dir) => path.resolve(__dirname, dir)

const app = express()

// 第 1 步：开放dist/client⽬录，关闭默认下载index⻚的选项，不然到不了后⾯路由
app.use(express.static(resolve("../dist/client"), { index: false }))

// 第 2 步：服务端打包⽂件地址
const bundle = resolve("../dist/server/vue-ssr-server-bundle.json")

// 第 3 步:获取渲染器
// createBundleRenderer 打包版的渲染器
const renderer = createBundleRenderer(bundle, {
  runInNewContext: false, // https://ssr.vuejs.org/zh/api/#runinnewcontext
  template: fs.readFileSync(resolve("../public/index.html"), "utf-8"), // 宿主⽂件
  clientManifest: require(resolve(
    "../dist/client/vue-ssr-client-manifest.json"
  )), // 客户端清单,挂载客户端js文件（激活相关）
})

app.get("*", async (req, res) => {
  try {
    const context = {
      url: req.url,
    }
    const html = await renderer.renderToString(context)
    res.send(html)
  } catch (error) {
    res.status(500).send("内部错误")
  }
})

app.listen(3000)
