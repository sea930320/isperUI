<template>
    <div class="mt-5 wizard-2">
        <loading v-if="isRunning"></loading>
        <b-alert variant="success" show class="text-left px-0" style="margin: 0 15px">
            <b-container>
                <b-row>
                    <b-col sm="4">项目名称 : {{projectData.name}}</b-col>
                    <b-col sm="4">相关流程 : {{projectData.flow_name}}</b-col>
                    <b-col sm="4">类型 : {{projectData.type | expType}}</b-col>
                </b-row>
            </b-container>
        </b-alert>
        <b-form @submit="onSubmit">
            <b-row align-v="start">
                <b-col sm="5">
                    <div class="cardDiv" style="height: 550px; overflow:auto">
                        <b-table
                            :items="projectRolesAssign.project_nodes"
                            small
                            hover
                            :fields="nodeColumns"
                            head-variant
                            class="table-container"
                            @row-clicked="nodeOnSelect"
                        >
                            <template slot="id" slot-scope="row">{{ row.index + 1}}</template>
                            <template slot="name" slot-scope="row">{{ row.item.name}}</template>
                            <template slot="appMode" slot-scope="row">
                                <a
                                    href="javascript:;"
                                    class="case-text"
                                    @click="showBigProcessImg(row.item.process.image)"
                                >{{ row.item.process.name}}</a>
                            </template>
                            <template slot="look_on" slot-scope="row">
                                <b-form-checkbox v-model="row.item.look_on"></b-form-checkbox>
                            </template>
                        </b-table>
                    </div>
                </b-col>
                <b-col sm="7">
                    <div class="cardDiv" style="height: 550px; overflow:auto">
                        <table class="table b-table table-sm text-left">
                            <thead role="rowgroup">
                                <tr>
                                    <th width="15%">角色类型</th>
                                    <th width="15%">角色名称</th>
                                    <th width="37%">角色形象</th>
                                    <th width="11%">是否使用</th>
                                    <th width="11%">结束环节</th>
                                    <th width="11%">是否被带入</th>
                                </tr>
                            </thead>
                            <tbody role="rowgroup">
                                <template
                                    v-for="(roleNodeRelatedGroup, type) in roleNodeRelatedGroups"
                                    v-key="type"
                                >
                                    <tr class="tr-type" :key="'project_role_type_'+ type">
                                        <td colspan="7" text-left>{{type}}</td>
                                    </tr>
                                    <tr
                                        v-for="(roleNodeRelated, index) in roleNodeRelatedGroup"
                                        :key="'role_allocation_'+type+'_'+index"
                                    >
                                        <td width="15%"></td>
                                        <td width="15%">{{roleNodeRelated.role_name}}</td>
                                        <td width="37%">
                                            <!-- {{roleNodeRelated.image_name}}-{{roleNodeRelated.gender ? (roleNodeRelated.gender === 1 ? '男'
                                            : '女' ) : ''}}-->
                                            {{roleNodeRelated.image_name}}
                                            <!-- <a
                                                v-if="roleNodeRelated.image_id"
                                                href="javascript:"
                                                class="btn-link"
                                                @click="roleImageReselect(roleNodeRelated)"
                                            >重新选择</a>-->
                                        </td>
                                        <td width="11%" class="check-padding">
                                            <b-form-checkbox
                                                v-model="roleNodeRelated.can_take_in"
                                                @change="toggleCanTakeIn($event, roleNodeRelated)"
                                            ></b-form-checkbox>
                                        </td>
                                        <td width="11%" class="check-padding">
                                            <b-form-checkbox
                                                v-model="roleNodeRelated.can_terminate"
                                                @change="toggleCanTerminate($event, roleNodeRelated)"
                                            ></b-form-checkbox>
                                        </td>
                                        <td width="11%" class="check-padding">
                                            <b-form-checkbox
                                                v-model="roleNodeRelated.can_brought"
                                                @change="toggleCanBrought($event, roleNodeRelated)"
                                            ></b-form-checkbox>
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="4" align-v="center">
                    <b-button-group class="float-">
                        <b-button
                            size="lg"
                            type="submit"
                            style="width:100%"
                            variant="primary"
                            @click="previousPage()"
                        >上一步</b-button>
                    </b-button-group>
                </b-col>
                <b-col sm="4" align-v="center">
                    <b-button-group class="float-center">
                        <b-button
                            type="submit"
                            size="lg"
                            style="width:100%"
                            variant="primary"
                            @click="savePage()"
                        >保存</b-button>
                    </b-button-group>
                </b-col>
                <b-col sm="4" align-v="center">
                    <b-button-group class="float-center">
                        <b-button
                            size="lg"
                            type="submit"
                            style="width:100%"
                            variant="primary"
                            @click="nextPage()"
                        >下一步</b-button>
                    </b-button-group>
                </b-col>
            </b-row>
        </b-form>
        <!-- <b-modal
            :visible="roleImageModalShow"
            title="角色形象"
            class="my-modal"
            @ok="changeRoleImage"
            ok-title="确定"
            cancel-title="取消"
            @cancel="resetModal"
        >
            <b-container>
                <b-row class="select-container">
                    <b-col sm="4" class="left">
                        <input type="text" class="search-input" v-model="searchKey">
                        <ul class="list">
                            <li
                                v-for="(roleItem, index) in searchData"
                                :key="'roleItem_'+index"
                                class="cursor"
                                :class="{'active': activeTypeIndex === index }"
                                @click="selectRoleImgType(roleItem, index)"
                            >{{roleItem.name}}</li>
                        </ul>
                    </b-col>
                    <b-col sm="8" class="right">
                        <ul class="module-figure-content">
                            <li
                                v-for="(roleImageItem, index) in roleImageForType"
                                :key="'roleImageItem_'+index"
                                @click="selectRoleName(roleImageItem, index)"
                            >
                                <a href="javascript:;">
                                    <span
                                        class="module-avater"
                                        :class="{'role-img-active': activeRoleIndex === index}"
                                    >
                                        <img :src="roleImageItem.avatar" alt width="100%">
                                    </span>
                                    <span
                                        class="module-text"
                                    >{{roleImageItem.name}}-{{roleImageItem.gender === 1? '男' : '女'}}</span>
                                </a>
                            </li>
                        </ul>
                    </b-col>
                </b-row>
            </b-container>
        </b-modal>-->
        <!-- 查看大图Modal -->
        <image-view
            :visible="bigprocessModal"
            :src="processImgSrc"
            @on-close="bigprocessModal=false"
        ></image-view>
    </div>
