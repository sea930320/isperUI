<template>
    <div class="prepare-post container" v-if="userInfo">
        <loading v-if="isRunning"></loading>
        <b-row>
            <b-col cols="12" class="cardDiv" style="min-height: 500px;">
                <div v-if="post.content">
                    <h2 class="mt-3 mb-5">{{post.name}}</h2>
                    <div class="text-left px-5" v-html="post.content"></div>
                </div>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import { mapState } from "vuex";
import Loading from "@/components/loading/Loading";
import businessService from "@/services/businessService";

export default {
    name: "prepare1",
    components: { Loading },
    filters: {},
    data() {
        return {
            post: {}
        };
    },
    created() {
        this.$nextTick(() => {
            this.init();
        });
    },
    computed: {
        ...mapState(["userInfo"])
    },
    watch: {},
    methods: {
        init() {
            this.run();
            businessService
                .postDetail({
                    id: this.$route.params.id
                })
                .then(data => {
                    this.post = data;
                    this.$emit("data-ready");
                })
                .catch(() => {
                    this.$emit("data-failed");
                });
        }
    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.prepare-post {
}
</style>