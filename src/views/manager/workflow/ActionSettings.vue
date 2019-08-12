<template>
  <div class="action-settings">
    <loading v-if="isRunning"></loading>
    <b-row class="cardDiv px-0">
      <b-col md="3" sm="12">
        <workflow-module :flowName="workflow.name" :flowXml="workflow.xml"></workflow-module>
      </b-col>
      <b-col md="2" sm="12">
        <div class style="height: 460px; border: 1px solid #eaeaea; overflow: auto">
          <b-table
            :items="actions"
            borderless
            small
            hover
            :fields="actionColumns"
            head-variant
            @row-clicked="selectAction"
          >
            <template slot="name" slot-scope="row">{{row.item.name}}</template>
          </b-table>
        </div>
      </b-col>
      <b-col md="3" sm="12">
        <div class style="height: 460px; border: 1px solid #eaeaea; overflow: auto">
          <b-table
            :items="nodes"
            borderless
            small
            hover
            :fields="nodeColumns"
            head-variant
            @row-clicked="nodeOnSelect"
          >
            <template slot="sn" slot-scope="row">{{ row.index + 1 }}</template>
            <template slot="name" slot-scope="row">{{row.item.name}}</template>
            <template slot="process_name" slot-scope="row">
              <a
                href="javascript:;"
                class="case-text"
                @click="showCurImage(row.item.process.image)"
              >{{row.item.process.name}}</a>
            </template>
          </b-table>
        </div>
      </b-col>
      <b-col md="4" sm="12">
        <div class style="height: 460px; border: 1px solid #eaeaea; overflow: auto">
          <table class="table b-table table-hover table-borderless table-sm role-allocation">
            <thead role="rowgroup">
              <tr>
                <th class="text-left field-role-alloc-type">身份类型</th>
                <th class="text-left field-role-alloc-name">身份名称</th>
                <th class="text-left field-role-allo-action">
                  <b-form-checkbox v-model="is_all_use">配置动作</b-form-checkbox>
                </th>
              </tr>
            </thead>
            <tbody role="rowgroup" v-if="isAnimation">
              <tr
                class="tr-allocation"
                v-for="(nodeActionRole, index) in curNodeActionRoles"
                :key="index"
              >
                <td>{{nodeActionRole.role_type}}</td>
                <td>{{nodeActionRole.role_name}}</td>
                <td>
                  <b-form-checkbox
                    v-model="nodeActionRole.is_use"
                    @change="checkUseHandle($event, nodeActionRole)"
                  ></b-form-checkbox>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </b-col>
      <b-col cols="12" class="mt-3">
        <b-button variant="success" class="mr-1" @click="savePage">保存</b-button>
      </b-col>
    </b-row>
    <!-- 查看大图Modal -->
    <image-view
      :visible="processImageModal"
      :src="processImage"
      @on-close="processImageModal=false"
    ></image-view>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import workflowModule from "@/components/workflow/flow-module";
import ImageView from "@/components/imageView/ImageView";
import Loading from "@/components/loading/Loading";
import workflowService from "@/services/workflowService";
import _ from "lodash";

