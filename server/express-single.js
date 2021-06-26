const express = require("express")
const app = express()
// 导⼊Vue构造函数
const Vue = require("vue")

const Router = require("vue-router")
Vue.use(Router)

// createRenderer⽤于获取渲染器
const { createRenderer } = require("vue-server-renderer")
// 获取渲染器
const renderer = createRenderer()

// path修改为通配符
app.get("*", async function(req, res) {
  // 每次创建⼀个路由实例
  const router = new Router({
    routes: [
      { path: "/", component: { template: "<div>index page</div>" } },
      { path: "/detail", component: { template: "<div>detail page</div>" } },
    ],
  })
  const vm = new Vue({
    data: { msg: "突突突" },
    // 添加router-view显示内容
    template: `
    <div>
    <router-link to="/">index</router-link>
    <router-link to="/detail">detail</router-link>
    <router-view></router-view>
    {{msg}}
    </div>`,
    router, // 挂载
  })
  try {
    // 跳转⾄对应路由
    router.push(req.url)
    const html = await renderer.renderToString(vm)
    res.send(html)
  } catch (error) {
    res.status(500).send("渲染出错")
  }
})

app.listen(3001)
