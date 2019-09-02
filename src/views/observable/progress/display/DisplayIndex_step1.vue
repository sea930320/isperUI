<template>
  <div class="display-main-box">
    <div class="content-item-center display-top-button">
      <p class="mb-0">展示文件 :</p>
      <b-button class="ml-3" variant="primary" @click="onUploadlocal">上传新文件...</b-button>
      <b-button class="ml-3" variant="primary" @click="onUploadPrev">从文件中选择</b-button>
    </div>
    <!-- table for documents -->
    <div class="display-table-content content-item-center">
      <div class="display-table-inner">
        <table class="table table-green doc-list-table">
          <thead>
            <tr>
              <th style="width: 65%">文件名</th>
              <th style="width: 25%">提交人</th>
              <th style="width: 10%">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(doc, index) in docs.list" :key="index">
              <td>{{doc.filename}}</td>
              <td>{{doc.created_by ? doc.created_by.name: ''}}</td>
              <td>
                <a href="javascript:;" class="btn-link" target="_blank" @click="onDelete(doc)">
                  <icon name="trash" />
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <upload-modal @on-uploadConfirm="uploadCallback"></upload-modal>

    <!-- confirm delete -->
    <b-modal
      v-model="delete_confirm_dialog"
      title="删除提醒"
      ok-title="确定"
      cancel-title="取消"
      @cancel="delete_confirm_dialog=false"
      @ok="confirmDelete"
    >
      <div class="modal-message">
        <p class="message">确认要删除?</p>
      </div>
    </b-modal>

    <!-- 从文件中选择 -->
    <b-modal
      v-model="prev_doc_dialog"
      title="应用模板"
      ok-title="确定"
      cancel-title="取消"
      @ok="selectPrevDoc"
      @cancel="prev_doc_dialog=false"
    >
      <div class="prev-list-content content-item-center" v-loading="prev_doc_loading">
        <div v-if="!prev_doc_loading && prev_docs.length==0">
          <div class="modal-message">
            <p class="message">对不起，该角色没有配置任何模板，请切换角色试试</p>
            <p class="tip">请选择模板之后再编辑</p>
          </div>
        </div>
        <div v-else class="max-height-box">
          <b-form-radio-group v-model="selected_doc" stacked>
            <b-form-radio
              v-for="(doc, index) in prev_docs"
              :key="index"
              :value="doc"
            >{{doc.name}}</b-form-radio>
          </b-form-radio-group>
        </div>
      </div>
    </b-modal>

    <!-- Bottom button -->
    <div class="display-bottom-button">
      <b-button variant="primary" @click="onNext">下一頁</b-button>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import businessService from "@/services/businessService";
