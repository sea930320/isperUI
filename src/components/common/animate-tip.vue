<template>
  <div class="modal-wrap" v-show="visible">
    <div class="modal-mask"></div>
    <div class="animate-wrap">
      <div class="modal-content animate-content">
        <span class="animate-tip-txt">{{txt}}</span>
        <img :src="img" alt="" width="400px" height="300px">
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  props: {
    txt: {
      type: String,
      default: ''
    },
    img: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style>
.animate-wrap {
  margin: 0 auto;
  position: relative;
  outline: 0;
  top: 200px;
  width: 400px;
  height: 300px;
}
.animate-tip-txt {
  position: absolute;
  top: 60px;
  left: 50%;
  margin-left: -200px;
  width: 100%;
  color: #333;
  font-size: 16px;
  text-align: center;
}
.animate-content {
  width: 400px;
  height: 300px;
  border-radius: 4px;
  overflow: hidden;
}
</style>
