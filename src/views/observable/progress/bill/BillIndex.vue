<template>
  <div class="post-index">
    <loading v-if="isRunning"></loading>
    <b-container fluid>
      <b-row>
        <b-col sm="9">
          <b-form-group label-cols="1" label="法案名称:" label-for="input-horizontal1">
            <b-form-input
              class="cardDiv mt-0"
              id="input-horizontal1"
              maxlength="32"
              v-model="bill_name"
              placeholder="请输入名称（32个字以下）"
              disabled
            ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col sm="3">
          <b-button-group class="float-left">
            <b-button
              :size="template_size"
              class="styledBtn"
              variant="outline-primary"
              @click="allBillPreviewModal()"
            >法案预览</b-button>
          </b-button-group>
        </b-col>
      </b-row>

      <b-row>
        <b-col sm="12">
          <span v-if="selected==1">章节条模式</span>
          <span v-if="selected==2">条模式</span>
        </b-col>
      </b-row>

      <div class="cardDiv">
        <b-table
          :items="bill_data"
          v-if="selected==1"
          responsive
          ref="selectableTable"
          small
          hover
          :fields="columns"
          head-variant
        >
          <template slot="sn" slot-scope="row">{{ row.index + 1 }}</template>
          <template slot="chapter_number" slot-scope="row">{{row.item.chapter_number}}</template>
          <template slot="chapter_title" slot-scope="row">{{row.item.chapter_title}}</template>
          <template slot="section_number" slot-scope="row">{{row.item.section_number}}</template>
          <template slot="section_title" slot-scope="row">{{row.item.section_title}}</template>
          <template slot="part_number" slot-scope="row">{{row.item.part_number}}</template>
          <template slot="part_title" slot-scope="row">{{row.item.part_title}}</template>
          <template slot="part_text" slot-scope="row">{{row.item.part_content}}</template>
        </b-table>
        <b-table
          :items="bill_data"
          v-if="selected==2"
          ref="selectableTable1"
          responsive
          small
          hover
          :fields="columns1"
          head-variant
        >
          <template slot="sn" slot-scope="row">{{ row.index + 1 }}</template>
          <template slot="part_number" slot-scope="row">{{row.item.part_number}}</template>
          <template slot="part_title" slot-scope="row">{{row.item.part_title}}</template>
          <template slot="part_text" slot-scope="row">{{row.item.part_content}}</template>
        </b-table>
      </div>
    </b-container>

    <!--preview bill-->
    <b-modal
      title="法案预览"
      v-model="all_bill_preview_modal_show"
      ok-title="确定"
      cancel-title="取消"
      @hidden="allBillPreviewModalClear"
      size="xl"
      hide-footer
    >
      <b-container fluid>
        <b-row>
          <b-col sm="6">
            <b-card-group deck>
              <b-card header="现 行 法 案">
                <ul class="list-group">
                  <li
                    class="list-group-item"
                    v-for="(bill_data_origin_one,index) in bill_data_origin"
                    :key="index"
                  >
                    <!--{{bill_data_origin_one}}-->
                    {{ bill_data_origin_one.chapter_number }} . {{ bill_data_origin_one.chapter_title }}
                    <br />
                    {{ bill_data_origin_one.section_number }} . {{ bill_data_origin_one.section_title }}
                    <br />
                    {{ bill_data_origin_one.part_number }} . {{ bill_data_origin_one.part_title }}
                    <br />
                    {{ bill_data_origin_one.part_content }}
                  </li>
                </ul>
              </b-card>
            </b-card-group>
          </b-col>
          <b-col sm="6">
            <b-card-group deck>
              <b-card header="新 法 案">
                <ul class="list-group">
                  <li
                    class="list-group-item"
                    v-for="(bill_data_one,index) in bill_data_comparison"
                    :key="index"
                  >
                    <!--updated-->
                    <span v-if="bill_data_one.added_flag=='1'" style="color:red">
                      <!--{{bill_data_one}}-->
                      {{ bill_data_one.chapter_number }} . {{ bill_data_one.chapter_title }}
                      <br />
                      {{ bill_data_one.section_number }} . {{ bill_data_one.section_title }}
                      <br />
                      {{ bill_data_one.part_number }} . {{ bill_data_one.part_title }}
                      <br />
                      {{ bill_data_one.part_content }}
                    </span>
                    <!--inserted-->
                    <span v-if="bill_data_one.added_flag=='2'" style="color:blue">
                      <!--{{bill_data_one}}-->
                      {{ bill_data_one.chapter_number }} . {{ bill_data_one.chapter_title }}
                      <br />
                      {{ bill_data_one.section_number }} . {{ bill_data_one.section_title }}
                      <br />
                      {{ bill_data_one.part_number }} . {{ bill_data_one.part_title }}
                      <br />
                      {{ bill_data_one.part_content }}
                    </span>
                    <!--deleted-->
                    <span
                      v-if="bill_data_one.added_flag=='3'"
                      style="text-decoration:line-through;color:red"
                    >
                      <!--{{bill_data_one}}-->
                      {{ bill_data_one.chapter_number }} . {{ bill_data_one.chapter_title }}
                      <br />
                      {{ bill_data_one.section_number }} . {{ bill_data_one.section_title }}
                      <br />
                      {{ bill_data_one.part_number }} . {{ bill_data_one.part_title }}
                      <br />
                      {{ bill_data_one.part_content }}
                    </span>
                    <span v-if="bill_data_one.added_flag=='0'">
                      <!--{{bill_data_one}}-->
                      {{ bill_data_one.chapter_number }} . {{ bill_data_one.chapter_title }}
                      <br />
                      {{ bill_data_one.section_number }} . {{ bill_data_one.section_title }}
                      <br />
                      {{ bill_data_one.part_number }} . {{ bill_data_one.part_title }}
                      <br />
                      {{ bill_data_one.part_content }}
                    </span>
                  </li>
                </ul>
              </b-card>
            </b-card-group>
          </b-col>
        </b-row>
      </b-container>
    </b-modal>
  </div>
