<template>
  <div class="student-guide-index container">
    <loading v-if="isRunning"></loading>
    <b-row>
      <b-col lg="3" md="3" sm="12" v-if="[0,1].includes(type)">
        <div class="cardDiv course-selector p-0" style="background:#c7dbff">
          <b-list-group class="d-inline-flex m-0 p-0 w-100">
            <b-list-group-item class="course-name mb-1">课堂名称与课外学习</b-list-group-item>
            <template v-for="(course, index) in courses">
              <b-list-group-item
                class="course-item"
                :key="'courseIndex' + index"
                :id="'courseIndex' + index"
                @click="selectCourse(course, index)"
                :active="activeItemId==='courseIndex' + index"
              >{{course.courseName}}</b-list-group-item>
            </template>
          </b-list-group>
        </div>
      </b-col>
      <b-col :lg="[0,1].includes(type) ? 9:12" sm="12">
        <b-row no-gutters>
          <b-col>
            <b-form-group style="margin: 18px 0 0" class="text-left">
              <b-form-radio-group
                v-model="type"
                :options="options"
                buttons
                button-variant="primary"
                size="sm"
              ></b-form-radio-group>
            </b-form-group>
          </b-col>
          <b-col class="text-right" v-if="type==1">
            <b-button-group style="margin: 18px 0 0" class="text-right">
              <b-button size="sm" class="styledBtn" @click="newTeam">新建队员</b-button>
            </b-button-group>
          </b-col>
        </b-row>
        <template v-if="type==0">
          <div class="cardDiv">
            <b-table
              :items="studentWatchingList.list"
              responsive
              small
              hover
              :fields="columns1"
              head-variant
            >
              <template slot="sn" slot-scope="row">{{ row.item.id }}</template>
              <template slot="name" slot-scope="row">{{row.item.business.name}}</template>
              <template
                slot="company_name"
                slot-scope="row"
              >{{row.item.business.company && row.item.business.company.name}}</template>
              <template slot="team_name" slot-scope="row">{{row.item.team.name}}</template>
              <template slot="create_time" slot-scope="row">{{row.item.business.create_time}}</template>
              <template slot="status" slot-scope="row">{{row.item.business.status| businessStatus}}</template>
              <template slot="action" slot-scope="row">
                <b-button
                  class="styledBtn"
                  variant="outline-primary"
                  v-if="row.item.business.status==9"
                  @click="evaluate(row.item)"
                >评论</b-button>
                <b-button
                  class="styledBtn"
                  variant="outline-primary"
                  v-if="row.item.business.status==2"
                  :to="'/student/enter-business/' + row.item.business.id"
                >进入指导</b-button>
              </template>
            </b-table>
          </div>
          <div class="cardDiv">
            <b-row class="justify-content-center row-margin-tweak">
              <b-pagination
                :size="template_size"
                :total-rows="studentWatchingList.total"
                :per-page="queryWatchingParam.size"
                limit="5"
                v-model="queryWatchingParam.page"
              />
            </b-row>
          </div>
        </template>
        <template v-else>
          <div class="cardDiv">
            <b-table :items="teamList.list" responsive small hover :fields="columns2" head-variant>
              <template slot="sn" slot-scope="row">{{ row.item.id }}</template>
              <template slot="name" slot-scope="row">{{row.item.name}}</template>
              <template slot="team_leader" slot-scope="row">{{row.item.team_leader.name}}</template>
              <template slot="create_time" slot-scope="row">{{row.item.create_time}}</template>
              <template slot="status" slot-scope="row">{{row.item.type ?"开放":"不开放"}}</template>
              <template slot="action" slot-scope="row">
                <b-button-group class>
                  <b-button
                    class="styledBtn"
                    @click="teamMemberModal(row.item)"
                    variant="outline-primary"
                  >队员管理</b-button>
                  <b-button
                    class="styledBtn"
                    variant="outline-primary"
                    @click="removeTeam(row.item)"
                  >删除</b-button>
                  <b-button
                    class="styledBtn"
                    variant="outline-primary"
                    @click="showWatchingBusinesses(row.item)"
                  >查看关注的业务</b-button>
                </b-button-group>
              </template>
            </b-table>
          </div>
          <div class="cardDiv">
            <b-row class="justify-content-center row-margin-tweak">
              <b-pagination
                :size="template_size"
                :total-rows="teamList.total"
                :per-page="queryTeamParam.size"
                limit="5"
                v-model="queryTeamParam.page"
              />
            </b-row>
          </div>
        </template>
      </b-col>
    </b-row>
    <b-modal v-model="teamModal" centered title="队员管理" size="xl" :hide-footer="true">
      <b-button-group class="float-right mb-3">
        <b-button class="styledBtn" @click="memberAddModal">邀请</b-button>
      </b-button-group>
      <table class="table table-green table-border table-tac table-hover">
        <thead>
          <tr>
            <th>姓名</th>
            <th>学号</th>
            <th>班级</th>
            <th>性别</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(member, index) in selectedTeam.members" :key="index">
            <td>
              <b-form-radio
                v-model="selectedTeam.team_leader.id"
                name="leader-radio"
                :value="member.id"
              >{{member.name}} {{member.id == selectedTeam.team_leader.id ? " (队长) ":""}}</b-form-radio>
            </td>
            <td>{{member.student_id}}</td>
            <td>{{member.class_name || member.class && member.class.name}}</td>
            <td>{{member.gender | gender}}</td>
            <td>
              <b-button class="styledBtn float-center" @click="removeTeamUser(member.id, index)">移出</b-button>
            </td>
          </tr>
        </tbody>
      </table>
    </b-modal>
    <b-modal v-model="userModal" centered title="邀请" size="lg" :hide-footer="true">
      <b-table :items="user.list" small hover :fields="userColumns" head-variant>
        <template slot="HEAD_sn" slot-scope="head">
          <b-form-checkbox v-model="user.all_checked">{{head.label}}</b-form-checkbox>
        </template>
        <template slot="sn" slot-scope="row">
          <b-form-checkbox v-model="row.item.checked">{{ row.index + 1 }}</b-form-checkbox>
        </template>
        <template slot="name" slot-scope="row">{{row.item.name}}</template>
        <template slot="username" slot-scope="row">{{row.item.username}}</template>
        <template slot="student_id" slot-scope="row">{{row.item.student_id}}</template>
        <template slot="class_name" slot-scope="row">{{row.item.class && row.item.class.name}}</template>
        <template slot="gender" slot-scope="row">{{row.item.gender | gender}}</template>
      </b-table>
      <b-row class="justify-content-center row-margin-tweak mt-3">
        <b-pagination
          :size="template_size"
          :total-rows="user.total"
          :per-page="user.queryParam.size"
          limit="5"
          v-model="user.queryParam.page"
        ></b-pagination>
      </b-row>
      <b-button size="sm" class="styledBtn float-center mt-3" @click="addTeamMeber()">保存</b-button>
    </b-modal>
    <b-modal
      v-model="businessModal"
      centered
      title="关注的业务"
      size="md"
      :hide-footer="true"
      scrollable
    >
      <b-card class="p-3 text-left mb-3" v-for="(business,index) in businesses" :key="index">
        <h3 class="mb-3">业务信息</h3>
        <div class="mt-2">
          <span class="title">业务名称 :</span>
          {{business.name}}
        </div>
        <div class="mt-2">
          <span class="title">事务类型 :</span>
          {{business.project && business.project.office_item || ''}}
        </div>
        <div class="mt-2">
          <span class="title">业务启动时间 :</span>
          {{business.create_time}}
        </div>
        <div class="mt-2">
          <span class="title">业务办理单位 :</span>
          {{business.company && business.company.name}}
        </div>
        <div class="mt-2">
          <span class="title">业务状态 :</span>
          {{business.status | businessStatus}}
        </div>
      </b-card>
    </b-modal>
    <b-modal v-model="newTeamModal" centered title="新建队员" size="lg" :hide-footer="true">
      <b-row class="mb-3">
        <b-col cols="4">
          <div style="display:flex">
            <div class="mr-2 vertical-center">团队名称:</div>
            <b-form-input style="flex:1" v-model="new_team.name"></b-form-input>
          </div>
        </b-col>
        <b-col cols="4">
          <div style="display:flex">
            <div class="mr-2 vertical-center">开放邀请:</div>
            <b-form-select
              style="flex:1"
              v-model="new_team.public_mode"
              :options="publicTeamOptions"
            ></b-form-select>
          </div>
        </b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col cols="12">
          <div style="display:flex">
            <div class="mr-2 vertical-center">业务:</div>
            <b-form-select
              style="flex:1"
              v-model="new_team.business_id"
              value-field="id"
              text-field="name"
              :options="business.list"
            ></b-form-select>
          </div>
        </b-col>
      </b-row>
      <b-table :items="user.list" small hover :fields="userColumns" head-variant>
        <template slot="HEAD_sn" slot-scope="head">
          <b-form-checkbox v-model="user.all_checked">{{head.label}}</b-form-checkbox>
        </template>
        <template slot="sn" slot-scope="row">
          <b-form-checkbox v-model="row.item.checked">{{ row.index + 1 }}</b-form-checkbox>
        </template>
        <template slot="name" slot-scope="row">{{row.item.name}}</template>
        <template slot="username" slot-scope="row">{{row.item.username}}</template>
        <template slot="student_id" slot-scope="row">{{row.item.student_id}}</template>
        <template slot="class_name" slot-scope="row">{{row.item.class && row.item.class.name}}</template>
        <template slot="gender" slot-scope="row">{{row.item.gender | gender}}</template>
      </b-table>
      <b-row class="justify-content-center row-margin-tweak mt-3">
        <b-pagination
          :size="template_size"
          :total-rows="user.total"
          :per-page="user.queryParam.size"
          limit="5"
          v-model="user.queryParam.page"
        ></b-pagination>
      </b-row>
      <b-button size="sm" class="styledBtn float-center mt-3" @click="addNewTeam()">保存</b-button>
    </b-modal>
    <evaluate-modal @success="getWatchingList"></evaluate-modal>
  </div>
