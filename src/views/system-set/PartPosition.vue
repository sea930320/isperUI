<template>
    <div class="part_position row pb-5">
        <loading v-if="isRunning"></loading>
        <b-col class="col-3">
            <div class="float-left mt-3">
                <b-button variant="outline-primary" class="styledBtn" style="margin-left: 0 !important;" v-b-modal.newItem @click="()=>{newItem={id:null,target:1,name:''}}">新增部门</b-button>
            </div>
            <div class="cardDiv float-left mt-3 w-100">
                <b-list-group class="d-inline-flex w-100">
                    <template v-for="part in partPositionData" :newItem="this.newItem" :editItem="this.editItem">
                        <b-list-group-item class="cardDiv1 d-flex justify-content-between align-items-center" :key="'item1-'+part.id" :id="'item1-' + part.id" v-b-toggle="'collapse1-'+part.id" @click="()=>{cycled('item1-'+part.id);getPartUsers(part.id);}">
                            <icon name="angle-right" class="mr-auto cycle"></icon>
                            {{part.name}}
                            <div class="ml-auto">
                                <b-button variant="light" class="partBtn mr-2" style="padding: 0px 7px" v-b-modal.newItem @click="()=>{newItem={id:part.id,target:2,name:''}}"><icon name="plus" style="width: 10px;color: grey"></icon></b-button>
                                <b-button variant="light" class="partBtn" style="padding: 0px 7px;" @click="deleteItemSave(part.id,1)"><icon name="trash" style="width: 10px;color: grey"></icon></b-button>
                            </div>
                        </b-list-group-item>
                        <b-collapse :id="'collapse1-'+part.id" :key="'collapse1-'+part.id">
                            <b-list-group class="d-inline-flex w-100" v-if="part.positions.length > 0">
                                <b-list-group-item class="positionitem d-flex justify-content-between align-items-center subListItem" v-for="position in part.positions" :key="'position'+position.sid">
                                    {{position.sname}}
                                    <div class="ml-auto">
                                        <b-button variant="light" style="padding: 0px 7px;" @click="deleteItemSave(position.sid,2)"><icon name="trash" style="width: 10px;color: grey"></icon></b-button>
                                    </div>
                                </b-list-group-item>
                            </b-list-group>
                        </b-collapse>
                    </template>
                </b-list-group>
            </div>
        </b-col>
        <b-col class="col-9">
            <b-row class="pt-4">
                部门内职务人员
                <div class="cardDiv w-100 mt-3">
                    <b-table :items="selectedPartUsers" small hover :fields="columns" head-variant style="fontSize: 18px">
                        <template slot="id" slot-scope="row">{{ row.item.id }}</template>
                        <template slot="name" slot-scope="row"><span class="text">{{row.item.name}}</span></template>
                        <template slot="part" slot-scope="row">{{row.item.part ? row.item.part : ''}}</template>
                        <template slot="company" slot-scope="row">{{row.item.company ? row.item.company : ''}}</template>
                        <template slot="action" slot-scope="row">
                            <b-form-select class="col-9" v-model="row.item.newPP">
                                <optgroup v-for="part in partPositionData" :key="part.id" :label="part.name">
                                    <option v-for="pos in part.positions" :key="pos.sid" :value="pos.sid">{{pos.sname}}</option>
                                </optgroup>
                            </b-form-select>
                            <b-button class="styledBtn fontedBtn" :key="row.item.id" :size="template_size" variant="outline-primary" @click="setPP(row.item.id,1)">
                                确定
                            </b-button>
                        </template>
                    </b-table>
                </div>
            </b-row>
            <b-row class="mt-2">
                部门外职务人员
                <b-row class="col-4 ml-auto">
                    <b-form-select v-model="selectedPP" style="width: 72%;">
                        <optgroup v-for="part in partPositionData" :key="part.id" :label="part.name">
                            <option v-for="pos in part.positions" :key="pos.sid" :value="pos.sid">{{pos.sname}}</option>
                        </optgroup>
                    </b-form-select>
                    <b-button class="styledBtn fontedBtn" variant="outline-primary" @click="setPP(selected,3)">
                        批量确定
                    </b-button>
                </b-row>
                <div class="cardDiv w-100 mt-3">
                    <b-table :items="nonPPusers" small hover :fields="noncolumns" head-variant style="fontSize: 18px">
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
                        <template slot="name" slot-scope="row"><span class="text">{{row.item.name}}</span></template>
                        <template slot="part" slot-scope="row">{{row.item.part ? row.item.part : ''}}</template>
                        <template slot="company" slot-scope="row">{{row.item.company ? row.item.company : ''}}</template>
                        <template slot="action" slot-scope="row">
                            <b-form-select class="col-9" v-model="row.item.newPP">
                                <optgroup v-for="part in partPositionData" :key="part.id" :label="part.name">
                                    <option v-for="pos in part.positions" :key="pos.sid" :value="pos.sid">{{pos.sname}}</option>
                                </optgroup>
                            </b-form-select>
                            <b-button class="styledBtn fontedBtn" :key="row.item.id" :size="template_size" variant="outline-primary" @click="setPP(row.item.id,2)">
                                确定
                            </b-button>
                        </template>
                    </b-table>
                </div>
            </b-row>
        </b-col>
        <b-modal hide-footer centered  id="newItem" ref="newItem" title="添加">
            <div>
                <b-form @submit="newItemSave" class="container pt-3">
                    <b-form-group id="input-group-7" label-for="name">
                        <b-form-input
                                v-model="newItem.name"
                                required
                                autocomplete="username"
                                placeholder="名称"
                                v-if="newItem.target === 1"
                        ></b-form-input>
                        <b-form-input
                                v-model="newItem.name"
                                required
                                autocomplete="username"
                                placeholder="名称"
                                list="my-list-id"
                                v-if="newItem.target === 2"
                        ></b-form-input>
                        <datalist id="my-list-id" v-if="newItem.target === 2">
                            <option v-for="jobType in jobTypes" :key="jobType">{{ jobType }}</option>
                        </datalist>
                    </b-form-group>
                    <b-button class="mt-3 my-4 col-5 float-left" block type="submit" variant="primary">保 存
                    </b-button>
                    <b-button class="mt-3 my-4 col-5 float-right" block variant="primary"
                              @click="()=>{this.$refs['newItem'].hide(); this.newItem = {id:null,target:null,name:''}}">取 消
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
    import PartPositionService from "@/services/partpositionService";
    import DictionaryService from "@/services/dictionaryService";

    export default {
        name: "part_position",
        components: {
            Loading,
        },
        created() {
            this.$nextTick(() => {
                this.getPartPositionData();
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
                jobTypes: [],
                currentSelect: null,
                selected: [],
                selectedPP: null,
                partPositionData: [],
                selectedPartUsers: [],
                nonPPusers: [],
                newItem: {
                    id: null,
                    target: null,
                    name: '',
                },
                columns: {
                    id: {
                        label: "序号",
                        sortable: false,
                        class: "text-center field-id"
                    },
                    name: {
                        label: "人员姓名",
                        sortable: false,
                        class: "text-center field-name"
                    },
                    part: {
                        label: "部门名称",
                        sortable: false,
                        class: "text-center field-part"
                    },
                    position: {
                        label: "职务类型",
                        sortable: false,
                        class: "text-center field-position"
                    },
                    action: {
                        label: "操作",
                        sortable: false,
                        class: "text-center field-action"
                    }
                },
                noncolumns: {
                    check: {
                        label: "",
                        sortable: false,
                        class: "text-center field-check"
                    },
                    id: {
                        label: "序号",
                        sortable: false,
                        class: "text-center field-id"
                    },
                    name: {
                        label: "人员姓名",
                        sortable: false,
                        class: "text-center field-name"
                    },
                    part: {
                        label: "部门名称",
                        sortable: false,
                        class: "text-center field-part"
                    },
                    position: {
                        label: "职务类型",
                        sortable: false,
                        class: "text-center field-position"
                    },
                    action: {
                        label: "操作",
                        sortable: false,
                        class: "text-center field-action"
                    }
                },
            };
        },
        watch: {
            queryParam: {
                handler() {
                    this.getPartPositionData();
                },
                deep: true
            },
            queryDebounceParam: {
                deep: true,
                handler: _.debounce(function () {
                    this.getPartPositionData();
                }, 500)
            },
        },
        computed: {

        },
        methods: {
            getPartPositionData() {
                this.run();
                PartPositionService
                    .getPartPositionData({})
                    .then(data => {
                        this.partPositionData = data.results;
                        PartPositionService
                            .getNonPPUsers({})
                            .then(data => {
                                this.nonPPusers = data.results;
                                this.$emit("data-ready");
                            })
                            .catch(() => {
                                this.$emit("data-failed");
                            });
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
                DictionaryService
                    .getDicData({})
                    .then(data => {
                        this.jobTypes = data.results.job
                    })
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
                PartPositionService
                    .newPPSave(this.newItem)
                    .then(data => {
                        if (data.results === 'success') {
                            PartPositionService
                                .getPartPositionData({})
                                .then(data => {
                                    this.partPositionData = data.results;
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
                PartPositionService
                    .editItemSave(this.editItem)
                    .then(data => {
                        if (data.results === 'success') {
                            PartPositionService
                                .getPartPositionData({})
                                .then(data => {
                                    this.partPositionData = data.results;
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
                    PartPositionService
                        .deletePPSave({id:id, target:target})
                        .then(data => {
                            if (data.results === 'success') {
                                PartPositionService
                                    .getPartPositionData({})
                                    .then(data => {
                                        this.partPositionData = data.results;
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
            },
            getPartUsers(id) {
                this.currentSelect = id;
                this.run();
                PartPositionService
                    .getPartUsers({id:id})
                    .then(data => {
                        this.selectedPartUsers = data.results;
                        this.$emit("data-ready");
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
            },
            setPP(target,set) {
                this.run();
                let newPP = null;
                if (set === 1) {
                    newPP = this.selectedPartUsers.filter(item => item.id === target)[0].newPP;
                    target = [target];
                }
                else if (set === 2) {
                    newPP = this.nonPPusers.filter(item => item.id === target)[0].newPP;
                    target = [target];
                }
                else if (set === 3) {
                    newPP = this.selectedPP;
                }
                PartPositionService
                    .setNewPP({id:JSON.stringify(target), newPP:newPP})
                    .then(data => {
                        if (data.results === 'success') {
                            PartPositionService
                                .getNonPPUsers({})
                                .then(data => {
                                    this.nonPPusers = data.results;
                                    PartPositionService
                                        .getPartUsers({id:this.currentSelect})
                                        .then(data => {
                                            this.selectedPartUsers = data.results;
                                            this.selectedPP = null;
                                            this.selected = [];
                                            this.$emit("data-ready");
                                        })
                                        .catch(() => {
                                            this.$emit("data-failed");
                                        });
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
    .part_position {
        .partBtn {
            background-color: transparent;
            border-radius: 20px;
            border-color: #ffffff59;
            svg {
                color: #ffffff59 !important;
            }
        }
        .partBtn:hover {
            border-color: white;
            svg {
                color: white !important;
            }
        }
        .cardDiv1 {
            color: white;
            border-radius: 0px !important;
            background-color: royalblue;
            border-style: none;
        }
        .align-items-center.d-flex.justify-content-between.list-group-item {
            padding: 7px 8px 7px 15px;
        }
        .subListItem {
            padding: 3px 8px 3px 30px !important;
            font-size: 16px !important;
            color: darkslategrey !important;
        }
        .subListItem:hover {
            background-color: #4169e14a;
            color: white !important;
            button {
                background-color: transparent;
                svg {
                    color: white !important;
                }
            }
        }
        .d-inline-flex.list-group.py-2 {
            width: 22%;
        }
        .positionitem {
            border-radius: 0px !important;
            border-style: none;
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
        }.field-check {
             width: 3%;
             padding-top: 11px;
             text-align: right !important;
         }
        .field-id {
            width: 9%;
            text-align: center !important;
        }
        .field-name {
            width: 10%;
            text-align: left !important;
        }
        .field-part {
            width: 15%;
            text-align: left !important;
        }
        .field-position {
            width: 15%;
            text-align: left !important;
        }
        .field-action {
            width: 20%;
            text-align: left !important;
        }
    }
</style>