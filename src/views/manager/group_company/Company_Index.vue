<template>
    <div class="company-index">
        <loading v-if="isRunning"></loading>
        <b-row class="cardDiv">
            <b-col lg="3" md="6" sm="12">
                <b-input-group :size="template_size">
                    <b-input-group-prepend>
                        <span class="input-group-text">
                            <icon name="search"></icon>
                        </span>
                    </b-input-group-prepend>
                    <b-form-input v-model.lazy="queryDebounceParam.search" placeholder/>
                </b-input-group>
            </b-col>
            <b-col lg="9" md="6" sm="12" class="align-self-center">
                <b-button-group class="float-right">
                    <b-button
                        :size="template_size"
                        class="styledBtn fontedBtn"
                        variant="outline-primary"
                        v-b-modal.newCompany
                        @click="newCompany = {
                        name: '',
                        type: '',
                        comment: '',
                        cManagerName: '',
                        cManagerPass: ''
                    }"
                        v-if="isActionAllowed('code_group_company_management', 'code_create_delete_company_group_company')"
                    >添加单位</b-button>
                    <b-modal hide-footer centered id="newCompany" ref="newCompany" title="添加单位">
                        <div>
                            <b-form @submit="onSubmit" class="container w-80 pt-3">
                                <b-form-group id="input-group-1" label-for="name">
                                    <b-form-input
                                        id="newCompany_name"
                                        v-model="newCompany.name"
                                        required
                                        placeholder="单位名称"
                                    ></b-form-input>
                                </b-form-group>
                                <b-form-group id="input-group-12" label-for="input-2">
                                    <b-form-select
                                        v-model="newCompany.type"
                                        :options="allgroup.cTypes"
                                    ></b-form-select>
                                </b-form-group>
                                <b-form-group id="input-group-2" label-for="input-2">
                                    <b-form-textarea
                                        id="newCompany_comment"
                                        rows="3"
                                        no-resize
                                        v-model="newCompany.comment"
                                        required
                                        placeholder="单位描述"
                                    ></b-form-textarea>
                                </b-form-group>
                                <br>
                                <b-form-group
                                    id="input-group-3"
                                    class="text-left"
                                    label="创建管理员 :"
                                    label-for="input-2"
                                >
                                    <b-form-input
                                        id="input-22"
                                        v-model="newCompany.cManagerName"
                                        required
                                        placeholder="管理员账号"
                                        autocomplete="username"
                                    ></b-form-input>
                                </b-form-group>
                                <b-form-group id="input-group-4" label-for="input-2">
                                    <b-form-input
                                        id="input-23"
                                        v-model="newCompany.cManagerPass"
                                        required
                                        placeholder="管理员密码"
                                        type="password"
                                        autocomplete="new-password"
                                    ></b-form-input>
                                </b-form-group>
                                <b-button
                                    class="mt-3 my-4"
                                    block
                                    type="submit"
                                    variant="primary"
                                >保 存</b-button>
                            </b-form>
                        </div>
                    </b-modal>
                    <b-button
                        :size="template_size"
                        class="styledBtn fontedBtn"
                        variant="outline-primary"
                        @click="this.deleteCompany"
                        v-if="isActionAllowed('code_group_company_management', 'code_create_delete_company_group_company')"
                    >删除单位</b-button>
                </b-button-group>
            </b-col>
        </b-row>
        <div class="cardDiv">
            <b-table
                :items="allgroup.list"
                small
                hover
                :fields="columns"
                head-variant
                style="fontSize: 18px"
            >
                <template slot="check" slot-scope="row">
                    <b-form-checkbox
                        :id="row.item.id.toString()"
                        v-model="selected"
                        name="checkbox"
                        :value="row.item.id"
                        unchecked-value
                    ></b-form-checkbox>
                </template>
                <template slot="id" slot-scope="row">{{ row.item.id }}</template>
                <template slot="name" slot-scope="row">
                    <span class="text">{{row.item.name}}</span>
                </template>
                <template slot="type" slot-scope="row">{{row.item.type ? row.item.type : ''}}</template>
                <template slot="creator" slot-scope="row">{{row.item.creator}}</template>
                <template slot="create_time" slot-scope="row">{{ row.item.create_time }}</template>
                <template slot="action" slot-scope="row">
                    <b-button-group>
                        <b-button
                            :key="row.item.id"
                            class="styledBtn"
                            :size="template_size"
                            variant="outline-primary"
                            @click="editOpen(row)"
                            v-if="isActionAllowed('code_group_company_management', 'code_company_edit_group_company')"
                        >
                            <icon name="edit" style="width: 20px"></icon>编辑
                        </b-button>
                        <b-button
                            class="styledBtn"
                            :key="'add' + row.item.id"
                            :size="template_size"
                            variant="outline-primary"
                            @click="addCManagerOpen(row)"
                            v-if="isActionAllowed('code_group_company_management', 'code_company_edit_group_company')"
                        >
                            <icon name="user-plus" style="width: 20px"></icon>配置管理员
                        </b-button>
                    </b-button-group>
                </template>
            </b-table>
        </div>
        <b-row class="justify-content-end row-margin-tweak cardDiv">
            <b-pagination
                :size="template_size"
                :total-rows="allgroup.total"
                :per-page="queryParam.size"
                limit="5"
                v-model="queryParam.page"
            ></b-pagination>
        </b-row>
        <b-modal size="xl" centered hide-footer id="addCManager" ref="addCManager" title="配置管理员">
            <div class="pb-5">
                <b-button
                    :size="template_size"
                    variant="outline-primary"
                    class="mb-3 offset-10 styledBtn fontedBtn"
                    style="margin-left: 82% !important;"
                    @click="()=>{newCManager = true; editCManager = false; resetCManager = false; new_CManager = {name:'',description:'',password:null}}"
                >新增管理员</b-button>
                <b-table
                    :items="cManagers.list"
                    small
                    hover
                    :fields="cManagerColumns"
                    class="col-10 offset-1 mb-3"
                    head-variant
                    style="fontSize: 18px"
                >
                    <template slot="id" slot-scope="row">{{ row.item.id }}</template>
                    <template slot="name" slot-scope="row">
                        <span class="text">{{row.item.name}}</span>
                    </template>
                    <template
                        slot="comment"
                        slot-scope="row"
                    >{{row.item.description ? row.item.description : ''}}</template>
                    <template slot="action" slot-scope="row">
                        <b-button-group>
                            <b-button
                                class="styledBtn"
                                :key="'edit' + row.id"
                                :size="template_size"
                                variant="outline-primary"
                                @click="()=>{editCManager = true; newCManager = false; resetCManager = false; edit_CManager = {id:row.item.id,description:row.item.description}}"
                            >修改信息</b-button>
                            <b-button
                                class="styledBtn"
                                :key="'reset' + row.id"
                                :size="template_size"
                                variant="outline-primary"
                                @click="()=>{resetCManager = true; newCManager = false; editCManager = false; reset_CManager = {id:row.item.id,password:''}}"
                            >重置密码</b-button>
                            <b-button class="styledBtn" :key="'delete' + row.id" :size="template_size"
                                      variant="outline-primary"
                                      @click="deleteCompanyManager(row.item.id)">
                                删除
                            </b-button>
                        </b-button-group>
                    </template>
                </b-table>
                <b-modal hide-footer centered v-model="newCManager" title="新增管理员">
                    <div>
                        <b-form @submit="newCManagerSave" class="container pt-3">
                            <b-form-group id="input-group-7" label-for="name">
                                <b-form-input
                                    v-model="new_CManager.name"
                                    required
                                    autocomplete="username"
                                    placeholder="管理员名称"
                                ></b-form-input>
                            </b-form-group>
                            <b-form-group id="input-group-8" label-for="input-2">
                                <b-form-textarea
                                    rows="3"
                                    no-resize
                                    v-model="new_CManager.description"
                                    required
                                    placeholder="备注"
                                    :disabled="newManagerLock !== 0"
                                ></b-form-textarea>
                            </b-form-group>
                            <b-form-group id="input-group-9" label-for="input-2">
                                <b-form-input
                                    v-model="new_CManager.password"
                                    required
                                    autocomplete="new-password"
                                    type="password"
                                    placeholder="密码"
                                    :disabled="newManagerLock !== 0"
                                ></b-form-input>
                            </b-form-group>
                            <span v-if="newManagerLock === 4" style="color: red; font-size: 12px" class="justify-content-center row">该账号是超级管理员</span>
                            <span v-if="newManagerLock === 2" style="color: red; font-size: 12px" class="justify-content-center row">该账号是另一个集群的账号</span>
                            <span v-if="newManagerLock === 3" style="color: red; font-size: 12px" class="justify-content-center row">该账号在本集群已经有对应的权限</span>
                            <span v-if="newManagerLock === 1" style="color: red; font-size: 12px" class="justify-content-center row">已存在的账号，可以分配该权限</span>
                            <b-button
                                class="mt-3 my-4 col-5 float-left"
                                block
                                type="submit"
                                variant="primary"
                                :disabled="![0, 1].includes(newManagerLock)"
                            >保 存</b-button>
                            <b-button
                                class="mt-3 my-4 col-5 float-right"
                                block
                                variant="primary"
                                @click="()=>{newCManager = false; new_CManager = {name:'',description:'',password:null}}"
                            >取 消</b-button>
                        </b-form>
                    </div>
                </b-modal>
                <b-modal hide-footer centered v-model="editCManager" title="修改信息">
                    <div>
                        <b-form @submit="editCManagerSave" class="container pt-3">
                            <b-form-group id="input-group-10" label-for="input-2">
                                <b-form-textarea
                                    id="edit_CManager_description"
                                    rows="3"
                                    no-resize
                                    v-model="edit_CManager.description"
                                    required
                                    placeholder="备注"
                                ></b-form-textarea>
                            </b-form-group>
                            <b-button
                                class="mt-3 my-4 col-5 float-left"
                                block
                                type="submit"
                                variant="primary"
                            >保 存</b-button>
                            <b-button
                                class="mt-3 my-4 col-5 float-right"
                                block
                                variant="primary"
                                @click="()=>{editCManager = false; edit_CManager = {id: null,description:''}}"
                            >
                                取 消
                            </b-button>
                        </b-form>
                    </div>
                </b-modal>
                <b-modal hide-footer centered v-model="resetCManager" title="重置密码">
                    <div>
                        <b-form @submit="resetCManagerSave" class="container pt-3">
                            <b-form-group id="input-group-11" label-for="input-2">
                                <b-form-input
                                    v-model="reset_CManager.password"
                                    required
                                    autocomplete="new-password"
                                    type="password"
                                    placeholder="密码"
                                ></b-form-input>
                            </b-form-group>
                            <b-button
                                class="mt-3 my-4 col-5 float-left"
                                block
                                type="submit"
                                variant="primary"
                            >保 存</b-button>
                            <b-button
                                class="mt-3 my-4 col-5 float-right"
                                block
                                variant="primary"
                                @click="()=>{resetCManager = false; reset_CManager = {id: null,password:''}}"
                            >取 消</b-button>
                        </b-form>
                    </div>
                </b-modal>
            </div>
        </b-modal>
        <b-modal hide-footer centered id="editCompany" ref="editCompany" title="修改单位">
            <div>
                <b-form @submit="updateCompany" class="container w-80 pt-3">
                    <b-form-group id="input-group-5" label-for="name">
                        <b-form-input v-model="editItem.name" required placeholder="单位名称"></b-form-input>
                    </b-form-group>
                    <b-form-group id="input-group-6" label-for="input-2">
                        <b-form-select v-model="editItem.type" :options="allgroup.cTypes"></b-form-select>
                    </b-form-group>
                    <b-button class="mt-3 my-4" block type="submit" variant="primary">保 存</b-button>
                </b-form>
            </div>
        </b-modal>
    </div>
