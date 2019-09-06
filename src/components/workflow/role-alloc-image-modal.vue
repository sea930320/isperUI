<template>
    <div class="role-alloc-image-modal">
        <loading v-if="isRunning"></loading>
        <b-modal
            v-model="show"
            title="身份形象"
            size="lg"
            ok-title="确定"
            cancel-title="取消"
            @cancel="cancelshow"
            @ok="addFiguresOk"
        >
            <b-row class="select-container row">
                <b-col cols="4" class="left">
                    <input type="text" class="search-input" v-model="searchKey">
                    <ul class="list">
                        <li
                            v-for="(roleItem, index) in searchData"
                            :key="index"
                            class="cursor"
                            :class="{'active': activeTypeId==roleItem.id }"
                            @click="selectRoleImgType(roleItem)"
                        >{{roleItem.name}}</li>
                    </ul>
                </b-col>
                <b-col cols="8" class="right">
                    <ul class="module-figure-content">
                        <li
                            v-for="(roleImageItem, index) in roleImageForType"
                            :key="index"
                            @click="selectRoleName(roleImageItem)"
                        >
                            <a href="javascript:;">
                                <span
                                    class="module-avater"
                                    :class="{'role-img-active': activeRoleId==roleImageItem.id}"
                                >
                                    <img :src="roleImageItem.avatar" alt width="100%">
                                </span>
                                <span
                                    class="module-text"
                                    :class="{'role-text-active': activeRoleId==roleImageItem.id}"
                                >{{roleImageItem.name}}-{{roleImageItem.gender == 1? '男' : '女'}}</span>
                            </a>
                        </li>
                    </ul>
                </b-col>
            </b-row>
        </b-modal>
    </div>
</template>
<script>
import Loading from "@/components/loading/Loading";
import workflowService from "@/services/workflowService";
import _ from "lodash";
export default {
    components: { Loading },
    data() {
        return {
            show: false,
            roleImageList: [],
            searchKey: "",
            curSelectRoleAlloc: null,
            activeTypeId: 0,
            activeRoleId: -1
        };
    },
    computed: {
        searchData() {
            let that = this;
            return that.roleImageList.filter(roleItem => {
                return (
                    String(roleItem.name)
                        .toLowerCase()
                        .indexOf(String(that.searchKey).toLowerCase()) !== -1
                );
            });
        },
        roleImageForType() {
            let activeRole = _.find(this.searchData, { id: this.activeTypeId });
            if (activeRole) {
                return activeRole.roles;
            } else {
                return [];
            }
        }
    },
    created() {
        this.$parent.$on("openRoleAllocImageModal", allocation => {
            this.reset();
            this.curSelectRoleAlloc = { ...allocation };
            this.run();
            workflowService
                .getWorkflowRoleImageList()
                .then(data => {
                    if (data.length > 0) {
                        this.roleImageList = data;
                        this.activeTypeId = data[0].id;
                    }
                    this.activeTypeId = allocation.image
                        ? allocation.image.type
                        : this.activeTypeId;
                    this.activeRoleId = allocation.image
                        ? allocation.image.id
                        : this.activeRoleId;
                    this.$emit("data-ready");
                    this.show = true;
                })
                .catch(() => {
                    this.$emit("data-failed");
                });
        });
    },
    watch: {},
    methods: {
        // 选择角色形象
        selectRoleName(roleImageItem) {
            this.curSelectRoleAlloc.image = {
                ...roleImageItem,
                ...{
                    type: this.activeTypeId
                }
            };
            this.activeRoleId = roleImageItem.id;
        },
        // 选择角色形象类型
        selectRoleImgType(roleItem) {
            this.activeTypeId = roleItem.id;
        },
        reset() {
            this.searchKey = "";
            this.activeTypeId = 0;
            this.activeRoleId = -1;
        },
        // 确认添加角色
        addFiguresOk() {
            if (!this.curSelectRoleAlloc.image) {
                this.$toasted.error("请选择角色形象");
                return;
            }
            this.$emit("on-ok", this.curSelectRoleAlloc);
        },
        cancelshow() {
            this.$emit("on-cancel");
        }
    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.role-alloc-image-modal {
    .select-container {
        height: 427px;
        font-size: 14px;
        border: 1px solid #cdcdcd;
    }
    .select-container > .left {
        padding: 0;
        height: 100%;
        border-right: 1px solid #cdcdcd;
    }
    .search-input {
        border: 1px solid #cdcdcd;
        width: 97%;
        width: calc(100% - 6px);
        height: 30px;
        line-height: 30px;
        margin: 3px;
        outline: none;
        padding-left: 10px;
    }
    .select-container > .left > .list {
        height: calc(100% - 40px);
        overflow-x: hidden;
        overflow-y: auto;
        list-style: none;
        padding: 0px;
    }
    .select-container > .left > .list > li {
        height: 35px;
        line-height: 35px;
        padding: 0 8px;
        border-top: 1px solid #fff;
        border-bottom: 1px solid #fff;
    }
    .select-container > .left > .list > li:hover {
        border-top: 1px solid #cdcdcd;
        border-bottom: 1px solid #cdcdcd;
        background-color: #f2f9ff;
    }
    .select-container > .left > .list > li.active {
        background-color: #d9edf7;
    }
    .select-container > .right {
        padding: 10px 0;
        height: 100%;
        overflow-y: auto;
    }
    .module-figure-content {
        list-style: none;
        padding: 0px;
        li {
            float: left;
            margin-left: 9px;
            margin-right: 10px;
            a:hover {
                text-decoration: none;
            }
        }
        .module-avater {
            width: 80px;
            height: 80px;
            border: 1px solid #cdcdcd;
            overflow-x: hidden;
            display: block;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .role-img-active {
            border: 5px solid #3a7de0;
        }
        .module-text {
            color: #9c9c9c;
            text-decoration: none;
        }
        .role-text-active {
            color: black;
        }
    }
}
</style>
