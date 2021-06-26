import Vue from "vue"
import App from "./App.vue"
import createRouter from "./router"
import createStore from "./store"

Vue.config.productionTip = false

// 处理客户端asyncData调用
Vue.mixin({
  beforeCreate() {
    const { asyncData } = this.$options
    if (asyncData) {
      asyncData({ store: this.$store, route: this.$route })
    }
  },
})

// 返回一个应用程序工厂
// 被后端的渲染器调用
export default function createApp(context) {
  // 处理首屏，先处理路由跳转
  const router = createRouter()
  const store = createStore()
  const app = new Vue({
    router,
    store,
    context,
    render: (h) => h(App),
  })

  return {
    router,
    store,
    app,
  }
}
