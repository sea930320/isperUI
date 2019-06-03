<template>
    <div class="search-index" v-if="userInfo">
        <router-view></router-view>
    </div>
</template>

<script>
import { mapState } from "vuex";
export default {
    name: "search-index",
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
.search-index {
}
</style>