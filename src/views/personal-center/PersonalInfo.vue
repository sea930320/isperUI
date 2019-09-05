<template>
  <div class="personal-info container" v-if="user">
    <PersonalCenterTab activeTab="0" />
    <loading v-if="isRunning"></loading>
    <b-form @submit.prevent="updateInfo" class="cardDiv">
      <b-form-group label-cols="4" label-cols-lg="2" label="姓名 *" label-for="userName">
        <b-form-input type="text" v-model="user.name" name="userName" required />
      </b-form-group>
      <b-form-group label-cols="4" label-cols-lg="2" label="用户名 *" label-for="userId">
        <b-form-input type="text" v-model="user.username" name="userId" required />
      </b-form-group>
      <b-form-group label-cols="4" label-cols-lg="2" label="手机 *" label-for="phoneNumber">
        <b-input-group prepend="+86">
          <b-form-input
            type="text"
            v-model="user.phone"
            name="phoneNumber"
            :disabled="session_expire_time > 0 || sendLabel !='获取'"
            required
          />
        </b-input-group>
        <b-input-group class="mt-2" v-if="user.phone != userInfo.phone">
          <b-form-input type="number" v-model="verificationCode" placeholder="手机验证码"></b-form-input>
          <b-input-group-append>
            <b-button
              variant="primary"
              @click="sendVerificationCode"
              :disabled="session_expire_time > 0 || sendLabel !='获取'"
            >{{(session_expire_time &lt;= 0) ? sendLabel: session_expire_time + ' s'}}</b-button>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>
      <b-form-group label-cols="4" label-cols-lg="2" label="QQ" label-for="qqID">
        <b-form-input type="text" v-model="user.qq" name="qqID" />
      </b-form-group>
      <b-form-group label-cols="4" label-cols-lg="2" label="头像" label-for="avatar">
        <div @click="toggleShow" style="cursor:pointer; width: 100px">
          <b-img-lazy
            thumbnail
            rounded="circle"
            v-if="user.avatar"
            :src="rootPath + user.avatar"
            alt="Avatar"
            class="avatar-img"
          />
          <div v-else class="avatar-img" />
        </div>
      </b-form-group>

      <b-form-group
        label-cols="4"
        label-cols-lg="2"
        label="所在集群"
        label-for="group_name"
        v-if="user.manager_info && user.manager_info.group_name"
      >
        <b-form-input
          type="text"
          v-model="user.manager_info.group_name"
          name="group_name"
          disabled
        />
      </b-form-group>
      <b-form-group
        label-cols="4"
        label-cols-lg="2"
        label="单位"
        label-for="company_name"
        v-if="user.manager_info && user.manager_info.company_name"
      >
        <b-form-input
          type="text"
          v-model="user.manager_info.company_name"
          name="company_name"
          disabled
        />
      </b-form-group>
      <b-form-group
        label-cols="4"
        label-cols-lg="2"
        label="部门"
        label-for="part_name"
        v-if="user.manager_info && user.manager_info.part_name"
      >
        <b-form-input type="text" v-model="user.manager_info.part_name" name="part_name" disabled />
      </b-form-group>
      <b-form-group
        id="input-group-10"
        label-cols="4"
        label-cols-lg="2"
        label="事务类型"
        label-for="office_types"
        v-if="[4,8 ].includes(user.role)"
      >
        <vue-tags-input
          v-model="tag"
          :tags="tags"
          :autocomplete-items="filteredTypes"
          :add-only-from-autocomplete="true"
          :autocomplete-min-length="0"
          @tags-changed="newTags => tags = newTags"
          placeholder="添加标签"
        />
      </b-form-group>
      <b-button class="mr-2" type="submit" variant="primary" :disabled="!validate">修改</b-button>
      <b-button type="button" @click="resetInfo">取消</b-button>
    </b-form>

    <ImageUpload
      field="img"
      :url="apiRootPath + '/account/avatar-img/update?id='+user.id"
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
      :withCredentials="true"
    ></ImageUpload>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import ImageUpload from "vue-image-crop-upload";
