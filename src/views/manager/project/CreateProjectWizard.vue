<template>
    <form-wizard @on-complete="onComplete"
                 shape="tab"
                 back-button-text="上一步"
                 next-button-text="下一步"
                 finish-button-text="保存"
                 color="#9b59b6">
        <tab-content title="基本属性">
            <b-container fluid>
                <b-row align-v="center">
                    <b-col sm="1" class="mb-5">
                        <label for="input1">Small:</label>
                    </b-col>
                    <b-col sm="3">
                        <b-form-input id="input1" placeholder="Enter your name"></b-form-input>
                    </b-col>

                    <b-col sm="1" class="mb-5">
                        <label>Small:</label>
                    </b-col>
                    <b-col sm="3">
                        <b-dropdown
                                variant="light"
                                text="test"
                                class="w-100">
                            <b-dropdown-item-button>Action</b-dropdown-item-button>
                            <b-dropdown-item-button>Another action</b-dropdown-item-button>
                            <b-dropdown-item-button>Something else here...</b-dropdown-item-button>
                        </b-dropdown>
                    </b-col>

                    <b-col sm="1" class="mb-5">
                        <label>Small:</label>
                    </b-col>
                    <b-col sm="3">
                        <b-dropdown
                                variant="light"
                                text="test"
                                class="w-100">
                            <b-dropdown-item-button>Action</b-dropdown-item-button>
                            <b-dropdown-item-button>Another action</b-dropdown-item-button>
                            <b-dropdown-item-button>Something else here...</b-dropdown-item-button>
                        </b-dropdown>
                    </b-col>
                </b-row>

                <b-row align-v="center">
                    <b-col sm="1" class="mb-5">
                        <label>Small:</label>
                    </b-col>
                    <b-col sm="3">
                        <b-dropdown
                                variant="light"
                                text="test"
                                class="w-100">
                            <b-dropdown-item-button>Action</b-dropdown-item-button>
                            <b-dropdown-item-button>Another action</b-dropdown-item-button>
                            <b-dropdown-item-button>Something else here...</b-dropdown-item-button>
                        </b-dropdown>
                    </b-col>

                    <b-col sm="1" class="mb-5">
                        <label>Small:</label>
                    </b-col>
                    <b-col sm="3">
                        <b-dropdown
                                variant="light"
                                text="test"
                                class="w-100">
                            <b-dropdown-item-button>Action</b-dropdown-item-button>
                            <b-dropdown-item-button>Another action</b-dropdown-item-button>
                            <b-dropdown-item-button>Something else here...</b-dropdown-item-button>
                        </b-dropdown>
                    </b-col>

                    <b-col sm="1" class="mb-5">
                        <label>Small:</label>
                    </b-col>
                    <b-col sm="3">
                        <b-dropdown
                                variant="light"
                                text="test"
                                class="w-100">
                            <b-dropdown-item-button>Action</b-dropdown-item-button>
                            <b-dropdown-item-button>Another action</b-dropdown-item-button>
                            <b-dropdown-item-button>Something else here...</b-dropdown-item-button>
                        </b-dropdown>
                    </b-col>
                </b-row>
                <b-row align-v="center">
                    <b-col sm="1" class="mb-5">
                        <label>Small:</label>
                    </b-col>
                    <b-col sm="4" class="mb-5">
                        <b-form-input type="date"></b-form-input>
                    </b-col>
                    <b-col sm="1" class="mb-5">
                        <label>---</label>
                    </b-col>
                    <b-col sm="4" class="mb-5">
                        <b-form-input type="date"></b-form-input>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col sm="12">
                        <b-card
                                header="TextArear1"
                                style="padding:0"
                        >
                            <b-form-textarea
                                    v-model="text"
                                    placeholder="Enter something..."
                                    rows="3"
                                    max-rows="6"
                            >
                            </b-form-textarea>
                        </b-card>
                    </b-col>
                </b-row>
                <br>
                <b-row>
                    <b-col sm="12">
                        <b-card
                                header="TextArear1"
                                style="padding:0"
                        >
                            <b-form-textarea
                                    v-model="text"
                                    placeholder="Enter something..."
                                    rows="3"
                                    max-rows="6"
                            >
                            </b-form-textarea>
                        </b-card>
                    </b-col>
                </b-row>
                <br>
                <b-row>
                    <b-col sm="12">
                        <b-card
                                header="TextArear1"
                                style="padding:0"
                        >
                            <b-form-textarea
                                    v-model="text"
                                    placeholder="Enter something..."
                                    rows="3"
                                    max-rows="6"
                            >
                            </b-form-textarea>
                        </b-card>
                    </b-col>
                </b-row>
            </b-container>
        </tab-content>
        <tab-content title="环节及身份配置">
            <b-alert variant="success" show>Success Alert</b-alert>
            <b-container>
                <b-row>
                    <b-col sm="4" class="subtable_div">
                        <b-table :items="table1.list" small striped hover :fields="table_1" head-variant class="subtable">
                            <template slot="field_1" slot-scope="row">
                                {{ row.index + 1 }}
                            </template>
                            <template slot="field_2" slot-scope="row">
                                {{row.item.field_2}}
                            </template>
                            <template slot="field_3" slot-scope="row">
                                {{row.item.field_3}}
                            </template>

                            <template slot="field_4" slot-scope="row">
                                <b-form-checkbox></b-form-checkbox>
                            </template>
                        </b-table>
                    </b-col>

                    <b-col sm="8" class="subtable_div">
                        <b-table :items="table2.list" small striped hover :fields="table_2" head-variant class="subtable">
                            <template slot="field_1" slot-scope="row">
                                {{ row.index + 1 }}
                            </template>
                            <template slot="field_2" slot-scope="row">
                                {{row.item.field_2}}
                            </template>
                            <template slot="field_3" slot-scope="row">
                                {{row.item.field_3}}
                            </template>

                            <template slot="field_4" slot-scope="row">
                                <b-form-checkbox></b-form-checkbox>
                            </template>
                            <template slot="field_5" slot-scope="row">
                                <b-form-checkbox></b-form-checkbox>
                            </template>
                            <template slot="field_6" slot-scope="row">
                                <b-form-checkbox></b-form-checkbox>
                            </template>
                        </b-table>
                    </b-col>
                </b-row>
            </b-container>
        </tab-content>
        <tab-content title="素材设置">
            <b-alert variant="success" show>Success Alert</b-alert>
            <b-container>
                <b-row>
                    <b-col sm="6"  class="subtable_div">
                        <b-table :items="table3.list" small striped hover :fields="table_3" head-variant class="subtable">
                            <template slot="field_1" slot-scope="row">
                                {{ row.index + 1 }}
                            </template>
                            <template slot="field_2" slot-scope="row">
                                {{row.item.field_2}}
                            </template>
                            <template slot="field_3" slot-scope="row">
                                {{row.item.field_3}}
                            </template>
                            <template slot="field_3" slot-scope="row">
                                {{row.item.field_3}}
                            </template>
                        </b-table>
                    </b-col>
                    <b-col sm="3" class="subtable_div">
                        <b-table :items="table4.list" small striped hover :fields="table_4" head-variant class="subtable">
                            <template slot="field_1" slot-scope="row">
                                {{ row.index + 1 }}
                            </template>
                            <template slot="field_2" slot-scope="row">
                                {{row.item.field_2}}
                            </template>
                        </b-table>
                    </b-col>

                    <b-col sm="3" class="subtable_div">
                        <b-table :items="table5.list" small striped hover :fields="table_5" head-variant class="subtable">
                            <template slot="field_1" slot-scope="row">
                                {{ row.item.field_1}}
                            </template>
                            <template slot="field_2" slot-scope="row">
                                {{row.item.field_2}}
                            </template>
                            <template slot="field_3" slot-scope="row">
                                <b-form-checkbox></b-form-checkbox>
                            </template>
                        </b-table>
                    </b-col>
                </b-row>
            </b-container>
        </tab-content>
        <tab-content title="跳转/嵌套设置">
            <b-container>
                <b-row>
                    <b-col sm="6">
                        <b-row>
                            <b-col sm="12">
                                <b-table :items="table5.list" small striped hover :fields="table_5" head-variant class="subtable">
                                    <template slot="field_1" slot-scope="row">
                                        {{ row.item.field_1}}
                                    </template>
                                    <template slot="field_2" slot-scope="row">
                                        {{row.item.field_2}}
                                    </template>
                                    <template slot="field_3" slot-scope="row">
                                        <b-form-checkbox></b-form-checkbox>
                                    </template>
                                </b-table>
                            </b-col>
                        </b-row>
                    </b-col>
                    <b-col sm="6">
                        <b-row>
                            <b-col sm="12">
                                <b-card
                                        header="TextArear1"
                                        style="padding:0"
                                >
                                    <b-form-textarea
                                            v-model="text"
                                            placeholder="Enter something..."
                                            rows="3"
                                            max-rows="6"
                                    >
                                    </b-form-textarea>
                                </b-card>
                            </b-col>
                        </b-row>
                        <br>
                        <b-row>
                            <b-col sm="12">
                                <b-table :items="table5.list" small striped hover :fields="table_5" head-variant class="subtable">
                                    <template slot="field_1" slot-scope="row">
                                        {{ row.item.field_1}}
                                    </template>
                                    <template slot="field_2" slot-scope="row">
                                        {{row.item.field_2}}
                                    </template>
                                    <template slot="field_3" slot-scope="row">
                                        <b-form-checkbox></b-form-checkbox>
                                    </template>
                                </b-table>
                            </b-col>
                        </b-row>
                    </b-col>
                </b-row>
            </b-container>
        </tab-content>
    </form-wizard>

