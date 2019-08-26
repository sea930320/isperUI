<template>
    <div class="attention-check container">
        <loading v-if="isRunning"></loading>
        <PersonalCenterTab activeTab="3"/>
        <div class="cardDiv">
            <b-card class="mx-4">
                <b-card-title>取 消 关 注 请 求</b-card-title>
                <b-card-text>
                    请求学校 : {{$route.params.messageId.attentionCancelInfo.university}}
                    &emsp; 请求人 : {{$route.params.messageId.attentionCancelInfo.created_by}}
                    &emsp; 请求时间 : {{$route.params.messageId.attentionCancelInfo.created_time}}
                </b-card-text>
            </b-card>
            <b-button class="w-10 mt-3" :size="template_size" variant="outline-danger" @click="acceptRequest()">
                接 受
            </b-button>
            <b-button class="w-10 mt-3 ml-3" :size="template_size" variant="outline-primary" @click="rejectRequest()">
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
    import CourseService from "@/services/courseService";

    export default {
        name: "attention-check",
        components: {
            Loading,
            PersonalCenterTab
        },
        mixins: [prefixRoute],
        data() {
            return {
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
                    universityID: this.$route.params.messageId.attentionCancelInfo.id,
                    set: -1
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
                    universityID: this.$route.params.messageId.attentionCancelInfo.id,
                    set: 4
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
