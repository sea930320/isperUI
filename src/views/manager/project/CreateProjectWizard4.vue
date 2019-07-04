<template>
  <div class="mt-5 wizard-4">
    <loading v-if="isRunning"></loading>
    <b-alert variant="success" show class="text-left px-0" style="margin: 0 15px">
      <b-container>
        <b-row>
          <b-col sm="5">
            项目名称 :
            {{projectData.name}}
          </b-col>
          <b-col sm="4">
            相关流程 :
            {{projectData.flow_name}}
          </b-col>
          <b-col sm="3">
            类型 :
            {{projectData.type }}
          </b-col>
        </b-row>
      </b-container>
    </b-alert>
    <b-row align-v="start">
      <b-col sm="6">
        <div class="cardDiv">
          <b-table
            :items="nodes"
            :fields="columns"
            responsive
            small
            hover
            head-variant
            class
            @row-clicked="selectNode"
          >
            <template slot="id" slot-scope="row">{{ row.index + 1}}</template>
            <template slot="name" slot-scope="row">{{ row.item.name}}</template>
            <template slot="matching_name" slot-scope="row">
              <a
                href="javascript:;"
                @click="showBigProcessImg(row.item.process.image)"
              >{{row.item.process.name}}</a>
            </template>
          </b-table>
        </div>
      </b-col>
      <b-col sm="6" v-if="currentNode && [6, 9].includes(currentNode.process.type)">
        <div class="cardDiv text-left">
          <b-table
            :items="this.currentNode.project_jump ? [this.currentNode.project_jump] : []"
            :fields="columns1"
            responsive
            small
            head-variant
            class="text-left"
          >
            <template slot="name" slot-scope="row">
              {{ row.item.name}}
              <span style="float:right;" @click="deleteJumpHandle">
                <icon name="window-close" title="删除" style="cursor: pointer;"></icon>
              </span>
            </template>
          </b-table>
        </div>
        <div class="cardDiv text-left">
          <b-navbar toggleable="lg" style="background: #4169e1 !important">
            <b-input-group>
              <span class="input-group-text">
                <icon name="search"></icon>
              </span>
              <b-form-input v-model.lazy="queryDebounceParam.search" placeholder="请输入内容" />
            </b-input-group>
          </b-navbar>
          <b-table
            :items="projects.list"
            :fields="columns2"
            responsive
            hover
            small
            head-variant
            class="text-left"
            @row-clicked="selectProjectHandle"
          >
            <template slot="id" slot-scope>
              <span class="icon-select">✔</span>
            </template>
            <template slot="name" slot-scope="row">{{ row.item.name }}</template>
            <template slot="class" slot-scope="row">{{ row.item.type }}</template>
          </b-table>
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="12" align-v="center">
        <b-button size="lg" variant="primary" class="mr-5" @click="previousPage()">上一步</b-button>
        <b-button size="lg" variant="primary" @click="savePage()">保存</b-button>
      </b-col>
    </b-row>
    <imageView :visible="bigprocessModal" :src="processImgSrc" @on-close="bigprocessModal=false"></imageView>
  </div>
</template>

<script>
import ProjectService from "@/services/projectService";
import { expType, level, abilityTarget } from "@/filters/fun";
import { mapState } from "vuex";
import Loading from "@/components/loading/Loading";
import _ from "lodash";
import imageView from "@/components/imageView/ImageView";