</template>

<script>
    import { expType, level, abilityTarget } from "@/filters/fun";
    import { mapState } from "vuex";
    import Loading from "@/components/loading/Loading";
    import ProjectService from "@/services/projectService";
    import imageView from "@/components/imageView/imageView";
    import _ from "lodash";
    // import arrayUtils from "@/utils/arrayUtils";
    import dateUtils from "@/utils/dateUtils";
    import BContainer from "bootstrap-vue/src/components/layout/container";

    export default {
        name: "create-project-wizard",
        components: {
            BContainer,
            Loading,
            imageView
        },
        filters: {
            expType,
            level,
            abilityTarget
        },
        data() {
            return {
                table_1: {
                    field_1:{
                        label: "field_1",
                        sortable: false,
                        class: "text-center field-sn"
                    },
                    field_2: {
                        label: "field_2",
                        sortable: false,
                        class: "text-center field-sn"
                    },
                    field_3:{
                        label: "field_3",
                        sortable: false,
                        class: "text-center field-sn"
                    },
                    field_4: {
                        label: "field_4",
                        sortable: false,
                        class: "text-center field-name"
                    }
                },
                table_2: {
                    field_1:{
                        label: "field_1",
                        sortable: false,
                        class: "text-center field-sn"
                    },
                    field_2: {
                        label: "field_2",
                        sortable: false,
                        class: "text-center field-sn"
                    },
                    field_3:{
                        label: "field_3",
                        sortable: false,
                        class: "text-center field-sn"
                    },
                    field_4: {
                        label: "field_4",
                        sortable: false,
                        class: "text-center field-name"
                    },
                    field_5: {
                        label: "field_5",
                        sortable: false,
                        class: "text-center field-name"
                    },
                    field_6: {
                        label: "field_6",
                        sortable: false,
                        class: "text-center field-name"
                    }
                },
                table_3: {
                    field_1:{
                        label: "field_1",
                        sortable: false,
                        class: "text-center field-sn"
                    },
                    field_2: {
                        label: "field_2",
                        sortable: false,
                        class: "text-center field-sn"
                    },
                    field_3:{
                        label: "field_3",
                        sortable: false,
                        class: "text-center field-sn"
                    },
                    field_4: {
                        label: "field_4",
                        sortable: false,
                        class: "text-center field-name"
                    }
                },
                table_4: {
                    field_1:{
                        label: "field_1",
                        sortable: false,
                        class: "text-center field-sn"
                    },
                    field_2: {
                        label: "field_2",
                        sortable: false,
                        class: "text-center field-sn"
                    }
                },
                table_5: {
                    field_1:{
                        label: "field_1",
                        sortable: false,
                        class: "text-center field-sn"
                    },
                    field_2: {
                        label: "field_2",
                        sortable: false,
                        class: "text-center field-sn"
                    },
                    field_3:{
                        label: "field_3",
                        sortable: false,
                        class: "text-center field-sn"
                    }
                },
                // 查询参数
                queryParam: {
                    status: "",
                    page: 1,
                    size: 5
                },
                queryDebounceParam: {
                    search: ""
                },
                // 流程列表
                table1: {
                    list: [],
                    total: 0
                },
                table2: {
                    list: [],
                    total: 0
                },
                table3: {
                    list: [],
                    total: 0
                },
                table4: {
                    list: [],
                    total: 0
                },
                table5: {
                    list: [],
                    total: 0
                },
                // 流程相关项目
                relatedProjects: [],
                animationImgSrc: "",
                copyModalName: "",
                workflowXml: null,
                deleteModal: false,
                publishModal: false,
                copyModal: false,
                bigImgModal: false,
                newFlowStatus: false,
                xmlModalShow: false,
                relatedShow: false,
                isSuperFlag: false,
                shareModal: false,
                experimentTypeOptions: [
                    { value: "1", text: "立法类型实验" },
                    { value: "2", text: "执法类型实验" },
                    { value: "3", text: "诉讼与仲裁实验" },
                    { value: "4", text: "自由类型实验" },
                    { value: "5", text: "非诉讼与法务管理类型实验" },
                    { value: "6", text: "法律思维类型实验" },
                    { value: "7", text: "证据科学类型实验" },
                    { value: "8", text: "法律实效评价类型实验" }
                ],
            };
        },
        created() {
            this.$nextTick(() => {
                this.loading_table_1();
            });
        },
        computed: {
            ...mapState(["userInfo"])
        },
        watch: {
            // 监控查询参数，如有变化 查询列表数据
            queryParam: {
                handler() {
                    this.queryProjectList();
                },
                deep: true
            },
            queryDebounceParam: {
                deep: true,
                handler: _.debounce(function() {
                    this.queryProjectList();
                }, 500)
            }
        },
        methods: {
            // 查询流程列表数据
            onComplete: function(){
                alert('Yay. Done!');
            },
            loading_table_1() {
                this.run();
//                ProjectService
//                    .getProjectList({ ...this.queryParam, ...this.queryDebounceParam })
//                    .then(data => {
//                        data.results.forEach(item => {
//                            if (item.checked === undefined) {
//                                item.checked = false;
//                            }
//                            if (item.locked === undefined) {
//                                item.locked = false;
//                            }
//                        });
//                        this.projects.list = data.results;
//                        this.projects.total = data.paging.count;
//                        this.$emit("data-ready");
//                    })
//                    .catch(() => {
//                        this.$emit("data-failed");
//                    });
                this.table1.list=[
                    {
                        field_2:"field2_1",
                        field_3:"field1_1"
                    },
                    {
                        field_2:"field2_2",
                        field_3:"field1_2"
                    },
                    {
                        field_2:"field2_3",
                        field_3:"field1_3"
                    },
                ];
                this.table2.list=[
                    {
                        field_2:"field2_1",
                        field_3:"field1_1"
                    },
                    {
                        field_2:"field2_2",
                        field_3:"field1_2"
                    },
                    {
                        field_2:"field2_3",
                        field_3:"field1_3"
                    },
                ];
                this.table3.list=[
                    {
                        field_2:"field2_1",
                        field_3:"field1_1"
                    },
                    {
                        field_2:"field2_2",
                        field_3:"field1_2"
                    },
                    {
                        field_2:"field2_3",
                        field_3:"field1_3"
                    },
                ];
                this.table4.list=[
                    {
                        field_1:"field2_1",
                        field_2:"field1_1"
                    },
                    {
                        field_1:"field2_2",
                        field_2:"field1_2"
                    },
                    {
                        field_1:"field2_3",
                        field_2:"field1_3"
                    },
                ];
                this.table5.list=[
                    {
                        field_1:"field2_1",
                        field_2:"field1_1"
                    },
                    {
                        field_1:"field2_2",
                        field_2:"field1_2"
                    },
                    {
                        field_1:"field2_3",
                        field_2:"field1_3"
                    },
                ]
            },

            // 查看渲染动画的大图
            showBigImg(animation) {
                this.animationImgSrc = animation.url;
                this.bigImgModal = true;
            },

//            Go To Crate Project Page
            createProjectPage(){
                this.$router.push('/manager/project/create_project_wizard');
            },
        }
    };
</script>
<style>
    .card-body{
        padding:0
    }
    .card-header{
        text-align:left
    }
</style>