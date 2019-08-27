<template>
    <div>
        <loading v-if="isRunning"></loading>
        <b-modal centered v-model="visible" size="lg" v-if="project">
            <b-container fluid class="business-start-modal">
                <b-row align-v="start">
                    <b-col cols="4" class="text-left text-content">
                        <label>项目创建单位 :</label>
                        {{project.company_name}}
                    </b-col>
                    <b-col cols="4" class="text-left text-content">
                        <label>项目名称 :</label>
                        {{project.name}}
                    </b-col>
                    <b-col cols="4" class="text-left text-content">
                        <label>事务类型 :</label>
                        {{project.officeItem_name}}
                    </b-col>
                </b-row>
                <b-row>
                    <b-col cols="12" class="text-left text-content mt-4">
                        <label>项目简介</label>
                        <div class="project-description w-100 p-2">{{project.intro}}</div>
                    </b-col>
                </b-row>
            </b-container>
            <div slot="modal-footer" class="w-100">
                <b-button
                    variant="primary"
                    class="float-center mr-5"
                    @click="xmlModalShow = true"
                >查看流程图</b-button>
                <b-button variant="success" class="float-center" @click="startBusiness(true)">启动业务</b-button>
            </div>
            <!-- 查看流程图 -->
            <view-xml
                :visible="xmlModalShow"
                :xml="project.flow.xml"
                @on-close="xmlModalShow = false"
            ></view-xml>
            <b-modal centered hide-footer id="selectUse_to" ref="selectUse_to" title="办理单位">
                <div class="row py-3">
                    <b-form-select
                        v-model="project.use_to_company"
                        class="col-7 offset-1"
                        :options="company_list"
                    ></b-form-select>
                    <b-button
                        variant="success"
                        class="float-center col-2 offset-1"
                        @click="startBusiness(false)"
                    >确定</b-button>
                </div>
            </b-modal>
        </b-modal>
    </div>
</template>
<script>
import ViewXml from "@/components/workflowXML/ViewXML";
import businessService from "@/services/businessService";
import GroupService from "@/services/groupService";
import Loading from "@/components/loading/Loading";

export default {
    components: {
        Loading,
        ViewXml
    },
    data() {
        return {
            visible: false,
            project: null,
            xmlModalShow: false,
            company_list: []
        };
    },
    created() {
        this.$parent.$on("openBusinessStartModal", project => {
            if (!project) {
                this.visible = false;
                return;
            }
            this.visible = true;
            this.project = project;
        });
    },
    computed: {},
    methods: {
        isEmpty(obj) {
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) return false;
            }
            return true;
        },
        startBusiness(init) {
            if (
                this.project.created_role === 2 &&
                (this.project.use_to_company === undefined || init)
            ) {
                GroupService.getCompanyListOfGroup({
                    groupID: this.$parent.queryParam.group_id
                }).then(data => {
                    this.company_list = data.results;
                    this.$refs["selectUse_to"].show();
                });
            } else {
                this.$refs["selectUse_to"].hide();
                let postData = {};
                if (this.project.created_role === 2)
                    postData = {
                        project_id: this.project.id,
                        use_to: this.project.use_to_company
                    };
                else postData = { project_id: this.project.id };
                if (this.project) {
                    this.visible = false;
                    businessService
                        .createBusiness(postData)
                        .then(() => {
                            this.$emit("data-ready");
                            this.$toasted.success("启动成功。");
                        })
                        .catch(() => {
                            this.$emit("data-failed");
                        });
                }
            }
        }
    },
    watch: {
        visible(val) {
            if (!val) {
                this.$parent.$emit("BusinessStartCancelled");
            }
        }
    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.business-start-modal {
    .text-content {
        font-size: 14px;
    }
    .project-description {
        border: 1px solid #eaeaea;
    }
}
</style>
