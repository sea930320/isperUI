<template>
  <div class="student-container main-bg" style="height: 100%; overflow: auto">
    <TopHeader v-if="userInfo">
      <template v-slot:pageMenu>
        <b-nav-item v-if="[9].includes(userInfo.role)" to="/student/business-watch">
          <icon name="list" class="tabIcon"></icon>业务关注
        </b-nav-item>
        <b-nav-item v-if="[9].includes(userInfo.role)" to="/student/team">
          <icon name="box-open" class="tabIcon"></icon>团队管理
        </b-nav-item>
      </template>
    </TopHeader>
    <div style="padding: 130px 0 0 0">
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
    return {};
  },
  created() {},
  computed: {},
  watch: {},
  methods: {}
};
</script>
