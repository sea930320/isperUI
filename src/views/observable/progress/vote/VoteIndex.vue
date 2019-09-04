<template>
  <div class="vote-index container" style="margin-top: 10%;">
    <loading v-if="isRunning"></loading>
    <!-- Tabs with card integration -->
    <b-card
      overlay
      img-src="/media/waiting.gif"
      img-alt="Waiting..."
      text-variant="white"
      title="请耐心等待。。。"
      sub-title="正在进行表决或者输入表决选项，请等待"
      v-if="[1,2,3].includes(status)"
      class="ml-auto mr-auto w-40 text-left"
    ></b-card>
    <b-card
      :title="(status === 4) ? '表决中间结果 : ' + resultData.title : '表决结果 : ' + resultData.title"
      :sub-title="resultData.description"
      v-if="status === 5 || status === 4"
      class="text-left"
    >
      <b-card-text>
        表决模式 : {{(resultData.mode === 1) ? '择一表决' : (resultData.mode === 2) ? '多项表决' : '淘汰式表决'}}
        &emsp;&emsp;表决方式 : {{(resultData.method === 0) ? '记名表决' : '无记名表决'}}
      </b-card-text>

      <div v-if="resultData.method === 0" class="text-center">
        <b-table
          :bordered="true"
          :items="
                        [
                            resultData.items.map(x=>x.text).concat('未按表决器').map((x, i)=>x + ' : ' +resultData.items.map(x=>x.voted_users.length).concat(resultData.members.filter(x=>x.voted === 0).length)[i] + '/' + resultData.members.length + ' ('
                                        + Math.round(resultData.items.map(x=>x.voted_users.length).concat(resultData.members.filter(x=>x.voted === 0).length)[i]*100/resultData.members.length) + '%) ').reduce((obj, cur, i) => {
                                return { ...obj, [cur]: resultData.items.map(x=>x.voted_users.join(' , ')).concat(resultData.members.filter(x=>x.voted === 0).map(x=>x.username).join(' , '))[i]};
                            }, {})
                        ]
                    "
          :fields="resultData.items.map(x=>x.text).concat('未按表决器').map((x, i)=>x + ' : ' +resultData.items.map(x=>x.voted_users.length).concat(resultData.members.filter(x=>x.voted === 0).length)[i] + '/' + resultData.members.length + ' ('
                                        + Math.round(resultData.items.map(x=>x.voted_users.length).concat(resultData.members.filter(x=>x.voted === 0).length)[i]*100/resultData.members.length) + '%) ')"
        ></b-table>
      </div>
      <div v-if="resultData.method === 1" class="text-center">
        <b-table
          :bordered="true"
          :items="
                        [
                            resultData.items.map(x=>x.text).concat('未按表决器').reduce((obj, cur, i) => {
                                return { ...obj, [cur]:
                                        resultData.items.map(x=>x.voted_count).concat(resultData.members.filter(x=>x.voted === 0).length)[i] + '/' + resultData.members.length + ' ('
                                        + Math.round(resultData.items.map(x=>x.voted_count).concat(resultData.members.filter(x=>x.voted === 0).length)[i]*100/resultData.members.length) + '%) '
                                    };
                            }, {})
                        ]
                    "
          :fields="resultData.items.map(x=>x.text).concat('未按表决器')"
        ></b-table>
      </div>
    </b-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Loading from "@/components/loading/Loading";
import VoteService from "@/services/voteService";
import VueTagsInput from "@johmun/vue-tags-input";
import { Datetime } from "vue-datetime";
import "vue-datetime/dist/vue-datetime.css";

export default {
  name: "vote-index",
  components: {
    Loading,
    VueTagsInput,
    Datetime
  },
  data() {
    return {
      tag: "",
      node_members: [],
      status: null,
      waitMsg: "",
      tabIndex: 1,
      voteMode: null,
      startVote: false,
      voteData: {
        voteItems: [],
        voteTitle: "",
        voteDescription: ""
      },
      voteSetting: {
        members: [],
        voteMethod: 0,
        voteEndTime: "",
        voteMaxVote: 1,
        voteLostVote: 1
      },
      resultData: {}
    };
  },
  computed: {
  },
  created() {
    this.$nextTick(() => {
      this.getInitVoteData();
    });
  },
  methods: {
    getInitVoteData() {
      this.run();
      VoteService.getInitVoteData({
        business_id: this.$route.params.bid,
        node_id: this.$route.params.nid,
        role: 0,
        observable: 1
      })
        .then(data => {
          this.status = data.status;
          if (data.status === 1) this.node_members = data.data.node_members;
          else if (data.status === 2) this.waitMsg = data.data;
          else if (data.status === 3) {
            this.voteMode = null;
            this.voteData.voteTitle = data.data.title; // fix
            this.voteData.voteDescription = data.data.description; // fix
            this.voteData.voteItems = data.data.items.map(x => {
              return { text: x.text };
            }); // fix
            this.node_members = data.data.node_members;
            this.voteSetting.members = [];
            this.voteSetting.voteEndTime = "";
            this.voteSetting.voteLostVote = 1;
            this.voteSetting.voteMaxVote = 1;
            this.voteSetting.voteMethod = 0;
            this.startVote = true;
          } else if (data.status === 4) this.resultData = data.data;
          else if (data.status === 5) this.resultData = data.data;
          else if (data.status === 6) this.resultData = data.data;
          else if (data.status === 7) this.resultData = data.data;
          this.$emit("data-ready");
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    }
  }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.vote-index {
  .modeBtn {
    height: 70px;
    width: 180px;
    border-radius: 10px;
    margin: 40px 45px;
    font: 22px "Microsoft Yahei", Tahoma, Helvetica, Arial, "\5B8B\4F53",
      sans-serif;
  }

  .nav-tabs .nav-link.active {
    color: #4169e1;
    background-color: #c7dbff;
    border-color: #c7dbff;
    border-width: 0 0 2px;
  }
  .vdatetime-input {
    text-align: center !important;
    padding-left: 3rem !important;
    padding-right: 3rem !important;
  }
}
</style>
