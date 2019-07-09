<template>
  <div class="qa-step1 pt-5">
    <b-row class="justify-content-md-center">
      <b-col cols="2" class="text-right">
        <label>Title:</label>
      </b-col>
      <b-col cols="6">
        <b-form-input size="sm" v-model="title"></b-form-input>
      </b-col>
    </b-row>
    <b-row class="mt-2 justify-content-md-center">
      <b-col cols="2" class="text-right">
        <label>Description:</label>
      </b-col>
      <b-col cols="6">
        <b-form-textarea v-model="description" rows="3" max-rows="6"></b-form-textarea>
      </b-col>
    </b-row>

    <b-button class="styledBtn mt-3" variant="outline-primary" @click.stop="createSurvey()">保存</b-button>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  components: {},
  data() {
    return {
      title: "",
      description: ""
    };
  },
  created() {
    this.$nextTick(() => {
      this.init();
    });
  },
  computed: {
    ...mapState(["userInfo"]),
    currentRoleAllocation() {
      return this.$store.state.meta.currentRoleAllocation;
    }
  },
  mounted() {},
  methods: {
    init() {},
    createSurvey() {}
  }
};
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
.qa-step1 {
}
</style>