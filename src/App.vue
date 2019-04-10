<template>
  <div id="app">
    <div class="browser-warning-wrapper" v-if="warning">
      <div class="browser-warning-header">
        <i></i>
        <p>为保证最佳使用体验，建议您使用以下浏览器的最新版本</p>
      </div>
      <div class="bs">
        <span class="bs-block bsi-chrome">
          <i class="bsi-icon"></i>
          <span class="bsi-name">Chrome</span>
          <a href="http://www.google.cn/chrome/" target="_blank">官方下载</a>
        </span>
        <span class="bs-block bsi-ie">
          <i class="bsi-icon"></i>
          <span class="bsi-name">IE最新版</span>
          <a
            href="https://support.microsoft.com/zh-cn/help/17621/internet-explorer-downloads"
            target="_blank"
          >官方下载</a>
        </span>
        <span class="bs-block bsi-firefox">
          <i class="bsi-icon"></i>
          <span class="bsi-name">Firefox</span>
          <a href="https://www.mozilla.org/zh-CN/firefox/new/" target="_blank">官方下载</a>
        </span>
      </div>
    </div>
    <div class="page-container" v-else>
      <router-view></router-view>
      <!-- <Loading :visible="loading"></Loading> -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// import Loading from "@/components/loading/loading";

export default {
  components: {
    // Loading
  },
  data() {
    return {
      warning: false
    };
  },
  computed: {
    ...mapGetters(["loading"])
  },
  created() {
    this.checkBrowser();
  },
  watch: {},
  methods: {
    checkBrowser() {
      // 浏览器检测
      const DEFAULT_VERSION = "9.0";
      let ua = navigator.userAgent.toLowerCase();
      let isIE = ua.indexOf("msie") > -1;
      let safariVersion;
      if (isIE) {
        safariVersion = ua.match(/msie ([\d.]+)/)[1];
        if (safariVersion <= DEFAULT_VERSION) {
          this.warning = true;
        }
      }
    }
  }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>