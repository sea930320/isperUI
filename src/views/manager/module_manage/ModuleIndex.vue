<template>
  <div class="super-module-manage">
    <loading v-if="isRunning"></loading>
    <b-row>
      <b-col cols="2">
        <b-card no-body>
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button block href="#" variant="primary" style="font-size: 20px">
              <strong>普通元模块</strong>
            </b-button>
          </b-card-header>
          <div role="tablist">
            <b-card no-body class="border-0">
              <b-card-header header-tag="header" role="tab">
                <b-button block href="#" v-b-toggle.accordion-1 class="bg-grey fontedBtn">文件类元模块</b-button>
              </b-card-header>
              <b-collapse id="accordion-1" visible role="tabpanel">
                <b-list-group>
                  <b-list-group-item
                    :active="currentUrl=='edit'"
                    @click="type=0;currentUrl='edit'"
                  >编辑</b-list-group-item>
                  <b-list-group-item
                    :active="currentUrl=='post'"
                    @click="type=0;currentUrl='post'"
                  >公示</b-list-group-item>
                  <b-list-group-item
                    :active="currentUrl=='display'"
                    @click="type=0;currentUrl='display'"
                  >展示</b-list-group-item>
                  <b-list-group-item
                    :active="currentUrl=='distribute_sign'"
                    @click="type=0;currentUrl='distribute_sign'"
                  >交付与签收</b-list-group-item>
                  <b-list-group-item
                    :active="currentUrl=='bill'"
                    @click="type=0;currentUrl='bill'"
                  >法案制作</b-list-group-item>
                </b-list-group>
              </b-collapse>
            </b-card>

            <b-card no-body class="border-0">
              <b-card-header header-tag="header" role="tab">
                <b-button block href="#" v-b-toggle.accordion-2 class="bg-grey fontedBtn">数据收集元模块</b-button>
              </b-card-header>
              <b-collapse id="accordion-2" visible role="tabpanel">
                <b-list-group>
                  <b-list-group-item
                    :active="currentUrl=='poll'"
                    @click="type=0;currentUrl='poll'"
                  >投票</b-list-group-item>
                  <b-list-group-item
                    :active="currentUrl=='selectdecide'"
                    @click="type=0;currentUrl='selectdecide'"
                  >判断与选择</b-list-group-item>
                  <b-list-group-item
                    :active="currentUrl=='vote'"
                    @click="type=0;currentUrl='vote'"
                  >表决</b-list-group-item>
                  <b-list-group-item :active="currentUrl=='qa'" @click="type=0;currentUrl='qa'">调查问卷</b-list-group-item>
                </b-list-group>
              </b-collapse>
            </b-card>

            <b-card no-body class="border-0">
              <b-card-header header-tag="header" role="tab">
                <b-button block href="#" v-b-toggle.accordion-3 class="bg-grey fontedBtn">流程走向元模块</b-button>
              </b-card-header>
              <b-collapse id="accordion-3" visible role="tabpanel">
                <b-list-group>
                  <b-list-group-item
                    :active="currentUrl=='jump'"
                    @click="type=0;currentUrl='jump'"
                  >跳转</b-list-group-item>
                  <b-list-group-item
                    :active="currentUrl=='nest'"
                    @click="type=0;currentUrl='nest'"
                  >嵌套</b-list-group-item>
                  <b-list-group-item
                    :active="currentUrl=='report'"
                    @click="type=0;currentUrl='report'"
                  >心得</b-list-group-item>
                </b-list-group>
              </b-collapse>
            </b-card>
          </div>
        </b-card>
        <b-card no-body>
          <b-card-header header-tag="header" role="tab">
            <b-button block href="#" variant="primary" style="font-size: 20px">
              <strong>动画场景元模块</strong>
            </b-button>
          </b-card-header>
          <b-card no-body class="border-0">
            <b-card-header header-tag="header" role="tab">
              <b-button block href="#" v-b-toggle.accordion-4 class="bg-grey fontedBtn">动画场景元模块</b-button>
            </b-card-header>
            <b-collapse id="accordion-4" visible role="tabpanel">
              <b-list-group>
                <b-list-group-item
                  v-for="(process, index) in animationProcesses"
                  :key="index"
                  :active="currentUrl==process.image"
                  @click="type=1;currentUrl=process.image;"
                >{{process.name}}</b-list-group-item>
              </b-list-group>
            </b-collapse>
          </b-card>
        </b-card>
      </b-col>
      <b-col cols="10">
        <div class="cardDiv my-0">
          <div>
            <img
              v-if="type==0"
              v-bind:src="require('@/assets/module/' + currentUrl + '.png')"
              class="w-100"
              style="height: 700px"
            />
            <img v-else v-bind:src="currentUrl" class="w-100" style="height: 700px" />
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Loading from "@/components/loading/Loading";
import GroupService from "@/services/groupService";
import WorkflowService from "@/services/workflowService";
import _ from "lodash";

export default {
  name: "super-module-manage",
  components: {
    Loading
  },
  data() {
    return {
      type: 0,
      currentUrl: "edit",
      processes: [],
      animationProcesses: []
    };
  },
  created() {
    this.$nextTick(() => {
      this.getProcesses();
    });
  },
  computed: {
    ...mapState(["userInfo"])
  },
  watch: {},
  methods: {
    changeUrl(url) {
      this.currentUrl = url;
    },
    getGroupList() {
      GroupService.fetchAllGroupDetail()
        .then(() => {})
        .catch(() => {});
    },
    getProcesses() {
      WorkflowService.getProcesses().then(data => {
        this.processes = data;
        this.animationProcesses = _.filter(data, process => {
          return process.type == 1;
        });
      });
    }
  }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.super-module-manage {
  .card header {
    padding: 0 !important;
    border-radius: 0 !important;
    a {
      border-radius: 0;
    }
  }
  .bg-grey {
    background-color: darkgrey;
    color: black;
    border: none;
  }
  .btn-secondary:focus {
    box-shadow: none;
  }
  .btn-secondary:active:focus {
    box-shadow: none;
  }
  .list-group {
    max-height: 200px;
    overflow: auto;
    display: block !important;
  }
  .list-group-item {
    padding: 0.4rem 1.25rem !important;
    border: none !important;
    height: 30px !important;
    font-size: 18px !important;
    line-height: 18px;
    border-radius: 0 !important;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .list-group-item.active {
    background-color: #5f98ff !important;
    border-color: #007bff !important;
  }
  .list-group-item:hover {
    background-color: #4169e14a;
    color: white !important;
    cursor: pointer;
    button {
      background-color: transparent;
      svg {
        color: white !important;
      }
    }
  }
}
</style>
