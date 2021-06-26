import createApp from "./main"

// 用于首屏渲染
// context由渲染器传入
export default (context) => {
  return new Promise((resolve, reject) => {
    // 获取路由和app实例
    const { app, router, store } = createApp(context)
    //   获取首屏地址
    router.push(context.url)
    router.onReady(() => {
      // 获取当前匹配的所有组件
      const matched = router.getMatchedComponents()
      if (!matched.length) {
        return reject()
      }
      // 遍历matched，判断内部有没有asyncData，有就执行
      const tmp = matched.map((com) => {
        if (com.asyncData) {
          return com.asyncData({ store, route: router.currentRoute })
        }
      })
      console.log("matched", matched, tmp)
      Promise.all(tmp)
        .then(() => {
          // 约定把store.state放入context
          // 渲染器把state序列化为字符串（脱水） window.__INITIAL_STATE__
          // 在前端获取之前恢复成对象（注水）
          context.state = store.state
          resolve(app)
        })
        .catch(reject)
    }, reject)
  })
}
