<template>
  <div class="distribute-main-box">
    <div v-if="permission">
      <div class="content-item-center distribute-top-title">
        <h2 class="mb-0">来自 {{sender_name}} 文件展示</h2>
      </div>

      <div class="distribute-table-content content-item-center">
        <div class="distribute-table-inner">
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
      </div>
    </div>
    <div v-if="!permission">
      <div class="content-item-center distribute-top-title cardDiv">
        <h2 class="mb-0">请稍等</h2>
      </div>
    </div>
  </div>
</template>
<script>
import businessService from "@/services/businessService";
import { openFile } from "@/utils/previewFile";
export default {
  name: "distribute_step2",
  components: {},
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
      sender_name: "",
      permission: true
    };
  },
  computed: {
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
      this.updateList();
      for (var i in this.metaInfo.role_alloc_status) {
        if (this.metaInfo.role_alloc_status[i].can_terminate) {
          this.sender_name = this.metaInfo.role_alloc_status[i].user_name;
        }
      }
    },
    updateList() {
      businessService
        .getBusinessDocTeamStatus({
          business_id: this.$route.params.bid,
          node_id: this.$route.params.nid,
          is_observable: 1
        })
        .then(data => {
          this.docs = data;
          if (this.docs.length > 0) {
            this.permission = true;
          } else {
            this.permission = false;
          }
        });
    },

    // preview documents
    // not working with firefox
    previewFile(doc) {
      openFile(doc.doc_url, 1);
    }
  }
};
</script>

<style lang='css' scoped>
@import "./distribute_sign.css";
</style>