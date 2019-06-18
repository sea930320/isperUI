<template>
  <div class="header">
    <div class="logo fl">
      <h1>
        <a href="javascript:;" title="LETS-2017">LETS-2017</a>
      </h1>
    </div>
    <div class="user-infor f12 fff fr">
      &nbsp;&nbsp;欢迎您：<span>{{user.name}}</span> &nbsp;| &nbsp;
      身份：<span>{{user.identity | identity}}</span>&nbsp; |&nbsp;
      <a href="javascript:;" class="btn-logout" @click="logoutHandler">退出</a>
    </div>
    <ul class="kind">
      <slot></slot>
    </ul>
  </div>
</template>
<script >
import { identity } from 'src/filters/fun'
export default {
  computed: {
    user() {
      return this.$store.getters.userInfo
    }
  },
  filters: { identity },
  methods: {
    logoutHandler() {
      this.$store.dispatch('logout')
      this.$router.push({path: '/login'})
    }
  }
}
</script>
