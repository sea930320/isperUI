<template>
  <div class="content"> 
    <div class="tableHead">
      <span class="spanItem w_13">序号</span>
      <span class="spanItem w_13">分类</span>
      <span class="spanItem w_13">等级</span>
      <span class="spanItem w_60">评语样本</span>
    </div>
    <div class="table-wrapper border">
      <happy-scroll hide-horizontal resize>
        <div v-for="(comment, indexHead) in comments" :key="indexHead">
          <div class="evaStrItem" v-for="(detail, index2) in comment.evaluate" :key="index2" @click="msgClick(detail.evaluate_content)">
            <span class="spanItem w_13">{{index2 == 0 ? (indexHead + 1) : ''}}</span>
            <span class="spanItem w_13">{{index2 == 0 ? comment.evaluate_type : ''}}</span>
            <span class="spanItem w_13">{{detail.evaluate_level}}</span>
            <span class="spanItem w_60 alignLeft">{{detail.evaluate_content}}</span>
          </div>
        </div>
      </happy-scroll>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import mentorService from 'src/services/mentorService'
import { HappyScroll } from 'vue-happy-scroll'
export default {
  name: 'evaluateTem',
  components: { HappyScroll },
  data() {
    return {
      // 点评信息 模板数据
      comments: [
        {
          evaluate_type: '',
          evaluate: []
        }
      ]
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      mentorService
        .queryEvaModal()
        .then(data => {
          this.comments = data
        })
    },
    msgClick(msg) {
      this.$emit('msgClick', msg)
    }
  }
}
</script>
<style scoped>
  .content{
    padding-top: 7px;
  }
  .table-wrapper.border {
    min-height: 560px;
    height: 560px;
  }
  .tableHead{
    background-color: #00c175;
  }
  .tableHead .spanItem{
    display: inline-block;
    line-height: 34px;
    height: 34px;
    text-align: center;
    vertical-align: top;
    color: #fff;
  }
  .evaStrItem .spanItem{
    display: inline-block;
    line-height: 34px;
    text-align: center;
    vertical-align: top;
  }
  .evaStrItem .alignLeft{
    text-align: left;
    padding-left: 12px;
  }
  .evaStrItem{
    background-color: #fff;
    border-bottom: 1px solid #ccc;
    cursor: pointer;
  }
  .evaStrItem:hover{
    background-color: rgba(129,208,177,.3);
  }
  .w_13{
    width: 12%;
  }
  .w_60{
    width: 60%;
  }
  .content .table tbody tr td.alignCenter{
    padding: 6px 0px;
    text-align: center;
  }
</style>

