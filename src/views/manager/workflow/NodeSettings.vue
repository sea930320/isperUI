<template>
  <div class="node-settings">
    <loading v-if="isRunning"></loading>
    <b-row class="cardDiv px-0">
      <b-col md="4" sm="12">
        <workflow-module :flowName="workflow.name" :flowXml="workflow.xml"></workflow-module>
      </b-col>
      <b-col md="8" sm="12">
        <div class style="min-height: 460px; border: 1px solid #eaeaea;">
          <b-table :items="flowNodes" borderless small hover :fields="columns" head-variant>
            <template slot="HEAD_viewable" slot-scope="head">
              <b-form-checkbox v-model="allChecked">{{head.label}}</b-form-checkbox>
            </template>
            <template slot="sn" slot-scope="row">{{ row.index + 1 }}</template>
            <template slot="link_name" slot-scope="row">{{row.item.name}}</template>
            <template slot="modules" slot-scope="row">
              <span
                class="badge badge-success mr-2"
              >{{row.item.process===null ? '' : row.item.process.name}}</span>
              <a
                href="javascript:;"
                class="btn-text"
                @click="showModuleModal(row.item)"
              >{{!row.item.process ? '请选择' : '重新选择'}}</a>
            </template>
            <template slot="viewable" slot-scope="row">
              <b-form-checkbox v-model="row.item.look_on"></b-form-checkbox>
            </template>
          </b-table>
        </div>
      </b-col>
      <b-col cols="12" class="mt-3">
        <b-button variant="success" class="mr-1" @click="savePage">保存</b-button>
        <b-button
          variant="primary"
          v-show="flowStep && flowStep>0"
          class="ml-1"
          @click="nextPage"
        >下一步</b-button>
      </b-col>
    </b-row>
    <!-- 对应程序模块Modal -->
    <process-modal :flowProcess="flowProcess" @on-ok="selectOkHandler"></process-modal>
    <!-- 对应程序模块Modal -->
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import Loading from "@/components/loading/Loading";
import { processType } from "@/filters/fun";
import workflowService from "@/services/workflowService";
import workflowModule from "@/components/workflow/flow-module";
import processModal from "@/components/workflow/process-modal";
export default {
  name: "node-settings",
  components: { Loading, workflowModule, processModal },
  data() {
    return {
      columns: {
        sn: {
          label: "序号",
          sortable: false,
          class: "text-right field-sn"
        },
        link_name: {
          label: "环节名称",
          sortable: false,
          class: "text-left field-link_name"
        },
        modules: {
          label: "对应的程序模块",
          sortable: false,
          class: "text-left field-modules"
        },
        viewable: {
          label: "允许旁观",
          sortable: false,
          class: "text-left field-viewable"
        }
      },
      workflow: {},
      flowNodes: [],
      flowProcess: [],
      isLoading: false,
      curFlowNode: null,
      allChecked: false
    };
  },
  filters: { processType },
  computed: {
    ...mapState(["userInfo", "flowStep"]),
    flowId() {
      return this.$route.params.flow_id;
    }
  },
  created() {
    this.$nextTick(() => {
      this.init();
    });
  },
  watch: {
    allChecked: {
      handler(val) {
        if (val) {
          this.flowNodes.map(item => {
            item.look_on = true;
            return item;
          });
        } else {
          this.flowNodes.map(item => {
            item.look_on = false;
            return item;
          });
        }
      }
    }
  },
  methods: {
    ...mapActions(["setFlowStep"]),
    init() {
      this.allChecked = false;
      this.run();
      const apis = [
        workflowService.getProcesses(),
        workflowService.getWorkflowDetail({ flow_id: this.flowId })
      ];
      Promise.all(apis)
        .then(response => {
          this.flowProcess = response[0];
          this.workflow = response[1];
          this.flowNodes = response[1].nodes.filter(x=>!x.is_parallel_start_node);
          this.setFlowStep(response[1].step);
          this.$emit("data-ready");
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },
    showModuleModal(flowNode) {
      this.curFlowNode = flowNode;
      this.$emit("openProcessModal", flowNode ? flowNode.process : null);
    },
    selectOkHandler(item) {
      this.curFlowNode.process = item;
    },
    // 保存之前验证是否选择程序模块
    validateSaveData() {
      let a = true,
        count = 0;
      a = this.flowNodes.every(item => {
        if (!item.process || !item.process.name) {
          this.$toasted.error(`请选择${item.name}对应的程序模块`);
          return false;
        }
        return true;
      });
      if (!a) return a;
      this.flowNodes.forEach(node => {
        if (node.process.type === 4) count++;
      });
      if (count > 1) {
        a = a && false;
        this.$toasted.error("请输入分析与总结模块只能有一个");
      }
      return a;
    },
    // 格式化要保存的数据
    formatSavaData() {
      let nodeParams = this.flowNodes.map(item => {
        return {
          id: item.id,
          name: item.name,
          process_id: item.process.id,
          look_on: item.look_on,
          condition: item.condition,
          type: item.process.type
        };
      });

      let params = {
        flow_id: this.flowId,
        nodes: JSON.stringify(nodeParams)
      };
      return params;
    },
    // 点击保存
    savePage() {
      if (this.validateSaveData()) {
        workflowService
          .updateWorkflowNodes(this.formatSavaData())
          .then(data => {
            this.setFlowStep(data.step);
            this.$toasted.success("保存成功");
          });
      }
    },
    nextPage() {
      this.$router.push({
        name: "setworkflow-doc",
        params: {
          flow_id: this.flowId
        }
      });
    }
  }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.node-settings {
  .field-sn {
    width: 10%;
  }

  .field-link_name {
    width: 15%;
  }

  .field-modules {
    width: 55%;
  }

  .field-viewable {
    width: 20%;
  }
}
</style>