</template>

<script>
import Loading from "@/components/loading/Loading";
import BillService from "@/services/billService";

export default {
  components: { Loading },
  data() {
    return {
      bill_data_origin: [],
      bill_data_comparison: [],
      comparison_fields: {
        sn: {
          label: "现 行 法 案",
          sortable: false,
          class: "text-left field-100"
        },
        data: {
          label: "现 行 法 案",
          sortable: false,
          class: "text-left field-100"
        }
      },

      edit_modal_data: {},

      selected: "1",
      add_modal_selected: "1",
      options: [
        { text: "章节条模式", value: "1" },
        { text: "条模式", value: "2" }
      ],
      add_modal_options: [
        { text: "增加章", value: "1" },
        { text: "增加节", value: "2" },
        { text: "增加条", value: "3" }
      ],
      bill_name: "",
      bill_data: [],

      selected_data: [],
      edit_full_modal_show: false,
      delete_modal_show: false,
      part_insert_modal_show: false,
      add_new_bill_modal_show: false,
      save_modal_show: false,
      setting_show_mode_modal_show: false,

      chapterSelected: "",
      chapterOptions: [],
      sectionSelected: null,
      sectionOptions: [],
      partSelected: 0,
      partSelectedName: "",
      selectedPartContent: "",
      selectedPartReason: "",
      partMin: 0,

      chapterSelected_chapter: "",
      sectionSelected_chapter: "",
      partSelected_chapter: "",
      selectedPartContent_chapter: "",
      selectedPartReason_chapter: "",
      sectionSelected_section: "",
      partSelected_section: "",
      selectedPartContent_section: "",
      selectedPartReason_section: "",
      selected_chapter_number: "",
      selected_chapter_title: "",
      selected_section_number: "",
      selected_section_title: "",
      selected_part_number: "",

      document_upload_modal: false,
      section_docs_lists: [],
      upload_doc_url: "",
      doc_desc_text: "",
      upload_doc_id: 0,
      previewShow: 0,
      encodedURLDOCX: "",
      insertPartTitle: "",
      insertPartContent: "",
      insertPartReason: "",

      all_bill_preview_modal_show: false,
      all_bill_preview_modalURL: "",

      columns: {
        sn: {
          label: "行号",
          sortable: false,
          class: "text-left field-5"
        },
        chapter_number: {
          label: "序章号",
          sortable: false,
          class: "text-left field-5"
        },
        chapter_title: {
          label: "章名",
          sortable: false,
          class: "text-left field-10"
        },
        section_number: {
          label: "节序号",
          sortable: false,
          class: "text-left field-5"
        },
        section_title: {
          label: "节名",
          sortable: false,
          class: "text-left field-10"
        },
        part_number: {
          label: "条序名",
          sortable: false,
          class: "text-left field-5"
        },
        part_title: {
          label: "条名",
          sortable: false,
          class: "text-left field-10"
        },
        part_text: {
          label: "正文",
          sortable: false,
          class: "text-left field-30"
        }
      },
      columns1: {
        sn: {
          label: "行号",
          sortable: false,
          class: "text-left field-5"
        },
        part_number: {
          label: "条序名",
          sortable: false,
          class: "text-left field-5"
        },
        part_title: {
          label: "条名",
          sortable: false,
          class: "text-left field-10"
        },
        part_text: {
          label: "正文",
          sortable: false,
          class: "text-left field-30"
        }
      },
      columns_upload: {
        sn: {
          label: "序号",
          sortable: false,
          class: "text-left field-10"
        },
        upload_doc_name: {
          label: "文件名",
          sortable: false,
          class: "text-left field-30"
        },
        upload_desc: {
          label: "备注",
          sortable: false,
          class: "text-left field-30"
        },
        upload_control: {
          label: "操作",
          sortable: false,
          class: "text-left field-30"
        }
      }
    };
  },
  created() {
    this.$nextTick(() => {
      this.init();
    });
  },
  computed: {},
  watch: {
    // 监控查询参数，如有变化 查询列表数据
    selected: {
      handler() {
        this.selected_data = [];
      },
      deep: true
    }
  },
  mounted() {},
  methods: {
    gadget_sort_comparison() {
      this.bill_data_comparison.sort(function(a, b) {
        return (
          a.chapter_number - b.chapter_number ||
          a.section_number - b.section_number ||
          a.part_number - b.part_number
        );
      });
      return true;
    },
    init() {
      this.run();
      BillService.getBillNameOnly({
        business_id: this.$route.params.bid,
        node_id: this.$route.params.nid
      }).then(data => {
        if (data.bill_name == "") {
          this.setting_show_mode_modal_show = true;
          this.$emit("data-ready");
          return;
        } else {
          BillService.getBillName({
            business_id: this.$route.params.bid,
            node_id: this.$route.params.nid,
            show_mode: this.selected
          })
            .then(data => {
              this.bill_name = data.bill_name;
              this.bill_data = data.bill_data;
              //                        this.bill_data_origin = data.bill_data;
              var checkChapter = [];
              this.chapterOptions = [];
              for (let i = 0; i < this.bill_data.length; i++) {
                if (!checkChapter.includes(this.bill_data[i].chapter_number)) {
                  checkChapter.push(this.bill_data[i].chapter_number);
                  this.chapterOptions.push({
                    text: this.bill_data[i].chapter_number,
                    value: this.bill_data[i].chapter_title
                  });
                }
              }
              this.partSelected = "";
              this.partSelectedName = "";

              this.$emit("data-ready");
            })
            .catch(() => {
              this.$emit("data-failed");
            });
        }
      });
    },

    updatePartsModal1(part_id) {
      if (this.selected == 1) {
        this.$refs.selectableTable.clearSelected();
      } else {
        this.$refs.selectableTable1.clearSelected();
      }
      this.selected_data = [];
      for (let i = 0; i < this.bill_data.length; i++) {
        if (this.bill_data[i].part_id == part_id) {
          this.edit_modal_data.part_id = this.bill_data[i].part_id;
          this.edit_modal_data.chapter_title = this.bill_data[i].chapter_title;
          this.edit_modal_data.chapter_number = this.bill_data[
            i
          ].chapter_number;
          this.edit_modal_data.section_title = this.bill_data[i].section_title;
          this.edit_modal_data.section_number = this.bill_data[
            i
          ].section_number;
          this.edit_modal_data.part_title = this.bill_data[i].part_title;
          this.edit_modal_data.part_number = this.bill_data[i].part_number;
          this.edit_modal_data.part_content = this.bill_data[i].part_content;
          this.edit_modal_data.part_reason = this.bill_data[i].part_reason;
          this.edit_full_modal_show = true;
        }
      }
    },
    allBillPreviewModal() {
      BillService.getBillName({
        business_id: this.$route.params.bid,
        node_id: this.$route.params.nid,
        show_mode: this.selected
      })
        .then(data => {
          this.bill_data_comparison = [];
          this.bill_data_origin = [];
          this.bill_data_origin = data.bill_data;
          for (let i = 0; i < this.bill_data.length; i++) {
            if (this.bill_data[i].hasOwnProperty("added_flag")) {
              if (this.bill_data[i].added_flag == "2") {
                this.bill_data_comparison.push(this.bill_data[i]);
                continue; // inserted
              }
            }
            for (let j = 0; j < this.bill_data_origin.length; j++) {
              if (
                this.bill_data[i].chapter_id ==
                  this.bill_data_origin[j].chapter_id &&
                this.bill_data[i].chapter_number ==
                  this.bill_data_origin[j].chapter_number &&
                this.bill_data[i].chapter_title ==
                  this.bill_data_origin[j].chapter_title &&
                this.bill_data[i].chapter_content ==
                  this.bill_data_origin[j].chapter_content &&
                this.bill_data[i].section_id ==
                  this.bill_data_origin[j].section_id &&
                this.bill_data[i].section_number ==
                  this.bill_data_origin[j].section_number &&
                this.bill_data[i].section_title ==
                  this.bill_data_origin[j].section_title &&
                this.bill_data[i].section_content ==
                  this.bill_data_origin[j].section_content &&
                this.bill_data[i].part_content ==
                  this.bill_data_origin[j].part_content &&
                this.bill_data[i].part_reason ==
                  this.bill_data_origin[j].part_reason &&
                this.bill_data[i].part_number ==
                  this.bill_data_origin[j].part_number &&
                this.bill_data[i].part_title ==
                  this.bill_data_origin[j].part_title
              ) {
                this.bill_data[i].added_flag = "0"; // remained
                break;
              } else {
                this.bill_data[i].added_flag = "1"; // updated
              }
            }
            this.bill_data_comparison.push(this.bill_data[i]);
          }
          for (let k = 0; k < this.bill_data_origin.length; k++) {
            let deleted_flag = false;
            for (let l = 0; l < this.bill_data.length; l++) {
              if (
                this.bill_data_origin[k].part_id == this.bill_data[l].part_id
              ) {
                deleted_flag = false;
                break;
              } else {
                deleted_flag = true;
                continue;
              }
            }
            if (deleted_flag) {
              this.bill_data_origin[k].added_flag = "3"; //deleted
              this.bill_data_comparison.push(this.bill_data_origin[k]);
            }
          }

          this.gadget_sort_comparison();
          this.all_bill_preview_modal_show = true;
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },
    allBillPreviewModalClear() {
      this.bill_data_origin = [];
      this.bill_data_comparison = [];
    }
  }
};
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
.post-index {
  .create-btns {
    display: flex;
    justify-content: center;
  }
  .vue-upload-file {
    left: 50% !important;
  }
  .field-1 {
    width: 1%;
  }
  .field-5 {
    width: 5%;
  }
  .field-10 {
    width: 10%;
    text-overflow: ellipsis;
  }
  .field-15 {
    width: 15%;
    text-overflow: ellipsis;
  }
  .field-20 {
    width: 20%;
    text-overflow: ellipsis;
  }
  .field-30 {
    width: 30%;
  }
  .field-40 {
    width: 40%;
  }
  .field-50 {
    width: 50%;
  }
  .field-60 {
    width: 60%;
  }
  .field-70 {
    width: 70%;
  }
  .field-80 {
    width: 80%;
  }
  .field-90 {
    width: 90%;
  }
  .field-100 {
    width: 100%;
  }
  .field-sn {
    width: 3%;
  }
  .field-name {
    width: 25%;
  }
  .field-creator {
    width: 9%;
  }
  .field-create_time {
    width: 13%;
  }
  .field-rend_ani_1 {
    width: 19%;
  }
  .field-rend_ani_2 {
    width: 10%;
  }
  .field-experiment_type_label {
    width: 7%;
  }
  .field-experiment_task_label {
    width: 15%;
  }
  .field-status {
    width: 5%;
  }
  .field-action {
    width: 20%;
  }
  .field-100 {
    width: 100%;
  }
}
</style>
