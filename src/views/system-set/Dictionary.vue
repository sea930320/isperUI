<template>
    <div class="dictionary_index">
        <loading v-if="isRunning"></loading>
        <div class="mt-5">
            <div block class="cardDiv1 d-inline-flex py-2" variant="primary">单位类型<b-button variant="outline-primary" class="plusBtn ml-auto rounded-circle" v-b-modal.newItem @click="()=>{this.newItem={id:null,target:1,name:'',content:''}}">+</b-button></div>
            <div block class="ml-5 cardDiv1 d-inline-flex py-2" variant="primary">事务类型<b-button variant="outline-primary" class="plusBtn ml-auto rounded-circle" v-b-modal.newItem @click="()=>{this.newItem={id:null,target:2,name:'',content:''}}">+</b-button></div>
            <div block class="ml-5 cardDiv1 d-inline-flex py-2" variant="primary">职务管理<b-button variant="outline-primary" class="plusBtn ml-auto rounded-circle" v-b-modal.newItem @click="()=>{this.newItem={id:null,target:3,name:'',content:''}}">+</b-button></div>
            <div block class="ml-5 cardDiv1 d-inline-flex py-2" variant="primary">课程类型<b-button variant="outline-primary" class="plusBtn ml-auto rounded-circle" v-b-modal.newItem @click="()=>{this.newItem={id:null,target:4,name:'',content:''}}">+</b-button></div>
        </div>
        <div>
            <b-list-group class="d-inline-flex py-2">
                <b-list-group-item v-for="companyItem in dicData.company" :key="'companyItem'+companyItem.id" class="d-flex justify-content-between align-items-center">
                    {{companyItem.name}}
                    <div class="ml-auto">
                        <b-button variant="light" class="mr-1" style="padding: 0px 5px 0px 6px;" v-b-modal.editItem @click="()=>{editItem={id:companyItem.id,target:1,name:companyItem.name,content:companyItem.content}}"><icon name="edit" style="width: 13px;color: grey"></icon></b-button>
                        <b-button variant="light" style="padding: 0px 7px;" @click="deleteItemSave(companyItem.id,1)"><icon name="trash" style="width: 10px;color: grey"></icon></b-button>
                    </div>
                </b-list-group-item>
            </b-list-group>
            <b-list-group class="d-inline-flex ml-5 py-2">
                <template v-for="officeItem in dicData.office" :newItem="this.newItem" :editItem="this.editItem">
                    <b-list-group-item class="d-flex justify-content-between align-items-center" :key="'item1-'+officeItem.id" :id="'item1-' + officeItem.id" v-b-toggle="'collapse1-'+officeItem.id" @click="cycled('item1-'+officeItem.id)">
                        {{officeItem.name}}
                        <icon name="angle-right" class="ml-auto cycle"></icon>
                        <div class="ml-auto">
                            <b-button variant="light" class="mr-1" style="padding: 0px 7px" v-b-modal.newItem @click="()=>{newItem={id:officeItem.id,target:20,name:'',content:''}}"><icon name="plus" style="width: 10px;color: grey"></icon></b-button>
                            <b-button variant="light" class="mr-1" style="padding: 0px 5px 0px 6px;" v-b-modal.editItem @click="()=>{editItem={id:officeItem.id,target:2,name:officeItem.name,content:officeItem.content}}"><icon name="edit" style="width: 13px;color: grey"></icon></b-button>
                            <b-button variant="light" style="padding: 0px 7px;" @click="deleteItemSave(officeItem.id,2)"><icon name="trash" style="width: 10px;color: grey"></icon></b-button>
                        </div>
                    </b-list-group-item>
                    <b-collapse :id="'collapse1-'+officeItem.id" :key="'collapse1-'+officeItem.id">
                        <b-list-group class="d-inline-flex w-100" v-if="officeItem.subItems.length > 0">
                            <b-list-group-item class="d-flex justify-content-between align-items-center subListItem" v-for="officeSItem in officeItem.subItems" :key="'officeSItem'+officeSItem.sid">
                                {{officeSItem.sname}}
                                <div class="ml-auto">
                                    <b-button variant="light" class="mr-1" style="padding: 0px 5px 0px 6px;" v-b-modal.editItem @click="()=>{editItem={id:officeSItem.sid,target:20,name:officeSItem.sname,content:officeSItem.scontent}}"><icon name="edit" style="width: 13px;color: grey"></icon></b-button>
                                    <b-button variant="light" style="padding: 0px 7px;" @click="deleteItemSave(officeSItem.sid,20)"><icon name="trash" style="width: 10px;color: grey"></icon></b-button>
                                </div>
                            </b-list-group-item>
                        </b-list-group>
                    </b-collapse>
                </template>
            </b-list-group>
            <b-list-group class="d-inline-flex ml-5 py-2">
                <b-list-group-item v-for="jobItem in dicData.job" :key="'jobItem'+jobItem.id" class="d-flex justify-content-between align-items-center">
                    {{jobItem.name}}
                    <div class="ml-auto">
                        <b-button variant="light" class="mr-1" style="padding: 0px 5px 0px 6px;" v-b-modal.editItem @click="()=>{editItem={id:jobItem.id,target:3,name:jobItem.name,content:jobItem.content}}"><icon name="edit" style="width: 13px;color: grey"></icon></b-button>
                        <b-button variant="light" style="padding: 0px 7px;" @click="deleteItemSave(jobItem.id,3)"><icon name="trash" style="width: 10px;color: grey"></icon></b-button>
                    </div>
                </b-list-group-item>
            </b-list-group>
            <b-list-group class="d-inline-flex ml-5 py-2">
                <template v-for="courseItem in dicData.course" :newItem="this.newItem">
                    <b-list-group-item class="d-flex justify-content-between align-items-center" :key="'item2-'+courseItem.id" :id="'item2-' + courseItem.id" v-b-toggle="'collapse2-'+courseItem.id" @click="cycled('item2-'+courseItem.id)">
                        {{courseItem.name}}
                        <icon name="angle-right" class="ml-auto cycle"></icon>
                        <div class="ml-auto">
                            <b-button variant="light" class="mr-1" style="padding: 0px 7px" v-b-modal.newItem @click="()=>{newItem={id:courseItem.id,target:40,name:'',content:''}}"><icon name="plus" style="width: 10px;color: grey"></icon></b-button>
                            <b-button variant="light" class="mr-1" style="padding: 0px 5px 0px 6px;" v-b-modal.editItem @click="()=>{editItem={id:courseItem.id,target:4,name:courseItem.name,content:courseItem.content}}"><icon name="edit" style="width: 13px;color: grey"></icon></b-button>
                            <b-button variant="light" style="padding: 0px 7px;" @click="deleteItemSave(courseItem.id,4)"><icon name="trash" style="width: 10px;color: grey"></icon></b-button>
                        </div>
                    </b-list-group-item>
                    <b-collapse :id="'collapse2-'+courseItem.id" :key="'collapse2-'+courseItem.id">
                        <b-list-group class="d-inline-flex w-100" v-if="courseItem.subItems.length > 0">
                            <b-list-group-item class="d-flex justify-content-between align-items-center subListItem" v-for="courseSItem in courseItem.subItems" :key="'courseSItem'+courseSItem.sid">
                                {{courseSItem.sname}}
                                <div class="ml-auto">
                                    <b-button variant="light" class="mr-1" style="padding: 0px 5px 0px 6px;" v-b-modal.editItem @click="()=>{editItem={id:courseSItem.sid,target:40,name:courseSItem.sname,content:courseSItem.scontent}}"><icon name="edit" style="width: 13px;color: grey"></icon></b-button>
                                    <b-button variant="light" style="padding: 0px 7px;" @click="deleteItemSave(courseSItem.sid,40)"><icon name="trash" style="width: 10px;color: grey"></icon></b-button>
                                </div>
                            </b-list-group-item>
                        </b-list-group>
                    </b-collapse>
                </template>
            </b-list-group>
        </div>
        <b-modal hide-footer centered  id="newItem" ref="newItem" title="添加">
            <div>
                <b-form @submit="newItemSave" class="container pt-3">
                    <b-form-group id="input-group-7" label-for="name">
                        <b-form-input
                                v-model="newItem.name"
                                required
                                autocomplete="username"
                                placeholder="名称"
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group id="input-group-8" label-for="input-2">
                        <b-form-textarea
                                rows="3"
                                no-resize
                                v-model="newItem.content"
                                required
                                placeholder="备注"
                        ></b-form-textarea>
                    </b-form-group>
                    <b-button class="mt-3 my-4 col-5 float-left" block type="submit" variant="primary">保 存
                    </b-button>
                    <b-button class="mt-3 my-4 col-5 float-right" block variant="primary"
                              @click="()=>{this.$refs['newItem'].hide(); this.newItem = {id:null,target:null,name:'',content:'',password:null}}">取 消
                    </b-button>
                </b-form>
            </div>
        </b-modal>
        <b-modal hide-footer centered  id="editItem" ref="editItem" title="编辑">
            <div>
                <b-form @submit="editItemSave" class="container pt-3">
                    <b-form-group id="input-group-1" label-for="name">
                        <b-form-input
                                v-model="editItem.name"
                                required
                                autocomplete="username"
                                placeholder="名称"
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group id="input-group-2" label-for="input-2">
                        <b-form-textarea
                                rows="3"
                                no-resize
                                v-model="editItem.content"
                                required
                                placeholder="备注"
                        ></b-form-textarea>
                    </b-form-group>
                    <b-button class="mt-3 my-4 col-5 float-left" block type="submit" variant="primary">保 存
                    </b-button>
                    <b-button class="mt-3 my-4 col-5 float-right" block variant="primary"
                              @click="()=>{this.$refs['editItem'].hide(); this.editItem = {id:null,target:null,name:'',content:'',password:null}}">取 消
                    </b-button>
                </b-form>
            </div>
        </b-modal>
    </div>
