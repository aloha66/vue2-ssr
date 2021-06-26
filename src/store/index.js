import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default function createStore() {
  return new Vuex.Store({
    state: {
      count: 108,
    },
    mutations: {
      init(state, count) {
        state.count = count
      },
      add(state) {
        state.count += 1
      },
    },
    actions: {
      getCount({ commit }) {
        return new Promise((resolve) => {
          setTimeout(() => {
            commit("init", Math.random() * 100)
            resolve()
          }, 1000)
        })
      },
    },
    modules: {},
  })
}
