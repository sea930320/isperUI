<template>
  <div class="personal-info">
    <b-card no-body>
      <b-form @submit.prevent="updateInfo">
        <b-card-header>
          <PersonalCenterTab activeTab="0"/>
        </b-card-header>
        <b-card-body class="text-left">
          <b-form-group label-cols="4" label-cols-lg="2" label="姓名 *" label-for="userName">
            <b-form-input type="text" v-model="userInfo.name" name="userName" required/>
          </b-form-group>
          <b-form-group label-cols="4" label-cols-lg="2" label="用户名 *" label-for="userId">
            <b-form-input type="text" v-model="userInfo.username" name="userId" required/>
          </b-form-group>
          <b-form-group
            label-cols="4"
            label-cols-lg="2"
            label="手机 *"
            label-for="phoneNumber"
          >
            <b-input-group prepend="+86">
              <b-form-input
                type="text"
                v-model="userInfo.phone"
                name="phoneNumber"
                :disabled="session_expire_time > 0 || sendLabel !='Send'"
                required
              />
            </b-input-group>
            <b-input-group class="mt-2">
              <b-form-input
                type="number"
                v-model="verificationCode"
                placeholder="手机验证码"
              ></b-form-input>
              <b-input-group-append>
                <b-button
                  variant="primary"
                  @click="sendVerificationCode"
                  :disabled="session_expire_time > 0 || sendLabel !='Send'"
                >{{(session_expire_time &lt;= 0) ? sendLabel: session_expire_time + ' s'}}</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
          <b-form-group label-cols="4" label-cols-lg="2" label="QQ" label-for="qqID">
            <b-form-input type="text" v-model="userInfo.qq" name="qqID"/>
          </b-form-group>
          <b-form-group label-cols="4" label-cols-lg="2" label="头像" label-for="avatar">
            <div @click="toggleShow" style="cursor:pointer; width: 100px">
              <b-img-lazy
                thumbnail
                rounded="circle"
                v-if="userInfo.avatar"
                :src="rootPath + userInfo.avatar"
                alt="Avatar"
                class="avatar-img"
              />
              <div v-else class="avatar-img"/>
            </div>
          </b-form-group>
        </b-card-body>
        <b-card-footer class="text-muted">
          <b-button class="mr-2" type="submit" variant="primary" :disabled="!validate">修改</b-button>
          <b-button type="button">取消</b-button>
        </b-card-footer>
      </b-form>
    </b-card>

    <ImageUpload
      field="img"
      :url="apiRootPath + '/account/avatar-img/update?id='+userInfo.id"
      @crop-success="cropSuccess"
      @crop-upload-success="cropUploadSuccess"
      @crop-upload-fail="cropUploadFail"
      v-model="avatarOption.show"
      :width="100"
      :height="100"
      :params="avatarOption.params"
      :headers="avatarOption.headers"
      img-format="png"
      langType="en"
    ></ImageUpload>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import ImageUpload from "vue-image-crop-upload";
import accountService from "@/services/accountService";
import { STORAGE_KEY_USER } from "@/store/storageKey";
import PersonalCenterTab from "@/components/personal-center/PersonalCenterTab";

export default {
  name: "personal-info",
  components: { ImageUpload, PersonalCenterTab },
  data() {
    return {
      rootPath: process.env.VUE_APP_ENDPOINT,
      apiRootPath: process.env.VUE_APP_API_ENDPOINT,
      avatarOption: {
        show: false,
        params: {},
        headers: {
          smail: "*_~"
        }
      },
      session_expire_time: 0,
      sendLabel: "获取",
      timer: null,
      verificationCode: ""
    };
  },
  computed: {
    ...mapState(["userInfo"]),
    validate() {
      if (
        !this.userInfo.id ||
        !this.userInfo.name ||
        !this.userInfo.username ||
        !this.userInfo.phone ||
        !this.verificationCode
      ) {
        return false;
      }
      return true;
    }
  },
  created() {},
  methods: {
    ...mapActions({
      loginAction: "login"
    }),
    updateInfo() {
      if (!this.validate) {
        return;
      }
      let user = Object.assign({}, this.userInfo);
      user.verification_code = this.verificationCode;
      accountService.updateAccount(user).then(() => {
        this.session_expire_time = 0;
        this.verificationCode = ''
        if (this.timer) {
          clearInterval(this.timer);
        }
        this.$cookie.set(STORAGE_KEY_USER, JSON.stringify(user));
        this.$toasted.success("Account Successfully updated");
      });
    },
    toggleShow() {
      this.avatarOption.show = !this.avatarOption.show;
    },
    // eslint-disable-next-line
    cropSuccess(imgDataUrl) {},
    // eslint-disable-next-line
    cropUploadSuccess(jsonData, field) {
      this.userInfo.avatar = jsonData.d.avatar_path;
      this.$cookie.set(STORAGE_KEY_USER, JSON.stringify(this.userInfo));
    },
    // eslint-disable-next-line
    cropUploadFail(status, field) {},
    sendVerificationCode() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.sendLabel = "Sending...";
      accountService
        .sendCode({
          to: this.userInfo.phone
        })
        .then(
          () => {
            this.$toasted.success("Please check your phone");
            this.startTimer();
            this.sendLabel = "Send";
          },
          () => {
            this.sendLabel = "Send";
          }
        )
        .catch(() => {
          this.sendLabel = "Send";
        });
    },
    startTimer() {
      this.session_expire_time = 300;
      this.timer = setInterval(() => {
        if (this.session_expire_time <= 0) {
          this.session_expire_time = 0;
          clearInterval(this.timer);
          return;
        }
        this.session_expire_time--;
      }, 1000);
    }
  }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.personal-info {
  .avatar-img {
    width: 100px;
    height: 100px;
    border: 1px solid grey;
  }
}
</style>