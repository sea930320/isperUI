<template>
    <div class="group_company-index">
        <b-tabs content-class="mt-3">
            <b-tab title="集群管理" active>
                <loading v-if="isRunning"></loading>
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
                </b-row>
                <div class="cardDiv">
                    <b-table :items="allgroup.list" small hover :fields="columns" head-variant style="fontSize: 18px">
                        <template slot="id" slot-scope="row">{{ row.item.id }}</template>
                        <template slot="name" slot-scope="row">
                            <span class="text">{{row.item.name}}</span>
                        </template>
                        <template slot="instructors" slot-scope="row">
                            <div>
                            <span v-for="instructor in row.item.instructors.slice(0, 5)"
                                  :key="instructor.id">{{ instructor.name + ', ' }}</span>
                            </div>
                        </template>
                        <template slot="created" slot-scope="row">
                            {{new Date(row.item.created).toLocaleString()}}
                        </template>
                        <template slot="action" slot-scope="row">
                            <b-button-group>
                                <b-button class="styledBtn" :key="row.item.id" :size="template_size" variant="outline-primary"
                                          @click="editOpen(row)" v-if="isActionAllowed('code_group_company_management', 'code_configure_instructor_group_company')">
                                    <icon name="user-plus" style="width: 20px"></icon>
                                    配置指导者
                                </b-button>
                                <b-modal hide-footer centered size="xl" id="editInstructors" ref="editInstructors" title="配置指导者">
                                    <div class="pb-5">
                                        <b-button :size="template_size" variant="outline-primary" class="mb-3 offset-10 styledBtn fontedBtn" style="margin-left: 82% !important;"
                                                  @click="()=>{newInstructor = true; editInstructor = false; new_Instructor = {name:'', password:null}}">
                                            新增指导者
                                        </b-button>
                                        <b-table :items="row.item.instructors" small hover :fields="instructorColumns"
                                                 class="col-10 offset-1" head-variant style="fontSize: 18px">
                                            <template slot="id" slot-scope="row">{{ row.item.id }}</template>
                                            <template slot="name" slot-scope="row">
                                                <span class="text">{{row.item.name}}</span>
                                            </template>
                                            <template slot="instructorItems" slot-scope="row">
                                                <b-badge pill variant="primary" class="mr-2" v-for="(instructor, index) in row.item.instructorItems" :key="`instructor-${index}`">{{ instructor.text }}</b-badge>
                                            </template>
                                            <template slot="action" slot-scope="row">
                                                <b-button class="styledBtn" :key="'edit' + row.id" :size="template_size" variant="outline-primary"
                                                          @click="()=>{editInstructor = true; newInstructor = false; edit_Instructor = {id:row.item.id, tags:[]}; allgroup.selectedInstructor = row.item.id; tags = row.item.instructorItems.map(item=>{return {text: item.text}});}">
                                                    <icon name="edit" style="width: 20px; margin: 0 0 4px 2px;"></icon>
                                                </b-button>
                                                <b-button class="styledBtn" :key="'delete' + row.id" :size="template_size" variant="outline-primary"
                                                          @click="deleteGroupInstructor(row.item.id)">
                                                    删除
                                                </b-button>
                                            </template>
                                        </b-table>
                                        <b-modal hide-footer centered  v-model="newInstructor" title="新增指导者">
                                            <div>
                                                <b-form @submit="newInstructorSave" class="container pt-3">
                                                    <b-form-group id="input-group-7" label-for="name">
                                                        <b-form-input
                                                                v-model="new_Instructor.name"
                                                                required
                                                                autocomplete="username"
                                                                placeholder="管理员名称"
                                                        ></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group id="input-group-9" label-for="input-2">
                                                        <b-form-input
                                                                v-model="new_Instructor.password"
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
                                                    <b-button class="mt-3 my-4 col-5 float-left" block type="submit" variant="primary" :disabled="![0, 1].includes(newManagerLock)">保 存
                                                    </b-button>
                                                    <b-button class="mt-3 my-4 col-5 float-right" block variant="primary"
                                                              @click="()=>{newInstructor = false; new_Instructor = {name:'', password:null}}">取 消
                                                    </b-button>
                                                </b-form>
                                            </div>
                                        </b-modal>
                                        <b-modal hide-footer centered  v-model="editInstructor" title="修改事务类型">
                                            <div>
                                                <b-form @submit="editInstructorSave" class="container pt-3" >
                                                    <b-form-group id="input-group-10" label-for="input-2">
                                                        <vue-tags-input
                                                                v-model="tag"
                                                                :tags="tags"
                                                                :autocomplete-items="filteredItems"
                                                                :add-only-from-autocomplete="true"
                                                                :autocomplete-min-length="0"
                                                                @tags-changed="newTags => tags = newTags"
                                                                placeholder="添加标签"
                                                        />
                                                    </b-form-group>
                                                    <b-button class="mt-3 my-4 col-5 float-left" block type="submit" variant="primary">保 存
                                                    </b-button>
                                                    <b-button class="mt-3 my-4 col-5 float-right" block variant="primary"
                                                              @click="()=>{editInstructor = false; edit_Instructor = {id: null,tags:[]}}">取
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
            </b-tab>
            <b-tab title="单位管理">
                <CompanyVue />
            </b-tab>
        </b-tabs>
    </div>
