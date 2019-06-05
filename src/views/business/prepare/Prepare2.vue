<template>
    <div class="prepare2" v-if="userInfo">Prepare2</div>
</template>

<script>
import { mapState } from "vuex";
export default {
    name: "prepare2",
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
.prepare2 {
}
</style>