import uploadModal from "@/components/common/uploadModal";
export default {
  name: "display_step1",
  components: { uploadModal },
  sockets: {
    connect() {},

    getMessage(msg) {
      if (!msg.result) {
        return;
      }
      if (!msg.result.business) {
        return;
      }
      if (msg.result.business === this.$route.params.bid) {
        if (
          msg.result.msg.startsWith("上传文件") ||
          msg.result.msg.startsWith("删除文件")
        ) {
          // update docs list
          businessService
            .getBusinessDisplayList({
              business_id: this.$route.params.bid,
              node_id: this.$route.params.nid,
              path_id: this.metaInfo.path_id
            })
            .then(data => {
              this.docs.list = data.results;
              this.docs.total = data.paging.count;
            });
        }
        /* eslint-disable */
        if (msg.result.msg == "展示-下一頁") {
        }
      }
    }
  },
  data() {
    return {
      docs: {
        list: [],
        total: 0
      },
      delete_file: null,
      delete_confirm_dialog: false,
      prev_doc_dialog: false,
      prev_doc_loading: false,
      prev_docs: [],
      selected_doc: null,
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
    currentRoleAllocation() {
      return this.$store.state.meta.currentRoleAllocation;
    },
    metaInfo() {
      return this.$store.state.meta.info;
    }
  },
  watch: {},
  mounted() {
    this.init();
  },
  methods: {
    init() {
      businessService
        .getBusinessDisplayList({
          business_id: this.$route.params.bid,
          node_id: this.$route.params.nid,
          path_id: this.metaInfo.path_id
        })
        .then(data => {
          this.docs.list = data.results;
          this.docs.total = data.paging.count;
        });
    },

    // upload documents
    onUploadlocal() {
      this.$emit("openUploadModal", {
        uploadUrl: "/api/business/docs/create",
        uploadParams: {
          business_id: this.$route.params.bid,
          node_id: this.$route.params.nid,
          role_alloc_id: this.currentRoleAllocation.alloc_id
        }
      });
    },
    uploadCallback(data) {
      if (data) {
        businessService
          .pushMessage({
            business_id: this.$route.params.bid,
            node_id: this.$route.params.nid,
            role_alloc_id: this.currentRoleAllocation.alloc_id,
            force_txt_mode: 1,
            type: "txt",
            msg: "上传文件: "
          })
          .then(() => {
            this.$toasted.success("上传成功");
          });
      }
    },
    onUploadPrev() {
      this.prev_doc_loading = true;
      this.selected_doc = null;
      // get prev docs and set in prev_docs
      businessService.getBusinessPrevDocs({
        business_id: this.$route.params.bid,
        node_id: this.$route.params.nid
      })
      .then(data => {
        if(data.length !== 0) {
          this.prev_docs = data
        }
        this.prev_doc_loading = false;
      });
      this.prev_doc_dialog = true;
    },

    selectPrevDoc() {
      if(this.selected_doc) {
        businessService.createBusinessDocFromPrev({
          business_id: this.$route.params.bid,
          node_id: this.$route.params.nid,
          doc_from: this.selected_doc.type,
          doc_id: this.selected_doc.id,
          role_alloc_id: this.currentRoleAllocation.alloc_id,
          path_id: this.metaInfo.path_id
        })
        .then(() => {
          businessService
          .pushMessage({
            business_id: this.$route.params.bid,
            node_id: this.$route.params.nid,
            role_alloc_id: this.currentRoleAllocation.alloc_id,
            force_txt_mode: 1,
            type: "txt",
            msg: "上传文件: "
          })
          .then(() => {
            this.$toasted.success("上传成功");
          });
        });
      }
    },

    // delete documents
    onDelete(file) {
      this.delete_file = file;
      this.delete_confirm_dialog = true;
    },
    confirmDelete() {
      if (this.delete_file) {
        businessService
          .deleteBusinessDisplayFile({
            business_id: this.delete_file.business_id,
            node_id: this.delete_file.node_id,
            doc_id: this.delete_file.id
          })
          .then(() => {
            businessService
              .pushMessage({
                business_id: this.$route.params.bid,
                node_id: this.$route.params.nid,
                role_alloc_id: this.currentRoleAllocation.alloc_id,
                force_txt_mode: 1,
                msg: "删除文件: " + this.delete_file.filename,
                type: "txt"
              })
              .then(() => {
                this.$toasted.success("文件已删除");
                this.delete_file = null;
              })
              .catch(() => {});
          })
          .catch(() => {
            this.delete_file = null;
          });
      }
      this.delete_confirm_dialog = false;
    },

    onNext() {
      // set doc access
      businessService
        .createBusinessDocTeamStatus({
          business_id: this.$route.params.bid,
          node_id: this.$route.params.nid
        })
        .then(() => {
          businessService
            .updateBusinessStepStatus({
              business_id: this.$route.params.bid,
              node_id: this.$route.params.nid,
              step: 11
            })
            .then(() => {
              businessService.pushMessage({
                business_id: this.$route.params.bid,
                node_id: this.$route.params.nid,
                role_alloc_id: this.currentRoleAllocation.alloc_id,
                force_txt_mode: 1,
                type: "txt",
                msg: "展示-下一頁"
              });
            });
        });
    }
  }
};
</script>

<style lang='css' scoped>
@import "./display.css";
</style>