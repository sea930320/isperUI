<template>
  <div class="panel">
    <div class="panel-header">{{title}}</div>
    <div class="panel-body" :style="bodyStyle">
      <slot></slot>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'ElPanel',

    props: ['title', 'bodyStyle']
  }
</script>
<style>
.panel{
	margin-bottom: 20px;
	background-color: #fff;
	border: 1px solid #cdcdcd;
}
.panel> .panel-header {
	line-height: 42px;
	background-color: #e6f1f8;
	border-left: 3px solid #3a7de0;
	border-bottom: 1px solid #cdcdcd;
	padding-left: 10px;
}
.panel> .panel-body {
	padding: 20px 28px;
	line-height: 25px;
}
.panel> .panel-body> .tarea{
	width: 100%;
	border: 0 none;
	line-height: 25px;
	min-height: 100px;
	background: none;
}
</style>
