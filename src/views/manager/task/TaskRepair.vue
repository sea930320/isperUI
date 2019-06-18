<template>
    <div class="task-index" v-if="userInfo">
        <loading v-if="isRunning"></loading>
        <b-row class="cardDiv">
            <b-col lg="3" md="6" sm="12">
                <b-input-group :size="template_size">
                    <b-input-group-prepend>
                        <span class="input-group-text">
                            <icon name="search"></icon>
                        </span>
                    </b-input-group-prepend>
                    <b-form-input v-model.lazy="queryDebounceParam.search" placeholder="请输入内容"/>
                </b-input-group>
            </b-col>
            <b-col lg="9" md="6" sm="12" class="align-self-center">
                <b-button-group class="float-right" v-if="!isSuperFlag">
                    <b-button
                        :size="template_size"
                        class="styledBtn"
                        variant="outline-primary"
                        @click="publicProcess"
                        v-if="isActionAllowed('code_workflow_management', 'code_public_unpublic_workflow')"
                    >公开</b-button>
                    <b-button
                        :size="template_size"
                        class="styledBtn"
                        variant="outline-primary"
                        @click="unpublicProcess"
                        v-if="isActionAllowed('code_workflow_management', 'code_public_unpublic_workflow')"
                    >不公开</b-button>
                    <b-button
                        :size="template_size"
                        class="styledBtn"
                        variant="outline-primary"
                        @click="newProcess"
                        v-if="isActionAllowed('code_workflow_management', 'code_create_workflow')"
                    >新建流程</b-button>
                    <b-button
                        class="styledBtn"
                        :size="template_size"
                        variant="outline-primary"
                        @click="publishWorkflowClick"
                        v-if="isActionAllowed('code_workflow_management', 'code_publish_workflow')"
                    >发布流程</b-button>
                    <b-button
                        class="styledBtn"
                        :size="template_size"
                        variant="outline-primary"
                        @click="copyWorkflowClick"
                        v-if="isActionAllowed('code_workflow_management', 'code_clone_workflow')"
                    >复制为未发布流程</b-button>
                    <b-button
                        :size="template_size"
                        class="styledBtn"
                        variant="outline-primary"
                        @click="shareClick"
                        v-if="isActionAllowed('code_workflow_management', 'code_share_unshare_workflow')"
                    >共享</b-button>
                    <b-button
                        :size="template_size"
                        class="styledBtn"
                        variant="outline-primary"
                        @click="unshareClick"
                        v-if="isActionAllowed('code_workflow_management', 'code_share_unshare_workflow')"
                    >取消共享</b-button>
                </b-button-group>
            </b-col>
        </b-row>
        <div class="cardDiv">
            <b-table :items="workflows.list" small hover :fields="columns" head-variant>
                <template slot="HEAD_sn" slot-scope="head">
                    <b-form-checkbox v-model="allChecked">{{head.label}}</b-form-checkbox>
                </template>
                <template slot="sn" slot-scope="row">
                    <b-form-checkbox v-model="row.item.checked">{{ row.index + 1 }}</b-form-checkbox>
                </template>
                <template slot="share" slot-scope="row">
                    <span v-if="row.item.is_share==1" class="badge badge-success">
                        <icon scale="0.6" name="share"></icon>
                    </span>
                </template>
                <template slot="name" slot-scope="row">
                    <input
                        v-if="row.item.edited"
                        type="text"
                        class="inp-edit"
                        v-model.trim="row.item.name"
                    >
                    <span v-else class="text">{{row.item.name}}</span>
                </template>
                <template
                    slot="creator"
                    slot-scope="row"
                >{{row.item.created_by ? row.item.created_by.name || row.item.created_by.username : 'n/a'}}</template>
                <template slot="create_time" slot-scope="row">{{row.item.create_time}}</template>
                <template slot="rend_ani_1" slot-scope="row">
                    <a
                        href="javascript:;"
                        class="btn-link"
                        v-if="isActionAllowed('code_workflow_management', 'code_view_workflow') && !row.item.edited"
                        title="点击查看大图"
                        @click="showBigImg(row.item.animation1)"
                    >
                        <icon name="eye"></icon>
                    </a>
                    <div
                        v-else-if="isActionAllowed('code_workflow_management', 'code_view_workflow')"
                    >
                        <toggle-upload :item="row.item" @uploadSuccess="uploadAnimationSuccess"></toggle-upload>
                    </div>
                </template>
                <template slot="rend_ani_2" slot-scope="row">
                    <a
                        href="javascript:;"
                        class="btn-link"
                        v-if="isActionAllowed('code_workflow_management', 'code_view_workflow') && !row.item.edited"
                        title="点击查看大图"
                        @click="showBigImg(row.item.animation2)"
                    >
                        <icon name="eye"></icon>
                    </a>
                    <div
                        v-else-if="isActionAllowed('code_workflow_management', 'code_view_workflow')"
                    >
                        <toggle-upload
                            :item="row.item"
                            :keyId="2"
                            @uploadSuccess="uploadAnimationSuccess"
                        ></toggle-upload>
                    </div>
                </template>
                <template slot="experiment_type_label" slot-scope="row">
                    <b-form-select
                        v-if="row.item.edited"
                        v-model="row.item.type_label"
                        :options="experimentTypeOptions"
                    ></b-form-select>
                    <span v-else class="text">{{ row.item.type_label | expType}}</span>
                </template>
                <template slot="experiment_task_label" slot-scope="row">
                    <b-form-input v-if="row.item.edited" type="text" v-model="row.item.task_label"/>
                    <span v-else class="text">{{row.item.task_label}}</span>
                </template>
                <template slot="status" slot-scope="row">
                    <span class="badge badge-danger" v-if="row.item.status==1">未发布</span>
                    <span
                        class="badge badge-info"
                        v-if="row.item.status==2 && row.item.is_public==0"
                    >已发布</span>
                    <span
                        class="badge badge-success"
                        v-if="row.item.status==2 && row.item.is_public==1"
                    >已公开</span>
                </template>
                <template slot="action" slot-scope="row">
                    <a
                        class="btn-link mx-1"
                        href="javascript:;"
                        v-if="isActionAllowed('code_workflow_management', 'code_edit_workflow') && row.item.edited && row.item.created_by.id==userInfo.id && !isSuperFlag"
                        @click="saveWorkflow(row.item)"
                    >
                        <icon name="save"></icon>
                    </a>
                    <a
                        class="btn-link mx-1"
                        href="javascript:;"
                        v-else-if="isActionAllowed('code_workflow_management', 'code_edit_workflow') && row.item.created_by.id==userInfo.id && !isSuperFlag"
                        @click="editWorkflow(row.item)"
                    >
                        <icon name="edit"></icon>
                    </a>
                    <a
                        class="btn-link mx-1"
                        href="javascript:;"
                        v-if="isActionAllowed('code_workflow_management', 'code_view_workflow') && row.item.status != 1"
                        @click="viewXmlHandler(row.item)"
                    >
                        <icon name="eye"></icon>
                    </a>
                    <router-link
                        v-if="isActionAllowed('code_workflow_management', 'code_edit_workflow') && !!row.item.id && row.item.status == 1 && row.item.created_by.id==userInfo.id && !isSuperFlag"
                        :to="{ name: 'manager-workflow-drawXML', params: { flow_id: row.item.id }}"
                        class="mx-1"
                    >
                        <icon name="project-diagram"></icon>
                    </router-link>
                    <a
                        class="btn-link mx-1"
                        href="javascript:;"
                        v-if="isActionAllowed('code_workflow_management', 'code_set_workflow') && row.item.status != 1 && row.item.created_by.id==userInfo.id && !isSuperFlag"
                        @click="toSetPage(row.item)"
                    >
                        <icon name="cog"></icon>
                    </a>
                    <a
                        class="mx-1"
                        href="javascript:;"
                        @click="deleteWorkflowClick(row.item)"
                        v-if="isActionAllowed('code_workflow_management', 'code_delete_workflow') && row.item.created_by.id==userInfo.id || isSuperFlag"
                    >
                        <icon name="trash"></icon>
                    </a>
                    <a
                        class="mx-1"
                        href="javascript:;"
                        v-if="isSuperFlag && row.item.protected == 0"
                        @click="lockWorkflowClick(row.item)"
                    >
                        <icon name="lock"></icon>
                    </a>
                    <a
                        class="mx-1"
                        href="javascript:;"
                        v-if="isSuperFlag && row.item.protected == 1"
                        @click="unlockWorkflowClick(row.item)"
                    >
                        <icon name="lock-open"></icon>
                    </a>
                </template>
            </b-table>
        </div>
        <b-row class="justify-content-center row-margin-tweak cardDiv">
            <b-pagination
                :size="template_size"
                :total-rows="workflows.total"
                :per-page="queryParam.size"
                limit="5"
                v-model="queryParam.page"
            ></b-pagination>
        </b-row>
        <!-- 查看大图Modal -->
        <image-view :visible="bigImgModal" :src="animationImgSrc" @on-close="bigImgModal=false"></image-view>
        <!-- 查看流程图 -->
        <view-xml :visible="xmlModalShow" :xml="workflowXml" @on-close="xmlModalShow = false"></view-xml>
        <b-modal v-model="deleteModal" title="删除提醒" size="lg" :showPerson="true">
            <b-container fluid>
                <div v-if="relatedProjects.length == 0" class="modal-msg">
                    <p class="message">是否确认删除流程。</p>
                </div>
                <div v-else class="modal-msg">
                    <p class="message">
                        该流程已被应用到项目中，删除流程后，若相关的项目没有被生成业务，则该项目将被一起删除；若相关的项目已经生成业务，相关的业务可继续执行，该项目将不可生新的业务。
                        <a
                            href="javascript:;"
                            class="btn-underline"
                            @click="relatedShow = !relatedShow"
                        >查看相关事务项目</a>
                    </p>
                    <div v-show="relatedShow" class="detail fixed-table-height">
                        <table class="table table-gray table-striped table-border">
                            <thead>
                                <tr>
                                    <th>项目名称</th>
                                    <th>事务类型</th>
                                    <th>等级</th>
                                    <th>能力目标</th>
                                    <th>是否已生成业务</th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-for="project in relatedProjects">
                                    <tr :key="project.id">
                                        <td>{{project.name}}</td>
                                        <td>{{project.type | expType}}</td>
                                        <td>{{project.level | level}}</td>
                                        <td>{{project.ability_tartget | abilityTarget}}</td>
                                        <td>
                                            <a
                                                href="javascript:;"
                                                class="btn-link"
                                                @click="project.expanded = !project.expanded"
                                            >{{project.exp_count == 0 ? '无业务' : `${project.exp_count}项业务`}}</a>
                                        </td>
                                    </tr>
                                    <tr
                                        :key="project.id + ' exp'"
                                        v-show="project.exp_count > 0 && project.expanded"
                                    >
                                        <td colspan="5" class="table-expanded-cell">
                                            <table class="table border">
                                                <thead>
                                                    <tr>
                                                        <th>业务名称</th>
                                                        <th>注册课堂</th>
                                                        <th>教师名称</th>
                                                        <th>实验小组</th>
                                                        <th>完成情况</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr
                                                        v-for="exp in project.experiments"
                                                        :key="exp.id"
                                                    >
                                                        <td>{{exp.name}}</td>
                                                        <td>{{exp.course_class}}</td>
                                                        <td>{{exp.teacher_name}}</td>
                                                        <td>{{exp.team_name}}</td>
                                                        <td>{{exp.status == 9? '完成' : '未完成'}}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                </div>
            </b-container>
            <div slot="modal-footer" class="w-100">
                <b-button variant="danger" class="float-center mr-2" @click="confirmDelete()">确定</b-button>
                <b-button variant="secondary" class="float-center" @click="deleteModal=false">取消</b-button>
            </div>
        </b-modal>
        <!-- 发布流程Modal -->
        <b-modal
            title="发布流程"
            v-model="publishModal"
            ok-title="立即发布"
            cancel-title="不发布"
            size="lg"
            @cancel="publishModal=false"
            @ok="publishOk"
        >
            <div class="modal-msg">
                <p class="message">流程建立成功，是否立即发布？</p>
                <p class="message">您只能发布以下流程:</p>
            </div>
            <b-container fluid>
                <table class="table table-border">
                    <thead>
                        <tr class="table-active">
                            <th>序号</th>
                            <th>流程名称</th>
                            <th>状态</th>
                            <th>是否可以</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(accessableItem, index) in checkedItems"
                            :key="accessableItem.id"
                        >
                            <td>{{index+1}}</td>
                            <td>{{accessableItem.name}}</td>
                            <td>{{ accessableItem.status==1 ? "未发布" : accessableItem.status==2 && accessableItem.is_public == 0 ? "已发布" : "已公开"}}</td>
                            <td>
                                <span
                                    class="badge badge-danger"
                                    v-if="accessableItem.created_by.id != userInfo.id"
                                >不能发布（没有权限）</span>
                                <span
                                    class="badge badge-info"
                                    v-else-if="accessableItem.status == 2"
                                >已经发布</span>
                                <span class="badge badge-success" v-else>可以发布</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </b-container>
        </b-modal>
        <!-- 复制流程Modal -->
        <b-modal
            title="复制为未发布流程"
            v-model="copyModal"
            @cancel="copyModal=false"
            @ok="copyModalOk"
            ok-title="确定"
            cancel-title="取消"
        >
            <b-form-input name="name" v-model.trim="copyModalName"></b-form-input>
        </b-modal>
        <!-- 确认共享Modal -->
        <b-modal
            title="确认共享"
            v-model="shareModal"
            ok-title="确认"
            cancel-title="取消"
            size="lg"
            @cancel="shareModal=false"
            @ok="shareConfirm"
        >
            <div class="modal-msg">
                <p class="message">您要确定共享流程吗？您只能共享以下流程:</p>
            </div>
            <b-container fluid>
                <table class="table table-border">
                    <thead>
                        <tr class="table-active">
                            <th>序号</th>
                            <th>流程名称</th>
                            <th>状态</th>
                            <th>是否可以</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(accessableItem, index) in checkedItems"
                            :key="accessableItem.id"
                        >
                            <td>{{index+1}}</td>
                            <td>{{accessableItem.name}}</td>
                            <td>{{ accessableItem.status==1 ? "未发布" : accessableItem.status==2 && accessableItem.is_public == 0 ? "已发布" : "已公开"}}</td>
                            <td>
                                <span
                                    class="badge badge-danger"
                                    v-if="accessableItem.created_by.id != userInfo.id"
                                >不能共享（没有权限）</span>
                                <span
                                    class="badge badge-danger"
                                    v-else-if="accessableItem.status == 1"
                                >不能共享（未发布）</span>
                                <span
                                    class="badge badge-info"
                                    v-else-if="accessableItem.is_share == 1"
                                >已经共享</span>
                                <span class="badge badge-success" v-else>可以共享</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </b-container>
        </b-modal>

        <!-- Unshare Modal -->
        <b-modal
            title="取消共享"
            v-model="unshareModal"
            ok-title="确定"
            cancel-title="取消"
            size="lg"
            @cancel="unshareModal=false"
            @ok="unshareConfirm"
        >
            <div class="modal-msg">
                <p class="message">您确定要取消共享流程吗？只能取消以下过流程:</p>
            </div>
            <b-container fluid>
                <table class="table table-border">
                    <thead>
                        <tr class="table-active">
                            <th>序号</th>
                            <th>流程名称</th>
                            <th>状态</th>
                            <th>是否可以</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(accessableItem, index) in checkedItems"
                            :key="accessableItem.id"
                        >
                            <td>{{index+1}}</td>
                            <td>{{accessableItem.name}}</td>
                            <td>{{ accessableItem.status==1 ? "未发布" : accessableItem.status==2 && accessableItem.is_public == 0 ? "已发布" : "已公开"}}</td>
                            <td>
                                <span
                                    class="badge badge-danger"
                                    v-if="accessableItem.created_by.id != userInfo.id"
                                >不能不共享（没有权限）</span>
                                <span
                                    class="badge badge-danger"
                                    v-else-if="accessableItem.status == 1"
                                >不能不共享（未发布）</span>
                                <span
                                    class="badge badge-info"
                                    v-else-if="accessableItem.is_share == 0"
                                >已经不共享</span>
                                <span class="badge badge-success" v-else>可以不共享</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </b-container>
        </b-modal>
        <!-- Public Modal -->
        <b-modal
            title="公开"
            v-model="publicModal"
            ok-title="确定"
            cancel-title="取消"
            size="lg"
            @cancel="publicModal=false"
            @ok="publicOk"
        >
            <div class="modal-msg">
                <p class="message">您要确定公开流程吗？您只能公开以下流程:</p>
            </div>
            <b-container fluid>
                <table class="table table-border">
                    <thead>
                        <tr class="table-active">
                            <th>序号</th>
                            <th>流程名称</th>
                            <th>状态</th>
                            <th>是否可以</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(accessableItem, index) in checkedItems"
                            :key="accessableItem.id"
                        >
                            <td>{{index+1}}</td>
                            <td>{{accessableItem.name}}</td>
                            <td>{{ accessableItem.status==1 ? "未发布" : accessableItem.status==2 && accessableItem.is_public == 0 ? "已发布" : "已公开"}}</td>
                            <td>
                                <span
                                    class="badge badge-danger"
                                    v-if="accessableItem.created_by.id != userInfo.id"
                                >不能公开（没有权限）</span>
                                <span
                                    class="badge badge-danger"
                                    v-else-if="accessableItem.status == 1"
                                >不能公开（未发布）</span>
                                <span
                                    class="badge badge-info"
                                    v-else-if="accessableItem.is_public == 1"
                                >已经公开</span>
                                <span class="badge badge-success" v-else>可以公开</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </b-container>
        </b-modal>
        <!-- Unpublic Modal -->
        <b-modal
            title="不公开"
            v-model="unpublicModal"
            ok-title="确定"
            cancel-title="取消"
            size="lg"
            @cancel="unpublicModal=false"
            @ok="unpublicOk"
        >
            <div class="modal-msg">
                <p class="message">您要确定不公开流程吗？只能将以下流程设置为私有:</p>
            </div>
            <b-container fluid>
                <table class="table table-border">
                    <thead>
                        <tr class="table-active">
                            <th>序号</th>
                            <th>流程名称</th>
                            <th>状态</th>
                            <th>是否可以</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(accessableItem, index) in checkedItems"
                            :key="accessableItem.id"
                        >
                            <td>{{index+1}}</td>
                            <td>{{accessableItem.name}}</td>
                            <td>{{ accessableItem.status==1 ? "未发布" : accessableItem.status==2 && accessableItem.is_public == 0 ? "已发布" : "已公开"}}</td>
                            <td>
                                <span
                                    class="badge badge-danger"
                                    v-if="accessableItem.created_by.id != userInfo.id"
                                >不能不公开（没有权限）</span>
                                <span
                                    class="badge badge-danger"
                                    v-else-if="accessableItem.status == 1"
                                >不能不公开（未发布）</span>
                                <span
                                    class="badge badge-info"
                                    v-else-if="accessableItem.is_public == 0"
                                >已经不公开</span>
                                <span class="badge badge-success" v-else>可以不公开</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </b-container>
        </b-modal>
    </div>
