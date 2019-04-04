<template>
  <div class="login-container">
    <TopHeader>
      <template v-slot:pageTitle>首页界面——登陆（新设计）</template>
    </TopHeader>
    <b-container>
      <b-card no-body class="overflow-hidden">
        <b-row no-gutters>
          <b-col cols="6" style="overflow: hidden">
            <b-card-img
              src="https://picsum.photos/400/400/?image=20"
              class="rounded-0"
              style="width: auto; height: 100%"
            ></b-card-img>
          </b-col>
          <b-col cols="6">
            <b-card-body class="text-center">
              <h3>ISPER</h3>
              <h4>ISPER -- 2019</h4>
              <div>Description</div>

              <div class="login-box px-5">
                <b-input-group>
                  <b-input-group-prepend>
                    <span class="input-group-text">
                      <icon name="user"></icon>
                    </span>
                  </b-input-group-prepend>
                  <b-form-input v-model.lazy="user.username" placeholder="User Name"></b-form-input>
                </b-input-group>
                <b-input-group class="mt-3">
                  <b-input-group-prepend>
                    <span class="input-group-text">
                      <icon name="unlock"></icon>
                    </span>
                  </b-input-group-prepend>
                  <b-form-input v-model="user.password" placeholder="Password"></b-form-input>
                </b-input-group>
                <b-button block variant="primary" class="mt-3">登陆</b-button>
              </div>

              <div class="dl-choose px-5 my-3">
                <b-row>
                  <b-col
                    cols="6"
                    v-for="(permission, index) in permissions"
                    :key="index"
                    class="text-left mt-1"
                  >
                    <b-form-radio
                      v-model="user.login_type"
                      :value="permission"
                    >{{permissionMatch[permission - 1]}}</b-form-radio>
                  </b-col>
                </b-row>
              </div>

              <div class="qrcode-info mt-3 pt-3">
                <div class="qrcode-title">下载ISPER手机APP, 随时随地参与实验</div>
                <b-row class="qrcodeImgBox mt-2">
                  <b-col>
                    <div class="qrcodeDesc">
                      <img src="@/assets/img/appleIcon.png" alt="IOS">
                      <span class="ml-2">iPhone</span>
                    </div>
                    <img
                      v-if="qrcodeImage.ios"
                      :src="qrcodeImage.ios"
                      alt="IOS"
                      class="qrcodeImage mt-2"
                    >
                    <div v-else class="qrcodeImage mt-2"/>
                  </b-col>
                  <b-col>
                    <div class="qrcodeDesc">
                      <img src="@/assets/img/androidIcon.png" alt="Android">
                      <span class="ml-2">Android</span>
                    </div>
                    <img
                      v-if="qrcodeImage.android"
                      :src="qrcodeImage.android"
                      alt="Android"
                      class="qrcodeImage mt-2"
                    >
                    <div v-else class="qrcodeImage mt-2"/>
                  </b-col>
                </b-row>
              </div>
            </b-card-body>
          </b-col>
        </b-row>
      </b-card>
    </b-container>
  </div>
</template>

<script>
import TopHeader from "@/components/header/TopHeader";
// import modal from "components/modal/modal";
import { mapState } from "vuex";
import accountService from "../services/accountService";
import { STORAGE_KEY_USER } from "../store/storageKey";
import { PERMISSION_MATCH } from "../config";
export default {
  components: {
    TopHeader
    /*modal*/
  },
  data() {
    return {
      tipModal: false,
      contentDetailFlag: false,
      error: "",
      user: {
        username: "",
        password: "",
        login_type: 1
      },
      is_director: false,
      is_manage: false,
      is_admin: false,
      is_general: false,
      permissions: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      qrcodeImage: {
        ios: "",
        android: ""
      },
      noticeInfo: {
        contentWid: 0,
        content: "",
        attach: "",
        file_name: "",
        create_time: "",
        title: "最新公告"
      },
      permissionMatch: PERMISSION_MATCH
    };
  },
  computed: {
    ...mapState(["userInfo"])
  },
  created() {
    this.getQrcode();
    // this.getNotice();
  },
  methods: {
    loginHandle() {
      const USER = JSON.parse(this.$cookie.get(STORAGE_KEY_USER));
      if (USER) {
        this.tipModal = true;
        return;
      }
      accountService.login(this.user).then(data => {
        this.$cookie.delete(STORAGE_KEY_USER);
        this.$cookie.set(STORAGE_KEY_USER, JSON.stringify(data));
        this.$store.dispatch("login", data);
        if (data.identity === 3 || data.identity === 4) {
          this.$router.push("/manager/workflow");
        }
        if (data.identity === 1) {
          if (data.last_experiment_id && data.last_experiment_status === 2) {
            this.$router.push({
              name: "doingExperiment",
              params: {
                exp_Id: data.last_experiment_id,
                exp_Name: data.last_experiment_name
              }
            });
          } else {
            this.$router.push("/experiment");
          }
        }
        if (data.identity === 2) {
          this.$router.push("/mentor");
        }
      });
    },
    getQrcode() {
      accountService.getQrcode().then(data => {
        this.qrcodeImage.ios = data.ios;
        this.qrcodeImage.android = data.android;
      });
    },
    getNotice() {
      accountService.getNotice().then(data => {
        this.calcContentLen(data.content);
        this.noticeInfo.content = data.content ? data.content : "";
        this.noticeInfo.attach = data.attach ? data.attach : "";
        this.noticeInfo.file_name = data.file_name ? data.file_name : "";
        this.noticeInfo.create_time = data.create_time ? data.create_time : "";
        this.noticeInfo.title = data.title ? data.title : "最新公告";
      });
    },
    calcContentLen(content) {
      let contentWid = 0;
      if (content !== "" && content.length > 0) {
        var span = document.createElement("span");
        var width = span.offsetWidth;
        span.style.visibility = "hidden";
        span.style.fontSize = "12px";
        span.style.fontFamily =
          '"Microsoft Yahei", Tahoma, Helvetica, Arial, 宋体, sans-serif';
        span.style.display = "inline-block";
        document.body.appendChild(span);
        if (typeof span.textContent != "undefined") {
          span.textContent = content;
        } else {
          span.innerText = content;
        }
        contentWid = parseFloat(window.getComputedStyle(span).width) - width;
        document.body.removeChild(span);
      }
      this.noticeInfo.contentWid = contentWid;
    }
  },
  watch: {
    "user.username": {
      handler: function() {
        this.error = "";
        accountService
          .getUserIdentity({ username: this.user.username })
          .then(data => {
            this.is_director = data.is_director;
            this.is_manage = data.is_manage;
            this.is_admin = data.is_admin;
            this.is_general = true;
          });
      },
      deep: true
    }
  }
};
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
@import "../assets/css/login.scss";
</style>
