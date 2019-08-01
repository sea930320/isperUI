<template>
  <div class="instructor-container main-bg" style="height: 100%; overflow: auto">
    <TopHeader v-if="userInfo">
      <template v-slot:pageMenu>
        <b-nav-item to="/instructor/business-guide">
          <icon name="book" class="tabIcon"></icon>业务指导
        </b-nav-item>
        <b-nav-item to="/instructor/business-question">
          <icon name="headset" class="tabIcon"></icon>业务咨询
        </b-nav-item>
        <b-nav-item to="/instructor/business-rating">
          <icon name="thumbs-up" class="tabIcon"></icon>业务评价
        </b-nav-item>
        <b-nav-item to="/instructor/student-guide" v-if="userInfo.teacher_id">
          <icon name="book-open" class="tabIcon"></icon>课堂指导
        </b-nav-item>
        <b-nav-item to="/instructor/interest-course" v-if="userInfo.teacher_id">
          <icon name="book-open" class="tabIcon"></icon>兴趣课堂
        </b-nav-item>
      </template>
    </TopHeader>
    <div style="padding: 130px 0 0 0" class="container">
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
