<template>
  <div class="report-index">
    <div>
      <b-card-group>
        <b-card header-tag="header">
          <b-row slot="header">
            <b-col lg="3" md="6" sm="12" class="align-self-center">
              <span class="float-left">业务完成</span>
            </b-col>
            <b-col lg="9" md="6" sm="12" class="align-self-center">
              <b-button-group class="float-right">
                <b-button class="styledBtn" variant="outline-primary" @click="exportReport">导出</b-button>
              </b-button-group>
            </b-col>
          </b-row>
          <b-card-text>
            <BulmaAccordion v-if="report.nodes" :dropdown="false" :icon="'custom'">
              <BulmaAccordionItem
                class="linkpoint"
                v-for="(node,index) in report.nodes"
                :key="index"
              >
                <h4 slot="title" class="align-self-center float-left">
                  <icon name="angle-right"></icon>
                  {{node.node_name}}
                </h4>
                <div slot="content" style="text-align: left;padding:20px">
                  <p v-if="node.type == 3">
                    <span>展示内容：</span>
                    <span v-if="node['bdts_list'].length == 0">无</span>
                    <a
                      v-else
                      href="javascript:;"
                      class="btn-link"
                      @click="handlerDetailClick(7,node['bdts_list'])"
                    >详情</a>
                  </p>
                  <p v-if="node.type == 7">
                    <span>公示结果展示：</span>
                    <span v-if="!node['bpost']">无</span>
                    <a
                      v-else
                      href="javascript:;"
                      class="btn-link"
                      @click="handlerDetailClick(8,node['bpost'])"
                    >详情</a>
                  </p>
                  <p v-if="node.type == 8">
                    <span>表决记录：</span>
                    <span v-if="!node['vote_data'] || node['vote_data']['items'].length == 0">无</span>
                    <a
                      v-else
                      href="javascript:;"
                      class="btn-link"
                      @click="handlerDetailClick(9,node['vote_data'])"
                    >详情</a>
                  </p>
                  <p v-if="node.type == 10">
                    <span>交付模块：</span>
                    <span v-if="!node['bdts_list'] || node['bdts_list'].length == 0">无</span>
                    <a
                      v-else
                      href="javascript:;"
                      class="btn-link"
                      @click="handlerDetailClick(12,node['bdts_list'])"
                    >详情</a>
                  </p>
                  <p v-if="node.type == 10">
                    <span>签收模块：</span>
                    <span v-if="!node['bdts_list'] || node['bdts_list'].length == 0">无</span>
                    <a
                      v-else
                      href="javascript:;"
                      class="btn-link"
                      @click="handlerDetailClick(13,node['bdts_list'])"
                    >详情</a>
                  </p>
                  <p v-if="node.type == 11">
                    <span>问卷调查内容：</span>
                    <span v-if="!node['bsurvey']">无</span>
                    <a
                      v-else
                      href="javascript:;"
                      class="btn-link"
                      @click="handlerDetailClick(10,node['bsurvey'])"
                    >详情</a>
                  </p>
                  <p v-if="node.type == 11">
                    <span>执行记录：</span>
                    <span v-if="!node['bsurvey'] || node['bsurvey']['answer_users'].length == 0">无</span>
                    <a
                      v-else
                      href="javascript:;"
                      class="btn-link"
                      @click="handlerDetailClick(11,node['bsurvey'])"
                    >详情</a>
                  </p>
                  <p v-if="node.type == 12">
                    <span>判断与选择记录：</span>
                    <span v-if="!node['decide_results'] || node['decide_results'].length == 0">无</span>
                    <a
                      v-else
                      href="javascript:;"
                      class="btn-link"
                      @click="handlerDetailClick(14,node['decide_results'])"
                    >详情</a>
                  </p>
                  <p v-if="node.type == 14">
                    <span>法案内容：</span>
                    <span v-if="!node['bill_name']">无</span>
                    <a
                      v-else
                      href="javascript:;"
                      class="btn-link"
                      @click="handlerDetailClick(15, {
                        'bill_data': node['bill_data'],
                        'bill_name': node['bill_name']
                      })"
                    >详情</a>
                  </p>
                  <p>
                    <span v-if="node.type === 4">分析与总结：</span>
                    <span v-else>交流记录：</span>
                    <span v-if="node['messages'].length == 0">无</span>
                    <a
                      v-else
                      href="javascript:;"
                      class="btn-link"
                      @click="handlerDetailClick(1,node['messages'])"
                    >详情</a>
                  </p>
                  <p v-if="node.type === 5">
                    <span>投票结果：</span>
                    <span v-if="!node['vote_status'] || node['vote_status'].length == 0">无</span>
                    <a
                      v-else
                      href="javascript:;"
                      class="btn-link"
                      @click="handlerDetailClick(6, node['vote_status'])"
                    >详情</a>
                  </p>
                  <p>
                    <span v-if="node.type === 3">展示文件：</span>
                    <span v-else>提交文件：</span>
                    <span v-if="node['docs'] && node['docs'].length == 0">无</span>
                    <a
                      v-else
                      href="javascript:;"
                      class="btn-link"
                      @click="handlerDetailClick(2, node['docs'])"
                    >详情</a>
                  </p>
                  <p>
                    自我备忘：
                    <span v-if="node['note'] == null">无</span>
                    <a
                      v-else
                      href="javascript:;"
                      class="btn-link"
                      @click="handlerDetailClick(3, node['note'])"
                    >详情</a>
                  </p>
                  <template>
                    <p>
                      操作指南：
                      <span v-if="node['guides'].length == 0">无</span>
                      <a
                        v-else
                        href="javascript:;"
                        class="btn-link"
                        @click="handlerDetailClick(4, node['guides'])"
                      >详情</a>
                    </p>
                    <!-- <p>
                        项目素材：
                        <span v-if="node.project_docs.length == 0">无</span>
                        <a
                          v-else
                          href="javascript:;"
                          class="btn-link"
                          @click="handlerDetailClick(5, node.project_docs)"
                        >详情</a>
                    </p>-->
                  </template>
                </div>
              </BulmaAccordionItem>
            </BulmaAccordion>

            <div class="member-experience-wrapper border my-2 p-2">
              <div class="title">组员分析与总结展示</div>
              <div class="member-experience-container">
                <ul class="member-experience-list">
                  <li v-for="(msg, index) in experiences" :key="index">
                    <div class="time text_blue">
                      <cite>
                        <i>{{msg.create_time}}</i>
                        &nbsp;&nbsp;{{msg.created_by.name}}
                      </cite>
                    </div>
                    <div class="content" v-html="replaceContent(msg.content)"></div>
                  </li>
                </ul>
              </div>
            </div>
          </b-card-text>
        </b-card>
      </b-card-group>
    </div>
    <b-modal v-model="modalShow" title="查看详情" size="lg" :showPerson="true" :hide-footer="true">
      <div class="result-detail-wrapper text-left">
        <div class="result-detail-content" v-if="detail.type === 1">
          <ul>
            <li v-for="(record, index) in detail.data" :key="index">
              <div class="time text_blue">
                <cite>
                  <i>{{record.timestamp}}</i>
                  -- {{record.role_name}}({{record.user_name}})
                </cite>
              </div>
              <p v-if="record.url">
                <!-- <chataudio :src="record.url"></chataudio> -->
              </p>
              <p v-else-if="record.ext.cmd == 'action_role_letin'">
                请入
                <span
                  v-for="(recordData, index1) in record.ext.opt.data"
                  :key="index1"
                >{{recordData.role_name}}、</span>
              </p>
              <p v-else-if="record.ext.cmd == 'action_submit_experience'">{{record.ext.opt.content}}</p>
              <p v-else>{{record.msg}}</p>
            </li>
          </ul>
        </div>

        <div class="result-detail-content" v-if="detail.type == 2">
          <table class="table table-gray table-striped table-border">
            <thead>
              <tr>
                <th>文件名</th>
                <th>文件类型</th>
                <th>签字</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(file, index) in detail.data" :key="index">
                <td>{{file.filename}}</td>
                <td>-</td>
                <td>
                  <div class="pr">
                    <span class="btn-link" target="_blank" @click.stop="showSignHandle(index)">查看</span>
                    <div class="sign-view-detail" v-show="signShow === index">
                      <p v-if="file.signs.length == 0">暂无</p>
                      <p v-else v-for="(sign, index1) in file.signs" :key="index1">
                        <span v-if="sign.sign_status == 1">{{sign.sign}}已签字</span>
                        <span v-if="sign.sign_status == 2">{{sign.sign}}已拒绝签字</span>
                      </p>
                    </div>
                  </div>
                </td>
                <td>
                  <a
                    href="javascript:void(0);"
                    class="btn-link mr-2"
                    @click="previewFile(file.url)"
                  >预览</a>
                  <a :href="file.url" class="btn-link" target="_blank">下载</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="result-detail-content" v-if="detail.type == 3">
          <p>{{detail.data}}</p>
        </div>

        <div class="result-detail-content" v-if="detail.type == 4">
          <p v-for="(file, index) in detail.data" :key="index" v-html="file.content"></p>
        </div>

        <div class="result-detail-content" v-if="detail.type == 5">
          <table class="table table-gray table-striped table-border">
            <thead>
              <tr>
                <th>文件名</th>
                <th>文件类型</th>
                <th>文件用途</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(file, index) in detail.data" :key="index">
                <td>{{file.name}}</td>
                <td>{{file.type}}</td>
                <td>{{file.usage | docUsage}}</td>
                <td>
                  <a
                    href="javascript:void(0);"
                    class="btn btn-outline-primary btn-sm mr-2"
                    @click="previewFile(file.url)"
                  >预览</a>
                  <a :href="file.url" class="btn btn-outline-primary btn-sm" target="_blank">下载</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="result-detail-content" v-if="detail.type == 6">
          <ul>
            <li class="voteLi" v-for="(vote, index) in detail.data" :key="index">
              <span class="voteName">{{vote.status}} ( {{vote.num}}票 )</span>
              <div class="precentBox">
                <span class="precentLine" :style="precentStyle(vote, detail.data)"></span>
              </div>
              <span class="votePercent">{{precentItem(vote, detail.data)}}</span>
            </li>
          </ul>
        </div>
        <div class="result-detail-content" v-if="detail.type === 7">
          <ul>
            <li v-for="(record, index) in detail.data" :key="index" class="mb-3">
              <div class="record-created mb-2">
                <cite>
                  <i>{{record['created_by'] + '想' + record.to_members_str + '展示了' + record['doc_name'] + '文件'}}</i>
                </cite>
              </div>
              <div
                class="record-seen"
                v-for="(m, m_index) in record.members"
                :key="'m_index_' + m_index"
              >{{m + '签收了' + record['doc_name'] + '文件'}}</div>
            </li>
          </ul>
        </div>
        <div class="result-detail-content" v-if="detail.type === 8">
          <p v-html="detail.data.content" />
        </div>
        <div class="result-detail-content" v-if="detail.type === 9">
          <div class="mb-2">
            <cite>
              <i>{{'表决内容:' + detail.data['title']}}</i>
            </cite>
          </div>
          <ul>
            <li v-for="(record, index) in detail.data.items" :key="index" class="mb-3">
              <div
                class="record-seen"
                v-for="(log_user, log_index) in record.voted_users"
                :key="'log_index' + log_index"
              >{{log_user + '参与表决，表决选择是：' + record['text']}}</div>
            </li>
          </ul>
        </div>
        <div class="result-detail-content" v-if="detail.type === 10">
          <div class="mb-2">
            <b>选择题</b>
          </div>
          <ul>
            <li
              v-for="(question, index) in detail.data.select_questions"
              :key="'sel' + index"
              class="mb-3"
            >
              <div v-if="question.select_option == 0">
                <div
                  v-for="(qcase, case_index) in question.question_cases"
                  :key="'qcase' + case_index"
                >{{'◎ ' + qcase['case']}}</div>
              </div>
              <div v-else>
                <div
                  v-for="(qcase, case_index) in question.question_cases"
                  :key="'qcase' + case_index"
                >{{'□ ' + qcase['case']}}</div>
              </div>
            </li>
          </ul>
          <div class="mb-2">
            <b>填空题</b>
          </div>
          <ul>
            <li
              v-for="(question, index) in detail.data.blank_questions"
              :key="'blank' + index"
              class="mb-3"
            >
              <div v-html="question.title" />
            </li>
          </ul>
          <div class="mb-2">
            <b>问答题</b>
          </div>
          <ul>
            <li
              v-for="(question, index) in detail.data.normal_questions"
              :key="'normal' + index"
              class="mb-3"
            >
              <div v-html="question.title" />
            </li>
          </ul>
        </div>
        <div class="result-detail-content" v-if="detail.type === 11">
          <ul>
            <li
              v-for="(record, index) in detail.data.answer_users"
              :key="index"
              class="mb-3"
            >{{record + '参与了调查问卷的填写'}}</li>
          </ul>
        </div>
        <div class="result-detail-content" v-if="detail.type === 12">
          <ul>
            <li
              v-for="(bdt, index) in detail.data"
              :key="index"
              class="mb-3"
            >{{bdt['created_by'] + '上传了' + bdt['doc_name'] + '文件'}}</li>
          </ul>
        </div>
        <div class="result-detail-content" v-if="detail.type === 13">
          <ul>
            <li v-for="(bdt, index) in detail.data" :key="index" class="mb-3">
              <div
                v-for="(m, m_index) in bdt.members"
                :key="'m' + m_index"
              >{{m + '签收了' + bdt['doc_name'] + '文件'}}</div>
            </li>
          </ul>
        </div>
        <div class="result-detail-content" v-if="detail.type === 14">
          <ul>
            <li
              v-for="(dr, index) in detail.data"
              :key="index"
              class="mb-3"
            >{{dr['name'] + '选择了' + dr['title']}}</li>
          </ul>
        </div>
        <div class="result-detail-content" v-if="detail.type === 15">
          <div v-if="detail.data.bill_name.edit_mode==1">
            <div v-for="(chapter, index) in detail.data.bill_data" :key="'chapter_' + index">
              <b style="font-size:14px; color: #3a7de0;">第{{chapter.chapter_number}}章 。</b>
              {{chapter.chapter_title}}
              <div v-for="(section, index) in chapter.sections" :key="'section' + index">
                <b style="font-size: 13px; color: #3a7de0c7;">第{{section.section_number}}节 。</b>
                {{section.section_title}}
                <div v-for="(part, index) in section.parts" :key="'part' + index">
                  <b style="font-size: 13px; color: #3a7de0a3;">第{{part.part_number}}条 。</b>
                  {{part.part_title}}
                  <p v-html="part.part_content" />
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <div
              v-for="(bill_one_data, index) in detail.data.bill_data"
              :key="'bill_one_data' + index"
            >
              <b style="font-size:14px; color: #3a7de0;">第{{bill_one_data.part_number}}条 。</b>
              {{bill_one_data.part_title}}
              <p v-html="part.part_content" />
            </div>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import businessService from "@/services/businessService";
