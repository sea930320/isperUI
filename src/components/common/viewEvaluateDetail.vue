<template>
  <modal
  :visible="visible"
  title="评价详情"
  :footerHide="true"
  size="large"
  @on-cancel="cancel">
    <div class="evaluateContainer">
      <div class="studentInfo">
        <div class="stuTop">
          <span class="inline">学号</span>
          <span class="inline">姓名</span>
          <span class="inline">班级</span>
          <span class="inline">昵称</span>
          <span class="inline">角色</span>
          <span class="inline">分数</span>
        </div>
        <div class="stuData">
          <span class="inline">{{stuInfo.username}}</span>
          <span class="inline">{{stuInfo.user_name}}</span>
          <span class="inline">{{stuInfo.class_name}}</span>
          <span class="inline">{{stuInfo.nickname}}</span>
          <span class="inline">{{stuInfo.role_name}}</span>
          <span class="inline">{{stuInfo.teacher_score}}</span>
        </div>
      </div>
      <div class="evaInfo">
        <p class="overTitle">总体点评：</p>
        <div class="overallEva">
          {{overallEva}}
        </div>
        <p class="sectionTitle">环节点评：</p>
        <div class="sectionEva">
          <div class="sectionEvaItem" v-for="(item, index) in secList" :key="index">
            <span class="sectionName">{{item.node_name}}：</span><span class="sectionItemInfo">{{item.content}}</span>
          </div>
        </div>
      </div>
    </div>
  </modal>
</template>

<script>
import modal from 'components/modal/modal'
import mentorService from 'src/services/mentorService'
export default {
  name: 'viewEvaluateDetail',
  components: { modal },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    stuInfo: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      overallEva: '',
      secList: []
    }
  },
  watch: {
    'visible': function(val) {
      if (!val) {
        this.overallEva = ''
        this.secList = []
      } else {
        this.queryDetail()
      }
    }
  },
  methods: {
    queryDetail() {
      let param = {
        experiment_id: this.stuInfo.experiment_id,
        user_id: this.stuInfo.user_id
      }
      mentorService
        .queryEvaDetail(param)
        .then(data => {
          this.overallEva = data.evaluate_experiment ? data.evaluate_experiment.content : ''
          this.secList = data.evaluate_node
        })
    },
    cancel() {
      this.$emit('cancelView')
    }
  }
}
</script>

<style scoped>
  .stuTop{
    padding: 8px 0;
    background-color: #00c175;
  }
  .stuData{
    padding: 8px 0;
    border: 1px solid #ccc;
    border-top: none;
  }
  .inline{
    display: inline-block;
    font-size: 14px;
    line-height: 24px;
    width: 16%;
    text-align: center;
  }
  .stuTop .inline{
    color: #fff;
  }
  .stuData .inline{
    color: #222;
  }

  .evaInfo .overTitle,.evaInfo .sectionTitle{
    padding:5px 10px;
    font-size: 14px;
    line-height: 24px;
    color: #222;
    font-weight: 700;
  }
  .evaInfo .overallEva{
    min-height: 100px;
    text-indent: 2em;
    font-size: 14px;
    font-weight: 400;
    line-height: 24px;
    border: 1px solid #ccc;
  }
  .evaInfo .sectionEva{
    min-height: 100px;
    font-size: 14px;
    font-weight: 400;
    line-height: 24px;
    border: 1px solid #ccc;
  }
  .evaInfo .sectionEvaItem{
    padding: 5px;
    border-bottom: 1px solid #ededef;
  }
  .evaInfo .sectionName{
    display: inline-block;
    width: 15%;
    font-size: 14px;
    font-weight: 400;
    vertical-align: top;
    line-height: 24px;
    text-align: center;
  }
  .evaInfo .sectionItemInfo{
    display: inline-block;
    width: 85%;
    font-size: 12px;
    font-weight: 400;
    line-height: 24px;
  }
</style>
