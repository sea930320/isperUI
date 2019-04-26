<template>
    <div class="group-index">
        <loading v-if="isRunning"></loading>
        <b-row class="subtitle">
            <icon name="home" style="width: 22px; height: 25px;" class="my-auto mr-3"></icon>
            集群管理
        </b-row>
        <b-row class="cardDiv">
            <b-col lg="3" md="6" sm="12">
                <b-input-group :size="template_size">
                    <b-input-group-prepend>
                        <span class="input-group-text">
                          <icon name="search"></icon>
                        </span>
                    </b-input-group-prepend>
                    <b-form-input v-model.lazy="queryDebounceParam.search" placeholder=""/>
                </b-input-group>
            </b-col>
            <b-col lg="9" md="6" sm="12" class="align-self-center">
                <b-button-group class="float-right">
                    <b-button :size="template_size" class="styledBtn fontedBtn" variant="outline-primary" v-b-modal.newGroup @click="newGroup = {
                        name: '',
                        comment: '',
                        default: 0,
                        publish: 1,
                        managerName: '',
                        managerPass: ''
                    }">添加集群
                    </b-button>
                    <b-modal hide-footer centered  id="newGroup" ref="newGroup" title="添加集群">
                        <div>
                            <b-form @submit="onSubmit" class="container w-80 pt-3">
                                <b-form-group id="input-group-1" label-for="name">
                                    <b-form-input
                                            id="newGroup_name"
                                            v-model="newGroup.name"
                                            required
                                            placeholder="集群名称"
                                    ></b-form-input>
                                </b-form-group>
                                <b-form-group id="input-group-2" label-for="input-2">
                                    <b-form-textarea
                                            id="newGroup_comment"
                                            rows="3"
                                            no-resize
                                            v-model="newGroup.comment"
                                            required
                                            placeholder="集群描述"
                                    ></b-form-textarea>
                                </b-form-group>
                                <b-form-radio-group v-model="newGroup.default" :options="options1"
                                                    name="default">
                                    <span class="float-left">是否为默认集群 :</span>
                                </b-form-radio-group>
                                <br/>
                                <b-form-radio-group v-model="newGroup.publish" :options="options2"
                                                    name="publish">
                                    <span class="float-left">是否为公开集群 :</span>
                                </b-form-radio-group>
                                <br/>
                                <b-form-group id="input-group-3" class="text-left" label="创建管理员 :" label-for="input-2">
                                    <b-form-input
                                            id="input-22"
                                            v-model="newGroup.managerName"
                                            required
                                            placeholder="管理员账号"
                                            autocomplete="username"
                                    ></b-form-input>
                                </b-form-group>
                                <b-form-group id="input-group-4" label-for="input-2">
                                    <b-form-input
                                            id="input-23"
                                            v-model="newGroup.managerPass"
                                            required
                                            placeholder="管理员密码"
                                            type="password"
                                            autocomplete="new-password"
                                    ></b-form-input>
                                </b-form-group>
                                <b-button class="mt-3 my-4" block type="submit" variant="primary">保 存</b-button>
                            </b-form>
                        </div>
                    </b-modal>
                    <b-button class="styledBtn fontedBtn" :size="template_size" variant="outline-primary" @click="this.deleteGroup">删除集群</b-button>
                </b-button-group>
            </b-col>
        </b-row>
        <div class="cardDiv">
            <b-table :items="allgroup.list" small hover :fields="columns" head-variant style="fontSize: 18px">
                <template slot="check" slot-scope="row">
                    <b-form-checkbox
                            :id="row.item.id.toString()"
                            v-model="selected"
                            name="checkbox"
                            :value="row.item.id"
                            unchecked-value=""
                    >
                    </b-form-checkbox>
                </template>
                <template slot="id" slot-scope="row">{{ row.item.id }}</template>
                <template slot="name" slot-scope="row">
                    <span class="text">{{row.item.name}}</span>
                    <span v-if="row.item.default" style="
                    font-size: 18px;
                    background-color: grey;
                    color: white;
                    padding: 3px 5px;
                    margin-left: 8px;
                    border-radius: 5px;">默认</span>
                </template>
                <template slot="comment" slot-scope="row">
                    {{row.item.comment ? row.item.comment : ''}}
                </template>
                <template slot="publish" slot-scope="row">
                    {{(row.item.publish)?'是':'否'}}
                </template>
                <template slot="groupManagers" slot-scope="row">
                    <div>
                        <span v-for="manager in row.item.groupManagers" :key="manager.id">{{ manager.name + ', ' }}</span>
                    </div>
                </template>
                <template slot="action" slot-scope="row">
                    <b-button-group>
                        <b-button class="styledBtn" :key="row.item.id" :size="template_size" variant="outline-primary" @click="editOpen(row)">
                            <icon name="edit" style="width: 20px"></icon>
                            编辑
                        </b-button>
                        <b-modal hide-footer centered  id="editGroup" ref="editGroup" title="修改集群">
                            <div>
                                <b-form @submit="updateGroup" class="container w-80 pt-3">
                                    <b-form-group id="input-group-5" label-for="name">
                                        <b-form-input
                                                v-model="editItem.name"
                                                required
                                                placeholder="集群名称"
                                        ></b-form-input>
                                    </b-form-group>
                                    <b-form-group id="input-group-6" label-for="input-2">
                                        <b-form-textarea
                                                rows="3"
                                                no-resize
                                                v-model="editItem.comment"
                                                required
                                                placeholder="集群描述"
                                        ></b-form-textarea>
                                    </b-form-group>
                                    <b-form-radio-group v-model="editItem.default" :options="options1"
                                                        name="default">
                                        <span class="float-left mr-4">是否为默认集群 :</span>
                                    </b-form-radio-group>
                                    <br/>
                                    <b-form-radio-group v-model="editItem.publish" :options="options2"
                                                        name="publish">
                                        <span class="float-left mr-4">是否为公开集群 :</span>
                                    </b-form-radio-group>
                                    <br/>
                                    <b-button class="mt-3 my-4" block type="submit" variant="primary">保 存</b-button>
                                </b-form>
                            </div>
                        </b-modal>
                        <b-button class="styledBtn" :key="'add' + row.item.id" :size="template_size" variant="outline-primary"
                                  @click="addManagerOpen(row)">
                            <icon name="user-plus" style="width: 20px"></icon>
                            配置管理员
                        </b-button>
                        <b-modal size="xl" centered  hide-footer id="addManager" ref="addManager" title="配置管理员">
                            <div class="pb-5">
                                <b-button :size="template_size" variant="outline-primary" class="mb-3 offset-10 styledBtn fontedBtn" style="margin-left: 82% !important;"
                                          @click="()=>{newManager = true; editManager = false; resetManager = false; new_Manager = {name:'',description:'',password:null}}">
                                    新增管理员
                                </b-button>
                                <b-table :items="Managers.list" small hover :fields="managerColumns"
                                         class="col-10 offset-1 mb-3" head-variant style="fontSize: 18px">
                                    <template slot="id" slot-scope="row">{{ row.item.id }}</template>
                                    <template slot="name" slot-scope="row">
                                        <span class="text">{{row.item.name}}</span>
                                    </template>
                                    <template slot="comment" slot-scope="row">
                                        {{row.item.description ? row.item.description : ''}}
                                    </template>
                                    <template slot="action" slot-scope="row">
                                        <b-button-group>
                                            <b-button class="styledBtn" :key="'edit' + row.id" :size="template_size" variant="outline-primary"
                                                      @click="()=>{editManager = true; newManager = false; resetManager = false; edit_Manager = {id:row.item.id,description:row.item.description}}">
                                                修改信息
                                            </b-button>
                                            <b-button class="styledBtn" :key="'reset' + row.id" :size="template_size"
                                                      variant="outline-primary"
                                                      @click="()=>{resetManager = true; newManager = false; editManager = false; reset_Manager = {id:row.item.id,password:''}}">
                                                重置密码
                                            </b-button>
                                        </b-button-group>
                                    </template>
                                </b-table>
                                <b-modal hide-footer centered  v-model="newManager" title="新增管理员">
                                    <div>
                                        <b-form @submit="newManagerSave" class="container pt-3">
                                            <b-form-group id="input-group-7" label-for="name">
                                                <b-form-input
                                                        v-model="new_Manager.name"
                                                        required
                                                        autocomplete="username"
                                                        placeholder="管理员名称"
                                                ></b-form-input>
                                            </b-form-group>
                                            <b-form-group id="input-group-8" label-for="input-2">
                                                <b-form-textarea
                                                        rows="3"
                                                        no-resize
                                                        v-model="new_Manager.description"
                                                        required
                                                        placeholder="备注"
                                                ></b-form-textarea>
                                            </b-form-group>
                                            <b-form-group id="input-group-9" label-for="input-2">
                                                <b-form-input
                                                        v-model="new_Manager.password"
                                                        required
                                                        autocomplete="new-password"
                                                        type="password"
                                                        placeholder="密码"
                                                ></b-form-input>
                                            </b-form-group>
                                            <b-button class="mt-3 my-4 col-5 float-left" block type="submit" variant="primary">保 存
                                            </b-button>
                                            <b-button class="mt-3 my-4 col-5 float-right" block variant="primary"
                                                      @click="()=>{newManager = false; new_Manager = {name:'',description:'',password:null}}">取 消
                                            </b-button>
                                        </b-form>
                                    </div>
                                </b-modal>
                                <b-modal hide-footer centered  v-model="editManager" title="修改信息">
                                    <div>
                                        <b-form @submit="editManagerSave" class="container pt-3" >
                                            <b-form-group id="input-group-10" label-for="input-2">
                                                <b-form-textarea
                                                        id="edit_Manager_description"
                                                        rows="3"
                                                        no-resize
                                                        v-model="edit_Manager.description"
                                                        required
                                                        placeholder="备注"
                                                ></b-form-textarea>
                                            </b-form-group>
                                            <b-button class="mt-3 my-4 col-5 float-left" block type="submit" variant="primary">保 存
                                            </b-button>
                                            <b-button class="mt-3 my-4 col-5 float-right" block variant="primary"
                                                      @click="()=>{editManager = false; edit_Manager = {id: null,description:''}}">取
                                                消
                                            </b-button>
                                        </b-form>
                                    </div>
                                </b-modal>
                                <b-modal hide-footer centered  v-model="resetManager" title="重置密码">
                                    <div>
                                        <b-form @submit="resetManagerSave" class="container pt-3">
                                            <b-form-group id="input-group-11" label-for="input-2">
                                                <b-form-input
                                                        v-model="reset_Manager.password"
                                                        required
                                                        autocomplete="new-password"
                                                        type="password"
                                                        placeholder="密码"
                                                ></b-form-input>
                                            </b-form-group>
                                            <b-button class="mt-3 my-4 col-5 float-left" block type="submit" variant="primary">保 存
                                            </b-button>
                                            <b-button class="mt-3 my-4 col-5 float-right" block variant="primary"
                                                      @click="()=>{resetManager = false; reset_Manager = {id: null,password:''}}">取
                                                消
                                            </b-button>
                                        </b-form>
                                    </div>
                                </b-modal>
                            </div>
                        </b-modal>
                    </b-button-group>
                </template>
            </b-table>
        </div>
        <b-row class="justify-content-end row-margin-tweak mx-0 mt-4 cardDiv">
            <b-pagination
                    :size="template_size"
                    :total-rows="allgroup.total"
                    :per-page="queryParam.size"
                    limit="5"
                    v-model="queryParam.page"
            ></b-pagination>
        </b-row>
    </div>
