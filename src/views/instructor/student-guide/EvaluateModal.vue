<template>
  <b-modal
    class="evaluate-modal"
    v-model="visible"
    centered
    title="新建队员"
    size="xl"
    :hide-footer="true"
    scrollable
  >
    <div class="team-info" v-if="stwb.team">
      <h3>团 队 信 息</h3>
      <b-row class="text-left">
        <b-col>
          <label class="info-label">团队名称:</label>
          <span class="info-content">{{stwb.team.name}}</span>
        </b-col>
        <b-col>
          <label class="info-label">开放邀请:</label>
          <span class="info-content">{{stwb.team.type == 0 ? "开放": "不开放"}}</span>
        </b-col>
        <b-col>
          <label class="info-label">队长:</label>
          <span class="info-content">{{stwb.team.team_leader && stwb.team.team_leader.name}}</span>
        </b-col>
        <b-col>
          <label class="info-label">创建时间:</label>
          <span class="info-content">{{stwb.team.create_time}}</span>
        </b-col>
      </b-row>
    </div>
    <div class="business-info" v-if="stwb.business">
      <h3>业 务 信 息</h3>
      <b-row class="text-left">
        <b-col>
          <label class="info-label">业务名称:</label>
          <span class="info-content">{{stwb.business.name}}</span>
        </b-col>
        <b-col>
          <label class="info-label">业务办理单位:</label>
          <span class="info-content">{{stwb.business.company.name}}</span>
        </b-col>
        <b-col>
          <label class="info-label">业务状态:</label>
          <span class="info-content">{{stwb.business.status | businessStatus}}</span>
        </b-col>
        <b-col>
          <label class="info-label">启动时间:</label>
          <span class="info-content">{{stwb.business.create_time}}</span>
        </b-col>
      </b-row>
    </div>
    <div class="eval-team text-left mt-2">
      <b-form-textarea id="team-eval" v-model="teamEval" placeholder="团队评论" rows="3" max-rows="6"></b-form-textarea>
      <table
        class="table table-green table-border table-tac table-hover mt-2"
        v-if="stwb.team && stwb.team.members"
      >
        <thead>
          <tr>
            <th>姓名</th>
            <th>学号</th>
            <th>性别</th>
            <th>评论</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(member, index) in stwb.team.members" :key="index">
            <td>{{member.name}}</td>
            <td>{{member.student_id}}</td>
            <td>{{member.gender | gender}}</td>
            <td>
              <b-form-input v-model="member.eval" placeholder="评论"></b-form-input>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <b-button class="styledBtn float-center" @click="submitEval()">提交</b-button>
  </b-modal>
</template>

<script>
import { businessStatus, gender } from "@/filters/fun";
import studentService from "@/services/studentService";

import _ from "lodash";
export default {
  name: "evaluateBusiness",
  components: {},
  filters: { businessStatus, gender },
  data() {
    return {
      stwb: {},
      visible: false,
      teamEval: ""
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    }
  },
  watch: {
    visible(val) {
      if (!val) {
        this.stwb = {};
        this.teamEval = "";
      }
    }
  },
  mounted() {
    this.$parent.$on("openEvaluateModal", stwb => {
      if (!stwb) {
        this.visible = false;
        return;
      }
      console.log(stwb);
      this.visible = true;
      this.stwb = _.clone(stwb, true);
      this.teamEval = this.stwb.teamEval;
    });
  },
  methods: {
    submitEval() {
      let param = {
        id: this.stwb.id,
        teamEval: this.teamEval,
        member_evals: []
      };
      for (let index in this.stwb.team.members) {
        let member = this.stwb.team.members[index];
        param.member_evals.push({
          id: member.id,
          eval: member.eval
        });
      }
      param.member_evals = JSON.stringify(param.member_evals);
      this.run();
      studentService
        .teamEvalByInstructor(param)
        .then(() => {
          this.$toasted.success("成功");
          this.$emit("data-ready");
          this.$emit("success");
          this.visible = false;
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    }
  }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.evaluate-modal {
  .info-label {
    font-weight: 600;
    margin-right: 10px;
  }
  .team-info,
  .business-info {
    font-size: 15px;
    border: 1px solid #dedede;
    margin-bottom: 10px;
    padding: 10px 5px;
  }
}
</style>
