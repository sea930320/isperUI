<template>
  <div class="top-header header-bg position-fixed" style="width: 90%; z-index: 1000; font-family: 'Microsoft JhengHei'; font-weight: bold;">
    <b-navbar toggleable="lg" type="dark" class="container py-0">
      <b-navbar-brand class="logo my-auto pl-3 pr-5 py-3" to="/">
        <div class="d-flex justify-content-center p-0">
          <div class="px-3">
            <img src="@/assets/imgIsper/3.png">
          </div>
          <h3 class="align-self-center mainTitle">ISPER - 2019</h3>
        </div>
      </b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <slot name="pageMenu"></slot>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto" v-if="userInfo && userInfo.role">
          <b-nav-item-dropdown right>
            <template slot="button-content" class="text-white">
              <icon name="users"></icon>&nbsp;&nbsp; {{userInfo.role_name}}
            </template>
            <b-dropdown-item :to="prefixRoute + 'personal-info'">个人信息</b-dropdown-item>
            <b-dropdown-item :to="prefixRoute + 'password-reset'">重置密码</b-dropdown-item>
            <b-dropdown-item :to="prefixRoute + 'assistant-set'">配置助理</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item right @click="logoutHandler">
            <icon name="sign-out-alt"></icon>
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { STORAGE_KEY_USER } from "@/store/storageKey";
import prefixRoute from "@/mixins/prefix-route";

export default {
  mixins: [prefixRoute],
  created() {},
  methods: {
    ...mapActions({
      logoutAction: "logout"
    }),
    logoutHandler() {
      this.$cookie.delete(STORAGE_KEY_USER);
      this.logoutAction();
      this.$router.push({ path: "/login" });
    }
  }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.top-header {
  .logo {
    // background-color: $logo-bg-color;
    a {
      font-size: 25px;
    }
    img {
      width: 50px;
    }
  }
  .navbar-dark .navbar-nav .nav-link {
    color: rgba(255, 255, 255, 0.7);
    padding: 0px 16px;
    height: 80px;
    line-height: 80px;
    overflow: hidden;
  }
  .nav-link.active {
    background: #4e73ff;
  }
}
</style>