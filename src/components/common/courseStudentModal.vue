<template>
  <modal :visible="show" title="添加课堂学生信息" size="large" :cancelHide="false" okText="添加" @on-ok="addok" @on-cancel="cancel">
    <div class="row padding8">
      <div class="col-xs-6">
        <span class="spanItem">课程号：</span>
        <input type="text" class="inp-edit" v-model.trim="param.c_no" />
      </div>
      <div class="col-xs-6">
        <span class="spanItem">课程名：</span>
        <input type="text" class="inp-edit" v-model.trim="param.c_name" />
      </div>
    </div>
    <div class="row padding8">
      <div class="col-xs-6">
        <span class="spanItem">课序号：</span>
        <input type="text" class="inp-edit" v-model.trim="param.c_sort" />
      </div>
      <div class="col-xs-6">
        <span class="spanItem">开课学期：</span>
        <input type="text" class="inp-edit" v-model.trim="param.c_term" />
      </div>
    </div>
    <div class="row padding8">
      <div class="col-xs-6">
        <span class="spanItem">任课老师：</span>
        <input type="text" class="inp-edit" v-model.trim="param.t_name" />
      </div>
      <div class="col-xs-6">
        <span class="spanItem">工号：</span>
        <input type="text" class="inp-edit" v-model.trim="param.t_username" />
      </div>
    </div>
    <div class="row padding8">
      <div class="col-xs-6">
        <span class="spanItem">课时：</span>
        <input type="text" class="inp-edit" v-model.trim="param.c_time" />
      </div>
      <div class="col-xs-6">
        <span class="spanItem">业务学时：</span>
        <input type="text" class="inp-edit" v-model.trim="param.c_experiment_time" />
      </div>
    </div>
    <div class="row padding8">
      <div class="col-xs-6">
        <span class="spanItem">学号：</span>
        <input type="text" class="inp-edit" v-model.trim="param.s_username" />
      </div>
      <div class="col-xs-6">
        <span class="spanItem">姓名：</span>
        <input type="text" class="inp-edit" v-model.trim="param.s_username" />
      </div>
    </div>
    <div class="row padding8">
      <div class="col-xs-6">
        <span class="spanItem">班级：</span>
        <input type="text" class="inp-edit" v-model.trim="param.class_name" />
      </div>
    </div>
  </modal>
</template>
<script type="text/ecmascript-6">
import modal from 'components/modal/modal'
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      param: {}
    }
  },
  methods: {
    // 确认添加成员
    addok() {
      let param = Object.assign({}, this.param)
      this.$emit('add-item', param)
    },
    // 取消
    cancel() {
      this.$emit('on-cancel')
    }
  },
  components: {modal}
}
</script>
<style scoped>
  .padding8{
    padding: 8px 0;
  }
  .spanItem{
    display: inline-block;
    width: 80px;
    text-align: right;
    line-height: 1.5
  }
</style>

