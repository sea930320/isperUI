<template>
  <div class="watch-index container">
    <loading v-if="isRunning"></loading>
    <b-form-group>
      <b-form-radio-group
        v-model="queryParam.type"
        :options="options"
        buttons
        button-variant="outline-primary"
        class="float-left"
      ></b-form-radio-group>
    </b-form-group>
    <b-row no-gutters>
      <b-col lg="3" md="6" sm="12">
        <b-input-group :size="template_size">
          <b-input-group-prepend>
            <span class="input-group-text">
              <icon name="search"></icon>
            </span>
          </b-input-group-prepend>
          <b-form-input v-model.lazy="queryDebounceParam.search" placeholder="请输入内容" />
        </b-input-group>
      </b-col>
    </b-row>
    <div class="cardDiv"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Loading from "@/components/loading/Loading";
import _ from "lodash";

export default {
  components: { Loading },
  data() {
    return {
      queryParam: {
        type: 0
      },
      queryDebounceParam: {
        search: ""
      },
      options: [
        { text: "全部业务", value: 0 },
        { text: "可关注业务", value: 1 },
        { text: "已关注业务", value: 2 }
      ]
    };
  },
  created() {
    this.$nextTick(() => {
      this.init();
    });
  },
  computed: {
    ...mapState(["userInfo"])
  },
  watch: {},
  mounted() {},
  methods: {
    init() {}
  }
};
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
.watch-index {
}
</style>