</template>

<script>

import {mapState} from "vuex";
import Loading from "@/components/loading/Loading";
import GroupService from "@/services/groupService";
import _ from "lodash";
import BRow from "bootstrap-vue/src/components/layout/row";
import VueTagsInput from '@johmun/vue-tags-input';
import CompanyVue from './Company_Index';

export default {
    name: "group_company-index",
    components: {
        BRow,
        Loading,
        VueTagsInput,
        CompanyVue,
    },
    data() {
        return {
            tag: '',
            tags: [],
            newManagerLock: 0,
            autocompleteItems: [],
            newInstructor: false,
            new_Instructor: {
                name: '',
                password: null,
            },
            editInstructor: false,
            edit_Instructor: {
                id: null,
                tags: []
            },
            columns: {
                id: {
                    label: "ID",
                    sortable: false,
                    class: "text-right field-sn"
                },
                name: {
                    label: "集群名称",
                    sortable: false,
                    class: "text-left field-name"
                },
                instructors: {
                    label: "集群指导者",
                    sortable: false,
                    class: "text-left field-creator"
                },
                created: {
                    label: "创建时间",
                    sortable: false,
                    class: "text-right field-create_time"
                },
                action: {
                    label: "操作",
                    sortable: false,
                    class: "text-left field-rend_ani_2"
                }
            },
            instructorColumns: {
                id: {
                    label: "序号",
                    sortable: false,
                    class: "text-right field-1"
                },
                name: {
                    label: "指导者名称",
                    sortable: false,
                    class: "text-left field-2"
                },
                instructorItems: {
                    label: "事务类型",
                    sortable: false,
                    class: "text-left field-3"
                },
                action: {
                    label: "操作",
                    sortable: false,
                    class: "text-left field-4"
                }
            },
            queryParam: {
                page: 1,
                size: 15
            },
            queryDebounceParam: {
                search: ""
            },
            allgroup: {
                list: [],
                selectedID: null,
                selectedInstructor: null,
                tmpItems: [],
            },
        };
    },
    created() {
        this.$nextTick(() => {
            this.queryGroupList();
        });
    },
    computed: {
        ...mapState(["userInfo"]),
        filteredItems() { return this.autocompleteItems.filter(i => {
            return i.text.toLowerCase().indexOf(this.tag.toLowerCase()) !== -1;
        })}
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
        },
        "new_Instructor.name": {
            handler: function() {
                if (this.new_Instructor.name !== '') {
                    GroupService
                        .checkUserGroup({ username: this.new_Instructor.name, group: this.allgroup.selectedID, role: 4 })
                        .then(data => {
                            this.newManagerLock = parseInt(data.results);
                        });
                } else
                    this.newManagerLock = 0;
            },
            deep: true
        },
    },
    methods: {
        queryGroupList() {
            this.run();
            GroupService
                .getOwnGroup({id: this.userInfo.id, ...this.queryParam, ...this.queryDebounceParam})
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
                    this.$emit("data-ready");
                })
                .catch(() => {
                    this.$emit("data-failed");
                });
        },
        editOpen(row) {
            this.allgroup.selectedID = row.item.id;
            this.run();
            GroupService
                .getInstructorItemList({})
                .then(data => {
                    this.allgroup.tmpItems = data.results;
                    this.autocompleteItems = [];
                    this.autocompleteItems = this.allgroup.tmpItems.map(item=>{ return {text: item.text}});
                    this.$emit("data-ready");
                    this.$refs['editInstructors'].show();
                })
                .catch(() => {
                    this.$emit("data-failed");
                });
        },
        newInstructorSave(evt) {
            evt.preventDefault();
            this.run();
            GroupService
                .createInstructors({id: this.allgroup.selectedID, data: this.new_Instructor, order: this.newManagerLock})
                .then((result) => {
                    if (result.results === 'success')
                        GroupService
                            .getOwnGroup({id: this.userInfo.id})
                            .then(data => {
                                this.allgroup.list = data.results;
                                GroupService
                                    .getInstructorItemList({})
                                    .then(res => {
                                        this.allgroup.tmpItems = res.results;
                                        this.autocompleteItems = [];
                                        this.autocompleteItems = this.allgroup.tmpItems.map(item=>{ return {text: item.text}});
                                        this.newInstructor = false;
                                        this.$emit("data-ready");
                                    })
                                    .catch(() => {
                                        this.$emit("data-failed");
                                    });
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
        editInstructorSave(evt) {
            evt.preventDefault();
            this.run();
            let selectedTexts = this.tags.map(item=>item.text);
            let tagsIndexs = this.allgroup.tmpItems.filter(item=>selectedTexts.includes(item.text)).map(i=>i.id);
            GroupService
                .saveInstructors({id: this.allgroup.selectedInstructor, items: JSON.stringify(tagsIndexs)})
                .then((result) => {
                    if (result.results === 'success')
                        GroupService
                            .getOwnGroup({id: this.userInfo.id})
                            .then(data => {
                                this.allgroup.list = data.results;
                                GroupService
                                    .getInstructorItemList({})
                                    .then(res => {
                                        this.allgroup.tmpItems = res.results;
                                        this.autocompleteItems = [];
                                        this.autocompleteItems = this.allgroup.tmpItems.map(item=>{ return {text: item.text}});
                                        this.editInstructor = false;
                                        this.$emit("data-ready");
                                    })
                                    .catch(() => {
                                        this.$emit("data-failed");
                                    });
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
        deleteGroupInstructor(iid) {
            let gid = this.allgroup.selectedID;
            if (confirm('您确定要删除该指导者吗？')) {
                this.run();
                GroupService
                    .deleteGroupInstructor({ gid: gid, iid: iid })
                    .then(data => {
                        if (data.results === 'success')
                            GroupService
                                .getOwnGroup({id: this.userInfo.id})
                                .then(data => {
                                    this.allgroup.list = data.results;
                                    GroupService
                                        .getInstructorItemList({})
                                        .then(res => {
                                            this.allgroup.tmpItems = res.results;
                                            this.autocompleteItems = [];
                                            this.autocompleteItems = this.allgroup.tmpItems.map(item=>{ return {text: item.text}});
                                            this.newInstructor = false;
                                            this.$emit("data-ready");
                                            this.$refs['editInstructors'].hide();
                                        })
                                        .catch(() => {
                                            this.$emit("data-failed");
                                        });
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
    .group_company-index {
        .tabs .nav.nav-tabs {
            li {
                width: 200px;
            }
            justify-content: center;
        }
        .field-sn {
            width: 10%;
            text-align: left !important;
        }
        .field-name {
            width: 15%;
            text-align: left !important;
        }
        .field-creator {
            width: 20%;
            text-align: left !important;
        }
        .field-create_time {
            width: 15%;
            text-align: left !important;
        }
        .field-rend_ani_2 {
            width: 10%;
            text-align: left !important;
        }
        .field-1 {
            width: 15%;
            text-align: left !important;
        }
        .field-2 {
            width: 20%;
            text-align: left !important;
        }
        .field-3 {
            width: 50%;
            text-align: left !important;
        }
        .field-4 {
            width: 15%;
            text-align: left !important;
        }
        .vue-tags-input {
            max-width: 100%;
        }
    }
</style>