export default {
  name: "wizard-4",
  components: {
    Loading,
    imageView
  },
  props: ["value"],
  filters: {
    expType,
    level,
    abilityTarget
  },
  data() {
    return {
      columns: {
        id: {
          label: "序号",
          sortable: false,
          class: "text-center field-sn"
        },
        name: {
          label: "环节名称",
          sortable: false,
          class: "text-center field-name"
        },
        matching_name: {
          label: "对应模块",
          sortable: false,
          class: "text-center field-creator"
        }
      },
      columns1: {
        name: {
          label: "要跳转的项目名称",
          sortable: false,
          class: "text-left"
        }
      },
      columns2: {
        id: {
          label: "选择",
          sortable: false,
          class: "text-center field-sn"
        },
        name: {
          label: "要跳转的项目名称",
          sortable: false,
          class: "text-center field-name"
        },
        class: {
          label: "类型",
          sortable: false,
          class: "text-center field-name"
        }
      },
      projectData: {},
      project_id: null,
      isSaved: false,
      currentNode: null,
      bigprocessModal: false,
      processImgSrc: "",
      nodes: [],
      projects: {
        list: [],
        total: 0
      },
      queryParam: {
        page: 1,
        size: 8
      },
      queryDebounceParam: {
        search: ""
      }
    };
  },
  created() {
    this.$nextTick(() => {
      this.project_id = this.$route.params.project_id;
      this.queryDetail();
      this.queryProjectList();
    });
  },
  computed: {
    ...mapState(["userInfo"])
  },
  watch: {
    queryParam: {
      handler() {
        this.queryProjectList();
      },
      deep: true
    },
    queryDebounceParam: {
      deep: true,
      handler: _.debounce(function() {
        this.queryProjectList();
      }, 500)
    }
  },
  methods: {
    updatePage: function(value) {
      this.$emit("input", value);
    },
    queryDetail() {
      this.run();
      ProjectService.getJumpDetail({
        project_id: this.project_id
      })
        .then(data => {
          this.projectData = data.project;
          this.nodes = data.project_nodes;
          this.isSaved = this.nodes
            .filter(node => [6, 9].includes(node.process.type))
            .some(node => node.project_jump);
          this.selectNode(this.nodes[0], 0);
          this.$emit("data-ready");
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },
    queryProjectList() {
      this.run();
      ProjectService.getProjectList({
        ...this.queryParam,
        ...this.queryDebounceParam
      }).then(data => {
        this.projects.list = data.results.map(i => {
          this.$set(i, "checked", false);
          return i;
        });
        this.projects.total = data.paging.count;
        this.$emit("data-ready");
      });
    },
    /* eslint-disable */
    selectNode(item, index) {
      this.nodes.map(node => {
        node._rowVariant = "";
        return node;
      });
      this.projects.list.map(project => {
        project._rowVariant = "";
        return project;
      });
      item._rowVariant = "primary";
      this.currentNode = item;
    },
    selectProjectHandle(item, index) {
      if (
        !!this.currentNode &&
        ![6, 9].includes(this.currentNode.process.type)
      ) {
        return;
      }
      if (this.projectData.id && item.id === this.projectData.id) {
        this.$toasted.error("跳转项目不能选择自己本身");
        return;
      }

      this.projects.list.map(project => {
        project._rowVariant = "";
        return project;
      });
      this.projects.list[index]._rowVariant = "primary";
      this.currentNode.project_jump = {
        id: item.id,
        name: item.name
      };
    },
    showBigProcessImg(img) {
      if (!img) {
        this.$toasted.error("当前程序模块没有图片,无法展示");
        return;
      }
      this.bigprocessModal = true;
      this.processImgSrc = img;
    },
    deleteJumpHandle() {
      this.isSaved = false;
      this.currentNode.project_jump = null;
    },
    savePage() {
      if (
        !this.nodes
          .filter(node => [6, 9].includes(node.process.type))
          .some(node => node.project_jump)
      ) {
        this.$toasted.error("某些跳转环节没有配置");
        return;
      }
      var jumpData = {};
      jumpData.project_jumps = this.nodes
        .filter(node => [6, 9].includes(node.process.type))
        .map(node => {
          return {
            node_id: node.id,
            jump_project_id: node.project_jump.id,
            processs_type: node.process.type
          };
        });
      ProjectService.postJumpSetup({
        project_id: this.$route.params.project_id,
        data: JSON.stringify(jumpData)
      }).then(() => {
        this.isSaved = true;
        this.$toasted.success("跳转设置成功");
      });
    },
    previousPage() {
      this.updatePage(2);
    }
  }
};
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss" scoped>
.wizard-4 {
}
</style>