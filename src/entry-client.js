// 客户端激活

import createApp from "./main"

const { app, router, store } = createApp()

// 注水
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

router.onReady(() => {
  // 挂载激活
  app.$mount("#app", true)
})
