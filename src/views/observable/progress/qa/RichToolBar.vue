<template>
  <div class="rich-toolbar">
    <div :id="'toolbar-' + index">
      <button class="ql-bold"></button>
      <button class="ql-italic"></button>
      <button class="ql-strike mr-2"></button>
      <button class="ql-blockquote"></button>
      <button class="ql-code-block"></button>
      <select class="ql-header">
        <option value="1"></option>
        <option value="2"></option>
        <option selected></option>
        <option value="3"></option>
        <option value="4"></option>
        <option value="5"></option>
        <option value="6"></option>
      </select>

      <button class="ql-list" value="ordered"></button>
      <button class="ql-list" value="bullet"></button>

      <button class="ql-indent" value="-1"></button>
      <button class="ql-indent" value="+1"></button>
      <button class="ql-direction" value="rtl"></button>

      <select class="ql-size">
        <option value="small"></option>
        <option selected></option>
        <option value="large"></option>
        <option value="huge"></option>
      </select>
      <button class="ql-addBlank ml-3">
        <icon name="asterisk"></icon>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    index: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {};
  },
  created() {
    this.$nextTick(() => {});
  },
  mounted() {},
  methods: {}
};
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
.rich-toolbar {
}
</style>