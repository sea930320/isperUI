<template>
  <div :class="wrapClasses">
    <div class="image-view-mask" @click="close"></div>
    <a class="image-view-close" @click="close"></a>
    <div class="image-view-inner">
      <div class="image-view-content">
        <img class="image" :src="src" alt ref="img">
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    src: {
      type: String,
      default: "/media/files/defaultAnimationImg.jpg"
    }
  },
  data() {
    return {
      wrapShow: false,
      marginLeft: 0,
      marginTop: 0,
      imgWidth: 0,
      imgHeight: 0
    };
  },
  computed: {
    wrapClasses() {
      return [
        "image-view-wrap",
        {
          "image-view-hidden": !this.wrapShow,
          [`${this.className}`]: !!this.className
        }
      ];
    }
  },
  methods: {
    close() {
      this.wrapShow = false;
      this.$emit("on-close", this.wrapShow);
    }
  },
  mounted() {
    if (this.visible) {
      this.wrapShow = true;
    }
  },
  watch: {
    visible(val) {
      if (val === false) {
        setTimeout(() => {
          this.wrapShow = false;
        }, 300);
      } else {
        this.wrapShow = true;
      }
    },
    src(val) {
      let OriginImage = new Image();
      OriginImage.src = val;
      // console.log(OriginImage.width)
      this.imgHeight = OriginImage.height;
      this.imgWidth = OriginImage.width;
      this.marginTop = -OriginImage.height / 2 + "px";
      this.marginLeft = -OriginImage.width / 2 + "px";
    }
  }
};
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss" scoped>
.image-view-wrap {
  position: fixed;
  z-index: 8010;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow-y: scroll;
}
.image-view-hidden {
  display: none;
}
.image-view-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.75;
  z-index: 9000;
  background: rgb(0, 0, 0);
}
.image-view-close {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10000;
  width: 38px;
  height: 38px;
  background: url("close_btn.png");
  cursor: pointer;
}
.image-view-inner {
  position: absolute;
  width: 1024px;
  left: 50%;
  top: 100px;
  margin-left: -512px;
  z-index: 9999;
  /*background: #0d0d0d;*/
  padding: 10px;
  overflow: hidden;
}
.image-view-content .image {
  max-width: 100%;
  margin: 0 auto;
}
</style>