import accountService from "@/services/accountService";
import GroupService from "@/services/groupService";
import { STORAGE_KEY_USER } from "@/store/storageKey";
import PersonalCenterTab from "@/components/personal-center/PersonalCenterTab";
import Loading from "@/components/loading/Loading";
import VueTagsInput from "@johmun/vue-tags-input";

export default {
  name: "personal-info",
  components: { ImageUpload, PersonalCenterTab, Loading, VueTagsInput },
  data() {
    return {
      tag: "",
      tags: [],
      officeTypes: [],
      autocompleteItems: [],
      rootPath: process.env.VUE_APP_ENDPOINT,
      apiRootPath: process.env.VUE_APP_API_ENDPOINT,

      editInstructor: false,
      user: {},
      avatarOption: {
        show: false,
        params: {},
        headers: {
          // smail: "*_~"
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
    filteredTypes() {
      return this.autocompleteItems.filter(i => {
        return i.text.toLowerCase().indexOf(this.tag.toLowerCase()) !== -1;
      });
    },
    validate() {
      if (!this.verificationCode && this.user.phone != this.userInfo.phone)
        return false;
      if (
        !this.user.id ||
        !this.user.name ||
        !this.user.username ||
        !this.user.phone
      ) {
        return false;
      }
      return true;
    }
  },
  created() {
    this.$nextTick(() => {
      this.user = { ...this.userInfo };
      this.tags = this.user.office_items.map(item => {
        return { text: item.name };
      });
      this.getInstructorItemList();
    });
  },
  methods: {
    ...mapActions({
      loginAction: "login"
    }),
    getInstructorItemList() {
      this.run();
      GroupService.getInstructorItemList({})
        .then(res => {
          this.officeTypes = res.results;
          this.autocompleteItems = res.results.map(item => {
            return { text: item.text };
          });
          this.$emit("data-ready");
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },
    updateInfo() {
      if (!this.validate) {
        return;
      }
      this.run();
      let user = Object.assign({}, this.user);
      if ([4, 8].includes(this.user.role)) {
        let selectedTexts = this.tags.map(item => item.text);
        let tagsIndexs = this.officeTypes
          .filter(item => selectedTexts.includes(item.text))
          .map(i => i.id);
        user.tagsIndexs = JSON.stringify(tagsIndexs);
      }
      user.verification_code = this.verificationCode;
      accountService
        .updateAccount(user)
        .then(() => {
          this.session_expire_time = 0;
          this.verificationCode = "";
          if (this.timer) {
            clearInterval(this.timer);
          }
          this.$cookie.set(STORAGE_KEY_USER, JSON.stringify(this.user));
          this.loginAction(this.user);
          this.$emit("data-ready");
          this.$toasted.success("修改成功");
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },
    resetInfo() {
      this.user = { ...this.userInfo };
    },
    toggleShow() {
      this.avatarOption.show = !this.avatarOption.show;
    },
    // eslint-disable-next-line
    cropSuccess(imgDataUrl) {},
    // eslint-disable-next-line
    cropUploadSuccess(jsonData, field) {
      this.user.avatar = jsonData.d.avatar_path;
      this.$cookie.set(STORAGE_KEY_USER, JSON.stringify(this.user));
    },
    // eslint-disable-next-line
    cropUploadFail(status, field) {},
    sendVerificationCode() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.sendLabel = "发送中...";
      accountService
        .sendCode({
          to: this.user.phone
        })
        .then(
          () => {
            this.$toasted.success("验证码已发送到手机");
            this.startTimer();
            this.sendLabel = "获取";
          },
          () => {
            this.sendLabel = "获取";
          }
        )
        .catch(() => {
          this.sendLabel = "获取";
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