<template>
  <div class="evaluate-container container"></div>
</template>

<script>
export default {
  name: "evaluateBusiness",
  components: {},
  data() {
    return {
      groupList: [],
      evaluateType: 2,
      sectionList: [],
      overallEvaluate: "",
      score: "",
      focusIndex: -1,
      taskId: "",
      viewDetailShow: false,
      viewReportShow: false,
      stuInfo: {}
    };
  },
  // 文本框自动获取焦点自定义指令
  directives: {
    focus: {
      inserted: function(el, { value }) {
        if (value) {
          el.focus();
        }
      }
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
    checkedItems() {
      return this.groupList.filter(item => item.checked === true);
    },
    checkedIds() {
      return this.checkedItems.map(item => item.user_id);
    },
    evaluate_node() {
      let arr = [];
      this.sectionList.forEach(item => {
        if (item.evaStr !== "") {
          let obj = {
            content: item.evaStr,
            node_id: item.node_id
          };
          arr.push(obj);
        }
      });
      return arr;
    }
  },
  watch: {
    evaluateType: function(val, oldVal) {
      if (val === 1) {
        this.focusIndex = 0;
      } else if (val === 2) {
        this.focusIndex = -1;
      }
    }
  },
  mounted() {
    this.taskId = this.$route.params.taskId;
    this.queryGroupList();
    this.queryNodeList();
  },
  methods: {
    // 查询小组成员信息
    queryGroupList() {
      let param = {
        business_id: this.taskId
      };
      mentorService.queryGroupList(param).then(data => {
        data.forEach(item => {
          item.checked = false;
        });
        this.groupList = data;
      });
    },
    // 查询环节信息
    queryNodeList() {
      let param = {
        business_id: this.taskId
      };
      mentorService.queryNodeList(param).then(data => {
        data.forEach(item => {
          item.evaStr = "";
        });
        this.sectionList = data;
      });
    },
    // 查看实验报告
    viewReport() {
      this.viewReportShow = true;
    },
    cancelReportView() {
      this.viewReportShow = false;
    },
    // 验证 点评实验
    validateInfo() {
      if (this.checkedIds.length === 0) {
        this.$toast.info("请勾选要点评的小组成员");
        return false;
      }
      if (this.checkedIds.length > 0) {
        let allEvaed = this.checkedItems.filter(item => {
          return (
            item.teacher_score === "" ||
            item.teacher_score === undefined ||
            item.teacher_score === null
          );
        });
        if (allEvaed.length !== 0) {
          if (this.overallEvaluate === "") {
            this.$toast.info("勾选了未评价小组成员，请填写总体点评评语");
            return false;
          }
        }
      }
      if (this.score === "") {
        this.$toast.info("请填写教师评分");
        return false;
      }
      if (this.score !== "") {
        let tmp = Number(this.score);
        if (!tmp || tmp < 0 || tmp > 100) {
          this.$toast.info("教师评分需为0-100间的数值");
          return false;
        }
      }
      if (this.overallEvaluate.length > 100) {
        this.$toast.info("总体点评字数超过100字");
        return false;
      }
      let flag = this.evaluate_node.every(item => {
        return item.content.length <= 100;
      });
      if (!flag) {
        this.$toast.info("环节点评字数超过100字");
        return false;
      }
      return true;
    },
    // 实验点评 保存
    saveEvaluate() {
      if (this.validateInfo()) {
        let param = {
          experiment_id: this.taskId,
          user_id: this.checkedIds.join(","),
          content: this.overallEvaluate,
          teacher_score: Math.round(parseFloat(this.score)),
          create_by_id: this.userInfo.id,
          evaluate_node: JSON.stringify(this.evaluate_node)
        };
        mentorService
          .saveEvaluate(param)
          .then(data => {
            this.$toast.success("评价成功");
            this.queryGroupList();
            this.queryNodeList();
            this.overallEvaluate = "";
            this.score = "";
          })
          .catch(data => {
            this.$toast.warn(data.msg);
          });
      }
    },
    // 点击小组成员 将目前的点评信息更新为现在当前点击成员之前保存的点评信息
    freshEvaluate(item) {
      this.stuInfo = Object.assign({}, item);
      this.queryDetail();
      this.score = this.stuInfo.teacher_score;
    },
    queryDetail() {
      let param = {
        experiment_id: this.stuInfo.experiment_id,
        user_id: this.stuInfo.user_id
      };
      mentorService.queryEvaDetail(param).then(data => {
        this.overallEvaluate = data.evaluate_experiment
          ? data.evaluate_experiment.content
          : "";
        let evaData = data.evaluate_node ? data.evaluate_node : [];
        this.sectionList.forEach(item => {
          if (evaData.length === 0) {
            item.evaStr = "";
          } else {
            let flag = evaData.some(val => {
              return item.node_id === val.node_id;
            });
            if (flag) {
              evaData.forEach(data => {
                if (item.node_id === data.node_id) {
                  item.evaStr = data.content;
                }
              });
            } else {
              item.evaStr = "";
            }
          }
        });
      });
    },
    // 点评信息模板 点击 将模板信息添加到点评栏
    msgClick(msg) {
      if (this.focusIndex === -2) {
        this.$toast.info("请点击要添加评语的环节处");
      } else {
        if (this.focusIndex === -1) {
          this.overallEvaluate += msg.toString().trim();
        } else {
          this.sectionList[this.focusIndex].evaStr += msg.toString().trim();
        }
      }
    },
    // 查看已点评过点评信息
    viewEvaluate(item) {
      this.stuInfo = Object.assign({}, item);
      this.viewDetailShow = true;
    },
    cancelView() {
      this.viewDetailShow = false;
    },
    // 返回
    returnBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.evaluate-container {
}
</style>
