<template>
    <div class="spinner-container">
        <rotate-square5></rotate-square5>
    </div>
</template>

<script type="text/babel">
import { RotateSquare5 } from "vue-loading-spinner";

export default {
    name: "loading",
    components: { RotateSquare5 }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss" scoped>
.spinner-container {
    position: absolute;
    width: 100%;
    left: 0;
    height: 100vh;
    top: 0;
    background: rgb(230, 234, 255);
    z-index: 10001;
}

.spinner {
    margin-top: 40vh;
    margin-left: calc(50% - 20px);
}
</style>