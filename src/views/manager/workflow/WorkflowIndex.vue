<template>
  <div class="workflow-index">
    <loading v-if="isRunning"></loading>
    <b-row>
      <b-col lg="3" md="6" sm="12" class="mb-3">
        <b-input-group :size="template_size">
          <b-input-group-prepend>
            <span class="input-group-text">
              <icon name="search"></icon>
            </span>
          </b-input-group-prepend>
          <b-form-input v-model.lazy="queryDebounceParam.search" placeholder="请输入内容"/>
        </b-input-group>
      </b-col>
      <b-col lg="4" md="6" sm="12" class="align-self-center mb-3">
        <b-form-radio-group v-model="queryParam.status">
          <b-form-radio value>全部</b-form-radio>
          <b-form-radio value="2">已发布流程</b-form-radio>
          <b-form-radio value="1">未发布流程</b-form-radio>
        </b-form-radio-group>
      </b-col>
      <b-col lg="5" md="6" sm="12" class="align-self-center mb-3">
        <b-button-group class="float-right">
          <b-button :size="template_size" variant="outline-primary">公开</b-button>
          <b-button :size="template_size" variant="outline-primary">不公开</b-button>
          <b-button :size="template_size" variant="outline-primary" @click="newProcess">新建流程</b-button>
          <b-button :size="template_size" variant="outline-primary">发布流程</b-button>
          <b-button :size="template_size" variant="outline-primary">复制为未发布流程</b-button>
          <b-button :size="template_size" variant="outline-primary">共享</b-button>
          <b-button :size="template_size" variant="outline-primary">取消共享</b-button>
        </b-button-group>
      </b-col>
    </b-row>
    <b-table :items="workflows.list" small striped hover :fields="columns" head-variant>
      <template slot="sn" slot-scope="row">{{ row.index + 1 }}</template>
      <template slot="name" slot-scope="row">
        <input v-if="row.item.edited" type="text" class="inp-edit" v-model.trim="row.item.name">
        <span v-else class="text">{{row.item.name}}</span>
      </template>
      <template
        slot="creator"
        slot-scope="row"
      >{{row.item.created_by ? row.item.created_by.name : 'n/a'}}</template>
      <template slot="create_time" slot-scope="row">{{row.item.create_time}}</template>
      <template slot="rend_ani_1" slot-scope="row">
        <a
          href="javascript:;"
          class="btn-link"
          v-if="!row.item.edited"
          title="点击查看大图"
          @click="showBigImg(row.item.animation1)"
        >查看</a>
        <div v-else>
          <toggle-upload :item="row.item" @uploadSuccess="uploadAnimationSuccess"></toggle-upload>
        </div>
      </template>
      <template slot="rend_ani_2" slot-scope="row">
        <a
          href="javascript:;"
          class="btn-link"
          v-if="!row.item.edited"
          title="点击查看大图"
          @click="showBigImg(row.item.animation2)"
        >查看</a>
        <div v-else>
          <toggle-upload :item="row.item" :keyId="2" @uploadSuccess="uploadAnimationSuccess"></toggle-upload>
        </div>
      </template>
      <template slot="experiment_type_label" slot-scope="row">
        <b-form-select
          v-if="row.item.edited"
          v-model="row.item.type_label"
          :options="experimentTypeOptions"
        ></b-form-select>
        <span v-else class="text">{{ row.item.type_label | expType}}</span>
      </template>
      <template slot="experiment_task_label" slot-scope="row">
        <b-form-input v-if="row.item.edited" type="text" v-model="row.item.task_label"/>
        <span v-else class="text">{{row.item.task_label}}</span>
      </template>
      <template slot="status" slot-scope="row">
        <span v-if="row.item.status == 1">未发布</span>
        <span v-else>已发布</span>
      </template>
      <template slot="action" slot-scope="row">
        <a
          class="btn-link"
          href="javascript:;"
          v-if="row.item.edited"
          @click="saveWorkflow(row.item)"
        >保存</a>
        <a class="btn-link" href="javascript:;" v-else @click="editWorkflow(row.item)">编辑</a>
        <a
          class="btn-link"
          href="javascript:;"
          v-if="row.item.status == 2"
          @click="viewXmlHandler(row.item)"
        >查看</a>
        <router-link
          v-if="!!row.item.id && row.item.status == 1"
          :to="{ name: 'drawXML', params: { flow_id: row.item.id }}"
        >画图</router-link>
        <a
          class="btn-link"
          href="javascript:;"
          v-if="row.item.status == 2"
          @click="toSetPage(row.item)"
        >设置</a>
        <a href="javascript:;" @click="deleteWorkflowClick(row.item)">删除</a>
        <a
          href="javascript:;"
          v-if="isSuperFlag && row.item.protected == 0"
          @click="lockWorkflowClick(row.item)"
        >保护</a>
        <a
          href="javascript:;"
          v-if="isSuperFlag && row.item.protected == 1"
          @click="unlockWorkflowClick(row.item)"
        >解除保护</a>
      </template>
    </b-table>
    <b-row class="justify-content-center row-margin-tweak">
      <b-pagination
        :size="template_size"
        :total-rows="workflows.total"
        :per-page="queryParam.size"
        limit="5"
        v-model="queryParam.page"
      ></b-pagination>
    </b-row>
    <!-- 查看大图Modal -->
    <image-view :visible="bigImgModal" :src="animationImgSrc" @on-close="bigImgModal=false"></image-view>
    <!-- 查看流程图 -->
    <view-xml :visible="xmlModalShow" :xml="workflowXml" @on-close="xmlModalShow = false"></view-xml>
    <b-modal v-model="deleteModal" title="删除提醒" size="lg" :showPerson="true">
      <b-container fluid>
        <div v-if="relatedProjects.length == 0" class="modal-msg">
          <p class="message">该流程已被应用到项目中，删除流程后，若相关的项目没有被生成业务，则该项目将被一起删除；若相关的项目已经生成业务，相关的业务可继续执行，该项目将不可生新的业务。</p>
        </div>
      </b-container>
      <div slot="modal-footer" class="w-100">
        <b-button variant="danger" class="float-center mr-2" @click="confirmDelete()">确定</b-button>
        <b-button variant="secondary" class="float-center" @click="deleteModal=false">取消</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { expType, level, abilityTarget } from "@/filters/fun";
