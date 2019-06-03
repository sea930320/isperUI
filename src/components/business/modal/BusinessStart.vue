<template>
    <b-modal v-model="visible" size="lg" v-if="project">
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
                    {{project.officeItem && project.officeItem.name}}
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
            <b-button variant="primary" class="float-center mr-5" @click="xmlModalShow = true">查看流程图</b-button>
            <b-button variant="success" class="float-center" @click="startBusiness()">启动业务</b-button>
        </div>
        <!-- 查看流程图 -->
        <view-xml :visible="xmlModalShow" :xml="project.flow.xml" @on-close="xmlModalShow = false"></view-xml>
    </b-modal>
</template>
<script>
import ViewXml from "@/components/workflowXML/ViewXML";
import businessService from "@/services/businessService";
export default {
    components: {
        ViewXml
    },
    data() {
        return {
            visible: false,
            project: null,
            xmlModalShow: false
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
        startBusiness() {
            this.visible = false;
            businessService
                .createBusiness({
                    project_id: this.project.id
                })
                .then(() => {
                    // this.$router.push({
                    //     name: "editTask",
                    //     params: { task_id: data.id }
                    // });
                });
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
