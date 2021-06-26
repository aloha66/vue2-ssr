<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <div @click="$store.commit('add')">{{ $store.state.count }}</div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "Home",
  asyncData({ store, router }) {
    return store.dispatch("getCount");
  },
  components: {
    HelloWorld,
  },
};
</script>
