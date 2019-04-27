<template>
  <div class="manager-container main-bg">
    <TopHeader>
      <template v-slot:pageMenu>
        <b-nav-item to="/manager/workflow">
          <icon name="sitemap" class="tabIcon"></icon>流程管理
        </b-nav-item>
        <b-nav-item v-if="userInfo.role!==1" to="/manager/project">
          <icon name="tags" class="tabIcon"></icon>项目管理
        </b-nav-item>
        <b-nav-item v-if="userInfo.role===1" to="/manager/group">
          <icon name="users-cog" class="tabIcon"></icon>集群管理
        </b-nav-item>
        <b-nav-item v-if="userInfo.role===2" to="/manager/group_company">
          <icon name="users" class="tabIcon"></icon>集群及单位管理
        </b-nav-item>
        <b-nav-item v-if="userInfo.role===1" to="#">
          <icon name="sitemap" class="tabIcon"></icon>元模块管理
        </b-nav-item>
        <b-nav-item to="#">
          <icon name="user-cog" class="tabIcon"></icon>用户管理
        </b-nav-item>
        <b-nav-item to="/manager/system-set">
          <icon name="cogs" class="tabIcon"></icon>系统设置
        </b-nav-item>
        <b-nav-item v-if="userInfo.role===2" to="#">
          <icon name="user-cog" class="tabIcon"></icon>业务管理
        </b-nav-item>
      </template>
    </TopHeader>
    <div class="container" style="min-height: calc(100vh - 210px); padding: 130px 0 0 0;">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import prefixRoute from "@/mixins/prefix-route";
import TopHeader from "@/components/header/TopHeader";
export default {
  mixins: [prefixRoute],
  components: {
    TopHeader
  },
  data() {
    return {
      activatedRoute: "workflow"
    };
  },
  created() {},
  watch: {
    $route: "checkActiveRoute"
  },
  methods: {
    checkActiveRoute(to) {
      if (to.path.indexOf("workflow") !== -1) {
        this.activatedRoute = "workflow";
      } else if (to.path.indexOf("project") !== -1) {
        this.activatedRoute = "project";
      } else if (to.path.indexOf("group") !== -1) {
        this.activatedRoute = "group";
      }
    }
  }
};
</script>
