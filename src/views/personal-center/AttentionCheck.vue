<template>
    <div class="attention-check container">
        <loading v-if="isRunning"></loading>
        <PersonalCenterTab activeTab="3"/>
        <div class="cardDiv">
            <b-card class="mx-4">
                <b-card-title>关 注 请 求</b-card-title>
                <b-card-text>
                    请求学校 : {{$route.params.messageId.attentionInfo.university}}
                    &emsp; 请求人 : {{$route.params.messageId.attentionInfo.created_by}}
                    &emsp; 请求时间 : {{$route.params.messageId.attentionInfo.created_time}}
                </b-card-text>
                <b-card-text class="text-muted">
                    请求内容 ：{{$route.params.messageId.attentionInfo.message}}
                </b-card-text>
            </b-card>
            <b-button class="styledBtn w-10 mt-3" :size="template_size" variant="outline-primary" @click="acceptRequest()">
                接 受
            </b-button>
            <b-button class="styledBtn w-10 mt-3 ml-3" :size="template_size" variant="outline-primary" @click="rejectRequest()">
                拒 绝
            </b-button>
        </div>
    </div>
</template>

<script>
    import {mapState} from "vuex";
    import PersonalCenterTab from "@/components/personal-center/PersonalCenterTab";
    import store from '@/store';
    import Loading from "@/components/loading/Loading";
    import prefixRoute from "@/mixins/prefix-route";
    import VueTagsInput from '@johmun/vue-tags-input';
    import CourseService from "@/services/courseService";

    export default {
        name: "attention-check",
        components: {
            Loading,
            PersonalCenterTab,
            VueTagsInput
        },
        mixins: [prefixRoute],
        data() {
            return {
                tag: '',
                moreTeammates: [],
                unitUsers: [],
                formData: [],
                postData: []
            };
        },
        computed: {
            ...mapState(["userInfo"]),
            message() {
                return store.getters.getMsg
            },
        },
        created() {
            this.$nextTick(() => {
                if (this.$route.params.messageId === undefined)
                    this.$router.push(this.prefixRoute + 'message-view');
            });
        },
        methods: {
            acceptRequest() {
                this.run();
                CourseService.checkAttention({
                    notificationID: this.$route.params.messageId.id,
                    universityID: this.$route.params.messageId.attentionInfo.id,
                    set: 1
                }).then(() => {
                    this.$router.push(this.prefixRoute + 'message-view');
                    store.dispatch('refreshMsg');
                    this.$emit("data-ready");
                });
            },
            rejectRequest() {
                this.run();
                CourseService.checkAttention({
                    notificationID: this.$route.params.messageId.id,
                    universityID: this.$route.params.messageId.attentionInfo.id,
                    set: 2
                }).then(() => {
                    this.$router.push(this.prefixRoute + 'message-view');
                    store.dispatch('refreshMsg');
                    this.$emit("data-ready");
                });
            }
        }
    };
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
    .attention-check {
        .list-group-item {
            text-align: left;
        }
    }
</style>
