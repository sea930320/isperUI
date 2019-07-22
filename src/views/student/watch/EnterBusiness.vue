<template>
  <div class="enter-business container">
    <loading v-if="isRunning"></loading>
    <b-container>
      <b-row class="cardDiv p-0 bg-main" no-gutters>
        <b-col cols="3" class="left-sidebar p-3">
          <b-list-group>
            <b-list-group-item
              v-for="(menu, index) in menus"
              :key="index"
              :active="menu.key == activeMenu"
              @click="activeMenu=menu.key"
              class="menu-item"
            >{{menu.title}}</b-list-group-item>
          </b-list-group>
          <b-list-group v-if="!isStudent" class="mt-3">
            <b-list-group-item
              v-for="(request, index) in pending_requests"
              :key="'pending_request' + index"
              class="request-item mb-1 p-0"
            >
              <div class="user-icon">
                <icon name="user"></icon>
              </div>
              <div class="user-info">
                <div style="flex:1">{{request.requestedFrom.name || request.requestedFrom.username}}</div>
                <div style="flex:1">申请成为您的助理</div>
              </div>
              <div class="action">
                <b-button-group>
                  <b-button size="sm" class="styledBtn" @click="acceptRequest(request)">同意</b-button>
                  <b-button size="sm" class="styledBtn" @click="rejectRequest(request)">拒绝</b-button>
                </b-button-group>
              </div>
            </b-list-group-item>
          </b-list-group>
        </b-col>
        <template v-if="activeMenu == 1">
          <b-col
            :cols="isStudent ? 6 : 9"
            class="py-4 pl-2 pr-1"
            v-bind:class="{'pr-2':!isStudent}"
          >
            <b-card style="height: 49%; margin-bottom: 2%;" class="p-3 text-left">
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
            <b-card style="height: 49%" class="p-3 text-left" v-if="teams.length>0">
              <h3 class="mb-3">团队信息</h3>
              <div class="mt-2">
                <span class="title">团队序号 :</span>
                {{teams[0].id}}
              </div>
              <div class="mt-2">
                <span class="title">团队名称 :</span>
                {{teams[0].name}}
              </div>
              <div class="mt-2">
                <span class="title">团队队长 :</span>
                {{teams[0].leader.name}}
              </div>
              <div class="mt-2">
                <span class="title">创建时间 :</span>
                {{teams[0].create_time}}
              </div>
              <div class="mt-2">
                <span class="title">团队成员 :&nbsp;</span>
                <span
                  v-for="(member, index) in teams[0].members"
                  :key="index"
                >{{member.username}} &nbsp;</span>
              </div>
            </b-card>
          </b-col>
          <b-col cols="3" class="py-4 pl-1 pr-2" v-if="isStudent">
            <b-card style="height: 100%" class="py-3 text-left">
              <template v-for="(user, index) in business_team">
                <div
                  class="job-user-request mb-2"
                  :key="index"
                  v-if="user.position && user.position.id"
                >
                  <div>
                    <icon name="user"></icon>
                    <span class="ml-3 mr-4">{{user.position.name}} ({{user.name}})</span>
                  </div>
                  <b-button
                    size="sm"
                    class="styledBtn"
                    v-if="!user.requested"
                    @click="requestAssist(user)"
                  >申请</b-button>
                  <template v-else>
                    <b-badge
                      variant="primary"
                      size="sm"
                      v-if="user.requested.status == 0"
                      style="line-height: 22px; padding: 3.5px;"
                    >申请中...</b-badge>
                    <b-badge
                      variant="success"
                      size="sm"
                      v-if="user.requested.status == 1"
                      style="line-height: 22px; padding: 3.5px;"
                    >已同意</b-badge>
                    <b-badge
                      variant="danger"
                      size="sm"
                      v-if="user.requested.status == 2"
                      style="line-height: 22px; padding: 3.5px;"
                    >被拒接</b-badge>
                  </template>
                </div>
              </template>
            </b-card>
          </b-col>
        </template>
        <template v-else-if="activeMenu == 2">
          <b-col cols="9">
            <class-group-chat :business="business" :teams="teams"></class-group-chat>
          </b-col>
        </template>
      </b-row>
      <b-button v-if="!isStudent" size="sm" class="styledBtn" @click="$router.go(-1)">
        <icon name="arrow-left"></icon>&nbsp;返回
      </b-button>
    </b-container>
  </div>
