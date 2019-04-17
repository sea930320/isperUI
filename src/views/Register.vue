<template>
  <div class="register-container">
    <TopHeader>
      <template v-slot:pageTitle>首页界面——注册（新设计）(not working with api)</template>
    </TopHeader>
    <b-container>
      <b-card no-body>
        <b-form @submit.prevent="register">
          <b-card-header>
            <h4>个人信息</h4>
          </b-card-header>
          <b-card-body class="text-left">
            <b-form-group label-cols="4" label-cols-lg="2" label="姓 名" label-for="userName">
              <b-form-input
                type="text"
                v-model="user.name"
                placeholder="请输入姓名"
                name="userName"
                required
              />
            </b-form-group>
            <b-form-group
              label-cols="4"
              label-cols-lg="2"
              label="手 机"
              label-for="phoneNumber"
            >
              <b-form-input
                type="text"
                v-model="user.phone"
                placeholder="请输入手机号"
                name="phoneNumber"
              />
            </b-form-group>
            <b-form-group label-cols="4" label-cols-lg="2" label="QQ" label-for="qqID">
              <b-form-input type="text" v-model="user.qq" placeholder="请输入QQ" name="qqID"/>
            </b-form-group>
            <b-form-group label-cols="4" label-cols-lg="2" label="头像" label-for="avatar">
              <div @click="toggleShow" style="cursor:pointer; width: 100px">
                <b-img-lazy
                  thumbnail
                  rounded="circle"
                  v-if="user.avatar"
                  :src="user.avatar"
                  alt="Avatar"
                  class="avatar-img"
                />
                <div v-else class="avatar-img"/>
              </div>
            </b-form-group>

            <div class="text-center my-3" style="border-bottom: 1px solid gray;">
              <h5>登录信息</h5>
            </div>
            <b-form-group label-cols="4" label-cols-lg="2" label="用户名" label-for="userID">
              <b-form-input
                type="text"
                v-model="user.username"
                placeholder="请输入用户名"
                name="userID"
                required
              />
            </b-form-group>
            <!-- <b-form-group
              label-cols="4"
              label-cols-lg="2"
              label="Company"
              label-for="company"
            >
              <b-form-input
                type="text"
                v-model="user.company"
                placeholder="Input Company"
                name="company"
              />
            </b-form-group>-->
            <b-form-group label-cols="4" label-cols-lg="2" label="密 码" label-for="password">
              <b-form-input
                type="text"
                v-model="user.password"
                placeholder="请输入密码"
                name="password"
                required
              />
            </b-form-group>
            <b-form-group
              label-cols="4"
              label-cols-lg="2"
              label="密码确认"
              label-for="password_confirmation"
            >
              <b-form-input
                type="text"
                v-model="user.passwordConfirmation"
                placeholder="请再次输入密码"
                name="password_confirmation"
                required
              />
            </b-form-group>
          </b-card-body>
          <b-card-footer class="text-muted">
            <b-button type="submit" variant="primary" :disabled="true">注册</b-button>
          </b-card-footer>
        </b-form>
      </b-card>

      <ImageUpload
        field="img"
        @crop-success="cropSuccess"
        @crop-upload-success="cropUploadSuccess"
        @crop-upload-fail="cropUploadFail"
        v-model="avatarOption.show"
        :width="100"
        :height="100"
        url="/upload"
        :params="avatarOption.params"
        :headers="avatarOption.headers"
        img-format="png"
        langType="en"
      ></ImageUpload>
    </b-container>
  </div>
</template>

<script>
import TopHeader from "@/components/header/TopHeader";
import ImageUpload from "vue-image-crop-upload";

export default {
  name: "register",
  components: { TopHeader, ImageUpload },
  data() {
    return {
      user: {
        username: "",
        name: "",
        password: "",
        passwordConfirmation: "",
        phone: "",
        qq: "",
        company: "",
        avatar: ""
      },
      avatarOption: {
        show: false,
        params: {},
        headers: {
          smail: "*_~"
        }
      }
    };
  },
  methods: {
    register() {},
    toggleShow() {
      this.avatarOption.show = !this.avatarOption.show;
    },
    cropSuccess(imgDataUrl) {
      this.user.avatar = imgDataUrl;
    },
    // eslint-disable-next-line
    cropUploadSuccess(jsonData, field) {},
    // eslint-disable-next-line
    cropUploadFail(status, field) {}
  }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.register-container {
  .avatar-img {
    width: 100px;
    height: 100px;
    border: 1px solid grey;
  }
}
</style>