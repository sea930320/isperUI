<template>
    <div class="mt-5 wizard-1">
        <loading v-if="isRunning"></loading>
        <b-form v-if="[2,3,6,7].includes(userInfo.role)" @submit="savePage">
            <b-container fluid>
                <b-row align-v="start">
                    <b-modal centered hide-footer size="lg" id="selectFlowModal" ref="selectFlowModal" title="流程名称">
                        <div class="cardDiv">
                            <b-navbar toggleable="lg" class="theader">
                                <b-navbar-brand href="#">流 程</b-navbar-brand>
                                <b-collapse id="nav-collapse" is-nav>
                                    <!-- Right aligned nav items -->
                                    <b-navbar-nav class="ml-auto">
                                        <b-nav-form>
                                            <b-input-group :size="template_size">
                                                <b-input-group-prepend>
                                                    <span class="input-group-text">
                                                    <icon name="search"></icon>
                                                    </span>
                                                </b-input-group-prepend>
                                                <b-form-input v-model.lazy="queryDebounceParam.search"
                                                              placeholder="请输入内容"/>
                                            </b-input-group>
                                        </b-nav-form>
                                    </b-navbar-nav>
                                </b-collapse>
                            </b-navbar>
                            <b-table selectable :select-mode="selectMode" :items="workflows.list" hover
                                     :fields="columns" head-variant class="table-container" selectedVariant="primary"
                                     @row-selected="rowSelected">
                                <template slot="id" slot-scope="row">
                                    {{ row.item.id}}
                                </template>
                                <template slot="name" slot-scope="row">
                                    {{row.item.name}}
                                </template>
                                <template slot="convertedData" slot-scope="row">
                                    {{row.item.convertedData}}
                                </template>
                                <template slot="rend_ani_1" slot-scope="row">
                                    <a
                                            class="btn-link mx-1"
                                            href="javascript:"
                                            v-if="row.item.status !== 1"
                                            @click="viewXmlHandler(row.item)"
                                    >
                                        <icon name="eye"></icon>
                                    </a>
                                </template>
                            </b-table>
                        </div>
                        <b-row class="justify-content-center row-margin-tweak">
                            <b-pagination
                                    ref="pagination"
                                    :size="template_size"
                                    :total-rows="workflows.total"
                                    :per-page="queryParam.size"
                                    limit="5"
                                    v-model="queryParam.page"
                            ></b-pagination>
                        </b-row>
                    </b-modal>
                    <b-modal centered hide-footer size="xl" id="selectCourseModal" ref="selectCourseModal" title="关联课程">
                        <div class="cardDiv">
                            <b-col sm="4" class="mb-3">
                                <b-input-group :size="template_size">
                                    <b-input-group-prepend>
                                        <span class="input-group-text">
                                            <icon name="search"></icon>
                                        </span>
                                    </b-input-group-prepend>
                                    <b-form-input v-model.lazy="filterCourseText" placeholder="请输入内容"/>
                                </b-input-group>
                            </b-col>
                            <b-col sm="12">
                                <b-form-select v-model="project_data.course" @change="$refs['selectCourseModal'].hide()"
                                               :options="filteredCourse"></b-form-select>
                            </b-col>
                        </div>
                    </b-modal>
                    <b-col sm="12">
                        <b-container fluid>
                            <b-row align-v="center">
                                <b-col sm="6">
                                    <b-form-group
                                        id="fieldset-horizontal1"
                                        label-cols-sm="4"
                                        label-cols-lg="3"
                                        label="流程名称:"
                                        label-for="input-horizontal"
                                        class="text-left"
                                    >
                                        <b-form-input id="input-horizontal2" v-model="flow_name" required @focus="()=>{this.$refs['selectFlowModal'].show()}" v-if="is_edit === 0"></b-form-input>
                                        <b-form-input id="input-horizontal22" v-model="flow_name" required @focus="()=>{this.$refs['selectFlowModal'].show()}" v-else disabled></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="6">
                                    <b-form-group
                                        id="fieldset-horizontal3"
                                        label-cols-sm="4"
                                        label-cols-lg="3"
                                        label="项目名称:"
                                        label-for="input-horizontal"
                                        class="text-left"
                                    >
                                        <b-form-input id="input-horizontal" required oninvalid="this.setCustomValidity('这是必填栏')" oninput="this.setCustomValidity('')"
                                                      v-model="project_data.name"></b-form-input>
                                    </b-form-group>
                                </b-col>

                            </b-row>
                            <b-row align-v="center">
                                <b-col sm="6">
                                    <b-form-group
                                        id="fieldset-horizontal7"
                                        label-cols-sm="4"
                                        label-cols-lg="3"
                                        label="事务类型:"
                                        label-for="input-horizontal"
                                        class="text-left"
                                    >
                                        <b-form-input id="input-horizontal5" required oninvalid="this.setCustomValidity('这是必填栏')" oninput="this.setCustomValidity('')"
                                                      v-model="project_data.officeItem_name" disabled></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="6">
                                    <b-form-group
                                        id="fieldset-horizontal8"
                                        label-cols-sm="4"
                                        label-cols-lg="3"
                                        label="关联课程:"
                                        label-for="input-horizontal"
                                        class="text-left">
                                        <b-form-input id="input-horizontal8" required v-model="courseText" @focus="()=>{this.$refs['selectCourseModal'].show()}"></b-form-input>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <b-row align-v="center">
                                <b-col sm="6">
                                    <b-form-group
                                            id="fieldset-horizontal4"
                                            label-cols-sm="4"
                                            label-cols-lg="3"
                                            label="流程图完整显示:"
                                            class="text-left"
                                            label-for="input-horizontal"
                                    >
                                        <b-form-select v-model="project_data.entire_graph" required oninvalid="this.setCustomValidity('这是必填栏')" oninput="this.setCustomValidity('')"
                                                       :options="options_entire_graph"></b-form-select>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="6">
                                    <b-form-group
                                            id="fieldset-horizontal6"
                                            label-cols-sm="4"
                                            label-cols-lg="3"
                                            label="成果参考释放方式:"
                                            class="text-left"
                                            label-for="input-horizontal"
                                    >
                                        <b-form-select v-model="project_data.reference" required oninvalid="this.setCustomValidity('这是必填栏')" oninput="this.setCustomValidity('')"
                                                       :options="options_reference"></b-form-select>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <b-row align-v="center">
                                <b-col sm="6">
                                    <b-form-group
                                        id="fieldset-horizontal5"
                                        label-cols-sm="4"
                                        label-cols-lg="3"
                                        label="开放模式:"
                                        label-for="input-horizontal"
                                        class="text-left"
                                    >
                                        <b-form-select v-model="project_data.is_open" required oninvalid="this.setCustomValidity('这是必填栏')" oninput="this.setCustomValidity('')"
                                                       :options="options_is_open"></b-form-select>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="6">
                                    <b-form-group
                                            id="fieldset-horizontal111"
                                            label-cols-sm="4"
                                            label-cols-lg="3"
                                            label="目标部门:"
                                            class="text-left"
                                            v-if="[3, 7].includes(this.userInfo.role)"
                                            label-for="input-horizontal">
                                        <b-form-select v-model="use_to"
                                                       :options="this.use_to_list"></b-form-select>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <b-row align-v="center">
                                <b-col sm="6" v-if="project_data.is_open === 3">
                                    <b-form-group
                                            id="fieldset-horizontal9"
                                            label-cols-sm="4"
                                            label-cols-lg="3"
                                            label="限时:"
                                            label-for="input-horizontal"
                                            class="text-left">
                                        <b-row align-v="center">
                                            <div style="width: 42%;">
                                                <div class="form-date-control">
                                                    <b-form-input type="date" required oninvalid="this.setCustomValidity('这是必填栏')" oninput="this.setCustomValidity('')"
                                                                  v-model="project_data.start_time"></b-form-input>
                                                </div>
                                            </div>
                                            &emsp;&emsp;到&emsp;&emsp;
                                            <div style="width: 42%;">
                                                <div class="form-date-control">
                                                    <b-form-input type="date" required oninvalid="this.setCustomValidity('这是必填栏')" oninput="this.setCustomValidity('')"
                                                                  v-model="project_data.end_time"></b-form-input>
                                                </div>
                                            </div>
                                        </b-row>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="6" v-if="project_data.is_open === 4">
                                    <b-form-group
                                            id="fieldset-horizontal10"
                                            label-cols-sm="4"
                                            label-cols-lg="3"
                                            label="指定用户:"
                                            class="text-left"
                                            label-for="input-horizontal">
                                        <vue-tags-input
                                                style="max-width: 100%;"
                                                v-model="tag"
                                                :tags="target_users"
                                                :autocomplete-items="filteredItems"
                                                :add-only-from-autocomplete="true"
                                                :autocomplete-min-length="0"
                                                @tags-changed="newTags => target_users = newTags"
                                                placeholder="添加标签"/>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="6" v-if="project_data.is_open === 5">
                                    <b-form-group
                                            id="fieldset-horizontal11"
                                            label-cols-sm="4"
                                            label-cols-lg="3"
                                            label="指定部门/单位:"
                                            class="text-left"
                                            label-for="input-horizontal">
                                        <b-form-select v-model="target_parts" required oninvalid="this.setCustomValidity('这是必填栏')" oninput="this.setCustomValidity('')"
                                                       :options="this.allParts"></b-form-select>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col sm="12">
                                    <b-card header="项目简介（必填）" style="padding:0">
                                        <b-form-textarea
                                                v-model="project_data.intro"
                                                placeholder=""
                                                rows="5"
                                                max-rows="6"
                                                required oninvalid="this.setCustomValidity('这是必填栏')" oninput="this.setCustomValidity('')"
                                        ></b-form-textarea>
                                    </b-card>
                                </b-col>
                            </b-row>
                            <br>
                            <b-row>
                                <b-col sm="12">
                                    <b-card header="项目目的（必填）" style="padding:0">
                                        <b-form-textarea
                                                v-model="project_data.purpose"
                                                placeholder=""
                                                rows="5"
                                                max-rows="6"
                                                required oninvalid="this.setCustomValidity('这是必填栏')" oninput="this.setCustomValidity('')"
                                        ></b-form-textarea>
                                    </b-card>
                                </b-col>
                            </b-row>
                            <br>
                            <b-row>
                                <b-col sm="12">
                                    <b-card header="项目要求（必填）" style="padding:0">
                                        <b-form-textarea
                                                v-model="project_data.requirement"
                                                placeholder=""
                                                rows="5"
                                                max-rows="6"
                                                required oninvalid="this.setCustomValidity('这是必填栏')" oninput="this.setCustomValidity('')"
                                        ></b-form-textarea>
                                    </b-card>
                                </b-col>
                            </b-row>
                        </b-container>
                        <b-container fluid class="mt-4">
                            <b-row>
                                <b-col sm="4" align-v="center">
                                </b-col>
                                <b-col sm="4" align-v="center">
                                    <b-button-group class="float-center">
                                        <b-button size="lg" type="submit" style="width:100%" variant="primary">
                                            保 存
                                        </b-button>
                                    </b-button-group>
                                </b-col>
                                <b-col sm="4" align-v="center" v-if="project_id">
                                    <b-button-group class="float-center">
                                        <b-button size="lg" style="width:100%" variant="primary" @click="nextPage()">
                                            下一步
                                        </b-button>
                                    </b-button-group>
                                </b-col>
                            </b-row>
                        </b-container>
                    </b-col>
                </b-row>
            </b-container>
        </b-form>
        <b-form v-if="userInfo.role === 1">
            <div class="cardDiv">
                <b-container fluid>
                    <b-row>
                        <b-col sm="12">
                            <b-table :items="showProjectDataArray" small bordered responsive fixed hover
                                     :fields="columns1" head-variant class="table-container">
                                <template slot="name" slot-scope="row">
                                    {{row.item.title}}
                                </template>
                                <template slot="content" slot-scope="row">
                                    {{row.item.content}}
                                </template>
                            </b-table>
                        </b-col>
                    </b-row>
                </b-container>
            </div>
            <br><br>
            <b-row>
                <b-col sm="12" align-v="center">
                    <b-button-group class="float-center">
                        <b-button size="lg" type="submit" style="width:100%" variant="success" @click="firstPage()">
                            项目页
                        </b-button>
                    </b-button-group>
                </b-col>
            </b-row>
            <br><br>
        </b-form>
        <br><br>
        <view-xml :visible="xmlModalShow" :xml="workflowXml" @on-close="xmlModalShow = false"></view-xml>
    </div>
