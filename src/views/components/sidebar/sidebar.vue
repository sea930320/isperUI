<template>
  <div class="sidebar">
    <div class="sidebar-title" :class="icon">{{title}}</div>
    <div class="sidebar-main">
      <div class="sidebar-search" v-if="hasSearch">
        <form action="" method="">
          <input type="text" class="inp-txt" placeholder="搜索" v-model="filterKey" @input="search"/>
          <a href="javascript:;" class="btn-search-small" @click="search"></a>
        </form>
      </div>
      <div class="sidebar-list">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script >
export default {
  props: {
    title: String,
    icon: String,
    hasSearch: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      filterKey: ''
    }
  },
  methods: {
    search() {
      this.$emit('on-search', this.filterKey)
    }
  }
}
</script>
<style>
.sidebar{
  width: 100%;
}
.sidebar .sidebar-title{
	color: #fff;
	height: 42px;
	line-height: 42px;
	background-color: #3A7DE0;
	padding-left: 45px;
}
.icon-course{
	background: url('./img/icon_course.png') no-repeat 15px center;
}
.icon-type{
	background: url('./img/icon_classify.png') no-repeat 15px center;
}
.sidebar .sidebar-main{
	padding: 7px 5px;
	height: 520px;
	overflow: auto;
	border: 1px solid #cdcdcd;
  background-color: #fff;
	border-top: none;
}
.sidebar-main .sidebar-list{
	padding: 5px 10px;
}
.sidebar-main .sidebar-list li{
	padding: 0 4px;
	border-bottom: 1px solid #D6E1E8;
}
.sidebar-main .sidebar-list li.active {
  background-color: #D6E1E8;
}
.sidebar-main .sidebar-list a{
	display: block;
	color: #3A7DE0;
	line-height: 38px;
}
.sidebar-search{
	position: relative;
}
.inp-txt{
	width: 100%;
	height: 28px;
	line-height: 28px;
	text-indent: 5px;
	border: 1px solid #a9b6c6;
	outline: none;
	background-color: #f6f6f6;
}
</style>
