<template>
    <div class="edit-module">
        <loading v-if="isRunning"></loading>
        This is Edit Module
    </div>
</template>

<script>
    import {mapState} from "vuex";
    import Loading from "@/components/loading/Loading";

    export default {
        name: "edit-module",
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
    .edit-module {
    }
</style>