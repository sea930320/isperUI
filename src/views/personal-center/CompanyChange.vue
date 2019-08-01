<template>
  <div class="company-change container">
    <PersonalCenterTab activeTab="4" />
    <loading v-if="isRunning"></loading>
    <div class="cardDiv">
      <div class="mt-4 mb-2 current-name">
        <label style="font-weight: 600">本单位:</label>
        <span class="ml-3">{{userInfo.manager_info.company_name}}</span>
      </div>
      <b-form @submit.prevent="companyChangeRequest" v-if="!lastRequest.id">
        <b-form-group label-cols="4" label-cols-lg="2" label="集群 *" label-for="companyName">
          <b-form-select v-model="selectedCompany" :options="companys"></b-form-select>
        </b-form-group>
        <b-form-group label-cols="4" label-cols-lg="2" label="申请理由" label-for="reason">
          <b-form-textarea v-model="reason" rows="3" max-rows="6"></b-form-textarea>
        </b-form-group>
        <b-button class="mr-2" type="submit" variant="primary">申请变更</b-button>
      </b-form>
      <div v-else>
        <div class="my-3">您已经申请了单位变更</div>
        <div>
          <label>申请单位:</label>
          <span class="ml-3">{{lastRequest.target.name}}</span>
        </div>
        <b-row>
          <b-col class="text-right">
            <label>本单位申请状态:</label>
            <b-badge class="ml-3" variant="success" v-if="lastRequest.sAgree==1">同意</b-badge>
            <b-badge class="ml-3" variant="warning" v-else>等待...</b-badge>
          </b-col>
          <b-col class="text-left">
            <label>目标单位申请状态:</label>
            <b-badge class="ml-3" variant="success" v-if="lastRequest.tAgree==1">同意</b-badge>
            <b-badge class="ml-3" variant="warning" v-else>等待...</b-badge>
          </b-col>
        </b-row>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import PersonalCenterTab from "@/components/personal-center/PersonalCenterTab";
import Loading from "@/components/loading/Loading";
import groupService from "@/services/groupService";

export default {
  name: "personal-info",
  components: { PersonalCenterTab, Loading },
  data() {
    return {
      companys: [],
      selectedCompany: null,
      reason: "",
      lastRequest: {}
    };
  },
  computed: {
    ...mapState(["userInfo"])
  },
  created() {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    init() {
      this.run();
      let apis = [
        groupService.getCompanyListOfGroup({
          groupID: this.userInfo.manager_info.group_id
        }),
        groupService.companyChangeInfo()
      ];
      Promise.all(apis)
        .then(datas => {
          this.companys = datas[0].results.filter(company => {
            return company.id != this.userInfo.manager_info.company_id;
          });
          this.lastRequest = datas[1];
          this.$emit("data-ready");
        })
        .catch(() => {
          this.$emit("data-field");
        });
    },
    companyChangeRequest() {
      this.run();
      groupService
        .companyChangeRequest({
          company_id: this.selectedCompany,
          reason: this.reason
        })
        .then(() => {
          this.init();
        })
        .catch(() => {
          this.$emit("data-field");
        });
    }
  }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.company-change {
  .current-name {
    display: inline-block;
    border-bottom: 1px solid #d9dde2;
    padding: 0 50px;
  }
}
</style>