import { mapState } from "vuex";
import { BulmaAccordion, BulmaAccordionItem } from "vue-bulma-accordion";
import { openFile } from "@/utils/previewFile";
import { docUsage } from "@/filters/fun";

export default {
  components: {
    BulmaAccordion,
    BulmaAccordionItem,
  },
  filters: { docUsage },
  data() {
    return {
      status: 1,
      report: {
        data: {},
        nodes: []
      },
      signShow: -1,
      modalShow: false,
      detail: {
        type: 1, // 查看详情类型 1：交流记录，2：提交文件，3：自我备忘
        data: {}
      },
      experience: {
        status: 1,
        content: ""
      },
      downloadUrl: "/api/business/report/export"
    };
  },
  created() {
    this.$nextTick(() => {
      this.generateBusinessReport();
    });
  },
  computed: {
    ...mapState({
      metaInfo: state => state.meta.info,
      experiences: state => state.meta.experiences
    }),
  },
  mounted() {
    document.addEventListener("click", () => {
      this.signShow = -1;
    });
  },
  methods: {
    generateBusinessReport() {
      this.run();
      this.$store.dispatch("getExperienceList", {
        business_id: this.$route.params.bid
      });
      businessService
        .genarateBusinessReport({
          business_id: this.$route.params.bid,
          node_id: this.$route.params.nid,
          is_observable: 1
        })
        .then(data => {
          this.report.data = data;
          this.report.nodes = data.nodes;

          this.experience.status = data.experience.status;
          this.experience.content =
            data.experience.status === 1 ? data.experience.content : "";
          this.$emit("data-ready");
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },
    handlerDetailClick(type, data) {
      this.detail.type = type;
      this.detail.data = data;
      this.modalShow = true;
    },
    // 查看签字处理
    showSignHandle(index) {
      this.signShow === index ? (this.signShow = -1) : (this.signShow = index);
    },
    precentStyle(item, arr) {
      let num = item.num;
      let total = 0;
      arr.forEach(element => {
        total += element.num;
      });
      let percent = parseFloat((num / total) * 100).toFixed(2);
      return {
        width: percent + "%"
      };
    },
    precentItem(item, arr) {
      let num = item.num;
      let total = 0;
      arr.forEach(element => {
        total += element.num;
      });
      let percent = parseFloat((num / total) * 100).toFixed(2) + "%";
      return percent;
    },
    previewFile(fileUrl) {
      openFile(fileUrl, 1);
    },
    replaceContent(con) {
      return con.replace(/\r?\n|\r/g, "<br/>");
    },
    handleSave() {
      if (this.experience.content === "") {
        this.$toasted.error("请输入分析与总结");
        return;
      }
      businessService
        .postBusinessExperience({
          business_id: this.$route.params.bid,
          content: this.experience.content
        })
        .then(() => {
          this.$toasted.success("保存成功");
        });
    },
    exportReport() {
      window.open(this.downloadUrl + "?business_id=" + this.$route.params.bid);
    }
  }
};
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
.report-index {
  .result-detail-wrapper {
    font-size: 12px;
  }
  .linkpoint {
    cursor: pointer;
  }
  .result-detail-content {
    min-height: 200px;
    max-height: 400px;
    overflow: auto;
    ul {
      list-style: none;
      padding-left: 20px;
    }
    p {
      word-break: break-all;
    }
  }
  .voteLi {
    padding: 5px;
  }
  .voteLi .voteName {
    display: inline-block;
    color: #3a7de0;
    line-height: 20px;
    margin-right: 5px;
    width: 95px;
    text-align: right;
  }
  .voteLi .precentBox {
    display: inline-block;
    width: 500px;
    height: 20px;
    background-color: #fff;
    vertical-align: middle;
    position: relative;
  }
  .precentBox .precentLine {
    display: inline-block;
    position: absolute;
    left: 0;
    top: 7px;
    border-top: 2px solid rgb(24, 185, 86);
    border-bottom: 2px solid rgb(24, 185, 86);
  }
  .voteLi .votePercent {
    display: inline-block;
    color: #111;
    line-height: 20px;
    margin-left: 5px;
  }
  .submit-container {
    margin-top: 10px;
    padding: 10px;
  }
  .submit-container .submit-textarea {
    width: 100%;
    border: none;
    height: 200px;
    padding: 10px;
    overflow: auto;
  }
  .member-experience-container {
    font-size: 14px;
    text-align: left;
    ul {
      list-style: none;
      padding-left: 0px;
    }
    height: 320px;
    padding: 20px;
    overflow: auto;
    background-color: #fff;
    border: 1px solid #dfe6ec;
  }
  .member-experience-list > li {
    padding: 4px 0;
  }
  .member-experience-list > li > .time {
    line-height: 24px;
  }
  .member-experience-list > li > .content {
    line-height: 20px;
    word-break: break-all;
  }
}
</style>
