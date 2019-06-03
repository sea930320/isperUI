<template>
    <div class="search2" v-if="userInfo">Search2</div>
</template>

<script>
import { mapState } from "vuex";
export default {
    name: "search2",
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
.search2 {
}
</style>