</template>

<script>
    import {expType, level, abilityTarget} from "@/filters/fun";
    import {mapState, mapActions} from "vuex";
    import Loading from "@/components/loading/Loading";
    import workflowService from "@/services/workflowService";
    import BContainer from "bootstrap-vue/src/components/layout/container";
    import ViewXml from "@/components/workflowXML/ViewXML";
    import _ from "lodash";
    import ProjectService from "@/services/projectService";
    import CourseService from "@/services/courseService";
    import VueTagsInput from '@johmun/vue-tags-input';

    export default {
        name: "wizard-1",
        components: {
            BContainer,
            Loading,
            VueTagsInput,
            ViewXml,
        },
        filters: {
            expType,
            level,
            abilityTarget
        },
        data() {
            return {
                tag: '',
                tags: [],
                allUsers: [],
                allParts: [],
                use_to_list: [],
                target_users: [],
                target_parts: null,
                use_to: null,
                courseText: '',
                filterCourseText: '',
                filteredCourse: [],
                columns: {
                    id: {
                        label: "序号",
                        sortable: false,
                        class: "text-center field-sn"
                    },
                    name: {
                        label: "流程名称",
                        sortable: false,
                        class: "text-center field-name"
                    },
                    convertedData: {
                        label: "实验类型",
                        sortable: false,
                        class: "text-center field-creator"
                    },
                    rend_ani_1: {
                        label: "检查",
                        sortable: false,
                        class: "text-center field-rend_ani_1"
                    },
                },
                showProjectDataArray: [],
                columns1: {
                    name: {
                        label: "项目",
                        sortable: false,
                        class: "field-30"
                    },
                    content: {
                        label: "内容",
                        sortable: false,
                        class: "field-70"
                    },
                },
                showProjectData: {},
                project_data: {},
                project_id: -1,
                is_edit: 0,
                flow_name: '',
                options_entire_graph: [
                    {value: 1, text: '完整显示'},
                    {value: 2, text: '逐步显示'},
                ],
                options_is_open: [
                    {value: 1, text: '自由'},
                    {value: 2, text: '不公开'},
                    {value: 3, text: '限时'},
                    {value: 4, text: '指定用户'},
                    {value: 5, text: '指定部门/单位'},
                ],
                options_reference: [
                    {value: 1, text: '同步'},
                    {value: 2, text: '后步'},
                    {value: 3, text: '最后'},
                ],
                options_course: [],
                savedBit: false,
                // 查询参数
                queryParam: {
                    status: '2',
                    page: 1,
                    size: 8,
                },
                workflows: {
                    list: [],
                    total: 0
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
                selectedFlowName: '',
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
                shareModal: false,
                selectedWorkflow: 0,
                selectMode: 'single',
                saveBtnClicked: 0,
                nextBtnClicked: 0,
                courses: {
                    list: [],
                    total: 0
                },
                experimentTypeOptions: []
            };
        },
        created() {
            this.$nextTick(() => {
                this.queryItemList();
                this.project_id = this.$route.params.project_id;

                if (this.userInfo.role === 1) {
                    this.queryProjectDetail();
                } else {
                    if (this.$route.params.is_edit) {
                        this.is_edit = this.$route.params.is_edit;
                        this.project_data = this.$route.params.currentProject;
                        this.courseText = this.$route.params.currentProject.course_name;
                        this.target_users = this.$route.params.currentProject.target_users;
                        this.target_parts = this.$route.params.currentProject.target_parts.value;
                        this.use_to = this.$route.params.currentProject.use_to.value;
                        this.flow_name = this.project_data.flow_name;
                        this.project_id = this.$route.params.project_id;
                    } else {
                        this.is_edit = this.$route.params.is_edit;
                        this.project_data = {
                            id: 0,
                            flow_id: 0,
                            name: '',
                            all_role: 0,
                            course: '',
                            reference: 1,
                            officeItem: 0,
                            officeItem_name: '',
                            public_status: 1,
                            level: 0,
                            entire_graph: 1,
                            can_redo: 0,
                            is_open: 1,
                            ability_target: 0,
                            intro: '',
                            purpose: '',
                            requirement: '',
                            start_time: '',
                            end_time: ''
                        };
                    }
                    this.queryWorkflowList(true);
                }


            });
        },
        computed: {
            ...mapState(["userInfo"]),
            filteredItems() { return this.allUsers.filter(i => {
                return i.text.toLowerCase().indexOf(this.tag.toLowerCase()) !== -1;
            })}
        },
        watch: {
            // 监控查询参数，如有变化 查询列表数据
            queryParam: {
                handler() {
                    this.queryWorkflowList(false);
                    this.queryItemList();
                },
                deep: true
            },
            queryDebounceParam: {
                deep: true,
                handler: _.debounce(function () {
                    this.queryWorkflowList(false);
                }, 500)
            },
            filterCourseText: {
                handler() {
                    this.filteredCourse = this.options_course.filter(item => item.text.indexOf(String(this.filterCourseText)) !== -1)
                },
                deep: true
            },
            'project_data.course': {
                handler() {
                    if (this.project_data.course !== '' && this.options_course.length !== 0) {
                        this.courseText = this.options_course.filter(item => item.value === this.project_data.course)[0].text
                    }
                },
                deep: true
            }
        },
        methods: {
            ...mapActions(["setFlowStep"]),
            updatePage: function (value) {
                this.$emit('input', value);
            },
            // 查询流程列表数据
            queryWorkflowList(firstRequest) {
                this.run();
                let flowData = firstRequest && this.$route.params.is_edit ? {flow_id: this.project_data.flow_id} : {};
                workflowService
                    .fetchList({...this.queryParam, ...this.queryDebounceParam, ...flowData})
                    .then(data => {
                        data.results.forEach(item => {
                            if (item.checked === undefined) {
                                item.checked = false;
                            }
                            if (item.locked === undefined) {
                                item.locked = false;
                            }
                        });
                        this.workflows.list = data.results;
                        if (this.is_edit === 1) {
                            for (let i = 0; i < this.workflows.list.length; i++) {
                                if (parseInt(this.workflows.list[i].id) === parseInt(this.project_data.flow_id)) {
                                    this.project_data.flow_name = this.workflows.list[i].name;
                                    this.flow_name = this.workflows.list[i].name;
//                                this.selectedFlowName = this.workflows.list[i].name;
                                    break
                                }
                            }
                        }
                        for (let i = 0; i < this.workflows.list.length; i++) {
                            for (let j = 0; j < this.experimentTypeOptions.length; j++) {
                                if (this.workflows.list[i].type_label === parseInt(this.experimentTypeOptions[j].value)) {
                                    this.workflows.list[i].convertedData = this.experimentTypeOptions[j].text;
                                    break
                                }
                            }
                        }
                        this.workflows.total = data.paging.count;
                        this.$emit("data-ready");
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                        this.$router.push('/manager/project');
                    });
            },
            // get All Course
            queryItemList() {
                this.run();
                CourseService
                    .getCourseList()
                    .then(data => {
                        this.options_course = data.results;
                        this.filteredCourse = this.options_course.filter(item => item.text.indexOf(String(this.filterCourseText)) !== -1)
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                        this.$router.push('/manager/project');
                    });
                ProjectService
                    .getAllUsers_AllParts()
                    .then(data => {
                        this.allUsers = data.users;
                        this.allParts = data.parts;
                        this.use_to_list = data.use_to_list;
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                        this.$router.push('/manager/project');
                    })
            },
            // Crate Project
            queryProjectCreate() {
                this.run();
                this.project_data.target_users = JSON.stringify(this.target_users.map(item=>item.id));
                this.project_data.target_parts = this.target_parts;
                this.project_data.use_to = this.use_to;
                ProjectService
                    .createProject(this.project_data)
                    .then((data) => {
                        this.$toasted.success('保存成功');
                        this.$emit("data-ready");
                        this.project_id = data.id;
                        this.project_data.id = data.id;
                        this.$emit('update', this.project_data);
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                        this.$router.push('/manager/project');
                    })
            },
            queryProjectUpdate() {
                this.run();
                this.project_data.target_users = JSON.stringify(this.target_users.map(item=>item.id));
                this.project_data.created_by = JSON.stringify(this.project_data.created_by);
                this.project_data.target_parts = this.target_parts;
                this.project_data.use_to = this.use_to;
                ProjectService
                    .updateProject(this.project_data)
                    .then(() => {
                        this.$toasted.success('保存成功');
                        this.$emit("data-ready");
//                  this.$router.push('/manager/project' );
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                        this.$router.push('/manager/project');
                    })
            },
            showBigImg(animation) {
                this.animationImgSrc = animation.url;
                this.bigImgModal = true;
            },
            viewXmlHandler(workflow) {
                this.workflowXml = workflow.xml;
                this.xmlModalShow = true;
            },
            rowSelected(items) {
                if (items.length > 0) {
                    this.selectedWorkflow = items[0].id;
                    this.project_data.flow_id = items[0].id;
                    this.project_data.flow_name = items[0].name;
                    this.project_data.officeItem = items[0].officeItem;
                    this.project_data.officeItem_name = items[0].officeItem_name;
                    this.flow_name = items[0].name;
                    this.$refs['selectFlowModal'].hide();

                } else {
                    this.selectedWorkflow = 0;
                    this.project_data.flow_id = 0;
                    this.project_data.flow_name = '';
                    this.flow_name = "";
                }
            },

            onSubmit(e) {
                e.preventDefault();
            },
            queryProjectDetail() {
                this.$emit("data-ready");
                ProjectService
                    .getProjectDetail({project_id: this.$route.params.project_id})
                    .then((data) => {
                        this.showProjectData = data;
                        this.showProjectDataArray = [
                            {'title': '项目名称', 'content': data.name},
                            {'title': '流程', 'content': data.flow_name},
                            {'title': '流程图完整显示', 'content': data.entire_graph === 1 ? '完整显示' : '逐步显示'},
                            {
                                'title': '开放模式',
                                'content': this.options_is_open.filter(item => item.value === data.is_open)[0].text
                            },
                            {
                                'title': '成果参考释放方式',
                                'content': this.options_reference.filter(item => item.value === data.reference)[0].text
                            },
                            {
                                'title': '事务类型',
                                'content': data.officeItem_name
                            },
                            {'title': '关联课程', 'content': ''},
                            {'title': '开发时段（开始时间）', 'content': data.start_time},
                            {'title': '开发时段（结束时间）', 'content': data.end_time},
                            {'title': '项目简介', 'content': data.intro},
                            {'title': '项目目的', 'content': data.purpose},
                            {'title': '项目要求', 'content': data.requirement}
                        ]
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                        this.$router.push('/manager/project');
                    })
            },
            firstPage() {
                this.$router.push('/manager/project');
            },
            nextPage() {
                this.nextBtnClicked = 1;
                this.saveBtnClicked = 0;
                if ((this.is_edit === 1) || ((this.is_edit === 0) && (this.savedBit))) {
                    this.updatePage(1);
                } else {
                    this.$toasted.error('请保存你的项目');
                }
            },
            savePage(evt) {
                evt.preventDefault();
                if (this.project_data.flow_name === undefined || this.project_data.flow_name === '')
                    alert('请选择流程名称');
                else {
                    this.nextBtnClicked = 0;
                    this.saveBtnClicked = 1;
                    if (this.is_edit === 1) {
                        this.queryProjectUpdate();
                        this.savedBit = true;
                    }
                    if (this.is_edit === 0) {
                        this.savedBit = true;
                        this.queryProjectCreate();
                    }
                }
            },
        }
    };
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
    .wizard-1 {
        .theader {
            background-color: #c7dbff;
        }

        .field-rend_ani_1 {
            width: 60px;
        }

        .field-sn {
            width: 60px;
        }

        .field-30 {
            width: 30% !important
        }

        .field-70 {
            width: 70% !important
        }

        .card-body {
            padding: 0;
        }

        .card-header {
            text-align: left;
        }

        .opened {
            background-color: yellow;
        }

        .table-container table {
            display: flex;
            flex-flow: column;
            height: 100%;
            width: 100%;
        }

        .table-container table thead {
            flex: 0 0 auto;
            width: 100%;
        }

        .table-container table tbody tr {
            width: 100%;
        }

        .table-container table thead, .table-container table tbody tr {
            display: table;
            table-layout: fixed;
        }

        .table-container table {
            border-collapse: collapse;
        }

        .table-container table td, .table-container table th {
            padding: 0.4em;
        }

        .table-container table td {
            border: 1px solid #e7e1e1;
            font-size: 0.85em;
            /* necessary to set for proper "showing row x of y" calculations if infinate scoll */
            white-space: nowrap;
            text-align: center;
            padding: 10px 5px;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        .table-container th {
            background-color: royalblue;
            color: white;
            cursor: pointer;
            -webkit-user-select: none;
            -moz-user-select: none !important;
            -ms-user-select: none;
            user-select: none;
        }

        .table-container table tbody td {
            padding: 8px;
            cursor: pointer;
        }

        .table-container table tbody tr:hover {
            background-color: rgba(168, 168, 239, .5);
        }

        .table-container table thead td {
            padding: 10px 5px;
        }

        /* START Adjustments for width and scrollbar hidden */
        .table-container th.table-action, .table-container td.table-action {
            width: 5.8vw;
        }

        .table-container table thead {
            width: calc(100% - 1px);
        }

        .table-container table tbody::-webkit-scrollbar {
            width: 1px;
        }

        .table-container table tbody::-webkit-scrollbar {
            width: 1px;
        }

        .table-container table tbody::-webkit-scrollbar-thumb {
            width: 1px;
        }

        .table-primary td {
            border: none;
        }

        .ti-autocomplete {
            max-height: 300px;
            overflow: overlay;
        }

        .col-form-label {
            text-align: left;
        }
        /* END Adjustments for width and scrollbar */
    }
</style>