export default {
  name: "action-settings",
  components: { Loading, workflowModule, ImageView },
  data() {
    return {
      nodeColumns: {
        sn: {
          label: "序号",
          sortable: false,
          class: "text-right field-node-sn"
        },
        name: {
          label: "环节名称",
          sortable: false,
          class: "text-left field-node-name"
        },
        process_name: {
          label: "对应模块",
          sortable: false,
          class: "text-left field-node-process_name"
        }
      },
      actionColumns: {
        name: {
          label: "动作",
          sortable: false,
          class: "text-left w-100"
        }
      },
      workflow: {},
      nodes: [],
      nodeActiveIndex: -1,
      actions: [],
      actionActiveIndex: -1,
      roleActionAssign: {},
      nodeActionRoles: [],
      curNodeActionRoles: [],
      is_all_use: false,
      processImageModal: false,
      processImage: ""
    };
  },
  computed: {
    ...mapState(["userInfo", "flowStep"]),
    flowId() {
      return this.$route.params.flow_id;
    },
    activeNode() {
      if (this.nodes.length === 0 || this.nodeActiveIndex == -1) return null;
      return this.nodes[this.nodeActiveIndex];
    },
    activeAction() {
      if (this.actions.length === 0 || this.actionActiveIndex == -1)
        return null;
      return this.actions[this.actionActiveIndex];
    },
    isAnimation() {
      if (!this.activeNode) return false;
      if (this.activeNode.process.type === 1) {
        return true;
      }
      return false;
    }
  },
  created() {
    this.$nextTick(() => {
      this.init();
    });
  },
  watch: {
    is_all_use(value) {
      if (this.curNodeActionRoles.length == 0) return;
      this.curNodeActionRoles.forEach(cnar => {
        cnar.is_use = value;
        this.checkUseHandle(value, cnar);
      });
    }
  },
  methods: {
    ...mapActions(["setFlowStep"]),
    init() {
      this.run();
      let param = { flow_id: this.flowId };
      const apis = [
        workflowService.getWorkflowDetail(param),
        workflowService.getWorkflowRoleActions(param)
      ];
      Promise.all(apis)
        .then(response => {
          this.workflow = response[0];
          this.nodes = response[0].nodes;
          this.roleActionAssign = response[1];
          this.actions = this.roleActionAssign.flow_actions;
          this.nodeActionRoles = [];

          this.roleActionAssign.nodes.forEach(node => {
            this.nodeActionRoles[
              node.id
            ] = this.roleActionAssign.action_allocations.filter(
              action_allocation => action_allocation.node_id === node.id
            );
          });

          if (this.nodes.length > 0) {
            this.nodeOnSelect(this.nodes[0], 0);
          }

          if (this.actions.length > 0) {
            this.selectAction(this.actions[0], 0);
          }
          this.$emit("data-ready");
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },

    getCurNodes2Roles() {
      if (!this.activeNode || !this.activeAction) {
        return [];
      }
      this.curNodeActionRoles = this.nodeActionRoles[this.activeNode.id].map(
        nodeActionRole => {
          return {
            node_id: nodeActionRole.node_id,
            node_name: nodeActionRole.node_name,
            role_id: nodeActionRole.role_id,
            no: nodeActionRole.no,
            role_name: nodeActionRole.role_name,
            role_type: nodeActionRole.role_type,
            is_use:
              nodeActionRole.flow_action_ids.indexOf(this.activeAction.id) !==
              -1
          };
        }
      );
    },
    // 查看对应模块大图
    showCurImage(image) {
      if (!image) {
        this.$toasted.error("当前程序模块没有图片,无法展示");
        return;
      }
      this.processImageModal = true;
      this.processImage = image;
    },
    // Click Node
    nodeOnSelect(item, index) {
      this.nodeActiveIndex = index;
      this.nodes.map(node => {
        this.$set(node, "_rowVariant", "");
        return node;
      });
      this.$set(item, "_rowVariant", "primary");
      if (item.process.type == 1) {
        this.getCurNodes2Roles();
      } else {
        this.curNodeActionRoles = [];
      }
    },
    selectAction(item, index) {
      this.actionActiveIndex = index;
      this.actions.map(action => {
        this.$set(action, "_rowVariant", "");
        return action;
      });
      this.$set(item, "_rowVariant", "primary");
      this.getCurNodes2Roles();
    },
    checkUseHandle(val, nodeActionRole) {
      let nar = _.find(this.nodeActionRoles[this.activeNode.id], {
        node_id: nodeActionRole.node_id,
        role_id: nodeActionRole.role_id,
        no: nodeActionRole.no
      });
      if (val) {
        nar.flow_action_ids = _.union(nar.flow_action_ids, [
          this.activeAction.id
        ]);
      } else {
        _.remove(nar.flow_action_ids, id => {
          return id == this.activeAction.id;
        });
      }
    },
    // 点击保存
    savePage() {
      let result = [];
      this.run();
      this.nodeActionRoles.forEach(enars => {
        enars.forEach(nar => {
          result.push({
            node_id: nar.node_id,
            role_id: nar.role_id,
            no: nar.no,
            flow_action_ids: nar.flow_action_ids
          });
        });
      });
      workflowService
        .saveWorkflowRoleAction({
          flow_id: this.flowId,
          data: JSON.stringify(result)
        })
        .then(() => {
          this.$emit("data-ready");
        })
        .catch(() => {
          this.$emit("data-field");
        });
    }
  }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.action-settings {
  .field-node-sn {
    vertical-align: middle;
    width: 15%;
  }
  .field-node-name {
    vertical-align: middle;
    width: 45%;
  }
  .field-node-process_name {
    vertical-align: middle;
    width: 40%;
  }
  .field-role-alloc-type {
    vertical-align: middle;
    width: 40%;
  }
  .field-role-alloc-name {
    vertical-align: middle;
    width: 40%;
  }
  .field-role-alloc-action {
    vertical-align: middle;
    width: 20%;
  }
}
</style>