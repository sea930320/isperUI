<template>
    <div class="animation-index" v-if="userInfo">Animation Index</div>
</template>

<script>
import { mapState } from "vuex";
export default {
    name: "animation-index",
    components: {},
    filters: {},
    data() {
        return {};
    },
    created() {
        this.$nextTick(() => {});
    },
    computed: {
        ...mapState(["userInfo"])
    },
    watch: {},
    methods: {}
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.animation-index {
}
</style>