<template>
    <div class="publicity-module">
        <loading v-if="isRunning"></loading>
        This is Publicity Module
    </div>
</template>

<script>
    import {mapState} from "vuex";
    import Loading from "@/components/loading/Loading";

    export default {
        name: "publicity-module",
        components: {
            Loading,
        },
        data() {
            return {}
        },
        created() {
            this.$nextTick(() => {
            });
        },
        computed: {
            ...mapState(["userInfo"]),
        },
        watch: {
        },
        methods: {
        }
    };
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
    .publicity-module {
    }
</style>