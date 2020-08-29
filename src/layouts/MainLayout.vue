<template>
  <div :class="{'safe-area': safeArea}">
    <div :class="showNav?'app-main he-1' : 'app-main he-2'">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
    <Nav v-if="showNav"/>
  </div>
</template>

<script>
import Nav from "@/components/Nav";
export default {
  data() {
    return {};
  },
  props: {
    safeArea: {
      type: Boolean,
      default: false
    },
    showNav: {
      type: Boolean,
      default: true
    }
  },
  components: {
    Nav
  }
};
</script>

<style lang="stylus" scoped>
.safe-area {
  padding-top: 60px;
  height: calc(100vh - 60px);
}

 .he-1 {
   height: calc(100vh - 2.33333rem);
 }
 .he-2 {
   height: calc(100vh - 0.33333rem);
 }
.app-main {
  position: relative;
  // height: 100vh;
  padding-bottom: 0.33333rem;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 0;
  }
}
</style>
