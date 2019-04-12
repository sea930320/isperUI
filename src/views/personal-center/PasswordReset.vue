<template>
  <div class="password-reset">
    <b-card no-body>
      <b-form @submit.prevent="updatePassword">
        <b-card-header>
          <PersonalCenterTab activeTab="1"/>
        </b-card-header>
        <b-card-body class="text-left">
          <b-form-group
            label-cols="4"
            label-cols-lg="2"
            label="Old Password *"
            :description="err['old-p']"
          >
            <b-form-input
              type="text"
              v-model="password.old"
              name="old-password"
              v-validate="'required|min:5'"
            />
          </b-form-group>
          <b-form-group
            label-cols="4"
            label-cols-lg="2"
            label="New Password *"
            :description="err['new-p']"
          >
            <b-form-input
              type="text"
              v-model="password.new"
              name="new-password"
              v-validate="'required|min:5|max:35'"
            />
          </b-form-group>
          <b-form-group
            label-cols="4"
            label-cols-lg="2"
            label="New Password Confirmation *"
            :description="err['new-p-c']"
          >
            <b-form-input
              type="text"
              v-model="password.new_confirm"
              name="new-password-confirmation"
            />
          </b-form-group>
          <b-form-group label-cols="4" label-cols-lg="2" label="Verification Code *">
            <b-input-group>
              <b-form-input
                type="text"
                v-model="password.verification_code"
                name="verification-code"
              />
              <b-input-group-append is-text>{{maskedPhone}}</b-input-group-append>
              <b-input-group-append>
                <b-button variant="primary" @click="sendVerificationCode">Send</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-card-body>
        <b-card-footer class="text-muted">
          <b-button class="mr-2" type="submit" variant="primary">Update</b-button>
          <b-button type="button">Cancel</b-button>
        </b-card-footer>
      </b-form>
    </b-card>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import accountService from "@/services/accountService";
// import { STORAGE_KEY_USER } from "@/store/storageKey";
import PersonalCenterTab from "@/components/personal-center/PersonalCenterTab";

export default {
  name: "personal-info",
  components: { PersonalCenterTab },
  data() {
    return {
      password: {
        old: null,
        new: null,
        new_confirm: null,
        verification_code: null
      },
      err: {}
    };
  },
  computed: {
    ...mapState(["userInfo"]),
    maskedPhone() {
      if (!this.userInfo.phone) {
        return "You need to input valid phone number";
      }
      var x = this.userInfo.phone
        .replace(/\D/g, "")
        .match(/(\d{3})(\d{6})(\d{2})/);
      return x[1] + "******" + x[3];
    }
  },
  created() {},
  methods: {
    ...mapActions({
      loginAction: "login"
    }),
    notSameValidation() {
      if (this.password.new != this.password.new_confirm)
        return "Password Confirmation does not match";
      return "";
    },
    validate() {
      this.err = Object.assign({}, this.err, {
        "old-p": this.errors.has("old-password")
          ? this.errors
              .first("old-password")
              .replace("old-password", "Old Password")
          : "",
        "new-p": this.errors.has("new-password")
          ? this.errors
              .first("new-password")
              .replace("new-password", "New Password")
          : "",
        "new-p-c": this.notSameValidation()
      });
      if (this.err["old-p"] || this.err["new-p"] || this.err["new-p-c"]) {
        return false;
      } else return true;
    },
    updatePassword() {
      if (!this.userInfo.id) {
        alert("You have no permission");
        return;
      }
      this.$validator
        .validateAll()
        .then(() => {
          if (!this.validate()) {
            return;
          }
          this.password.id = this.userInfo.id;
          this.password.login_type = this.userInfo.role;
          accountService.updatePassword(this.password).then(() => {
            this.$toasted.success("Password Successfully updated");
          });
        })
        .catch(() => {
          this.validate();
        });
    },
    sendVerificationCode() {
      accountService.sendCode({
        to: this.userInfo.phone
      }).then(() => {
        this.$toasted.success("Password Successfully updated");
      });
    }
  }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.password-reset {
  .text-muted.form-text {
    color: #dc3545 !important;
  }
}
</style>