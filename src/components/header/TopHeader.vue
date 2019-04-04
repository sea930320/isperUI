<template>
  <div class="top-header bg-light mb-5">
    <div class="container d-flex justify-content-start py-2 my-2">
      <div class="logo mr-3">
        <b-link href="/">
          <img src="@/assets/logo.png">
        </b-link>
      </div>
      <h1 class="m-0">
        <slot name="pageTitle"></slot>
      </h1>
    </div>
  </div>
</template>

<script>
export default {
  computed: {},
  methods: {}
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.top-header {
  .logo {
    img {
      width: 50px;
    }
  }
}
</style>