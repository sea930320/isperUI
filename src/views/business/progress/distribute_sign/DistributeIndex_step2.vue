<template>
  <div class="distribute-main-box">
    <div v-if="permission">
      <div class="content-item-center distribute-top-title">
        <h2 class="mb-0" v-if="!currentRoleAllocation.can_terminate">来自 {{sender_name}} 的交付文件</h2>
        <h2 class="mb-0" v-else>接收情况</h2>
      </div>

      <div class="distribute-table-content content-item-center">
        <div class="distribute-table-inner">
          <div v-if="!currentRoleAllocation.can_terminate">
            <table class="table table-green doc-list-table">
            <thead>
              <tr>
                <th style="width: 85%">文件名</th>
                <th style="width: 15%">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(doc, index) in docs" :key="index">
                <td>
                  <a
                    href="javascript:void(0);"
                    class="btn-link"
                    @click="previewFile(doc)"
                  >{{doc.doc_name}}</a>
                </td>
                <td>
                  <icon v-if="!doc.status" name="eye-slash" />
                  <icon v-if="doc.status" name="eye" />
                </td>
              </tr>
            </tbody>
          </table>
          </div>
          <div v-else>
            <table class="table table-green doc-list-table">
            <thead>
              <tr>
                <th style="width: 85%">接收者名称</th>
                <th style="width: 15%">状态</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, index) in users" :key="index">
                <td>
                  {{user.user_name}}
                </td>
                <td>
                  <label v-if="user.status == 'signed'">签收</label>
                  <label v-else-if="user.status == 'reject'">拒接</label>
                  <label v-else-if="user.status == 'review'">在看</label>
                </td>
              </tr>
            </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="distribute-bottom-button">
        <b-button variant="primary" v-if="currentRoleAllocation.can_terminate" @click="onEnd">结束并走向</b-button>
        <div v-else>
          <b-button variant="primary" @click="onSign">签收</b-button>
          <b-button variant="primary" @click="onReject" style="margin-left:30px;">拒接签收</b-button>
        </div>
      </div>
      <!-- Confirm end -->
      <b-modal
        v-model="end_confirm_dialog"
        title="提醒"
        ok-title="确定"
        cancel-title="取消"
        @cancel="end_confirm_dialog=false"
        @ok="confirmEnd"
      >
        <div class="modal-message">
          <p class="message">有些文件还没查看，您真要结束本环节吗？</p>
        </div>
      </b-modal>
      <!-- end dialog -->
      <end-node-handle :isCommit="commit_end" @on-cancel="commit_end=false"></end-node-handle>
    </div>
    <div v-if="!permission">
      <div class="content-item-center distribute-top-title">
        <h2 class="mb-0">请稍等</h2>
      </div>
    </div>
  </div>
</template>
<script>
import endNodeHandle from "@/components/business/modal/endNodeHandle";
import businessService from "@/services/businessService";
import { openFile } from "@/utils/previewFile";
export default {
  name: "distribute_step2",
  components: { endNodeHandle },
  sockets: {
    connect() {},
    getMessage(msg) {
      if (!msg.result) {
        return;
      }
      if (!msg.result.business) {
        return;
      }
      if (
        msg.result.business === this.$route.params.bid &&
        msg.result.msg.startsWith("展示文件")
      ) {
        this.updateList();
      }
    }
  },
  data() {
    return {
      docs: [],
      users: [],
      commit_end: false,
      end_confirm_dialog: false,
      sender_name: "",
      permission: true
    };
  },
  computed: {
    metaInfo() {
      return this.$store.state.meta.info;
    },
    currentRoleAllocation() {
      return this.$store.state.meta.currentRoleAllocation;
    },
    userInfo() {
      return this.$store.state.userInfo;
    }
  },
  watch: {},
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.updateList();

      for (var i in this.metaInfo.role_alloc_status) {
        if (this.metaInfo.role_alloc_status[i].can_terminate) {
          this.sender_name = this.metaInfo.role_alloc_status[i].user_name;
        }
      }
    },
    updateList() {
      
      if (this.currentRoleAllocation.can_terminate) {
        businessService.getBusinessDocTeamStatus1({
          business_id : this.$route.params.bid,
          node_id : this.$route.params.nid,
        })
        .then(data => {
          this.users = data;
        });
        
        businessService
          .getBusinessDocTeamStatus({
            business_id: this.$route.params.bid,
            node_id: this.$route.params.nid
          })
          .then(data => {
            this.docs = data;
            if (this.docs.length > 0) {
              this.permission = true;
            } else {
              this.permission = false;
            }
          });
      } else {
        businessService
          .getBusinessDocTeamStatus({
            business_id: this.$route.params.bid,
            node_id: this.$route.params.nid,
            user_id: this.userInfo.id
          })
          .then(data => {
            this.docs = data;
            if (this.docs.length > 0) {
              this.permission = true;
            } else {
              this.permission = false;
            }
          });
      }
    },

    // preview documents
    // not working with firefox
    previewFile(doc) {
      openFile(doc.doc_url, this.userInfo.id);
      //set document as read
      businessService
        .updateBusinessDocTeamStatus({
          business_id: this.$route.params.bid,
          node_id: this.$route.params.nid,
          business_doc_id: doc.doc_id,
          user_id: this.userInfo.id,
          status: 1
        })
        .then(() => {
          businessService
            .pushMessage({
              business_id: this.$route.params.bid,
              node_id: this.$route.params.nid,
              role_alloc_id: this.currentRoleAllocation.alloc_id,
              force_txt_mode: 1,
              type: "txt",
              msg: "展示文件: " + doc.doc_name
            })
            .then(() => {});
        });
    },

    onEnd() {
      for (var v in this.docs) {
        if (!this.docs[v].status) {
          this.end_confirm_dialog = true;
          return;
        }
      }
      this.commit_end = true;
    },
    confirmEnd() {
      this.commit_end = true;
    },

    onSign() {
      businessService
        .updateBusinessDocTeamStatus({
          business_id: this.$route.params.bid,
          node_id: this.$route.params.nid,
          user_id: this.userInfo.id,
          status: 2
        })
        .then(() => {
          businessService
            .pushMessage({
              business_id: this.$route.params.bid,
              node_id: this.$route.params.nid,
              role_alloc_id: this.currentRoleAllocation.alloc_id,
              force_txt_mode: 1,
              type: "txt",
              msg: "展示文件: "
            })
            .then(() => {});
        });
      
    },
    onReject() {
      businessService
        .updateBusinessDocTeamStatus({
          business_id: this.$route.params.bid,
          node_id: this.$route.params.nid,
          user_id: this.userInfo.id,
          status: -1
        })
        .then(() => {
          businessService
            .pushMessage({
              business_id: this.$route.params.bid,
              node_id: this.$route.params.nid,
              role_alloc_id: this.currentRoleAllocation.alloc_id,
              force_txt_mode: 1,
              type: "txt",
              msg: "展示文件: "
            })
            .then(() => {});
        });
    },
  }
};
</script>

<style lang='css' scoped>
@import "./distribute_sign.css";
</style>