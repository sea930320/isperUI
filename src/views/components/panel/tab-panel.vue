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
    name: 'ElTabPanel',

    props: ['title', 'bodyStyle']
  }
</script>
