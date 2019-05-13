<template>
  <div class="message-view">
    <PersonalCenterTab activeTab="3"/>
    <div @submit.prevent="updateInfo" class="cardDiv">
      <b-list-group>
        <b-list-group-item v-for="item in message" :to="item.link" :key="item.id">{{item.content}}</b-list-group-item>
      </b-list-group>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import PersonalCenterTab from "@/components/personal-center/PersonalCenterTab";
import store from '@/store'

export default {
  name: "message-view",
  components: { PersonalCenterTab },
  data() {
    return {
    };
  },
  computed: {
    ...mapState(["userInfo"]),
    message() {
      return store.getters.getMsg
    }
  },
  created() {},
  methods: {
  }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.message-view {
  .list-group-item {
    text-align: left;
  }
}
</style>