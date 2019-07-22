<template>
  <div>
    <loading v-if="isRunning"></loading>
    <b-modal centered v-model="visible" title="团队成员" size="lg" :hide-footer="true" scrollable>
      <b-container fluid class="student-team-modal">
        <div v-for="(team, index) in team.list" :key="index" class="my-2">
          <b-row v-if="index==0">
            <b-col class="vertical-center">团队队长: &nbsp;{{team.leader.username}}</b-col>
            <b-col class="vertical-center">指导者: &nbsp;{{team.teacher.username}}</b-col>
          </b-row>
          <b-table :items="team.members" small hover :fields="columns" head-variant v-if="index==0">
            <template slot="sn" slot-scope="row">{{ row.index + 1 }}</template>
            <template slot="name" slot-scope="row">{{row.item.name}}</template>
            <template slot="username" slot-scope="row">{{row.item.username}}</template>
            <template slot="student_id" slot-scope="row">{{row.item.student_id}}</template>
            <template slot="class_name" slot-scope="row">{{row.item.class && row.item.class.name}}</template>
            <template slot="gender" slot-scope="row">{{row.item.gender | gender}}</template>
          </b-table>
        </div>
      </b-container>
    </b-modal>
  </div>
</template>
<script>
import Loading from "@/components/loading/Loading";
import studentService from "@/services/studentService";
import { businessStatus, gender } from "@/filters/fun";

export default {
  components: {
    Loading
  },
  filters: { businessStatus, gender },
  data() {
    return {
      visible: false,
      queryParam: {
        type: 0,
        page: 1,
        size: 15
      },
      queryDebounceParam: {
        search: ""
      },
      business_id: null,
      team: {
        list: [],
        total: 0
      },
      columns: {
        sn: {
          label: "序号",
          sortable: false,
          class: "text-left pl-3 field-sn"
        },
        name: {
          label: "姓名",
          sortable: false,
          class: "text-center field-name"
        },
        username: {
          label: "学号",
          sortable: false,
          class: "text-center field-username"
        },
        class_name: {
          label: "班级",
          sortable: false,
          class: "text-center field-class_name"
        },
        gender: {
          label: "性别",
          sortable: false,
          class: "text-center field-gender"
        }
      }
    };
  },
  created() {
    this.$parent.$on("openStudentTeamDetailModal", param => {
      if (!param.id) {
        this.visible = false;
        return;
      }
      this.business_id = param.id;
      this.run();
      studentService
        .businessTeamDetail({
          business_id: this.business_id
        })
        .then(data => {
          this.$set(this.team, "list", data.results);
          this.$emit("data-ready");
        })
        .catch(() => {
          this.$emit("data-failed");
        });
      this.visible = true;
      this.team.id = param.id;
    });
  },
  computed: {},
  methods: {
    init() {}
  },
  watch: {}
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.student-team-modal {
}
</style>