</template>

<script>
    import {mapState} from "vuex";
    import Loading from "@/components/loading/Loading";
    import GroupService from "@/services/groupService";
    import _ from "lodash";
    import BRow from "bootstrap-vue/src/components/layout/row";

    export default {
        name: "group-index",
        components: {
            BRow,
            Loading,
        },
        data() {
            return {
                selected: [],
                editItem: {
                    id: null,
                    name: '',
                    comment: '',
                    default: 0,
                    publish: 1
                },
                Managers: {
                    list: [],
                    groupID: null
                },
                newManager: false,
                new_Manager: {
                    name: '',
                    description: '',
                    password: null,
                },
                editManager: false,
                edit_Manager: {
                    id: null,
                    description: ''
                },
                resetManager: false,
                reset_Manager: {
                    id: null,
                    password: ''
                },
                columns: {
                    check: {
                        label: "",
                        sortable: false,
                        class: "text-center field-check"
                    },
                    id: {
                        label: "ID",
                        sortable: false,
                        class: "text-center field-sn"
                    },
                    name: {
                        label: "集群名称",
                        sortable: false,
                        class: "text-center field-name"
                    },
                    comment: {
                        label: "集群描述",
                        sortable: false,
                        class: "text-center field-creator"
                    },
                    publish: {
                        label: "是否为公开集群",
                        sortable: false,
                        class: "text-center field-create_time"
                    },
                    groupManagers: {
                        label: "集群管理员",
                        sortable: false,
                        class: "text-center field-rend_ani_1"
                    },
                    action: {
                        label: "操作",
                        sortable: false,
                        class: "text-center field-rend_ani_2"
                    }
                },
                managerColumns: {
                    id: {
                        label: "序号",
                        sortable: false,
                        class: "text-center field-sn"
                    },
                    name: {
                        label: "管理员名称",
                        sortable: false,
                        class: "text-center field-name"
                    },
                    comment: {
                        label: "备注",
                        sortable: false,
                        class: "text-center field-creator"
                    },
                    action: {
                        label: "操作",
                        sortable: false,
                        class: "text-center field-rend_ani_2"
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
                    total: 0
                },
                newGroup: {
                    name: '',
                    comment: '',
                    default: 0,
                    publish: 1,
                    managerName: '',
                    managerPass: ''
                },
                options1: [
                    {text: '是', value: 1},
                    {text: '否', value: 0}
                ],
                options2: [
                    {text: '是', value: 1},
                    {text: '否', value: 0}
                ]
            };
        },
        created() {
            this.$nextTick(() => {
                this.queryGroupList();
            });
        },
        computed: {
            ...mapState(["userInfo"]),
        },
        watch: {
            queryParam: {
                handler() {
                    this.queryGroupList();
                },
                deep: true
            },
            queryDebounceParam: {
                deep: true,
                handler: _.debounce(function () {
                    this.queryGroupList();
                }, 500)
            }
        },
        methods: {
            onSubmit(evt) {
                evt.preventDefault();
                if (this.newGroup.default === 1 && !confirm("已经有默认集群了，是否更换默认集群")) {
                    return
                }
                else {
                    this.run();
                    GroupService
                        .create(this.newGroup)
                        .then((res) => {
                            if (res.results === 'success')
                                GroupService
                                    .fetchList({...this.queryParam, ...this.queryDebounceParam})
                                    .then(data => {
                                        data.results.forEach(item => {
                                            if (item.checked === undefined) {
                                                item.checked = false;
                                            }
                                            if (item.locked === undefined) {
                                                item.locked = false;
                                            }
                                        });
                                        this.allgroup.list = data.results;
                                        this.allgroup.total = data.paging.count;
                                        this.$emit("data-ready");
                                        this.$refs['newGroup'].hide();
                                    })
                                    .catch(() => {
                                        this.$emit("data-failed");
                                    });
                            else if (res.results === 'nameError') {
                                alert("该集群名已存在。");
                                this.$emit("data-failed");
                            }
                            else if (res.results === 'managerNameError') {
                                alert("该账号已存在。");
                                this.$emit("data-failed");
                            }
                            else
                                this.$emit("data-failed");
                        })
                        .catch(() => {
                            this.$emit("data-failed");
                        });
                }
            },
            queryGroupList() {
                this.run();
                GroupService
                    .fetchList({...this.queryParam, ...this.queryDebounceParam})
                    .then(data => {
                        data.results.forEach(item => {
                            if (item.checked === undefined) {
                                item.checked = false;
                            }
                            if (item.locked === undefined) {
                                item.locked = false;
                            }
                        });
                        this.allgroup.list = data.results;
                        this.allgroup.total = data.paging.count;
                        this.$emit("data-ready");
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
            },
            deleteGroup() {
                if (confirm("您确定要删除该集群吗？")){
                    this.run();
                    GroupService
                        .deleteGroups({ids: JSON.stringify(this.selected)})
                        .then(res => {
                            if (res.results === 'success')
                                GroupService
                                    .fetchList({...this.queryParam, ...this.queryDebounceParam})
                                    .then(data => {
                                        data.results.forEach(item => {
                                            if (item.checked === undefined) {
                                                item.checked = false;
                                            }
                                            if (item.locked === undefined) {
                                                item.locked = false;
                                            }
                                        });
                                        this.allgroup.list = data.results;
                                        this.allgroup.total = data.paging.count;
                                        this.$emit("data-ready");
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
            },
            editOpen(row) {
                this.editItem.id = row.item.id;
                this.editItem.name = row.item.name;
                this.editItem.comment = row.item.comment;
                this.editItem.default = row.item.default;
                this.editItem.publish = row.item.publish;
                this.$refs['editGroup'].show();
            },
            addManagerOpen(row) {
                this.Managers.list = row.item.groupManagers;
                this.Managers.groupID = row.item.id;
                this.$refs['addManager'].show();
            },
            updateGroup(evt) {
                evt.preventDefault();
                this.run();
                GroupService
                    .update(this.editItem)
                    .then((res) => {
                        if (res.results === 'success')
                            GroupService
                                .fetchList({...this.queryParam, ...this.queryDebounceParam})
                                .then(data => {
                                    data.results.forEach(item => {
                                        if (item.checked === undefined) {
                                            item.checked = false;
                                        }
                                        if (item.locked === undefined) {
                                            item.locked = false;
                                        }
                                    });
                                    this.allgroup.list = data.results;
                                    this.allgroup.total = data.paging.count;
                                    this.$emit("data-ready");
                                    this.$refs['editGroup'].hide();
                                })
                                .catch(() => {
                                    this.$emit("data-failed");
                                });
                        else if (res.results === 'nameError') {
                            alert("该集群名已存在。");
                            this.$emit("data-failed");
                        }
                        else
                            this.$emit("data-failed");
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
            },
            newManagerSave(evt) {
                evt.preventDefault();
                this.run();
                GroupService
                    .addManager({groupID: this.Managers.groupID, data: this.new_Manager})
                    .then((res) => {
                        if (res.results === 'success')
                            GroupService
                                .fetchList({...this.queryParam, ...this.queryDebounceParam})
                                .then(data => {
                                    data.results.forEach(item => {
                                        if (item.checked === undefined) {
                                            item.checked = false;
                                        }
                                        if (item.locked === undefined) {
                                            item.locked = false;
                                        }
                                    });
                                    this.allgroup.list = data.results;
                                    this.allgroup.total = data.paging.count;
                                    let selectedData = data.results.filter(obj => { return obj.id === this.Managers.groupID});
                                    this.Managers.list = selectedData[0].groupManagers;
                                    this.$emit("data-ready");
                                    this.newManager = false;
                                })
                                .catch(() => {
                                    this.$emit("data-failed");
                                });
                        else if (res.results === 'managerNameError') {
                            alert("该账号已存在。");
                            this.$emit("data-failed");
                        }
                        else
                            this.$emit("data-failed");
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
            },
            editManagerSave(evt) {
                evt.preventDefault();
                this.editManager = false;
                this.run();
                GroupService
                    .updateManager(this.edit_Manager)
                    .then((res) => {
                        if (res.results === 'success')
                            GroupService
                                .fetchList({...this.queryParam, ...this.queryDebounceParam})
                                .then(data => {
                                    data.results.forEach(item => {
                                        if (item.checked === undefined) {
                                            item.checked = false;
                                        }
                                        if (item.locked === undefined) {
                                            item.locked = false;
                                        }
                                    });
                                    this.allgroup.list = data.results;
                                    this.allgroup.total = data.paging.count;
                                    let selectedData = data.results.filter(obj => { return obj.id === this.Managers.groupID});
                                    this.Managers.list = selectedData[0].groupManagers;
                                    this.$emit("data-ready");
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
            },
            resetManagerSave(evt) {
                evt.preventDefault();
                this.resetManager = false;
                this.run();
                GroupService
                    .pResetManager(this.reset_Manager)
                    .then((res) => {
                        if (res.results === 'success')
                            GroupService
                                .fetchList({...this.queryParam, ...this.queryDebounceParam})
                                .then(data => {
                                    data.results.forEach(item => {
                                        if (item.checked === undefined) {
                                            item.checked = false;
                                        }
                                        if (item.locked === undefined) {
                                            item.locked = false;
                                        }
                                    });
                                    this.allgroup.list = data.results;
                                    this.allgroup.total = data.paging.count;
                                    let selectedData = data.results.filter(obj => { return obj.id === this.Managers.groupID});
                                    this.Managers.list = selectedData[0].groupManagers;
                                    this.$emit("data-ready");
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
    };
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
    .group-index {
        .field-check {
            width: 2%;
            padding-top: 11px;
            text-align: left !important;
        }
        .field-sn {
            width: 6%;
            text-align: left !important;
        }
        .field-name {
            width: 12%;
            text-align: left !important;
        }
        .field-creator {
            width: 25%;
            text-align: left !important;
        }
        .field-create_time {
            width: 10%;
            text-align: left !important;
        }
        .field-rend_ani_1 {
            width: 30%;
            text-align: left !important;
        }
        .field-rend_ani_2 {
            width: 15%;
            text-align: left !important;
        }
    }
</style>