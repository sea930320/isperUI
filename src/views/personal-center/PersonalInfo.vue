<template>
  <div class="personal-info">
    <b-card no-body>
      <b-form @submit.prevent="updateInfo">
        <b-card-header>
          <PersonalCenterTab activeTab="0"/>
        </b-card-header>
        <b-card-body class="text-left">
          <b-form-group label-cols="4" label-cols-lg="2" label="User Name *" label-for="userName">
            <b-form-input type="text" v-model="userInfo.name" name="userName" required/>
          </b-form-group>
          <b-form-group label-cols="4" label-cols-lg="2" label="User ID *" label-for="userId">
            <b-form-input type="text" v-model="userInfo.username" name="userId" required/>
          </b-form-group>
          <b-form-group
            label-cols="4"
            label-cols-lg="2"
            label="Phone Number *"
            label-for="phoneNumber"
          >
            <b-input-group prepend="+86">
              <b-form-input
                type="text"
                v-model="userInfo.phone"
                name="phoneNumber"
                @change="phoneVerified = false"
                required
              />
            </b-input-group>
            <b-input-group class="mt-2">
              <b-form-input placeholder="Verification Code"></b-form-input>
              <b-input-group-append>
                <b-button variant="primary">Send</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
          <b-form-group label-cols="4" label-cols-lg="2" label="QQ ID" label-for="qqID">
            <b-form-input type="text" v-model="userInfo.qq" name="qqID"/>
          </b-form-group>
          <b-form-group label-cols="4" label-cols-lg="2" label="Avatar" label-for="avatar">
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
          <b-button class="mr-2" type="submit" variant="primary" :disabled="!validate">Update</b-button>
          <b-button type="button">Cancel</b-button>
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
      phoneVerified: false,
      rootPath: process.env.VUE_APP_ENDPOINT,
      apiRootPath: process.env.VUE_APP_API_ENDPOINT,
      avatarOption: {
        show: false,
        params: {},
        headers: {
          smail: "*_~"
        }
      }
    };
  },
  computed: {
    ...mapState(["userInfo"]),
    validate() {
      if (
        !this.userInfo.id ||
        !this.userInfo.name ||
        !this.userInfo.username ||
        !this.userInfo.phone /*||!this.phoneVerified*/
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
      accountService.updateAccount(this.userInfo).then(() => {
        this.$cookie.set(STORAGE_KEY_USER, JSON.stringify(this.userInfo));
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
    cropUploadFail(status, field) {}
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