import { mapState, mapActions } from "vuex";
import Loading from "@/components/loading/Loading";
import ToggleUpload from "@/components/upload/ToggleUpload";
import workflowService from "@/services/workflowService";
import ImageView from "@/components/imageView/ImageView";
import ViewXml from "@/components/workflowXML/ViewXML";
import _ from "lodash";
import arrayUtils from "@/utils/arrayUtils";
import dateUtils from "@/utils/dateUtils";

export default {
  name: "workflow-index",
  components: {
    Loading,
    ImageView,
    ViewXml,
    ToggleUpload
  },
  filters: {
    expType,
    level,
    abilityTarget
  },
  data() {
    return {
      columns: {
        sn: {
          label: "序号",
          sortable: false,
          class: "text-center field-sn"
        },
        name: {
          label: "流程名",
          sortable: false,
          class: "text-center field-name"
        },
        creator: {
          label: "创建者",
          sortable: false,
          class: "text-center field-creator"
        },
        create_time: {
          label: "创建时间",
          sortable: false,
          class: "text-center field-create_time"
        },
        rend_ani_1: {
          label: "渲染动画1",
          sortable: false,
          class: "text-center field-rend_ani_1"
        },
        rend_ani_2: {
          label: "渲染动画2",
          sortable: false,
          class: "text-center field-rend_ani_2"
        },
        experiment_type_label: {
          label: "事务类型",
          sortable: false,
          class: "text-center field-experiment_type_label"
        },
        experiment_task_label: {
          label: "流程标签",
          sortable: false,
          class: "text-center field-experiment_task_label"
        },
        status: {
          label: "状态",
          sortable: false,
          class: "text-center field-status"
        },
        action: {
          label: "操作",
          sortable: false,
          class: "text-center field-action"
        }
      },
      // 查询参数
      queryParam: {
        status: "",
        page: 1,
        size: 15
      },
      queryDebounceParam: {
        search: ""
      },
      // 流程列表
      workflows: {
        list: [],
        total: 0
      },
      // 流程相关项目
      relatedProjects: [],
      animationImgSrc: "",
      copyModalName: "",
      workflowXml: null,
      deleteModal: false,
      publishModal: false,
      copyModal: false,
      bigImgModal: false,
      newFlowStatus: false,
      xmlModalShow: false,
      relatedShow: false,
      isSuperFlag: false,
      shareModal: false,
      experimentTypeOptions: [
        { value: "1", text: "立法类型实验" },
        { value: "2", text: "执法类型实验" },
        { value: "3", text: "诉讼与仲裁实验" },
        { value: "4", text: "自由类型实验" },
        { value: "5", text: "非诉讼与法务管理类型实验" },
        { value: "6", text: "法律思维类型实验" },
        { value: "7", text: "证据科学类型实验" },
        { value: "8", text: "法律实效评价类型实验" }
      ],
      newProcessAdded: false
    };
  },
  created() {
    this.$nextTick(() => {
      this.isSuperFlag = this.userInfo.identity === 1;
      this.queryWorkflowList();
    });
  },
  mounted() {
    // 绑定键盘删除操作
    document.addEventListener("keyup", e => {
      if (e.ctrlKey && e.keyCode === 46) {
        this.confirmDelete();
      }
    });
  },
  computed: {
    ...mapState(["userInfo"])
  },
  watch: {
    // 监控查询参数，如有变化 查询列表数据
    queryParam: {
      handler() {
        this.queryWorkflowList();
      },
      deep: true
    },
    queryDebounceParam: {
      deep: true,
      handler: _.debounce(function() {
        this.queryWorkflowList();
      }, 500)
    }
  },
  methods: {
    ...mapActions(["setFlowStep"]),
    // 查询流程列表数据
    queryWorkflowList() {
      this.run();
      workflowService
        .fetchList({ ...this.queryParam, ...this.queryDebounceParam })
        .then(data => {
          data.results.forEach(item => {
            if (item.checked === undefined) {
              item.checked = false;
            }
            if (item.locked === undefined) {
              item.locked = false;
            }
          });
          this.workflows.list = data.results;
          this.workflows.total = data.paging.count;
          if (this.newProcessAdded) {
            this.addNewProcess();
          }
          this.$emit("data-ready");
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },
    // 查看渲染动画的大图
    showBigImg(animation) {
      this.animationImgSrc = animation.url;
      this.bigImgModal = true;
    },
    // 验证编辑的流程数据
    validateData(workflow) {
      if (workflow.name === "") {
        this.$toasted.error("请输入流程名称");
        return false;
      }
      if (workflow.name.length > 20) {
        this.$toasted.error("流程名称应不超过20字");
        return false;
      }
      if (!workflow.animation1) {
        this.$toasted.error("请上传渲染动画1");
        return false;
      }
      if (!workflow.animation2) {
        this.$toasted.error("请上传渲染动画2");
        return false;
      }
      if (workflow.task_label === "") {
        this.$toasted.error("请输入流程的实验任务标签");
        return false;
      }
      if (workflow.task_label.length > 20) {
        this.$toasted.error("实验任务标签应不超过20字");
        return false;
      }
      return true;
    },
    // 新建流程
    newProcess() {
      if (this.queryParam.status === "") {
        this.addNewProcess();
      } else {
        this.newProcessAdded = true;
        this.queryParam.status = "";
      }
    },
    addNewProcess() {
      this.workflows.list.unshift({
        name: "",
        created_by: { name: this.userInfo.name },
        create_time: dateUtils.todayString(),
        animation1: "",
        animation2: "",
        type_label: 1,
        task_label: "",
        status: 1,
        edited: true,
        checked: false
      });
      // this.workflows.total++;
      this.newProcessAdded = false;
      this.newFlowStatus = true;
    },
    // 上传渲染动画成功回调
    uploadAnimationSuccess(data) {
      let item = arrayUtils.find(this.workflows.list, data);
      item.animation1 = data.animation1;
      item.animation2 = data.animation2;
    },
    saveWorkflowData(workflow) {
      let data = {
        name: workflow.name,
        animation1: workflow.animation1.id,
        animation2: workflow.animation2.id,
        type_label: workflow.type_label,
        task_label: workflow.task_label
      };
      if (workflow.id) data.flow_id = workflow.id;
      return data;
    },
    // 保存编辑的流程
    saveWorkflow(workflow) {
      if (this.validateData(workflow)) {
        let data = this.saveWorkflowData(workflow);
        if (workflow.id) {
          // 更新流程
          workflowService.updateWorkflow(data).then(() => {
            this.$toasted.success("更新流程成功");
            this.queryWorkflowList();
          });
        } else {
          // 创建新流程
          workflowService.create(data).then(() => {
            this.$toasted.success("保存新建流程成功");
            this.queryWorkflowList();
          });
        }
        this.newFlowStatus = false;
      }
    },
    // 编辑流程
    editWorkflow(workflow) {
      if (workflow.protected === 1) {
        this.$toasted.warn("该流程已被保护,请解除保护后进行编辑");
      } else {
        this.$set(workflow, "edited", true);
      }
    },
    viewXmlHandler(workflow) {
      this.workflowXml = workflow.xml;
      this.xmlModalShow = true;
    },
    // 点击删除流程按钮
    deleteWorkflowClick(workflow) {
      if (workflow.protected === 1) {
        this.$toasted.warn("该流程已被保护,请解除保护后再进行删除");
      } else {
        if (!workflow.id) {
          this.workflows.list.splice(this.workflows.list.indexOf(workflow), 1);
          this.newFlowStatus = false;
          return;
        }
        this.relatedShow = false;
        workflowService
          .getWorkflowRelated({ flow_id: workflow.id })
          .then(data => {
            this.relatedProjects = data.map(i => {
              this.$set(i, "expanded", false);
              return i;
            });
          });
        this.deleteModal = true;
        this.currentDeleteItem = workflow;
      }
    },
    deleteWorkflowHandler() {
      workflowService
        .deleteWorkflow({ flow_id: this.currentDeleteItem.id })
        .then(() => {
          this.$toasted.success("删除流程成功");
          this.queryWorkflowList();
        });
    },
    // Ctr+Delete 确定删除
    confirmDelete() {
      // 首次删除提醒
      if (this.deleteModal) {
        this.deleteWorkflowHandler();
        this.deleteModal = false;
      }
    },
    toSetPage(item) {
      if (item.protected === 1) {
        this.$toasted.warn("该流程已被保护,请解除保护后进行设置");
      } else {
        this.setFlowStep(item.step);
        this.$router.push({
          name: "setworkflowNode",
          params: {
            flow_id: item.id
          }
        });
      }
    }
  }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.workflow-index {
  .field-sn {
    width: 7%;
  }
  .field-name {
    width: 10%;
  }
  .field-creator {
    width: 9%;
  }
  .field-create_time {
    width: 9%;
  }
  .field-rend_ani_1 {
    width: 10%;
  }
  .field-rend_ani_2 {
    width: 10%;
  }
  .field-experiment_type_label {
    width: 10%;
  }
  .field-experiment_task_label {
    width: 10%;
  }
  .field-status {
    width: 5%;
  }
  .field-action {
    width: 20%;
  }
  .table th,
  .table td {
    vertical-align: middle;
  }
  .modal-body {
    .message {
      font-size: 16px;
    }
    .tip {
      font-size: 14px;
      color: #999;
    }
  }
}
</style>