</template>

<script>
    import Loading from "@/components/loading/Loading";
    import _ from "lodash";
    import JQuery from "jquery";
    import DictionaryService from "@/services/dictionaryService";

    export default {
        name: "dictionary_index",
        components: {
            Loading,
        },
        created() {
            this.$nextTick(() => {
                this.getDicData();
            });
        },
        data() {
            return {
                queryParam: {
                    page: 1,
                    size: 5
                },
                queryDebounceParam: {
                    search: ""
                },
                dicData: {
                    company: [],
                    office: [],
                    job: [],
                    course: []
                },
                newItem: {
                    id: null,
                    target: null,
                    name: '',
                    content: ''
                },
                editItem: {
                    id: null,
                    target: null,
                    name: '',
                    content: ''
                }
            };
        },
        watch: {
            queryParam: {
                handler() {
                    this.getDicData();
                },
                deep: true
            },
            queryDebounceParam: {
                deep: true,
                handler: _.debounce(function () {
                    this.getDicData();
                }, 500)
            },
        },
        computed: {

        },
        methods: {
            getDicData() {
                this.run();
                DictionaryService
                    .getDicData({})
                    .then(data => {
                        this.dicData.company = data.results.company;
                        this.dicData.office = data.results.office;
                        this.dicData.job = data.results.job;
                        this.dicData.course = data.results.course;
                        this.$emit("data-ready");
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
            },
            cycled(target) {
                if ( JQuery('#'+target + ' svg:first').css( "transform" ) === 'none' ){
                    JQuery('#'+target + ' svg:first').css("transform","rotate(90deg)");
                } else {
                    JQuery('#'+target + ' svg:first').css("transform","" );
                }
            },
            newItemSave(evt) {
                evt.preventDefault();
                this.run();
                DictionaryService
                    .newItemSave(this.newItem)
                    .then(data => {
                        if (data.results === 'success') {
                            DictionaryService
                                .getDicData({})
                                .then(data => {
                                    this.dicData.company = data.results.company;
                                    this.dicData.office = data.results.office;
                                    this.dicData.job = data.results.job;
                                    this.dicData.course = data.results.course;
                                    this.$emit("data-ready");
                                    this.$refs['newItem'].hide();
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
            },
            editItemSave(evt) {
                evt.preventDefault();
                this.run();
                DictionaryService
                    .editItemSave(this.editItem)
                    .then(data => {
                        if (data.results === 'success') {
                            DictionaryService
                                .getDicData({})
                                .then(data => {
                                    this.dicData.company = data.results.company;
                                    this.dicData.office = data.results.office;
                                    this.dicData.job = data.results.job;
                                    this.dicData.course = data.results.course;
                                    this.$emit("data-ready");
                                    this.$refs['editItem'].hide();
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
            },
            deleteItemSave(id, target) {
                if (confirm('您确定要删除该吗?')){
                    this.run();
                    DictionaryService
                        .deleteItemSave({id:id, target:target})
                        .then(data => {
                            if (data.results === 'success') {
                                DictionaryService
                                    .getDicData({})
                                    .then(data => {
                                        this.dicData.company = data.results.company;
                                        this.dicData.office = data.results.office;
                                        this.dicData.job = data.results.job;
                                        this.dicData.course = data.results.course;
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
        }
    };
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
    .dictionary_index {
        .plusBtn {
            font-size: 13.8px !important;
            font-weight: bold;
            width: 20px;
            height: 20px;
            margin-top: 2px;
            float: right;
            padding: 0;
        }
        .cardDiv1 {
            padding: 15px;
            background-color: #007bff;
            color: white;
            margin: 8px 0;
            box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.2), 0 6px 25px 0 rgba(0, 0, 0, 0.19);
        }
        .align-items-center.d-flex.justify-content-between.list-group-item {
            padding: 7px 8px 7px 15px;
        }
        .subListItem {
            padding: 3px 8px 3px 30px !important;
            font-size: 16px !important;
            color: darkgrey !important;
        }
        .d-inline-flex.list-group.py-2 {
            width: 22%;
        }
        .cardDiv1.d-inline-flex.py-2 {
            width: 22%;
        }
        .cycle {
            -webkit-transition-duration: 0.3s;
            -moz-transition-duration: 0.3s;
            -o-transition-duration: 0.3s;
            transition-duration: 0.3s;
            -webkit-transition-property: -webkit-transform;
            -moz-transition-property: -moz-transform;
            -o-transition-property: -o-transform;
            transition-property: transform;
        }
        .btn-outline-primary {
            color: white;
            border-color: white;
        }
        .btn-outline-primary:hover {
            color: #c7dbffd9 !important;
            background-color: #007bff;
            border-color: #c7dbffba !important;
        }
    }
</style>