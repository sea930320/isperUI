<template>
    <div class="dictionary_index">
        <loading v-if="isRunning"></loading>
        <div>
            <b-button v-b-toggle.collapse-1 block class="col-3 m-2" variant="primary">Toggle Collapse</b-button>
            <b-button v-b-toggle.collapse-1 block class="col-3 m-2" variant="primary">Toggle Collapse</b-button>
            <b-button v-b-toggle.collapse-1 block class="col-3 m-2" variant="primary">Toggle Collapse</b-button>
            <b-button v-b-toggle.collapse-1 block class="col-3 m-2" variant="primary">Toggle Collapse</b-button>
        </div>
    </div>
</template>

<script>
    import Loading from "@/components/loading/Loading";
    import _ from "lodash";
    import DictionaryService from "@/services/dictionaryService";

    export default {
        name: "dictionary_index",
        components: {
            Loading,
        },
        created() {
            this.$nextTick(() => {
                this.getLoginLogs();
            });
        },
        data() {
            return {
                queryParam: {
                    page: 1,
                    size: 5
                },
                queryDebounceParam: {
                    search: ""
                },
            };
        },
        watch: {
            queryParam: {
                handler() {
                    this.getLoginLogs();
                },
                deep: true
            },
            queryDebounceParam: {
                deep: true,
                handler: _.debounce(function () {
                    this.getLoginLogs();
                }, 500)
            },
        },
        computed: {

        },
        methods: {
            getLoginLogs() {

            },
        }
    };
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
    .dictionary_index {

    }
</style>