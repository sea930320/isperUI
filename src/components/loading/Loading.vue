<template>
    <div class="spinner-container">
        <hexagon></hexagon>
    </div>
</template>

<script type="text/babel">
import { Hexagon } from "vue-loading-spinner";

export default {
    name: "loading",
    components: { Hexagon }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss" scoped>
.spinner-container {
    position: fixed;
    width: 100%;
    left: 0;
    height: 100vh;
    top: 0;
    background: rgba(255, 255, 255, 0.6);
    z-index: 10001;
}

.spinner {
    margin-top: 40vh;
    margin-left: calc(50% - 20px);
}
</style>