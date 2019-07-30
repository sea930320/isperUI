<template>
  <!--  <div class="top-header header-bg position-fixed" style="width: 90%; z-index: 1000; font-family: 'Microsoft JhengHei'; font-weight: bold;"> blue -->
  <div
    class="top-header header-bg position-fixed"
    style="width: 100%; z-index: 1000; font-family: 'Microsoft JhengHei'; font-weight: bold;"
  >
    <b-navbar toggleable="lg" type="dark" class="container py-0">
      <b-navbar-brand class="logo my-auto pl-3 pr-5 py-3" to="/">
        <div class="d-flex justify-content-center p-0">
          <div class="px-3">
            <img src="@/assets/imgIsper/3.png" />
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
            <template
              slot="button-content"
              class="text-white"
              v-if="!['animation'].includes(this.$route.name)"
            >
              <icon name="users"></icon>
              &nbsp;&nbsp; {{userInfo.username}}-{{userInfo.manager_info.group_name && (userInfo.manager_info.group_name)}}{{userInfo.manager_info.company_name && ('/' + userInfo.manager_info.company_name)}}{{userInfo.manager_info.part_name && ('/' + userInfo.manager_info.part_name)}}({{userInfo.role_name}})
              <b-badge
                variant="primary"
                pill
                v-if="message.length > 0"
                class="counter"
                style="position: absolute; top: 31px;"
              >{{ message.length}}</b-badge>
            </template>
            <template slot="button-content" class="text-white" v-else>
              <icon name="users"></icon>
              &nbsp;&nbsp; {{userInfo.username}}-({{userInfo.role_name}})
            </template>
            <b-dropdown-item :to="prefixRoute + 'personal-info'">个人信息</b-dropdown-item>
            <b-dropdown-item :to="prefixRoute + 'password-reset'">重置密码</b-dropdown-item>
            <b-dropdown-item
              :to="prefixRoute + 'assistant-set'"
              v-if="[2, 3].includes(userInfo.role)"
            >配置助理</b-dropdown-item>
            <b-dropdown-item :to="prefixRoute + 'message-view'">
              消息管理
              <b-badge
                variant="primary"
                pill
                v-if="message.length > 0"
                class="ml-3"
              >{{message.length}}</b-badge>
            </b-dropdown-item>
            <b-dropdown-item
              :to="prefixRoute + 'group-change'"
              v-if="[5].includes(userInfo.role)"
            >集群变更</b-dropdown-item>
            <b-dropdown-item
              :to="prefixRoute + 'company-change'"
              v-if="[5].includes(userInfo.role)"
            >单位变更</b-dropdown-item>
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
import { mapActions, mapState } from "vuex";
import store from "@/store";
import { STORAGE_KEY_USER } from "@/store/storageKey";
import prefixRoute from "@/mixins/prefix-route";
import accountService from "@/services/accountService";

export default {
  mixins: [prefixRoute],
  created() {
    store.dispatch("refreshMsg");
  },
  computed: {
    ...mapState(["userInfo"]),
    message() {
      return store.getters.getMsg;
    }
  },
  methods: {
    ...mapActions({
      logoutAction: "logout"
    }),
    logoutHandler() {
      accountService
        .logout()
        .then(() => {
          this.$cookie.delete(STORAGE_KEY_USER);
          this.logoutAction();
          this.$router.push({ path: "/login" });
        })
        .catch(() => {});
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