</template>
<script>
import Loading from "@/components/loading/Loading";
import ClassGroupChat from "@/views/student/watch/ClassGroupChat";
import studentService from "@/services/studentService";
import { businessStatus, gender } from "@/filters/fun";
import _ from "lodash";

export default {
  components: { Loading, ClassGroupChat },
  data() {
    return {
      business_id: null,
      activeMenu: 1,
      teams: [],
      business: {},
      assisting_users: [],
      request_assists: []
    };
  },
  filters: { businessStatus, gender },
  created() {
    this.$nextTick(() => {
      this.init();
    });
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
    isStudent() {
      return [9].includes(this.userInfo.role);
    },
    menus() {
      if (this.isStudent) {
        return [
          { title: "业务关注基础信息", key: 1 },
          { title: "课堂指导讨论组", key: 2 }
        ];
      } else {
        return [
          { title: "业务关注基础信息", key: 1 },
          { title: this.userInfo.position.name + "讨论组", key: 3 }
        ];
      }
    },
    business_team() {
      if (!this.business.team) return [];
      let team = _.map(this.business.team, user => {
        user.requested = _.find(this.request_assists, ra => {
          return ra.requestedTo && ra.requestedTo.id == user.id;
        });
        return user;
      });
      return team;
    },
    pending_requests() {
      let requests = this.request_assists.filter(ra => {
        return ra.status == 0;
      });
      return requests;
    }
  },
  watch: {},
  methods: {
    init() {
      this.business_id = this.$route.params["bid"];
      this.run();
      studentService
        .businessTeamDetail({
          business_id: this.business_id
        })
        .then(data => {
          this.teams = data.results;
          this.business = data.business;
          this.requestAssistList();
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },
    requestAssistList() {
      this.run();
      studentService
        .requestAssistList({
          business_id: this.business_id
        })
        .then(data => {
          this.request_assists = data.results;
          this.$emit("data-ready");
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },
    requestAssist(user) {
      this.run();
      studentService
        .requestAssist({
          business_id: this.business_id,
          job_user_id: user.id
        })
        .then(data => {
          this.request_assists = data.results;
          this.$emit("data-ready");
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },
    acceptRequest(request) {
      console.log(request)
    },
    rejectRequest(request) {}
  }
};
</script>

<style lang="scss">
.enter-business {
  .bg-main {
    background: rgb(221, 231, 249);
    .left-sidebar {
      background: rgba(58, 125, 224, 0.5);
      min-height: 750px;
      .menu-item {
        cursor: pointer;
      }
      .request-item {
        background: transparent;
        border: 0px;
        display: flex;
        justify-content: space-between;
        .user-icon {
          width: 51px;
          height: 51px;
          background: white;
          border-radius: 3px;
          svg {
            width: 30px;
            height: 30px;
            margin-top: 10.5px;
          }
        }
        .user-info {
          flex: 1;
          display: flex;
          padding: 3px 10px;
          flex-direction: column;
          color: white;
          font-size: 14px;
          text-align: left;
        }
        .action {
          .btn-group {
            margin: 10px auto;
            .styledBtn {
              color: #253568;
              background: white !important;
            }
          }
        }
      }
    }
    .title {
      font-weight: bold;
    }
    .job-user-request {
      display: flex;
      justify-content: space-between;
      line-height: 29px;
      .styledBtn {
        min-width: 44px;
        height: 29px;
      }
    }
  }
}
</style>