</template>
<script>
import { mapState } from "vuex";
import studentService from "@/services/studentService";
import Loading from "@/components/loading/Loading";
import EvaluateModal from "./EvaluateModal";
import { businessStatus, gender } from "@/filters/fun";
import _ from "lodash";

export default {
  mixins: [],
  components: { Loading, EvaluateModal },
  filters: { businessStatus, gender },
  data() {
    return {
      courses: [],
      activeItemId: null,
      activeCourse: null,
      type: 0,
      options: [
        { text: "课外下关注的业务", value: 0 },
        { text: "课堂下的团队", value: 1 }
      ],
      studentWatchingList: {
        list: [],
        total: 0
      },
      queryWatchingParam: {
        page: 1,
        size: 5
      },
      teamList: {
        list: [],
        total: 0
      },
      queryTeamParam: {
        page: 1,
        size: 5
      },
      columns1: {
        sn: {
          label: "序号",
          sortable: false,
          class: "text-center w-5"
        },
        name: {
          label: "业务名称",
          sortable: false,
          class: "text-center w-20"
        },
        company_name: {
          label: "创建单位",
          sortable: false,
          class: "text-center w-20"
        },
        team_name: {
          label: "参与团队",
          sortable: false,
          class: "text-center w-10"
        },
        create_time: {
          label: "创建时间",
          sortable: false,
          class: "text-center w-15"
        },
        status: {
          label: "业务状态",
          sortable: false,
          class: "text-center w-20"
        },
        action: {
          label: "操作",
          sortable: false,
          class: "text-center w-10"
        }
      },
      columns2: {
        sn: {
          label: "序号",
          sortable: false,
          class: "text-center w-5"
        },
        name: {
          label: "业务名称",
          sortable: false,
          class: "text-center w-15"
        },
        team_leader: {
          label: "队长",
          sortable: false,
          class: "text-center w-15"
        },
        create_time: {
          label: "创建时间",
          sortable: false,
          class: "text-center w-15"
        },
        status: {
          label: "开放邀请",
          sortable: false,
          class: "text-center w-20"
        },
        action: {
          label: "操作",
          sortable: false,
          class: "text-center w-30"
        }
      },
      userColumns: {
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
        student_id: {
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
      },

      selectedTeam: {},
      teamModal: false,
      selectedUsers: [],
      userModal: false,
      user: {
        list: [],
        total: 0,
        all_checked: false,
        queryParam: {
          page: 1,
          size: 5
        },
        search_user: ""
      },
      businessModal: false,
      businesses: [],

      newTeamModal: false,
      new_team: {
        name: "",
        public_mode: 0,
        business_id: null
      },
      business: {
        list: []
      },
      publicTeamOptions: [
        { text: "开放", value: 0 },
        { text: "不开放", value: 1 }
      ]
    };
  },
  created() {
    this.$nextTick(() => {
      this.init();
    });
  },
  computed: {
    ...mapState(["userInfo"])
  },
  watch: {
    type() {
      if (this.courses.length > 0) {
        this.selectCourse(this.courses[0], 0);
      }
    },
    "user.list": {
      handler(users) {
        this.selectedUsers = _.filter(this.selectedUsers, user => {
          return user.page != this.user.queryParam.page;
        });
        this.selectedUsers = _.unionBy(
          this.selectedUsers,
          _.filter(users, { checked: true }),
          "id"
        );
      },
      deep: true
    },
    "user.queryParam": {
      handler() {
        this.queryCompanyUserList();
      },
      deep: true
    },
    "user.search_user": {
      handler: _.debounce(function() {
        this.selectedUsers = [];
        this.queryCompanyUserList();
      }, 500)
    },
    "user.all_checked": {
      handler(val) {
        if (val) {
          this.user.list = _.map(this.user.list, user => {
            user.checked = true;
            return user;
          });
        } else {
          this.user.list = _.map(this.user.list, user => {
            user.checked = false;
            return user;
          });
        }
      },
      deep: true
    },
    "selectedTeam.team_leader.id": {
      handler(val) {
        let selMember = _.find(this.selectedTeam.members, member => {
          return member.id == val;
        });
        this.selectedTeam.team_leader = _.clone(selMember, true);
        this.setTeamLeader();
      }
    }
  },
  methods: {
    init() {
      this.getCourseList();
    },
    getCourseList() {
      this.run();
      studentService
        .courseList()
        .then(data => {
          this.courses = data.results;
          if (this.courses.length > 0) {
            this.selectCourse(this.courses[0], 0);
          }
          this.$emit("data-ready");
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },
    selectCourse(course, index) {
      this.activeItemId = "courseIndex" + index;
      this.activeCourse = course;
      if (this.type == 0) {
        this.getWatchingList();
      } else {
        this.getTeamList();
      }
    },
    getWatchingList() {
      this.run();
      studentService
        .watchingList({
          ...this.queryWatchingParam,
          ...{
            id: this.activeCourse.id
          }
        })
        .then(data => {
          this.studentWatchingList.list = data.results;
          this.studentWatchingList.total = data.paging.count;
          this.$emit("data-ready");
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },
    getTeamList() {
      this.run();
      studentService
        .teamListByCourse({
          ...this.queryTeamParam,
          ...{
            id: this.activeCourse.id
          }
        })
        .then(data => {
          this.teamList.list = data.results;
          this.teamList.total = data.paging.count;
          this.$emit("data-ready");
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },
    removeTeam(team) {
      this.run();
      studentService
        .removeTeam({
          id: team.id
        })
        .then(() => {
          this.getTeamList();
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },
    teamMemberModal(team) {
      this.selectedTeam = team;
      this.teamModal = true;
    },
    memberAddModal() {
      this.selectedUsers = [];
      this.user.queryParam = {
        page: 1,
        size: 5
      };
      this.queryCompanyUserList();
      this.userModal = true;
    },
    queryCompanyUserList(except_team = true) {
      let excepted_team_id = except_team ? this.selectedTeam.id : -1;
      studentService
        .watchCompanyUserList({
          ...this.user.queryParam,
          ...{
            search: this.user.search_user,
            excepted_team_id: excepted_team_id
          }
        })
        .then(data => {
          this.user.list = _.map(data.results, user => {
            user.checked =
              _.filter(this.selectedUsers, sel_user => {
                return user.id == sel_user.id;
              }).length > 0;
            return user;
          });
          this.user.total = data.paging.count;
        })
        .catch(() => {});
    },
    setTeamLeader() {
      studentService
        .setTeamLeader({
          id: this.selectedTeam.id,
          student_id: this.selectedTeam.team_leader.id
        })
        .then(() => {});
    },
    removeTeamUser(val, index) {
      this.run();
      studentService
        .removeTeamUser({
          id: this.selectedTeam.id,
          student_id: val
        })
        .then(() => {
          this.selectedTeam.members.splice(index, 1);
          this.$emit("data-ready");
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },
    addTeamMeber() {
      this.run();
      studentService
        .addTeamUsers({
          id: this.selectedTeam.id,
          student_ids: JSON.stringify(_.map(this.selectedUsers, "id"))
        })
        .then(() => {
          this.selectedTeam.members = _.unionBy(
            this.selectedTeam.members,
            this.selectedUsers,
            "id"
          );
          this.userModal = false;
          this.$emit("data-ready");
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },
    showWatchingBusinesses(team) {
      this.businesses = team.businesses;
      this.businessModal = true;
    },
    newTeam() {
      this.selectedUsers = [];
      this.user.queryParam = {
        page: 1,
        size: 5
      };
      this.new_team = {
        name: "",
        public_mode: 0,
        business_id: null
      };
      this.queryWatchBusinessList();
      this.newTeamModal = true;
    },
    queryWatchBusinessList() {
      this.run();
      studentService
        .watchBusinessList({ no_paging: true, type: 1 })
        .then(data => {
          this.business.list = data.results;
          this.$emit("data-ready");
          this.queryCompanyUserList(false);
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },
    addNewTeam() {
      if (this.selectedUsers.length == 0) {
        this.$toasted.error("Please select at least one user");
        return;
      }
      if (this.new_team.name.trim() == "" || !this.new_team.business_id) {
        this.$toasted.error("Please input all fields");
        return;
      }
      let param = {
        student_ids: JSON.stringify(_.map(this.selectedUsers, "id")),
        name: this.new_team.name,
        public_mode: this.new_team.public_mode,
        business_id: this.new_team.business_id,
        team_leader_id: this.selectedUsers[0].id,
        course_id: this.activeCourse.id
      };
      this.run();
      studentService
        .newTeamByInstructor(param)
        .then(() => {
          this.getTeamList();
          this.newTeamModal = false;
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },
    evaluate(stwb) {
      this.$emit("openEvaluateModal", stwb);
    }
  }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.student-guide-index {
  .course-selector {
    .course-name {
      background: #4169e1;
      color: white;
    }
    .course-item {
      cursor: pointer;
    }
  }
  .list-group {
    .list-group-item {
      padding: 7px 8px 7px 15px;
      font-size: 15px;
    }
    .list-group-item.active {
      color: #fff;
      background-color: #4169e1;
      border-color: #4169e1;
    }
  }
  .vertical-center {
    line-height: 38px;
  }
}
</style> 