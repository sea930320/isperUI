<template>
  <div class="edit-main-body">
    <!-- main container -->
    <div class="edit-content-wrapper clearfix">
      <div class="editor-container">
        <div class="w-100 bordered">
          <div v-if="edit_mode === 0" class="empty">
            <p class="text">请选择应用模板</p>
          </div>
          <div v-if="edit_mode" style="height:600px!important;">
            <vue-editor class="w-100 h-92" v-model="template_text" placeholder="请输入内容"></vue-editor>
          </div>
        </div>
      </div>
      <div class="operate-container w-35">
        <div class="template-list-container border">
          <h3 class="court-title">
            {{metaInfo.name}}
            <span class="node">【{{metaInfo.nodeName}}】</span>
          </h3>
          <div class="template-list-table">
            <table class="table table-green">
              <thead>
                <tr>
                  <th style="width: 50%">文件名</th>
                  <!--<th style="width: 25%">提交人</th>-->
                  <th style="width: 25%">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(doc, index) in docs.list" :key="index">
                  <td>
                    <a href="javascript:" @click="selectTemplate_link(doc)">{{doc.name}}</a>
                  </td>
                  <td>
                    <a :href="doc.url" class="btn-link" target="_blank">下载</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- bottom button -->
    <div class="edit-bottom-button-content">
      <div class="spe-group">
        <a href="javascript:" class="btn-spe fl" @click="onTemplateList">
          <icon name="file-alt" />
          <p class="mb-0">&nbsp;应用模板</p>
        </a>
      </div>
    </div>

    <!-- template list -->
    <b-modal
      v-model="template_list_dlg"
      title="应用模板"
      ok-title="确定"
      cancel-title="取消"
      @ok="selectTemplate"
      @cancel="template_list_dlg=false"
    >
      <div class="template-list-content" v-loading="template_list_loading">
        <div v-if="!template_list_loading && templates.length === 0">
          <div class="modal-message">
            <p class="message">对不起，该角色没有配置任何模板，请切换角色试试</p>
            <p class="tip">请选择模板之后再编辑</p>
          </div>
        </div>
        <div v-else class="max-height-box">
          <b-form-radio-group v-model="selected_doc" stacked>
            <b-form-radio
              v-for="(template, index) in templates"
              :key="index"
              :value="template"
            >{{template.name}}</b-form-radio>
          </b-form-radio-group>
        </div>
      </div>
    </b-modal>
  </div>
</template>
<script type="text/ecmascript-6">
import businessService from "@/services/businessService";
import { VueEditor } from "vue2-editor";

export default {
  name: "edit",
  components: {
    VueEditor
  },
  // socket io
  // get message and update ui
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
        (msg.result.msg.startsWith("新建文件") ||
          msg.result.msg.startsWith("上传文件") ||
          msg.result.msg.startsWith("保存编辑模板"))
      ) {
        this.updateList();
      }
    }
  },

  data() {
    return {
      // 0 : default, 1: template, 2: new
      edit_mode: 0,
      template_text: "",
      template_list_dlg: false,
      template_list_loading: false,
      selected_doc: null,
      templates: [],
      docs: {
        list: [],
        total: 0
      }
    };
  },
  computed: {
    metaInfo() {
      return this.$store.state.meta.info;
    }
  },
  mounted() {
    this.init();
  },
  watch: {},
  methods: {
    init() {
      this.template_text = "";
      this.edit_mode = 0;
      this.updateList();
    },
    // select the application template
    selectTemplate() {
      if (!this.selected_doc || (this.selected_doc && !this.selected_doc.id)) {
        this.$toasted.info("请选择一个应用模板");
        return;
      }

      this.edit_mode = 1;
      this.template_text = this.selected_doc.content;
      this.sign_status = this.selected_doc.sign_status;

      if (this.sign_status > 0) {
        this.doc_sign = this.selected_doc.sign;
      }
    },

    // select the application template from right side
    selectTemplate_link(doc) {
      this.selected_doc = doc;
      this.selectTemplate();
    },
    // show template list
    onTemplateList() {
      // get template list
      this.template_list_loading = true;
      this.selected_doc = null;
      this.updateList();
      // show list dialog
      this.template_list_dlg = true;
    },

    // update right side template list
    updateList() {
      businessService
        .getBusinessTemplates({
          business_id: this.$route.params.bid,
          node_id: this.$route.params.nid,
          role_alloc_id: "observable",
          edit_module: 1,
          usage: 3
        })
        .then(data => {
          this.templates = data;
          if (data.length !== 0) {
            this.docs.list = data;
          }
          this.template_list_loading = false;
        });
    }
  }
};
</script>

<style lang='css' scoped>
@import "./edit.css";
</style>
