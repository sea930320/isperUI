<template>
  <div class="doc-settings">
    <loading v-if="isRunning"></loading>
    <b-row class="cardDiv px-0">
      <b-col cols="12">
        <div class="upload-resourse float-right mb-3">
          <span class="upload-resourse-tip mr-2">
            提示：
            <b>操作指南</b> 和
            <b>模板</b> 类型只能上传docx格式（doc格式无法读取文档内容，请谅解, 其他的用途类型格式不限）
          </span>
          <b-button-group>
            <b-button
              size="sm"
              variant="outline-primary"
              class="styledBtn"
              @click.stop="uploadData"
            >
              <icon name="upload"/>&nbsp;上传素材
            </b-button>
            <b-button
              size="sm"
              variant="outline-primary"
              class="styledBtn"
              @click.stop="uploadDocs"
            >
              <icon name="upload"/>&nbsp;导入操作指南
            </b-button>
          </b-button-group>
        </div>
      </b-col>
      <b-col md="3" sm="12">
        <workflow-module :flowName="workflow.name" :flowXml="workflow.xml"></workflow-module>
      </b-col>
      <b-col md="6" sm="12">
        <div class style="min-height: 460px; border: 1px solid #eaeaea;">
          <b-table
            :items="flowDocs"
            borderless
            small
            hover
            :fields="docColumns"
            head-variant
            @row-clicked="docOnSelect"
          >
            <template slot="sn" slot-scope="row">{{ row.index + 1 }}</template>
            <template slot="name" slot-scope="row">{{row.item.name}}</template>
            <template slot="type" slot-scope="row">
              <b-form-input size="sm" type="text" v-model.trim="row.item.type"/>
            </template>
            <template slot="usage" slot-scope="row">
              <b-form-select
                size="sm"
                v-model="row.item.usage"
                :options="usageOptions"
                @change="changeUseHandle(row.item)"
              ></b-form-select>
            </template>
            <template slot="action" slot-scope="row">
              <a href="javascript:void(0);" @click="previewFile(row.item.file)">预览</a>
              <a :href="row.item.file" target="_blank">下载</a>
              <a href="javascript:;" @click="deleteDocClick(row.item)">删除</a>
            </template>
          </b-table>
        </div>
      </b-col>
      <b-col md="3" sm="12">
        <div class style="min-height: 460px; border: 1px solid #eaeaea;">
          <b-table
            :items="docNodeRelated"
            borderless
            small
            hover
            :fields="docNodeRelatedColumns"
            head-variant
          >
            <template slot="HEAD_doc_use" slot-scope="head">
              <b-form-checkbox v-model="docAllCheck">{{head.label}}</b-form-checkbox>
            </template>
            <template slot="sn" slot-scope="row">{{ row.index + 1 }}</template>
            <template slot="name" slot-scope="row">{{row.item.name}}</template>
            <template slot="doc_use" slot-scope="row">
              <b-form-checkbox v-model="row.item.doc_use" @on-change="onSelect(row.item)"></b-form-checkbox>
            </template>
          </b-table>
        </div>
      </b-col>
      <b-col cols="12" class="mt-3">
        <b-button variant="primary" class="mr-1" @click="LastPage">上一步</b-button>
        <b-button variant="success" class="mr-1" @click="savePage">保存</b-button>
        <b-button
          variant="primary"
          v-show="flowStep && flowStep>1"
          class="ml-1"
          @click="nextPage"
        >下一步</b-button>
      </b-col>

      <!-- upload-modal -->
      <upload-modal @on-uploadConfirm="onUploadModalConfirm" @on-cancel="uploadModalType=0">
        <template v-if="uploadModalType == 2">
          <p style="font-size: 13px;">
            <b>请下载本流程操作指南导入模板，填写数据后导入</b>
          </p>
          <a
            :href="'/api/workflow/opt/export?flow_id=' + flowId"
            target="blank"
            class="btn-link"
          >本流程操作指南导入模板下载</a>
        </template>
      </upload-modal>

      <!-- 删除流程Modal -->
      <b-modal
        v-model="deleteModal"
        title="删除提醒"
        ok-title="确定"
        cancel-title="取消"
        @cancel="deleteModal=false"
        @ok="comfirmDelete"
      >
        <div class="modal-msg">
          <p class="message">是否确认要删除本素材?</p>
        </div>
      </b-modal>
    </b-row>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import Loading from "@/components/loading/Loading";
