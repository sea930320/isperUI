<template>
  <div class="meta-main-box">
    <loading v-if="isRunning"></loading>
    <b-card
      overlay
      img-src="/media/waiting.gif"
      img-alt="Waiting..."
      text-variant="white"
      title="请耐心等待。。。"
      sub-title="正在进行投票，请等待"
      v-if="[1,2,3].includes(status)"
      style="margin-top: 10%"
      class="ml-auto mr-auto w-40 text-left"
    ></b-card>
    <b-card :title="'投票主题 : ' + resultData.title" v-if="status === 4" class="text-left">
      <b-card-text>
        投票结果 : {{(resultData.share === 0) ? '公开' : '不公开'}}
        &emsp;&emsp;投票方式 : {{(resultData.method === 0) ? '记名投票' : '无记名投票'}}
      </b-card-text>

      <div class="poll-result col-xs-6">
        <div class="poll-result-title">投票统计</div>
        <div class="poll-result-detail">
          <dl>
            <dt>{{agreePercent}}%</dt>
            <dd>同意</dd>
          </dl>
          <dl>
            <dt>{{disagreePercent}}%</dt>
            <dd>不同意</dd>
          </dl>
          <dl>
            <dt>{{quitPercent}}%</dt>
            <dd>弃权</dd>
          </dl>
        </div>
        <div class="poll-list">
          <dl>
            <dd v-for="(user, index) in resultData.items['1']" :key="index">{{user}}</dd>
          </dl>
          <dl>
            <dd v-for="(user, index) in resultData.items['2']" :key="index">{{user}}</dd>
          </dl>
          <dl>
            <dd v-for="(user, index) in resultData.items['3']" :key="index">{{user}}</dd>
          </dl>
        </div>
      </div>
    </b-card>
  </div>
</template>
<script>
import Loading from "@/components/loading/Loading";
import pollService from "@/services/pollService";
import { mapState } from "vuex";
import "vue-datetime/dist/vue-datetime.css";

export default {
  name: "MetaPoll",
  components: { Loading },
  data() {
    return {
      node_members: [],
      method_options: [
        { text: "记名投票", value: 0 },
        { text: "无记名投票", value: 1 }
      ],
      share_options: [{ text: "公开", value: 0 }, { text: "不公开", value: 1 }],
      status: null,
      waitMsg: "",
      pollData: {
        pollTitle: "",
        members: [],
        pollMethod: 0,
        pollEndTime: "",
        pollShare: 0
      },
      resultData: {},
      options: [
        {
          type: 1,
          name: "同意"
        },
        {
          type: 2,
          name: "不同意"
        },
        {
          type: 3,
          name: "弃权"
        }
      ]
    };
  },
  computed: {
    ...mapState(["meta"]),
    metaInfo() {
      return this.meta.info;
    },
    agreePercent() {
      let total =
        this.resultData.items["1"].length +
        this.resultData.items["2"].length +
        this.resultData.items["3"].length;
      return ((this.resultData.items["1"].length / total) * 100).toFixed(2);
    },
    disagreePercent() {
      let total =
        this.resultData.items["1"].length +
        this.resultData.items["2"].length +
        this.resultData.items["3"].length;
      return ((this.resultData.items["2"].length / total) * 100).toFixed(2);
    },
    quitPercent() {
      let total =
        this.resultData.items["1"].length +
        this.resultData.items["2"].length +
        this.resultData.items["3"].length;
      return ((this.resultData.items["3"].length / total) * 100).toFixed(2);
    },
    check_allSetting() {
      return !(
        this.pollData.pollTitle !== "" &&
        this.pollData.members.length !== 0 &&
        this.pollData.pollEndTime !== ""
      );
    }
  },
  created() {
    this.$nextTick(() => {
      this.getInitPollData();
    });
  },
  methods: {
    getInitPollData() {
      this.run();
      pollService
        .getInitPollData({
          business_id: this.$route.params.bid,
          node_id: this.$route.params.nid,
          role: 0,
          observable: 1
        })
        .then(data => {
          this.status = data.status;
          if (data.status === 1) this.node_members = data.data.node_members;
          else if (data.status === 2) this.waitMsg = data.data;
          else if (data.status === 3) this.resultData = data.data;
          else if (data.status === 4) this.resultData = data.data;
          this.$emit("data-ready");
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    }
  }
};
</script>
<style>
.project-tip-containar p {
  word-break: break-all;
}

.poll-result-title {
  height: 40px;
  line-height: 40px;
  padding: 0 20px;
  font-size: 16px;
  text-align: left;
  background-color: #3b7ce0;
  color: #fff;
}

.poll-result-detail {
  overflow: hidden;
  padding: 20px 0;
  border: 1px solid #cdcdcd;
  border-top: none;
}

.poll-result-detail dl {
  float: left;
  width: 33.3%;
  text-align: center;
}

.poll-list dl {
  float: left;
  width: 33.3%;
  text-align: center;
}

.poll-result-detail dl dt {
  font-size: 18px;
  line-height: 2.8;
  color: #3b7ce0;
}

.poll-result-detail dl dd {
  font-size: 14px;
  line-height: 1.4;
  color: #a0a0a0;
}

.poll-list {
  height: 300px;
  padding: 10px 0 10px 0;
  border: 1px solid #cdcdcd;
  border-top: none;
  overflow-y: auto;
}

.poll-list > ul > li {
  font-size: 14px;
  line-height: 2;
}

.poll-list > ul > li > span {
  float: right;
  color: #ababab;
}

.poll-box {
  height: 225px;
  border: 1px solid #cdcdcd;
  background-color: #efefef;
}

.poll-options-btn-group {
  text-align: center;
}

.poll-options-btn {
  display: inline-block;
  height: 40px;
  line-height: 40px;
  width: 92px;
  margin-right: 32px;
  font-size: 14px;
  text-align: center;
  color: #397de0;
  border: 1px solid #397de0;
  border-radius: 4px;
}

.poll-options-btn:last-child {
  margin-right: 0;
}
</style>
