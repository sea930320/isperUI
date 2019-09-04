<template>
  <div class="court-container animation-index">
    <div class="meta-content-wrapper container">
      <!-- 场景显示 -->
      <div class="court-flash-container">
        <courtFlash></courtFlash>
      </div>
      <div class="court-chat-container">
        <animation-chat></animation-chat>
      </div>
    </div>
  </div>
</template>

<script>
import courtFlash from "./court-flash";
import AnimationChat from "./AnimationChat";
export default {
  name: "animation-index",
  components: {
    courtFlash,
    AnimationChat
  },
  filters: {},
  data() {
    return {};
  },
  created() {
    this.$nextTick(() => {});
  },
  computed: {},
  watch: {},
  methods: {}
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.animation-index {
  .flash-height {
    height: 670px;
  }
  .court-flash-container {
    float: left;
    background-color: #fff;
    width: 830px;
  }
  .court-chat-container {
    height: 680px;
    margin-left: 830px;
    width: 680px;
  }

  .court-action-wrap {
    padding: 10px;
    height: 140px;
    margin-right: -5px;
  }
  .btn-ex {
    display: inline-block;
    font-size: 12px;
    width: 82px;
    margin-right: 5px;
    height: 31px;
    line-height: 31px;
    text-align: center;
    color: #fff;
    padding: 0;
    -webkit-transition: all 0.3s ease;
    -moz-transition: all 0.3s ease;
    transition: all 0.3s ease;
  }
  .btn-ex-green {
    background-color: #2dcb70;
  }
  .btn-ex-green:hover {
    background-color: #00c175;
    color: #fff;
  }
  .btn-ex-blue {
    background-color: darkgrey;
  }
  .btn-ex-blue:hover {
    background-color: lightgrey;
    color: #fff;
  }
  .action-container .btn-ex {
    text-decoration: none;
    margin-bottom: 10px;
  }
  .speak-container .speak-field {
    border-bottom: 1px solid #cdcdcd;
  }
}
</style>