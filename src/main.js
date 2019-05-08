import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import BootstrapVue from 'bootstrap-vue'
import VueCookie from 'vue-cookie'
import VueResource from 'vue-resource'
import Toasted from 'vue-toasted';
import VeeValidate from 'vee-validate';
import globalMixin from './mixins/global-mixin'
import DataProcessMixin from "./mixins/data-process";
import lodash from 'lodash'
import VueLodash from 'vue-lodash'
import VueFormWizard from 'vue-form-wizard'
import VueSweetalert2 from 'vue-sweetalert2';
import VueMoment from 'vue-moment'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'


import {
  STORAGE_KEY_USER
} from './store/storageKey'

// Bootstrap and Bootstrap Vue StyleSheet import
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

//Font awesome
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'
Vue.component('icon', Icon);

Vue.config.productionTip = false;
Vue.use(VueResource);
Vue.use(VueCookie);
Vue.use(BootstrapVue);
Vue.use(ElementUI);
Vue.use(VueLodash, lodash);
Vue.use(Toasted, {
  duration: 1500
});
Vue.use(VeeValidate, {
  fieldsBagName: 'veeFields'
});
Vue.mixin(globalMixin);
Vue.mixin(DataProcessMixin);
Vue.use(VueFormWizard);
Vue.use(VueSweetalert2);
Vue.use(VueMoment)


new Vue({
  router,
  store,
  render: h => h(App),
  watch: {
    '$route': 'checkLogin'
  },
  created() {
    this.checkLogin()
  },
  methods: {
    checkLogin() {
      // 检查是否存在session
      const user = JSON.parse(this.$cookie.get(STORAGE_KEY_USER));
      if (!user) {
        if (!this.$route.name || ['home', 'register'].includes(this.$route.name)) {
          this.$router.push(this.$route.fullPath)
        } else {
          this.$router.push('/login')
        }
      } else {
        // // 判断用户权限
        // if ((user.identity === 3 || user.identity === 4) && this.$route.matched.some(record => record.name === 'experiment')) {
        //   this.$router.push({
        //     path: '/manager/workflow'
        //   })
        // }
        // if (user.identity === 1 && this.$route.matched.some(record => record.name === 'manager')) {
        //   this.$router.push({
        //     path: '/experiment'
        //   })
        // }
        // if (user.identity === 2 && this.$route.matched.some(record => record.name === 'manager')) {
        //   this.$router.push({
        //     path: '/mentor'
        //   })
        // }
        // // 已登录自动登录
        // if (this.$route.name === 'login') {
        //   if (user.identity === 3 || user.identity === 4) {
        //     this.$router.push({
        //       path: '/manager/workflow'
        //     })
        //   }
        //   if (user.identity === 1) {
        //     this.$router.push({
        //       path: '/experiment'
        //     })
        //   }
        //   if (user.identity === 2) {
        //     this.$router.push({
        //       path: '/mentor'
        //     })
        //   }
        // }
      }
    }
  }
}).$mount('#app')