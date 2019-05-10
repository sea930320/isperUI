<template>
    <div class="inner_permission">
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
            <b-table :items="allData.list" small hover :fields="columns" head-variant style="fontSize: 18px">
                <template slot="name" slot-scope="row"><span class="text">{{row.item.name}}</span></template>
                <template slot="comment" slot-scope="row">{{row.item.comment ? row.item.comment : ''}}</template>
                <template slot="ownPositions" slot-scope="row">
                    <b-badge pill variant="primary" class="mr-2" v-for="(position, index) in row.item.ownPositions" :key="`position-${index}`">{{ position.text }}</b-badge>
                </template>
                <template slot="action" slot-scope="row">
                    <b-button v-if="row.item.id === 1" class="styledBtn" :key="row.item.id" :size="template_size" variant="outline-primary"
                              @click="()=>{editInnerPermission = true; edit_InnerPermission = {id:row.item.id, tags:row.item.ownPositions.map(item=>{return {id: item.id, text: item.text}})};}">
                        对应关系没置
                    </b-button>
                </template>
            </b-table>
        </div>
        <b-row class="justify-content-end row-margin-tweak mx-0 mt-4 cardDiv">
            <b-pagination
                    :size="template_size"
                    :total-rows="allData.total"
                    :per-page="queryParam.size"
                    limit="5"
                    v-model="queryParam.page"
            ></b-pagination>
        </b-row>
        <b-modal hide-footer centered  v-model="editInnerPermission" title="修改事务类型">
            <div>
                <b-form @submit="editInnerPermissionSave" class="container pt-3" >
                    <b-form-group id="input-group-10" label-for="input-2">
                        <vue-tags-input
                                v-model="tag"
                                :tags="edit_InnerPermission.tags"
                                :autocomplete-items="filteredItems"
                                :add-only-from-autocomplete="true"
                                :autocomplete-min-length="0"
                                @tags-changed="newTags => edit_InnerPermission.tags = newTags"
                        />
                    </b-form-group>
                    <b-button class="mt-3 my-4 col-5 float-left" block type="submit" variant="primary">保 存
                    </b-button>
                    <b-button class="mt-3 my-4 col-5 float-right" block variant="primary"
                              @click="()=>{editInnerPermission = false; edit_InnerPermission = {id: null,tags:[]}}">取
                        消
                    </b-button>
                </b-form>
            </div>
        </b-modal>
    </div>
</template>

<script>
    import {mapState} from "vuex";
    import Loading from "@/components/loading/Loading";
    import PartPositionService from "@/services/partpositionService";
    import VueTagsInput from '@johmun/vue-tags-input';
    import _ from "lodash";
    import BRow from "bootstrap-vue/src/components/layout/row";

    export default {
        name: "inner_permission",
        components: {
            BRow,
            Loading,
            VueTagsInput,
        },
        data() {
            return {
                tag: '',
                editInnerPermission: false,
                edit_InnerPermission: {
                    id: null,
                    tags: []
                },
                autocompleteItems: [],
                editItem: {
                    id: null,
                    name: '',
                    comment: '',
                    default: 0,
                    publish: 1
                },
                columns: {
                    name: {
                        label: "任务类角色",
                        sortable: false,
                        class: "text-center field-name"
                    },
                    comment: {
                        label: "角色描述",
                        sortable: false,
                        class: "text-center field-comment"
                    },
                    ownPositions: {
                        label: "对应职务",
                        sortable: false,
                        class: "text-center field-ownPositions"
                    },
                    action: {
                        label: "操作",
                        sortable: false,
                        class: "text-center field-action"
                    }
                },
                queryParam: {
                    page: 1,
                    size: 4,
                    group_id: null
                },
                queryDebounceParam: {
                    search: ""
                },
                allData: {
                    list: [],
                    total: 0
                },
            };
        },
        created() {
            this.$nextTick(() => {
                this.queryDataList();
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
                    this.queryDataList();
                },
                deep: true
            },
            queryDebounceParam: {
                deep: true,
                handler: _.debounce(function () {
                    this.queryDataList();
                }, 500)
            }
        },
        methods: {
            queryDataList() {
                this.run();
                PartPositionService
                    .getInnerPermissions({...this.queryParam, ...this.queryDebounceParam})
                    .then(data => {
                        this.allData.list = data.results.data;
                        this.autocompleteItems = data.results.items;
                        this.allData.total = data.paging.count;
                        this.$emit("data-ready");
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
            },
            editInnerPermissionSave(evt) {
                evt.preventDefault();
                this.run();
                PartPositionService
                    .setInnerPermissions({id:this.edit_InnerPermission.id, items: JSON.stringify(this.edit_InnerPermission.tags.map(x=>x.id))})
                    .then(data => {
                        if (data.results === 'success') {
                            PartPositionService
                                .getInnerPermissions({...this.queryParam, ...this.queryDebounceParam})
                                .then(data => {
                                    this.allData.list = data.results.data;
                                    this.autocompleteItems = data.results.items;
                                    this.allData.total = data.paging.count;
                                    this.editInnerPermission = false;
                                    this.$emit("data-ready");
                                })
                                .catch(() => {
                                    this.$emit("data-failed");
                                });
                        } else
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
    .inner_permission {
        .field-name {
            width: 20%;
            text-align: center !important;
        }
        .field-comment {
            width: 25%;
            text-align: left !important;
        }
        .field-ownPositions {
            width: 40%;
            text-align: left !important;
        }
        .field-action {
            width: 10%;
            text-align: left !important;
        }
    }
</style>