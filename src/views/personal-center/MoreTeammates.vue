<template>
    <div class="more-teammates">
        <loading v-if="isRunning"></loading>
        <PersonalCenterTab activeTab="3"/>
        <div class="cardDiv" v-if="$route.params.messageId && formData.length !== 0">
            <h3 class="my-5 container">该 业 务 需 要 下 面 的 队 友</h3>
            <div class="row m-4" v-for="(item, index) in $route.params.messageId.content" :key="`${index}`">
                <h5 class="col-2 align-self-md-end">{{ item.role_name === null ? '无职务' : item.role_name }}</h5>
                <vue-tags-input
                        class="col-10"
                        style="max-width: 100%;"
                        v-model="tag"
                        :tags="formData[index].userIds"
                        :autocomplete-items="unitUsers"
                        :add-only-from-autocomplete="true"
                        :autocomplete-min-length="0"
                        :max-tags="item.moreCount"
                        @tags-changed="newTags => formData[index].userIds = newTags"
                        :placeholder="'此角色需要' + item.moreCount + '名团队成员。'"/>
            </div>
            <b-button class="styledBtn w-10" :size="template_size" variant="outline-primary" @click="addMoreTeammates()">
                确 定
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
    import businessService from "@/services/businessService";

    export default {
        name: "more-teammates",
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
            if (this.$route.params.messageId !== undefined) {
                this.getUnitUserList();
                for(let key in this.$route.params.messageId.content)
                    this.formData.push({
                        role_name: this.$route.params.messageId.content[key].role_name,
                        userIds: []
                    });
            }
        },
        methods: {
            getUnitUserList() {
                this.run();
                businessService.getUnitUserList({business_id: this.$route.params.messageId.business_id}).then(data => {
                    this.unitUsers = data.results;
                    this.$emit("data-ready");
                });
            },
            addMoreTeammates() {
                this.postData = [];
                for (let iItem in this.formData)
                    if (this.$route.params.messageId.content[iItem].moreCount !== this.formData[iItem].userIds.length) {
                        alert('please set all more teammates');
                        return
                    }
                for (let rIndex in this.formData)
                    for (let uIndex in this.formData[rIndex].userIds)
                        this.postData.push({
                            role_name: this.formData[rIndex].role_name !== null ? this.formData[rIndex].role_name : '',
                            userId: this.formData[rIndex].userIds[uIndex].id
                        });
                this.run();
                businessService.addMoreTeammates({business_id: this.$route.params.messageId.business_id, data: JSON.stringify(this.postData)}).then(() => {
                    this.$router.push(this.prefixRoute + 'message-view');
                    store.dispatch('refreshMsg');
                    this.$emit("data-ready");
                });
            }
        }
    };
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
    .more-teammates {
        .list-group-item {
            text-align: left;
        }
    }
</style>