</template>

<script>
import { expType, level, abilityTarget } from "@/filters/fun";
import { mapState, mapActions } from "vuex";
import Loading from "@/components/loading/Loading";
import ToggleUpload from "@/components/upload/ToggleUpload";
import workflowService from "@/services/workflowService";
import ImageView from "@/components/imageView/ImageView";
import ViewXml from "@/components/workflowXML/ViewXML";
import _ from "lodash";
import arrayUtils from "@/utils/arrayUtils";
import dateUtils from "@/utils/dateUtils";

export default {
    name: "task-index",
    components: {
        Loading,
        ImageView,
        ViewXml,
        ToggleUpload
    },
    filters: {
        expType,
        level,
        abilityTarget
    },
    data() {
        return {
            columns: {
                sn: {
                    label: "序号",
                    sortable: false,
                    class: "text-center field-sn"
                },
                share: {
                    label: "",
                    sortable: false,
                    class: "text-center field-share"
                },
                name: {
                    label: "流程名",
                    sortable: false,
                    class: "text-center field-name"
                },
                creator: {
                    label: "创建者",
                    sortable: false,
                    class: "text-center field-creator"
                },
                create_time: {
                    label: "创建时间",
                    sortable: false,
                    class: "text-center field-create_time"
                },
                rend_ani_1: {
                    label: "渲染动画1",
                    sortable: false,
                    class: "text-center field-rend_ani_1"
                },
                rend_ani_2: {
                    label: "渲染动画2",
                    sortable: false,
                    class: "text-center field-rend_ani_2"
                },
                experiment_type_label: {
                    label: "事务类型",
                    sortable: false,
                    class: "text-center field-experiment_type_label"
                },
                experiment_task_label: {
                    label: "流程标签",
                    sortable: false,
                    class: "text-center field-experiment_task_label"
                },
                status: {
                    label: "状态",
                    sortable: false,
                    class: "text-center field-status"
                },
                action: {
                    label: "操作",
                    sortable: false,
                    class: "text-center field-action"
                }
            },
            // 查询参数
            queryParam: {
                status: "",
                page: 1,
                size: 15
            },
            queryDebounceParam: {
                search: ""
            },
            // 流程列表
            workflows: {
                list: [],
                total: 0
            },
            allChecked: false,
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
            unshareModal: false,
            publicModal: false,
            unpublicModal: false,
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
            newProcessAdded: false
        };
    },
    created() {
        this.$nextTick(() => {
            this.isSuperFlag = this.userInfo.identity === 1;
            this.queryWorkflowList();
        });
    },
    mounted() {
        // 绑定键盘删除操作
        document.addEventListener("keyup", e => {
            if (e.ctrlKey && e.keyCode === 46) {
                this.confirmDelete();
            }
        });
    },
    computed: {
        ...mapState(["userInfo", "userPermission"]),
        checkedItems() {
            return this.workflows.list.filter(item => item.checked === true);
        },
        checkedPublishableItems() {
            return this.checkedItems.filter(
                item =>
                    item.created_by.id == this.userInfo.id && item.status === 1
            );
        },
        checkedPublishableIds() {
            return this.checkedPublishableItems.map(item => item.id);
        },
        checkedPublishableTargets() {
            let targets = "";
            for (let key in this.checkedPublishableItems) {
                let item = this.checkedPublishableItems[key];
                if (targets === "") {
                    targets = item.name;
                } else {
                    targets = targets + ", " + item.name;
                }
            }
            return targets;
        },
        checkedPublicableItems() {
            return this.checkedItems.filter(
                item =>
                    item.created_by.id == this.userInfo.id &&
                    item.status !== 1 &&
                    item.is_public === 0
            );
        },
        checkedPublicableIds() {
            return this.checkedPublicableItems.map(item => item.id);
        },
        checkedPublicableTargets() {
            let targets = "";
            for (let key in this.checkedPublicableItems) {
                let item = this.checkedPublicableItems[key];
                if (targets === "") {
                    targets = item.name;
                } else {
                    targets = targets + ", " + item.name;
                }
            }
            return targets;
        },
        checkedUnPublicableItems() {
            return this.checkedItems.filter(
                item =>
                    item.created_by.id == this.userInfo.id &&
                    item.status !== 1 &&
                    item.is_public === 1
            );
        },
        checkedUnPublicableIds() {
            return this.checkedUnPublicableItems.map(item => item.id);
        },
        checkedUnPublicableTargets() {
            let targets = "";
            for (let key in this.checkedUnPublicableItems) {
                let item = this.checkedUnPublicableItems[key];
                if (targets === "") {
                    targets = item.name;
                } else {
                    targets = targets + ", " + item.name;
                }
            }
            return targets;
        },
        checkedShareableItems() {
            return this.checkedItems.filter(
                item =>
                    item.created_by.id == this.userInfo.id &&
                    item.status !== 1 &&
                    item.is_share === 0
            );
        },
        checkedShareableIds() {
            return this.checkedShareableItems.map(item => item.id);
        },
        checkedShareableTargets() {
            let targets = "";
            for (let key in this.checkedShareableItems) {
                let item = this.checkedShareableItems[key];
                if (targets === "") {
                    targets = item.name;
                } else {
                    targets = targets + ", " + item.name;
                }
            }
            return targets;
        },
        checkedUnShareableItems() {
            return this.checkedItems.filter(
                item =>
                    item.created_by.id == this.userInfo.id &&
                    item.status !== 1 &&
                    item.is_share === 1
            );
        },
        checkedUnShareableIds() {
            return this.checkedUnShareableItems.map(item => item.id);
        },
        checkedUnShareableTargets() {
            let targets = "";
            for (let key in this.checkedUnShareableItems) {
                let item = this.checkedUnShareableItems[key];
                if (targets === "") {
                    targets = item.name;
                } else {
                    targets = targets + ", " + item.name;
                }
            }
            return targets;
        }
    },
    watch: {
        // 监控查询参数，如有变化 查询列表数据
        queryParam: {
            handler() {
                this.queryWorkflowList();
            },
            deep: true
        },
        queryDebounceParam: {
            deep: true,
            handler: _.debounce(function() {
                this.queryWorkflowList();
            }, 500)
        },
        allChecked: {
            handler(val) {
                if (val) {
                    this.workflows.list.map(item => {
                        item.checked = true;
                        return item;
                    });
                } else {
                    this.workflows.list.map(item => {
                        item.checked = false;
                        return item;
                    });
                }
            }
        }
    },
    methods: {
        ...mapActions(["setFlowStep"]),
        // 查询流程列表数据
        queryWorkflowList() {
            this.allChecked = false;
            this.run();
            workflowService
                .fetchList({ ...this.queryParam, ...this.queryDebounceParam })
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
                    this.workflows.total = data.paging.count;
                    if (this.newProcessAdded) {
                        this.addNewProcess();
                    }
                    this.$emit("data-ready");
                })
                .catch(() => {
                    this.$emit("data-failed");
                });
        },
        // 查看渲染动画的大图
        showBigImg(animation) {
            this.animationImgSrc = animation.url;
            this.bigImgModal = true;
        },
        // 验证编辑的流程数据
        validateData(workflow) {
            if (workflow.name === "") {
                this.$toasted.error("请输入流程名称");
                return false;
            }
            if (workflow.name.length > 20) {
                this.$toasted.error("流程名称应不超过20字");
                return false;
            }
            if (!workflow.animation1) {
                this.$toasted.error("请上传渲染动画1");
                return false;
            }
            if (!workflow.animation2) {
                this.$toasted.error("请上传渲染动画2");
                return false;
            }
            if (workflow.task_label === "") {
                this.$toasted.error("请输入流程的实验任务标签");
                return false;
            }
            if (workflow.task_label.length > 20) {
                this.$toasted.error("实验任务标签应不超过20字");
                return false;
            }
            return true;
        },
        // 新建流程
        newProcess() {
            if (this.queryParam.status === "") {
                this.addNewProcess();
            } else {
                this.newProcessAdded = true;
                this.queryParam.status = "";
            }
        },
        addNewProcess() {
            this.workflows.list.unshift({
                name: "",
                created_by: { name: this.userInfo.name, id: this.userInfo.id },
                create_time: dateUtils.todayString(),
                animation1: "",
                animation2: "",
                type_label: 1,
                task_label: "",
                status: 1,
                edited: true,
                checked: false
            });
            // this.workflows.total++;
            this.newProcessAdded = false;
            this.newFlowStatus = true;
        },
        // 上传渲染动画成功回调
        uploadAnimationSuccess(data) {
            let item = arrayUtils.find(this.workflows.list, data);
            item.animation1 = data.animation1;
            item.animation2 = data.animation2;
        },
        saveWorkflowData(workflow) {
            let data = {
                name: workflow.name,
                animation1: workflow.animation1.id,
                animation2: workflow.animation2.id,
                type_label: workflow.type_label,
                task_label: workflow.task_label,
                targets: workflow.name
            };
            if (workflow.id) data.flow_id = workflow.id;
            return data;
        },
        // 保存编辑的流程
        saveWorkflow(workflow) {
            if (this.validateData(workflow)) {
                let data = this.saveWorkflowData(workflow);
                this.run();
                if (workflow.id) {
                    // 更新流程
                    workflowService
                        .updateWorkflow(data)
                        .then(() => {
                            this.$emit("data-ready");
                            this.$toasted.success("更新流程成功");
                            this.queryWorkflowList();
                        })
                        .catch(() => {
                            this.$emit("data-failed");
                        });
                } else {
                    // 创建新流程
                    workflowService
                        .create(data)
                        .then(() => {
                            this.$emit("data-ready");
                            this.$toasted.success("保存新建流程成功");
                            this.queryWorkflowList();
                        })
                        .catch(() => {
                            this.$emit("data-failed");
                        });
                }
                this.newFlowStatus = false;
            }
        },
        // 编辑流程
        editWorkflow(workflow) {
            if (workflow.protected === 1) {
                this.$toasted.error("该流程已被保护,请解除保护后进行编辑");
            } else {
                this.$set(workflow, "edited", true);
            }
        },
        viewXmlHandler(workflow) {
            this.workflowXml = workflow.xml;
            this.xmlModalShow = true;
        },
        // 点击删除流程按钮
        deleteWorkflowClick(workflow) {
            if (workflow.protected === 1) {
                this.$toasted.error("该流程已被保护,请解除保护后再进行删除");
            } else {
                if (!workflow.id) {
                    this.workflows.list.splice(
                        this.workflows.list.indexOf(workflow),
                        1
                    );
                    this.newFlowStatus = false;
                    return;
                }
                this.relatedShow = false;
                workflowService
                    .getWorkflowRelated({ flow_id: workflow.id })
                    .then(data => {
                        this.relatedProjects = data.map(i => {
                            this.$set(i, "expanded", false);
                            return i;
                        });
                    });
                this.deleteModal = true;
                this.currentDeleteItem = workflow;
            }
        },
        deleteWorkflowHandler() {
            this.run();
            workflowService
                .deleteWorkflow({
                    flow_id: this.currentDeleteItem.id,
                    targets: this.currentDeleteItem.name
                })
                .then(() => {
                    this.$emit("data-ready");
                    this.$toasted.success("删除流程成功");
                    this.queryWorkflowList();
                })
                .catch(() => {
                    this.$emit("data-failed");
                });
        },
        // Ctr+Delete 确定删除
        confirmDelete() {
            // 首次删除提醒
            if (this.deleteModal) {
                this.deleteWorkflowHandler();
                this.deleteModal = false;
            }
        },
        toSetPage(item) {
            if (item.protected === 1) {
                this.$toasted.error("该流程已被保护,请解除保护后进行设置");
            } else {
                this.setFlowStep(item.step);
                this.$router.push({
                    name: "setworkflow-node",
                    params: {
                        flow_id: item.id
                    }
                });
            }
        },
        // 保护
        lockWorkflowClick(workflow) {
            this.run();
            workflowService
                .lockWorkflow({ flow_id: workflow.id, targets: workflow.name })
                .then(() => {
                    this.$emit("data-ready");
                    this.$set(workflow, "protected", 1);
                    this.$toasted.success("保护流程成功");
                })
                .catch(() => {
                    this.$emit("data-failed");
                });
        },
        // 解除保护
        unlockWorkflowClick(workflow) {
            this.run();
            workflowService
                .lockWorkflow({ flow_id: workflow.id, targets: workflow.name })
                .then(() => {
                    this.$emit("data-ready");
                    this.$set(workflow, "protected", 0);
                    this.$toasted.success("解除保护流程成功");
                })
                .catch(() => {
                    this.$emit("data-failed");
                });
        },
        // 点击发布流程按钮
        publishWorkflowClick() {
            if (this.newFlowStatus) {
                this.$toasted.error("请先保存新建的流程");
                return;
            }
            if (this.checkedItems.length > 0) {
                this.publishModal = true;
            } else {
                this.$toasted.error("请勾选要发布的流程");
            }
        },
        // 点击发布流程 立即发布
        publishOk() {
            this.publishModal = false;
            if (this.checkedPublishableItems.length == 0) {
                this.$toasted.error("没有您可以公开的流程！");
                return;
            }
            let totalLen = this.checkedItems.length;
            let accessableLen = this.checkedPublishableItems.length;
            this.run();
            workflowService
                .publishWorkflow({
                    ids: JSON.stringify(this.checkedPublishableIds),
                    targets: this.checkedPublishableTargets
                })
                .then(() => {
                    this.$emit("data-ready");
                    this.queryWorkflowList();
                    this.$toasted.success(
                        "成功: " +
                            accessableLen +
                            "个， 失败: " +
                            (totalLen - accessableLen)
                    );
                })
                .catch(() => {
                    this.$emit("data-failed");
                });
        },
        // 点击复制流程
        copyWorkflowClick() {
            let checkedItems = this.checkedItems;
            if (checkedItems.length === 0) {
                this.$toasted.error("请勾选要复制的流程");
                return;
            }
            if (checkedItems.length > 1) {
                this.$toasted.error("一次只能选择一个流程复制");
                return;
            }
            if (this.newFlowStatus) {
                this.$toasted.error("请先保存新建的流程");
                return;
            }
            if (checkedItems[0].status === 1) {
                this.$toasted.error("未发布的流程不能复制，请选择已发布的流程");
                return;
            }
            this.copyModalName = "";
            this.copyModal = true;
        },
        // 确定复制流程
        copyModalOk() {
            if (this.copyModalName === "") {
                this.$toasted.error("请输入复制流程名称");
                return;
            }

            if (this.copyModalName === this.checkedItems[0].name) {
                this.$toasted.error("复制的流程不能与原流程重名");
                return;
            }

            if (this.copyModalName.length > 20) {
                this.$toasted.error("流程名称应不超过20字");
                return;
            }
            this.run();
            this.copyModal = false;
            workflowService
                .copyWorkflow({
                    flow_id: this.checkedItems[0].id,
                    name: this.copyModalName,
                    targets: this.checkedItems[0].name
                })
                .then(() => {
                    this.queryWorkflowList();
                    this.$toasted.success("复制流程成功");
                    this.$emit("data-ready");
                })
                .catch(() => {
                    this.$emit("data-failed");
                });
        },
        // 共享
        shareClick() {
            if (this.checkedItems.length > 0) {
                this.shareModal = true;
            } else {
                this.$toasted.error("请勾选要共享的流程");
            }
        },
        // 确认共享
        shareConfirm() {
            this.shareModal = false;
            if (this.checkedShareableItems.length == 0) {
                this.$toasted.error("没有您可以公开的流程！");
                return;
            }
            let totalLen = this.checkedItems.length;
            let accessableLen = this.checkedShareableItems.length;
            this.run();
            workflowService
                .shareWorkflow({
                    data: JSON.stringify(this.checkedShareableIds),
                    targets: this.checkedShareableTargets
                })
                .then(() => {
                    this.$emit("data-ready");
                    this.queryWorkflowList(this.queryParam);
                    this.$toasted.success(
                        "成功: " +
                            accessableLen +
                            "个， 失败: " +
                            (totalLen - accessableLen)
                    );
                })
                .catch(() => {
                    this.$emit("data-failed");
                });
        },
        // 共享
        unshareClick() {
            if (this.checkedItems.length > 0) {
                this.unshareModal = true;
            } else {
                this.$toasted.error("请勾选要共享的流程");
            }
        },
        // 确认共享
        unshareConfirm() {
            this.unshareModal = false;
            if (this.checkedUnShareableItems.length == 0) {
                this.$toasted.error("没有您可以公开的流程！");
                return;
            }
            let totalLen = this.checkedItems.length;
            let accessableLen = this.checkedUnShareableItems.length;
            this.run();
            workflowService
                .unshareWorkflow({
                    data: JSON.stringify(this.checkedUnShareableIds),
                    targets: this.checkedUnShareableTargets
                })
                .then(() => {
                    this.$emit("data-ready");
                    this.queryWorkflowList(this.queryParam);
                    this.$toasted.success(
                        "成功: " +
                            accessableLen +
                            "个， 失败: " +
                            (totalLen - accessableLen)
                    );
                })
                .catch(() => {
                    this.$emit("data-failed");
                });
        },
        publicProcess() {
            if (this.checkedItems.length > 0) {
                this.publicModal = true;
            } else {
                this.$toasted.error("请勾选要公开的流程");
            }
        },
        publicOk() {
            this.publicModal = false;
            if (this.checkedPublicableItems.length == 0) {
                this.$toasted.error("没有您可以公开的流程！");
                return;
            }
            let totalLen = this.checkedItems.length;
            let accessableLen = this.checkedPublicableItems.length;
            this.run();
            workflowService
                .publicWorkflow({
                    data: JSON.stringify(this.checkedPublicableIds),
                    targets: this.checkedPublicableTargets
                })
                .then(() => {
                    this.$emit("data-ready");
                    this.queryWorkflowList();
                    this.$toasted.success(
                        "成功: " +
                            accessableLen +
                            "个， 失败: " +
                            (totalLen - accessableLen)
                    );
                })
                .catch(() => {
                    this.$emit("data-failed");
                });
        },
        unpublicProcess() {
            if (this.checkedItems.length > 0) {
                this.unpublicModal = true;
            } else {
                this.$toasted.error("请勾选要不公开的流程");
            }
        },
        unpublicOk() {
            this.unpublicModal = false;
            if (this.checkedUnPublicableItems.length == 0) {
                this.$toasted.error("没有您可以不公开的流程！");
                return;
            }
            let totalLen = this.checkedItems.length;
            let accessableLen = this.checkedUnPublicableItems.length;
            this.run();
            workflowService
                .unpublicWorkflow({
                    data: JSON.stringify(this.checkedUnPublicableIds),
                    targets: this.checkedUnPublicableTargets
                })
                .then(() => {
                    this.$emit("data-ready");
                    this.queryWorkflowList();
                    this.$toasted.success(
                        "成功: " +
                            accessableLen +
                            "个， 失败: " +
                            (totalLen - accessableLen)
                    );
                })
                .catch(() => {
                    this.$emit("data-failed");
                });
        }
    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.task-index {
    padding-bottom: 10px;

    .field-sn {
        text-align: left !important;
        padding-left: 20px;
        width: 6%;
    }

    .field-share {
        width: 4%;
    }

    .field-name {
        width: 9%;
    }

    .field-creator {
        width: 12%;
    }

    .field-create_time {
        width: 10%;
    }

    .field-rend_ani_1 {
        width: 10%;
    }

    .field-rend_ani_2 {
        width: 10%;
    }

    .field-experiment_type_label {
        width: 10%;
    }

    .field-experiment_task_label {
        width: 10%;
    }

    .field-status {
        width: 5%;
    }

    .field-action {
        width: 14%;
    }

    .table th,
    .table td {
        vertical-align: middle;
    }

    .modal-body {
        .message {
            font-size: 16px;
        }

        .tip {
            font-size: 14px;
            color: #999;
        }
    }
}
</style>