</template>

<script>
import { expType, level, abilityTarget } from "@/filters/fun";
import { mapState } from "vuex";
import Loading from "@/components/loading/Loading";
import _ from "lodash";
import ProjectService from "@/services/projectService";
import ImageView from "@/components/imageView/ImageView";

export default {
    name: "wizard-2",
    components: {
        Loading,
        ImageView
    },
    props: ["value"],
    filters: {
        expType,
        level,
        abilityTarget
    },
    data() {
        return {
            nodeColumns: {
                id: {
                    label: "序号",
                    sortable: false,
                    class: "text-center field-sn"
                },
                name: {
                    label: "环节名称",
                    sortable: false,
                    class: "text-center field-name"
                },
                appMode: {
                    label: "对应模块",
                    sortable: false,
                    class: "text-center field-creator"
                },
                look_on: {
                    label: "允许观摩",
                    sortable: false,
                    class: "text-center field-rend_ani_1"
                }
            },
            projectData: {},
            project_id: null,
            is_edit: 0,
            projectRolesAssign: {
                project_nodes: []
            },
            nodeActiveIndex: -1,
            queryParam: {
                page: 1,
                size: 10
            },
            queryDebounceParam: {
                search: ""
            },
            bigprocessModal: false,
            processImgSrc: null,
            roleImageModalShow: false,
            curRoleNodeRelated: null,
            nextBtnClicked: 1,
            saveBtnClicked: 0,
            previousBtnClicked: 0
        };
    },
    created() {
        this.$nextTick(() => {
            if (this.$route.params.is_edit) {
                this.projectData = this.$route.params.currentProject;
            } else {
                this.projectData = {};
            }
            this.is_edit = this.$route.params.is_edit;
            this.project_id = this.$route.params.project_id;
            this.getProjectRolesDetail();
        });
    },
    computed: {
        ...mapState(["userInfo"]),
        activeNode() {
            if (
                this.nodeActiveIndex == -1 ||
                this.projectRolesAssign.project_nodes.length === 0
            )
                return null;
            return this.projectRolesAssign.project_nodes[this.nodeActiveIndex];
        },
        activeNodeId() {
            if (!this.activeNode) return null;
            return this.projectRolesAssign.project_nodes[this.nodeActiveIndex]
                .id;
        },
        roleNodeRelated() {
            if (!this.activeNodeId) return [];
            let roleNodeRelated = this.activeNode.project_role_allocs.map(
                project_role_alloc => {
                    let role = {
                        ...project_role_alloc,
                        ..._.pick(
                            _.find(this.projectRolesAssign.project_roles, {
                                id: project_role_alloc.role_id
                            }),
                            [
                                "capacity",
                                "gender",
                                "image_id",
                                "image_name",
                                "job_type_id",
                                "role_name",
                                "type"
                            ]
                        )
                    };
                    role.image_id =
                        this.activeNode.process.type === 1
                            ? role.image_id
                            : null;
                    role.image_name =
                        this.activeNode.process.type === 1
                            ? role.image_name
                            : "非动画模块无形象";
                    return role;
                }
            );
            return roleNodeRelated;
        },
        roleNodeRelatedGroups() {
            if (this.roleNodeRelated.length === 0) return {};
            let roleNodeRelatedGroups = _.groupBy(this.roleNodeRelated, "type");
            return roleNodeRelatedGroups;
        }
        // searchData() {
        //     let that = this;
        //     return that.roleImageList.filter(roleItem => {
        //         return (
        //             String(roleItem.name)
        //                 .toLowerCase()
        //                 .indexOf(String(that.searchKey).toLowerCase()) !== -1
        //         );
        //     });
        // },
        // roleImageForType() {
        //     if (this.searchData[this.activeTypeIndex]) {
        //         return this.searchData[this.activeTypeIndex].roles;
        //     } else {
        //         return [];
        //     }
        // }
    },
    watch: {
        queryParam: {
            handler() {
                this.getProjectRolesDetail();
            },
            deep: true
        },
        queryDebounceParam: {
            deep: true,
            handler: _.debounce(function() {
                this.getProjectRolesDetail();
            }, 500)
        }
    },
    methods: {
        getProjectRolesDetail() {
            this.run();
            ProjectService.getProjectRolesDetail({
                project_id: this.project_id
            })
                .then(data => {
                    this.projectData = data.project;
                    this.initData(data);
                })
                .catch(() => {
                    this.$emit("data-failed");
                });
        },
        initData(data) {
            this.projectRolesAssign = data;
            if (this.projectRolesAssign.project_nodes.length > 0) {
                this.nodeOnSelect(this.projectRolesAssign.project_nodes[0], 0);
            }
            this.$emit("data-ready");
        },
        nodeOnSelect(item, index) {
            this.nodeActiveIndex = index;
            this.projectRolesAssign.project_nodes.map(node => {
                this.$set(node, "_rowVariant", "");
                return node;
            });
            this.$set(item, "_rowVariant", "primary");
        },
        toggleCanTakeIn(val, roleNodeRelated) {
            let selectedRoleNodeRelated = _.find(
                this.activeNode.project_role_allocs,
                {
                    id: roleNodeRelated.id
                }
            );
            this.$set(selectedRoleNodeRelated, "can_take_in", val);
        },
        toggleCanTerminate(val, roleNodeRelated) {
            let selectedRoleNodeRelated = _.find(
                this.activeNode.project_role_allocs,
                {
                    id: roleNodeRelated.id
                }
            );
            this.$set(selectedRoleNodeRelated, "can_terminate", val);
        },
        toggleCanBrought(val, roleNodeRelated) {
            let selectedRoleNodeRelated = _.find(
                this.activeNode.project_role_allocs,
                {
                    id: roleNodeRelated.id
                }
            );
            this.$set(selectedRoleNodeRelated, "can_brought", val);
        },
        roleImageReselect(roleNodeRelated) {
            this.roleImageModalShow = true;
            this.curRoleNodeRelated = roleNodeRelated;
        },
        showBigProcessImg(img) {
            if (!img) {
                this.$toasted.error("当前程序模块没有图片,无法展示");
                return;
            }
            this.bigprocessModal = true;
            this.processImgSrc = img;
        },
        nextPage() {
            this.nextBtnClicked = 1;
            this.saveBtnClicked = 0;
            this.previousBtnClicked = 0;
        },
        savePage() {
            this.nextBtnClicked = 0;
            this.saveBtnClicked = 1;
            this.previousBtnClicked = 0;
        },
        previousPage() {
            this.nextBtnClicked = 0;
            this.saveBtnClicked = 0;
            this.previousBtnClicked = 1;
        },
        getSaveData() {
            let projectNodeRoles = [];
            let roleImgs = [];
            this.projectRolesAssign.project_nodes.forEach(node => {
                this.nodes2roles[node.id].forEach(role => {
                    if (role.is_use) {
                        projectNodeRoles.push({
                            node_id: node.id,
                            role_id: role.role_id,
                            can_brought: role.can_brought,
                            can_terminate: role.can_terminate,
                            num: role.num,
                            score: role.score
                        });
                    }
                });
            });
            let data = {
                project_roles: roleImgs,
                project_node_roles: projectNodeRoles
            };
            return JSON.stringify(data);
        },
        onSubmit(e) {
            e.preventDefault();
            if (this.nextBtnClicked === 1) {
                this.updatePage(2);
            }
            if (this.saveBtnClicked === 1) {
                console.log(this.projectRolesAssign.project_nodes);
                ProjectService.configurateProjectRoles({
                    project_id: this.project_id,
                    data: JSON.stringify(this.projectRolesAssign.project_nodes)
                }).then(() => {
                    this.$toasted.success("保存项目角色设置成功");
                });
            }
            if (this.previousBtnClicked === 1) {
                this.updatePage(0);
            }
        },

        updatePage: function(value) {
            this.$emit("input", value);
        },
        selectRoleImgType(roleItem, index) {
            this.activeTypeIndex = index;
        },
        selectRoleName(roleImageItem, index) {
            this.curSelectRole = roleImageItem;
            this.activeRoleIndex = index;
        }
        // changeRoleImage(item) {
        //     this.roleImageModalShow = false;
        //     //                this.curRole.image_name = item.name;
        //     this.curRole.image_name = this.curSelectRole.name;
        //     //                this.curRole.image_id = item.id;
        //     this.curRole.image_id = this.curSelectRole.id;
        //     //                this.curRole.gender = item.gender;
        //     this.curRole.gender = this.curSelectRole.gender;
        //     //                if (this.$route.params.project_id && this.curRoleId && item.id) {
        //     //                this.$route.params.project_id = 2035;
        //     //                if (this.curRoleId && item.id) {
        //     if (this.curRoleId && this.curSelectRole.id) {
        //         ProjectService.updateProjectRoleImage({
        //             //                        project_id: this.$route.params.project_id,
        //             project_id: 2035,
        //             role_id: this.curRoleId,
        //             image_id: item.id
        //         }).then(() => {
        //             this.$toasted.success("更新角色形象成功");
        //         });
        //     }
        // },
        // resetModal() {
        //     this.searchKey = "";
        //     this.curSelectRole = null;
        //     this.activeTypeIndex = 0;
        //     this.activeRoleIndex = -1;
        // },
    }
};
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss" scoped>
.wizard-2 {
    .tr-type {
        background: #25356838;
    }
}
</style>