</template>

<script>
import { mapState } from "vuex";
import Loading from "@/components/loading/Loading";
import GroupService from "@/services/groupService";
import _ from "lodash";
import BRow from "bootstrap-vue/src/components/layout/row";

export default {
    name: "company-index",
    components: {
        BRow,
        Loading
    },
    data() {
        return {
            selected: [],
            editItem: {
                id: null,
                name: "",
                type: ""
            },
            cManagers: {
                list: [],
                companyID: null
            },
            newCManager: false,
            new_CManager: {
                name: "",
                description: "",
                password: null
            },
            editCManager: false,
            edit_CManager: {
                id: null,
                description: ""
            },
            resetCManager: false,
            reset_CManager: {
                id: null,
                password: ""
            },
            columns: {
                check: {
                    label: "",
                    sortable: false,
                    class: "text-left field-check"
                },
                id: {
                    label: "ID",
                    sortable: false,
                    class: "text-right field-csn"
                },
                name: {
                    label: "单位名称",
                    sortable: false,
                    class: "text-left field-cname"
                },
                type: {
                    label: "单位类别",
                    sortable: false,
                    class: "text-left field-ccreator"
                },
                creator: {
                    label: "创建人",
                    sortable: false,
                    class: "text-left field-ccreate_time"
                },
                create_time: {
                    label: "创建时间",
                    sortable: false,
                    class: "text-right field-crend_ani_1"
                },
                action: {
                    label: "操作",
                    sortable: false,
                    class: "text-left field-crend_ani_2"
                }
            },
            cManagerColumns: {
                id: {
                    label: "序号",
                    sortable: false,
                    class: "text-right field-csn"
                },
                name: {
                    label: "管理员名称",
                    sortable: false,
                    class: "text-left field-crend_ani_3"
                },
                comment: {
                    label: "备注",
                    sortable: false,
                    class: "text-left field-crend_ani_4"
                },
                action: {
                    label: "操作",
                    sortable: false,
                    class: "text-left field-crend_ani_2"
                }
            },
            queryParam: {
                page: 1,
                size: 5
            },
            queryDebounceParam: {
                search: ""
            },
            allgroup: {
                list: [],
                cTypes: [],
                total: 0
            },
            newCompany: {
                name: "",
                type: "",
                comment: "",
                cManagerName: "",
                cManagerPass: ""
            },
            newManagerLock: 0
        };
    },
    created() {
        this.$nextTick(() => {
            this.queryCompanyList();
        });
    },
    computed: {
        ...mapState(["userInfo"])
    },
    watch: {
        queryParam: {
            handler() {
                this.queryCompanyList();
            },
            deep: true
        },
        queryDebounceParam: {
            deep: true,
            handler: _.debounce(function() {
                this.queryCompanyList();
            }, 500)
        },
        "new_CManager.name": {
            handler: function() {
                if (this.new_CManager.name !== '') {
                    GroupService
                        .checkUserGroup({ username: this.new_CManager.name, group: this.userInfo.manager_info.group_id, role: 3 })
                        .then(data => {
                            this.newManagerLock = parseInt(data.results);
                        });
                } else
                    this.newManagerLock = 0;
            },
            deep: true
        }
    },
    methods: {
        queryCompanyList() {
            this.run();
            GroupService.fetchCompanyList({
                ...this.queryParam,
                ...this.queryDebounceParam
            })
                .then(data => {
                    this.allgroup.list = data.results;
                    this.allgroup.total = data.paging.count;
                    this.allgroup.cTypes = data.cTypes;
                    this.$emit("data-ready");
                })
                .catch(() => {
                    this.$emit("data-failed");
                });
        },
        onSubmit(evt) {
            evt.preventDefault();
            this.run();
            GroupService.createCompany(this.newCompany)
                .then(res => {
                    if (res.results === "success")
                        GroupService.fetchCompanyList({
                            ...this.queryParam,
                            ...this.queryDebounceParam
                        })
                            .then(data => {
                                this.allgroup.list = data.results;
                                this.allgroup.total = data.paging.count;
                                this.allgroup.cTypes = data.cTypes;
                                this.$emit("data-ready");
                                this.$refs["newCompany"].hide();
                            })
                            .catch(() => {
                                this.$emit("data-failed");
                            });
                    else if (res.results === "nameError") {
                        alert("该单位名已存在。");
                        this.$emit("data-failed");
                    } else if (res.results === "managerNameError") {
                        alert("该账号已存在。");
                        this.$emit("data-failed");
                    } else this.$emit("data-failed");
                })
                .catch(() => {
                    this.$emit("data-failed");
                });
        },
        deleteCompany() {
            if (confirm("您确定要删除该单位吗？")) {
                this.run();
                GroupService.deleteCompany({
                    ids: JSON.stringify(this.selected)
                })
                    .then(res => {
                        if (res.results === "success")
                            GroupService.fetchCompanyList({
                                ...this.queryParam,
                                ...this.queryDebounceParam
                            })
                                .then(data => {
                                    this.allgroup.list = data.results;
                                    this.allgroup.total = data.paging.count;
                                    this.allgroup.cTypes = data.cTypes;
                                    this.$emit("data-ready");
                                })
                                .catch(() => {
                                    this.$emit("data-failed");
                                });
                        else this.$emit("data-failed");
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
            }
        },
        editOpen(row) {
            this.editItem.id = row.item.id;
            this.editItem.name = row.item.name;
            this.editItem.type = row.item.type;
            this.$refs["editCompany"].show();
        },
        addCManagerOpen(row) {
            this.cManagers.list = row.item.companyManagers;
            this.cManagers.companyID = row.item.id;
            this.$refs["addCManager"].show();
        },
        updateCompany(evt) {
            evt.preventDefault();
            this.run();
            GroupService.updateCompany(this.editItem)
                .then(res => {
                    if (res.results === "success")
                        GroupService.fetchCompanyList({
                            ...this.queryParam,
                            ...this.queryDebounceParam
                        })
                            .then(data => {
                                this.allgroup.list = data.results;
                                this.allgroup.total = data.paging.count;
                                this.allgroup.cTypes = data.cTypes;
                                this.$emit("data-ready");
                                this.$refs["editCompany"].hide();
                            })
                            .catch(() => {
                                this.$emit("data-failed");
                            });
                    else if (res.results === "nameError") {
                        alert("该单位名已存在。");
                        this.$emit("data-failed");
                    } else this.$emit("data-failed");
                })
                .catch(() => {
                    this.$emit("data-failed");
                });
        },
        newCManagerSave(evt) {
            evt.preventDefault();
            this.run();
            GroupService.addCManager({
                companyID: this.cManagers.companyID,
                data: this.new_CManager,
                order: this.newManagerLock
            })
                .then(res => {
                    if (res.results === "success")
                        GroupService.fetchCompanyList({
                            ...this.queryParam,
                            ...this.queryDebounceParam
                        })
                            .then(data => {
                                this.allgroup.list = data.results;
                                this.allgroup.total = data.paging.count;
                                this.allgroup.cTypes = data.cTypes;
                                let selectedData = data.results.filter(obj => {
                                    return obj.id === this.cManagers.companyID;
                                });
                                this.cManagers.list =
                                    selectedData[0].companyManagers;
                                this.$emit("data-ready");
                                this.newCManager = false;
                            })
                            .catch(() => {
                                this.$emit("data-failed");
                            });
                    else if (res.results === "managerNameError") {
                        alert("该账号已存在。");
                        this.$emit("data-failed");
                    } else this.$emit("data-failed");
                })
                .catch(() => {
                    this.$emit("data-failed");
                });
        },
        editCManagerSave(evt) {
            evt.preventDefault();
            this.run();
            GroupService.updateCManager(this.edit_CManager)
                .then(res => {
                    if (res.results === "success")
                        GroupService.fetchCompanyList({
                            ...this.queryParam,
                            ...this.queryDebounceParam
                        })
                            .then(data => {
                                this.allgroup.list = data.results;
                                this.allgroup.total = data.paging.count;
                                this.allgroup.cTypes = data.cTypes;
                                let selectedData = data.results.filter(obj => {
                                    return obj.id === this.cManagers.companyID;
                                });
                                this.cManagers.list =
                                    selectedData[0].companyManagers;
                                this.$emit("data-ready");
                                this.editCManager = false;
                            })
                            .catch(() => {
                                this.$emit("data-failed");
                            });
                    else this.$emit("data-failed");
                })
                .catch(() => {
                    this.$emit("data-failed");
                });
        },
        resetCManagerSave(evt) {
            evt.preventDefault();
            this.run();
            GroupService.pCResetManager(this.reset_CManager)
                .then(res => {
                    if (res.results === "success")
                        GroupService.fetchCompanyList({
                            ...this.queryParam,
                            ...this.queryDebounceParam
                        })
                            .then(data => {
                                this.allgroup.list = data.results;
                                this.allgroup.total = data.paging.count;
                                this.allgroup.cTypes = data.cTypes;
                                let selectedData = data.results.filter(obj => {
                                    return obj.id === this.cManagers.companyID;
                                });
                                this.cManagers.list =
                                    selectedData[0].companyManagers;
                                this.$emit("data-ready");
                                this.resetCManager = false;
                            })
                            .catch(() => {
                                this.$emit("data-failed");
                            });
                    else this.$emit("data-failed");
                })
                .catch(() => {
                    this.$emit("data-failed");
                });
        },
        deleteCompanyManager(mid) {
            let cid = this.cManagers.companyID;
            if (confirm('您确定要删除该单位管理员吗？')) {
                this.run();
                GroupService
                    .deleteCompanyManager({ cid: cid, mid: mid })
                    .then(data => {
                        if (data.results === 'success')
                            GroupService.fetchCompanyList({
                                ...this.queryParam,
                                ...this.queryDebounceParam
                            })
                                .then(data => {
                                    this.allgroup.list = data.results;
                                    this.allgroup.total = data.paging.count;
                                    this.allgroup.cTypes = data.cTypes;
                                    this.$emit("data-ready");
                                    this.$refs["addCManager"].hide();
                                })
                                .catch(() => {
                                    this.$emit("data-failed");
                                });
                        else
                            this.$emit("data-failed");
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
            }
        }
    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.company-index {
    .field-ccheck {
        padding-top: 11px;
        text-align: left !important;
    }
    .field-csn {
        text-align: left !important;
    }
    .field-cname {
        text-align: left !important;
    }
    .field-ccreator {
        text-align: left !important;
    }
    .field-ccreate_time {
        text-align: left !important;
    }
    .field-crend_ani_1 {
        width: 15%;
        text-align: left !important;
    }
    .field-crend_ani_2 {
        width: 15%;
        text-align: left !important;
    }
    .field-crend_ani_3 {
        width: 7%;
        text-align: left !important;
    }
    .field-crend_ani_4 {
        width: 20%;
        text-align: left !important;
    }
}
</style>