import { processType } from "@/filters/fun";
import workflowService from "@/services/workflowService";
import workflowModule from "@/components/workflow/flow-module";
import uploadModal from "@/components/common/uploadModal";
import { openFile } from "@/utils/previewFile";
export default {
  name: "doc-settings",
  components: { Loading, workflowModule, uploadModal },
  data() {
    return {
      docColumns: {
        sn: {
          label: "序号",
          sortable: false,
          class: "text-center field-sn"
        },
        name: {
          label: "素材名称",
          sortable: false,
          class: "text-center field-name"
        },
        type: {
          label: "素材类型",
          sortable: false,
          class: "text-center field-type"
        },
        usage: {
          label: "用途",
          sortable: false,
          class: "text-center field-usage"
        },
        action: {
          label: "操作",
          sortable: false,
          class: "text-center field-action"
        }
      },
      docNodeRelatedColumns: {
        sn: {
          label: "序号",
          sortable: false,
          class: "text-center field-rel-sn"
        },
        name: {
          label: "素材名称",
          sortable: false,
          class: "text-center field-rel-name"
        },
        doc_use: {
          label: "素材类型",
          sortable: false,
          class: "text-center field-rel-doc_use"
        }
      },
      usageOptions: [
        { value: "1", text: "操作指南" },
        { value: "2", text: "关联文件" },
        { value: "3", text: "模板" }
      ],
      workflow: {},
      flowNodes: [],
      flowDocs: [],
      uploadModalType: 0,
      docActiveIndex: -1, // 当前选中文档index
      deleteModal: false,
      currentDeleteItem: [],
      meterialUploadUrl: "/api/workflow/docs/create",
      uploadParams: {
        flow_id: this.$route.params.flow_id
      },
      nodeChecked: [],
      flowNodesAssign: [],
      docAllCheck: false
    };
  },
  filters: { processType },
  computed: {
    ...mapState(["userInfo", "flowStep"]),
    flowId() {
      return this.$route.params.flow_id;
    },
    // 当前选中素材ID
    curDocId() {
      if (this.flowDocs.length === 0) return null;
      return this.flowDocs[this.docActiveIndex].id;
    },
    curDoc() {
      if (this.flowDocs.length === 0) return null;
      return this.flowDocs[this.docActiveIndex];
    },
    docNodeRelated() {
      return this.flowNodes.map(node => {
        return {
          id: node.id,
          name: node.name,
          doc_use:
            this.flowDocs.length === 0
              ? false
              : this.curDoc.node_ids.indexOf(node.id) !== -1
        };
      });
    }
  },
  watch: {
    docAllCheck: {
      handler(val) {
        if (this.flowDocs.length === 0) {
          this.$toasted.error("当前无文档，请先上传");
          return;
        }
        this.docNodeRelated.forEach(node => {
          node.doc_use = val;
          let index = this.curDoc.node_ids.indexOf(node.id);
          if (node.doc_use) {
            if (index === -1)
              this.flowDocs[this.docActiveIndex].node_ids.push(node.id);
          } else {
            if (index !== -1)
              this.flowDocs[this.docActiveIndex].node_ids.splice(index, 1);
          }
        });
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    ...mapActions(["setFlowStep"]),
    init() {
      this.docAllCheck = false;
      this.run();
      let param = {
        flow_id: this.flowId
      };
      workflowService
        .getWorkflowDetail(param)
        .then(data => {
          this.workflow = data;
          this.flowNodes = data.nodes;
          this.setFlowStep(data.step);
          // 获取素材
          workflowService
            .getWorkflowDocList(param)
            .then(data => {
              this.flowDocs = data.doc_list;
              if (data.doc_list.length > 0) {
                this.docOnSelect(data.doc_list[0], 0);
              }
              this.$emit("data-ready");
            })
            .catch(() => {
              this.$emit("data-failed");
            });
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },
    // 选择某个文档
    docOnSelect(item, index) {
      this.docActiveIndex = index;
      this.flowDocs.map(doc => {
        doc._rowVariant = "";
        return doc;
      });
      this.curDoc._rowVariant = "primary";
    },
    // 是否使用本素材checkbox操作
    onSelect(node) {
      if (this.flowDocs.length === 0) {
        node.doc_use = false;
        this.$toasted.error("当前无文档，请先上传");
        return;
      }
      let index = this.curDoc.node_ids.indexOf(node.id);
      if (!node.doc_use) {
        if (index === -1)
          this.flowDocs[this.docActiveIndex].node_ids.push(node.id);
      } else {
        if (index !== -1)
          this.flowDocs[this.docActiveIndex].node_ids.splice(index, 1);
      }
    },
    // 切换用途
    changeUseHandle(doc) {
      if (doc.usage == 1 || doc.usage == 3) {
        if (
          doc.name.substring(doc.name.lastIndexOf(".") + 1).toLowerCase() !==
          "docx"
        ) {
          this.$toasted.error("模板或操作指南用途必须是docx格式的文件");
          doc.usage = null;
          return false;
        }
      }
    },
    previewFile(fileUrl) {
      openFile(fileUrl, this.userInfo.id);
    },
    // 点击素材删除按钮
    deleteDocClick(docsItem) {
      this.deleteModal = true;
      this.currentDeleteItem = docsItem;
    },
    // 确认删除素材
    comfirmDelete() {
      this.deleteModal = false;
      workflowService
        .deleteWorkflowDoc({ doc_id: this.currentDeleteItem.id })
        .then(data => {
          this.flowDocs.splice(
            this.flowDocs.indexOf(this.currentDeleteItem),
            1
          );
          this.setFlowStep(data.step);
          if (this.flowDocs.length > 0) {
            this.docOnSelect(this.flowDocs[0], 0);
          } else {
            this.docNodeRelated.forEach(node => {
              node.doc_use = false;
            });
          }
        });
    },
    LastPage() {
      this.$router.push({ name: "setworkflow-node" });
    },
    // 验证数据是否正确和完整
    validateSaveData() {
      if (this.flowDocs.length === 0) {
        this.$toasted.error("请上传素材");
        return false;
      }
      return this.flowDocs.every(doc => {
        if (doc.type === "") {
          this.$toasted.error(`请填写素材${doc.name}的类型`);
          return false;
        }

        if (!doc.usage) {
          this.$toasted.error(`请选择素材${doc.name}的用途`);
          return false;
        }

        if (
          (doc.usage === 1 || doc.usage === 3) &&
          doc.name.substring(doc.name.lastIndexOf(".") + 1).toLowerCase() !==
            "docx"
        ) {
          this.$toasted.error(
            `素材【${
              doc.name
            }】格式不是docx，不得选择操作指南或模板用途，请重新选择`
          );
          return false;
        }

        if (doc.node_ids.length === 0) {
          this.$toasted.error(`素材${doc.name}没有任何环节使用`);
          return false;
        }
        return true;
      });
    },
    // 点击保存
    savePage() {
      if (this.validateSaveData()) {
        let data = this.flowDocs.map(doc => {
          return {
            id: doc.id,
            type: doc.type,
            usage: doc.usage,
            node_ids: doc.node_ids
          };
        });

        workflowService
          .updateWorkflowDoc({ docs: JSON.stringify(data) })
          .then(data => {
            this.setFlowStep(data.step);
            this.$toasted.success("保存成功");
          });
      }
    },
    nextPage() {
      this.$router.push({
        name: "setworkflowRoleAppend",
        params: {
          flow_id: this.flowId
        }
      });
    },
    uploadData() {
      this.$emit("openUploadModal", {
        uploadUrl: this.meterialUploadUrl,
        uploadParams: this.uploadParams
      });
      this.uploadModalType = 1;
    },
    uploadDocs() {
      this.$emit("openUploadModal", {
        uploadUrl: "/api/workflow/opt/import",
        uploadParams: this.uploadParams
      });
      this.uploadModalType = 2;
    },
    onUploadModalConfirm(data) {
      if (this.uploadModalType == 1) {
        this.onUploadOk(data);
      } else {
        this.batchUploadOk();
      }
      this.uploadModalType = 0;
    },
    // 确认上传素材
    onUploadOk(data) {
      data = data.map(doc => {
        return {
          id: doc.id,
          name: doc.name,
          file: doc.file,
          type: "",
          usage: null,
          node_ids: []
        };
      });
      this.flowDocs.push(...data);
      if (data.length > 0) {
        this.docActiveIndex = this.flowDocs.indexOf(data[0]);
      }
    },
    // 批量上传成功回调
    batchUploadOk() {
      this.init();
    }
  }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.doc-settings {
  .field-sn {
    vertical-align: middle;
    width: 10%;
  }

  .field-name {
    vertical-align: middle;
    width: 25%;
  }

  .field-type {
    vertical-align: middle;
    width: 25%;
  }

  .field-usage {
    vertical-align: middle;
    width: 20%;
    .custom-select.custom-select-sm {
      vertical-align: unset;
    }
  }

  .field-action {
    vertical-align: middle;
    width: 20%;
  }

  .field-rel-sn {
    vertical-align: middle;
    width: 20%;
  }

  .field-rel-name {
    vertical-align: middle;
    width: 50%;
  }

  .field-rel-doc_use {
    vertical-align: middle;
    width: 30%;
  }
  .upload-resourse {
    font-size: 14px;
    .upload-resourse-tip {
      color: #253568;
    }
  }
}
</style>