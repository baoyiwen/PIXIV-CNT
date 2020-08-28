<template>
  <div id="app">
    <Preload />
    <router-view/>
  </div>
</template>
<script>
  import Preload from "./components/Preload";
  import TopBar from "./components/TopBar";
  import Nav from "./components/Nav";
  export default {
    components: {
      Preload,
      TopBar,
      Nav
    }
  }
</script>
<style lang="less">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  max-width: 750px;
  margin: 0 auto;
  cursor: pointer;
}
</style>
