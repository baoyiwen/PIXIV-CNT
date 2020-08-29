import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import Moment from "vue-moment";
import Icon from 'vue-svg-icon/Icon';
import {Toast, Lazyload, ImagePreview} from 'vant';
import '@vant/touch-emulator';
import VueAwesomeSwiper from "vue-awesome-swiper";
import VCalendar from 'v-calendar';
import 'swiper/swiper-bundle.css'
import '@/assets/css/base.styl'
import './polyfill'

Vue.config.productionTip = false;
Vue.use(Moment);
Vue.use(Toast);
Vue.use(Lazyload, {
  lazyComponent: true,
  loading: require('@/svg/loading.svg')
});
Vue.use(ImagePreview);
Vue.use(VueAwesomeSwiper);
Vue.use(VCalendar);
Vue.component('Icon', Icon);


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
