<template>
  <div class="watch-index container">
    <loading v-if="isRunning"></loading>
    <b-form-group>
      <b-form-radio-group
        v-model="queryParam.type"
        :options="options"
        buttons
        button-variant="outline-primary"
        class="float-left"
      ></b-form-radio-group>
    </b-form-group>
    <b-row no-gutters>
      <b-col lg="3" md="6" sm="12">
        <b-input-group :size="template_size">
          <b-input-group-prepend>
            <span class="input-group-text">
              <icon name="search"></icon>
            </span>
          </b-input-group-prepend>
          <b-form-input v-model.lazy="queryDebounceParam.search" placeholder="请输入内容" />
        </b-input-group>
      </b-col>
    </b-row>
    <div class="cardDiv">
      <b-table :items="business.list" small hover :fields="columns" head-variant>
        <template slot="sn" slot-scope="row">{{ row.index + 1 }}</template>
        <template slot="name" slot-scope="row">{{row.item.name}}</template>
        <template
          slot="office_type"
          slot-scope="row"
        >{{row.item.officeItem? row.item.officeItem.name : row.item.project && row.item.project.office_item}}</template>
        <template slot="create_time" slot-scope="row">{{row.item.create_time}}</template>
        <template slot="company" slot-scope="row">{{row.item.company && row.item.company.name}}</template>
        <template slot="status" slot-scope="row">{{row.item.status | businessStatus}}</template>
        <template slot="action" slot-scope="row">
          <div v-if="row.item.is_watching">
            <b-button
              :size="template_size"
              class="styledBtn"
              variant="outline-primary"
              @click="enterBusiness(row.item)"
            >进入业务</b-button>
            <b-button
              :size="template_size"
              class="ml-1 styledBtn"
              @click="showTeamDetail(row.item)"
            >团队</b-button>
          </div>
          <div v-else>
            <b-button
              :size="template_size"
              class="styledBtn"
              variant="outline-primary"
              :to="{name: 'business-detail', params: {bid: row.item.id}}"
            >查看</b-button>
            <b-button
              :size="template_size"
              class="ml-1 styledBtn"
              @click="watchBusiness(row.item)"
            >关注</b-button>
          </div>
        </template>
      </b-table>
    </div>
    <b-row class="justify-content-center row-margin-tweak cardDiv">
      <b-pagination
        :size="template_size"
        :total-rows="business.total"
        :per-page="queryParam.size"
        limit="5"
        v-model="queryParam.page"
      ></b-pagination>
    </b-row>

    <b-modal
      v-model="selectModeModal"
      centered
      title="Watch Business"
      size="lg"
      :hide-footer="true"
    >
      <div class="container">
        <b-row class="justify-content-md-center">
          <b-col>
            <div>
              <b-button variant="primary" size="lg" class="float-center" @click="courseMode()">课堂方式</b-button>
            </div>
            <div class="mt-2">(关联到老师的课堂)</div>
          </b-col>
          <b-col>
            <div>
              <b-button variant="primary" size="lg" class="float-center" @click="extraMode()">课外方式</b-button>
            </div>
            <div class="mt-2">(无需关联老师的课堂)</div>
          </b-col>
        </b-row>
      </div>
    </b-modal>

    <b-modal v-model="teamSelectModal" hide-header size="xl">
      <div class="mt-3">
        <b-row class="my-2" v-if="watchConfig.mode == 0">
          <b-col cols="4">
            <div class="mb-1 text-left">请选择归属课堂</div>
            <b-form-select v-model="watchConfig.selected_course" :options="courses" size="md"></b-form-select>
          </b-col>
        </b-row>
        <b-row class="my-2" v-else>
          <b-col cols="4">
            <div class="mb-1 text-left">请输入课外学习主题</div>
            <b-form-input style="flex:1" v-model="watchConfig.extra_course.name"></b-form-input>
          </b-col>
          <b-col cols="4">
            <div class="mb-1 text-left">请选择指导者</div>
            <b-form-select v-model="watchConfig.extra_course.teacher" :options="teachers" size="md"></b-form-select>
          </b-col>
        </b-row>
        <b-row class="justify-content-md-center">
          <b-col cols="6">
            <b-form-group label="请选择实验小组">
              <b-form-radio-group v-model="watchConfig.team_mode" :options="teamModeOptions"></b-form-radio-group>
            </b-form-group>
          </b-col>
        </b-row>
        <template v-if="watchConfig.team_mode == 1">
          <b-row>
            <b-col>
              <div style="display:flex">
                <div class="mr-2 vertical-center">团队名称:</div>
                <b-form-input style="flex:1" v-model="watchConfig.new_team.name"></b-form-input>
              </div>
            </b-col>
            <b-col class="vertical-center">团队队长: &nbsp;{{userInfo.username}}</b-col>
            <b-col class="vertical-center">创建时间: &nbsp;{{getCurrent()}}</b-col>
          </b-row>
          <b-row class="mt-3">
            <b-col cols="4">
              <div style="display:flex">
                <div class="mr-2 vertical-center">开放邀请:</div>
                <b-form-select
                  style="flex:1"
                  v-model="watchConfig.new_team.public_mode"
                  :options="publicTeamOptions"
                ></b-form-select>
              </div>
            </b-col>
          </b-row>
          <b-row align-h="between" class="mt-3">
            <b-col cols="4" class="text-left vertical-center">团队成员</b-col>
            <b-col lg="3" md="6" sm="12">
              <b-input-group :size="template_size">
                <b-input-group-prepend>
                  <span class="input-group-text">
                    <icon name="search"></icon>
                  </span>
                </b-input-group-prepend>
                <b-form-input v-model.lazy="user.search_user" placeholder="请输入内容" />
              </b-input-group>
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
        </template>
        <template v-else>
          <b-table
            :items="team.list"
            small
            hover
            :fields="teamColumns"
            head-variant
            selectable
            select-mode="single"
            @row-selected="teamSelect"
          >
            <template slot="sn" slot-scope="row">{{ row.index + 1 }}</template>
            <template slot="name" slot-scope="row">{{row.item.name}}</template>
            <template
              slot="leader"
              slot-scope="row"
            >{{row.item.team_leader && row.item.team_leader.name}}</template>
            <template slot="create_time" slot-scope="row">{{row.item.create_time}}</template>
          </b-table>
          <b-row class="justify-content-center row-margin-tweak mt-3">
            <b-pagination
              :size="template_size"
              :total-rows="team.total"
              :per-page="team.queryParam.size"
              limit="5"
              v-model="team.queryParam.page"
            ></b-pagination>
          </b-row>
        </template>
      </div>
      <div slot="modal-footer" class="w-100">
        <b-button class="styledBtn float-center mr-2" @click="watchStart()">保存</b-button>
      </div>
    </b-modal>
    <team-detail></team-detail>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Loading from "@/components/loading/Loading";
import TeamDetail from "@/components/student/TeamDetail";
import _ from "lodash";
import studentService from "@/services/studentService";
import { businessStatus, gender } from "@/filters/fun";

export default {
  components: { Loading, TeamDetail },
  filters: { businessStatus, gender },
  data() {
    return {
      queryParam: {
        type: 0,
        page: 1,
        size: 15
      },
      queryDebounceParam: {
        search: ""
      },
      options: [
        { text: "全部业务", value: 0 },
        { text: "可关注业务", value: 1 },
        { text: "已关注业务", value: 2 }
      ],
      publicTeamOptions: [
        { text: "开放", value: 0 },
        { text: "不开放", value: 1 }
      ],
      business: {
        list: [],
        total: 0
      },
      user: {
        list: [],
        total: 0,
        all_checked: false,
        queryParam: {
          type: 0,
          page: 1,
          size: 5
        },
        search_user: ""
      },
      team: {
        list: [],
        total: 0,
        queryParam: {
          type: 0,
          page: 1,
          size: 5
        },
        search_team: ""
      },
      courses: [],
      teachers: [],
      selectModeModal: false,
      teamSelectModal: false,
      watchConfig: {
        selected_business: null,
        mode: 0, // 0: ketang mode, 1: kewai mode
        selected_course: null,
        extra_course: {
          name: "",
          teacher: null
        },
        team_mode: 0, // 0: existing team, 1: new team
        selected_team: null,
        new_team: {
          name: "",
          public_mode: 0,
          users: []
        }
      },
      teamModeOptions: [
        { text: "已有团队", value: 0 },
        { text: "新建团队", value: 1 }
      ],
      columns: {
        sn: {
          label: "ID",
          sortable: false,
          class: "text-center field-sn"
        },
        name: {
          label: "业务名称",
          sortable: false,
          class: "text-center field-name"
        },
        office_type: {
          label: "事务类型",
          sortable: false,
          class: "text-center field-creator"
        },
        create_time: {
          label: "业务启动时间",
          sortable: false,
          class: "text-center field-create_time w-20"
        },
        company: {
          label: "办理单位",
          sortable: false,
          class: "text-center field-creator w-15"
        },
        status: {
          label: "状态",
          sortable: false,
          class: "text-center field-status w-10"
        },
        action: {
          label: "操作",
          sortable: false,
          class: "text-center field-action w-10"
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
          class: "text-center field-student_id"
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
      teamColumns: {
        sn: {
          label: "序号",
          sortable: false,
          class: "text-left pl-3 field-sn"
        },
        name: {
          label: "团队名称",
          sortable: false,
          class: "text-center field-name"
        },
        leader: {
          label: "队长",
          sortable: false,
          class: "text-center field-leader"
        },
        create_time: {
          label: "创建时间",
          sortable: false,
          class: "text-center field-create_time"
        }
      }
    };
  },
  created() {
    this.$nextTick(() => {
      this.getWatchCourseList();
      this.getTeacherList();
      this.queryCompanyUserList();
      this.queryWatchBusinessList();
    });
  },
  computed: {
    ...mapState(["userInfo"])
  },
  watch: {
    queryParam: {
      handler() {
        this.queryWatchBusinessList();
      },
      deep: true
    },
    queryDebounceParam: {
      deep: true,
      handler: _.debounce(function() {
        this.queryWatchBusinessList();
      }, 500)
    },
    "user.list": {
      handler(users) {
        this.watchConfig.new_team.users = _.filter(
          this.watchConfig.new_team.users,
          user => {
            return user.page != this.user.queryParam.page;
          }
        );
        this.watchConfig.new_team.users = _.unionBy(
          this.watchConfig.new_team.users,
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
        this.watchConfig.new_team.users = [];
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
    "team.queryParam": {
      handler() {
        this.queryBusinessTeamList();
      },
      deep: true
    },
    "team.search_user": {
      handler: _.debounce(function() {
        this.queryBusinessTeamList();
      }, 500)
    }
  },
  mounted() {},
  methods: {
    getCurrent() {
      return this.$moment().format("YYYY-MM-DD");
    },
    queryWatchBusinessList() {
      this.run();
      studentService
        .watchBusinessList({ ...this.queryParam, ...this.queryDebounceParam })
        .then(data => {
          this.business.list = data.results;
          this.business.total = data.paging.count;
          this.$emit("data-ready");
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },
    queryCompanyUserList() {
      studentService
        .watchCompanyUserList({
          ...this.user.queryParam,
          ...{ search: this.user.search_user }
        })
        .then(data => {
          this.user.list = _.map(data.results, user => {
            user.checked =
              _.filter(this.watchConfig.new_team.users, selected_user => {
                return user.id == selected_user.id;
              }).length > 0;
            return user;
          });
          this.user.total = data.paging.count;
        })
        .catch(() => {});
    },
    queryBusinessTeamList() {
      if (!this.watchConfig.selected_business) {
        return;
      }
      this.run();
      studentService
        .businessTeamList({
          ...this.team.queryParam,
          ...{
            business_id: this.watchConfig.selected_business.id,
            search: this.team.search_team
          }
        })
        .then(data => {
          this.team.list = data.results;
          this.team.total = data.paging.count;
          this.$emit("data-ready");
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },
    getWatchCourseList() {
      studentService
        .watchCourseList()
        .then(data => {
          this.courses = data.results;
        })
        .catch(() => {});
    },
    getTeacherList() {
      studentService
        .teacherList()
        .then(data => {
          this.teachers = data.results;
        })
        .catch(() => {});
    },
    watchBusiness(business) {
      if (business.is_watching) {
        this.$toasted("Already watched");
        return;
      }
      this.watchConfig = {
        selected_business: business,
        mode: 0, // 0: ketang mode, 1: kewai mode
        selected_course: null,
        extra_course: {
          name: "",
          teacher: null
        },
        team_mode: 0, // 0: existing team, 1: new team
        selected_team: null,
        new_team: {
          name: "",
          public_mode: 0,
          users: []
        }
      };
      this.queryBusinessTeamList();
      this.selectModeModal = true;
    },
    courseMode() {
      this.selectModeModal = false;
      this.watchConfig.mode = 0;
      this.teamSelectModal = true;
    },
    extraMode() {
      this.selectModeModal = false;
      this.watchConfig.mode = 1;
      this.teamSelectModal = true;
    },
    teamSelect(items) {
      if (items.length == 0) return;
      this.watchConfig.selected_team = items[0];
    },
    validate() {
      if (this.watchConfig.mode == 0) {
        if (!this.watchConfig.selected_course) {
          this.$toasted.error("Please select Course");
          return;
        }
        if (
          this.watchConfig.team_mode == 0 &&
          !this.watchConfig.selected_team
        ) {
          this.$toasted.error("Please select Team");
          return;
        }
        if (this.watchConfig.team_mode == 1) {
          if (this.watchConfig.new_team.name.trim() == "") {
            this.$toasted.error("Please Input Team Name");
            return;
          } else if (this.watchConfig.new_team.users.length == 0) {
            this.$toasted.error("Please Select at least one user");
            return;
          }
        }
      } else {
        if (!this.watchConfig.extra_course.teacher) {
          this.$toasted.error("Please select Teacher");
          return;
        }
        if (
          this.watchConfig.team_mode == 0 &&
          !this.watchConfig.selected_team
        ) {
          this.$toasted.error("Please select Team");
          return;
        }
        if (this.watchConfig.team_mode == 1) {
          if (this.watchConfig.new_team.name.trim() == "") {
            this.$toasted.error("Please Input Team Name");
            return;
          } else if (this.watchConfig.new_team.users.length == 0) {
            this.$toasted.error("Please Select at least one user");
            return;
          }
        }
      }
      return true;
    },
    watchStart() {
      if (!this.validate()) return;
      this.run();
      studentService
        .watchStart({
          watch_config: JSON.stringify(this.watchConfig)
        })
        .then(() => {
          this.$toasted.success("成功");
          this.queryWatchBusinessList();
          this.teamSelectModal = false;
          this.$emit("data-ready");
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },
    showTeamDetail(business) {
      this.$emit("openStudentTeamDetailModal", {
        id: business.id
      });
    },
    enterBusiness(business) {
      this.$router.push("/student/enter-business/" + business.id);
    }
  }
};
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
.watch-index {
  .vertical-center {
    line-height: 38px;
  }
}
</style>