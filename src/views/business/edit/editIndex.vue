<!--<template>-->
    <!--<div class="meta-main-box">-->
        <!--<div class="meta-content-wrapper clearfix">-->
            <!--<div class="display-container col-xs-8">-->
                <!--<div class="template-container" ref="container">-->
                    <!--<div v-if="!templateShow" class="empty">-->
                        <!--<p class="text">请选择应用模板</p>-->
                    <!--</div>-->
                    <!--<div class="template-content" v-if="templateShow">-->
                        <!--<textarea class="template-textarea" v-model="template" placeholder="请输入内容"></textarea>-->
                    <!--</div>-->
                    <!--<div v-if="templateShow == 1 && selectedDoc && selectedDoc.sign_status" class="sign-wrap">-->
                        <!--<p class="sign-content">{{selectedDoc.sign}}</p>-->
                    <!--</div>-->
                <!--</div>-->
            <!--</div>-->
            <!--<div class="operate-container col-xs-4">-->
                <!--<expInfo :name="metaInfo.name" :nodeName="metaInfo.nodeName" :roles="metaInfo.user_roles"></expInfo>-->
                <!--<guideTabs></guideTabs>-->
            <!--</div>-->
        <!--</div>-->
        <!--<div class="bottom-button">-->
            <!--<div class="spe-group" v-show="currentRole.can_edit">-->
                <!--<a href="javascript:;" class="btn-spe fl"-->
                   <!--@click="uploadModalShow = true">-->
                    <!--<i class="iconfont icon-upload"></i>上传附件-->
                <!--</a>-->
                <!--<a href="javascript:;" class="btn-spe fl"-->
                   <!--@click="newTempHandle">-->
                    <!--<i class="iconfont icon-templet"></i>新建文件-->
                <!--</a>-->
                <!--<a href="javascript:;" class="btn-spe fl"-->
                   <!--@click="handleShowTemp">-->
                    <!--<i class="iconfont icon-templet"></i>应用模板-->
                <!--</a>-->
                <!--<a href="javascript:;" class="btn-spe fl"-->
                   <!--v-if="templateShow == 1 && selectedDoc && selectedDoc.sign_status == 0"-->
                   <!--@click="signModalShow = 1">-->
                    <!--<i class="iconfont icon-edit"></i>签名-->
                <!--</a>-->
                <!--<a href="javascript:;" class="btn-spe fl"-->
                   <!--v-if="templateShow == 1 && selectedDoc && selectedDoc.sign_status == 1"-->
                   <!--@click="signModalShow = 0">-->
                    <!--<i class="iconfont icon-edit"></i>取消签名-->
                <!--</a>-->
            <!--</div>-->
            <!--<a v-if="templateShow" href="javascript:;" class="btn btn-blue" @click="saveTemplate">保存</a>-->
            <!--<a v-if="currentRole.can_terminate" href="javascript:;" class="btn btn-blue" @click="commitEnd = true">结束并走向</a>-->
        <!--</div>-->
        <!--<endNodeHandle :isCommit="commitEnd" @on-cancel="commitEnd = false"></endNodeHandle>-->
        <!--&lt;!&ndash; <modal title="编辑签名" color="gray"-->
        <!--:visible="signModalShow"-->
        <!--@on-cancel="signModalShow = false"-->
        <!--&gt;-->
        <!--<div class="sign-modal-content">-->
          <!--<p class="tip">请在下面选择字体，并输入姓名</p>-->
          <!--<div class="font-wrap">-->
            <!--字体格式-->
            <!--<select id="">-->
              <!--<option value="">楷体</option>-->
              <!--<option value="">隶书</option>-->
            <!--</select>-->
          <!--</div>-->
          <!--<div class="sign-input-wrap">-->
            <!--<textarea name="name" v-model.trim="sign" placeholder="请输入签名"></textarea>-->
          <!--</div>-->
        <!--</div>-->
        <!--</modal> &ndash;&gt;-->
        <!--&lt;!&ndash; 签名提示 &ndash;&gt;-->
        <!--<modal :visible="signModalShow > -1" title="提示" @on-cancel="signModalShow = -1" @on-ok="signHandle">-->
            <!--<div class="modal-msg">-->
                <!--<p class="message" v-if="signModalShow == 1">是否确定给该模板签名</p>-->
                <!--<p class="message" v-if="signModalShow == 0">是否确定取消该模板签名</p>-->
            <!--</div>-->
        <!--</modal>-->
        <!--&lt;!&ndash; 新建文件 填写名字 &ndash;&gt;-->
        <!--<modal :visible="newTempOkShow" title="提示" @on-cancel="newTempOkShow = false" @on-ok="newTempOk">-->
            <!--<div class="modal-msg">-->
                <!--<p class="message">确定要保存该新建的文件吗？</p>-->
                <!--<p class="tip">请填写文件名后 点确定按钮</p>-->
                <!--<div>-->
                    <!--<input class="inp-new" type="text" placeholder="请填写文件名称" v-model.trim="newTempName">-->
                <!--</div>-->
            <!--</div>-->
        <!--</modal>-->
        <!--&lt;!&ndash; 选择模版弹出层 &ndash;&gt;-->
        <!--<modal title="应用模板" color="gray"-->
               <!--:visible="templateModalShow"-->
               <!--:okHide="templates.length == 0"-->
               <!--@on-ok="selectTemplate"-->
               <!--@on-cancel="templateModalShow = false"-->
        <!--&gt;-->
            <!--<div class="template-modal-content" v-loading="tempsLoading">-->
                <!--<div v-if="!tempsLoading && templates.length == 0" class="template-modal-content">-->
                    <!--<div class="modal-msg">-->
                        <!--<p class="message">对不起，该角色没有配置任何模板，请切换角色试试</p>-->
                        <!--<p class="tip">请选择模板之后再编辑</p>-->
                    <!--</div>-->
                <!--</div>-->
                <!--<div v-else class="max-hight-box" >-->
                    <!--<Radio-group v-model="selectedDoc">-->
                        <!--<div class="template-radio" v-for="(template, index) in templates" :key="index">-->
                            <!--<Radio :label="template">{{template.name}}</Radio>-->
                        <!--</div>-->
                    <!--</Radio-group>-->
                <!--</div>-->
            <!--</div>-->
        <!--</modal>-->
        <!--&lt;!&ndash; 上传附件 &ndash;&gt;-->
        <!--<uploadModal-->
                <!--:modalShow="uploadModalShow"-->
                <!--title="上传附件"-->
                <!--uploadUrl="/api/experiment/docs/create"-->
                <!--:uploadParams="docSubmitParam"-->
                <!--@on-uploadConfirm="uploadCallback"-->
                <!--@on-cancel="uploadModalShow = false"></uploadModal>-->
    <!--</div>-->
<!--</template>-->
<!--<script type="text/ecmascript-6">-->
    <!--import expInfo from 'pages/experiment/meta/_components/exp-info'-->
    <!--import guideTabs from 'pages/experiment/meta/_components/guide-tabs'-->
    <!--import modal from 'components/modal/modal'-->
    <!--import Radio from 'components/radio/radio'-->
    <!--import RadioGroup from 'components/radio/radio-group'-->
    <!--import uploadModal from 'pages/common/uploadModal'-->
    <!--import endNodeHandle from 'pages/experiment/meta/_components/end-node-handle'-->
    <!--import experimentService from 'src/services/experimentService'-->
    <!--export default {-->
        <!--name: 'MetaEdit',-->
        <!--components: { expInfo, guideTabs, modal, Radio, RadioGroup, uploadModal, endNodeHandle },-->
        <!--data() {-->
            <!--return {-->
                <!--// 模板数据加载-->
                <!--tempsLoading: false,-->
                <!--newTempOkShow: false,-->
                <!--commitEnd: false,-->
                <!--signModalShow: -1,-->
                <!--templateModalShow: false,-->
                <!--uploadModalShow: false,-->
                <!--// 模式 0: 没有模板  1：查看模板 2：新建模板-->
                <!--templateShow: 0,-->
                <!--selectedDoc: null,-->
                <!--// 新建模板的名字-->
                <!--newTempName: '',-->
                <!--// 用户的签名-->
                <!--sign: '',-->
                <!--template: '',-->
                <!--docSubmitParam: {},-->
                <!--templates: []-->
            <!--}-->
        <!--},-->
        <!--computed: {-->
            <!--userInfo() {-->
                <!--return this.$store.state.userInfo-->
            <!--},-->
            <!--metaInfo() {-->
                <!--return this.$store.state.meta.info-->
            <!--},-->
            <!--currentRole() {-->
                <!--return this.$store.state.meta.currentRole-->
            <!--}-->
        <!--},-->
        <!--mounted() {-->
            <!--this.init()-->
        <!--},-->
        <!--watch: {-->
            <!--'currentRole': {-->
                <!--handler(data) {-->
                    <!--this.template = ''-->
                    <!--this.templateShow = 0-->
                    <!--// 上传附件参数-->
                    <!--this.docSubmitParam.role_id = data.id-->
                <!--},-->
                <!--deep: true-->
            <!--},-->
            <!--$route(to) {-->
                <!--// this.template = ''-->
                <!--// this.templateShow = 0-->
                <!--// this.commitEnd = false-->
                <!--this.init()-->
            <!--}-->
        <!--},-->
        <!--methods: {-->
            <!--init() {-->
                <!--this.template = ''-->
                <!--this.templateShow = 0-->
                <!--this.commitEnd = false-->
                <!--// 上传附件参数-->
                <!--this.docSubmitParam = {-->
                    <!--experiment_id: this.$route.params.eid,-->
                    <!--node_id: this.$route.params.nid,-->
                    <!--role_id: this.currentRole.id-->
                <!--}-->
            <!--},-->
            <!--// 显示要展示的模板-->
            <!--handleShowTemp() {-->
                <!--this.tempsLoading = true-->
                <!--this.selectedDoc = null-->
                <!--this.template = ''-->
                <!--experimentService-->
                    <!--.getExperimentTemplates({-->
                        <!--experiment_id: this.$route.params.eid,-->
                        <!--node_id: this.$route.params.nid,-->
                        <!--role_id: this.currentRole.id,-->
                        <!--usage: 3-->
                    <!--})-->
                    <!--.then(data => {-->
                        <!--this.templates = data-->
                        <!--if (data.length === 0) {-->
                            <!--this.template = ''-->
                        <!--}-->
                        <!--this.tempsLoading = false-->
                    <!--})-->
                <!--this.templateModalShow = true-->
                <!--this.templateShow = 0-->
            <!--},-->
            <!--// 新建模板-->
            <!--newTempHandle() {-->
                <!--this.templateShow = 2-->
                <!--this.template = ''-->
            <!--},-->
            <!--// 选择模板-->
            <!--selectTemplate() {-->
                <!--if (!this.selectedDoc || (this.selectedDoc && !this.selectedDoc.id)) {-->
                    <!--this.$toast.info('请选择一个应用模板')-->
                    <!--return-->
                <!--}-->
                <!--this.templateShow = 1-->
                <!--this.templateModalShow = false-->
                <!--this.template = this.selectedDoc.content-->
                <!--// 发送应用模板消息-->
                <!--experimentService-->
                    <!--.pushMessage({-->
                        <!--experiment_id: this.$route.params.eid,-->
                        <!--node_id: this.$route.params.nid,-->
                        <!--role_id: this.currentRole.id,-->
                        <!--msg: `查看模板"${this.selectedDoc.name}"`,-->
                        <!--type: 'txt'-->
                    <!--})-->
            <!--},-->
            <!--// 确定签名-->
            <!--signHandle() {-->
                <!--if (!this.selectedDoc.id) {-->
                    <!--this.$toast.warn('请先选择应用模板')-->
                    <!--return-->
                <!--}-->
                <!--experimentService-->
                    <!--.templateSign({-->
                        <!--experiment_id: this.$route.params.eid,-->
                        <!--node_id: this.$route.params.nid,-->
                        <!--role_id: this.currentRole.id,-->
                        <!--doc_id: this.selectedDoc.id,-->
                        <!--status: this.signModalShow-->
                    <!--})-->
                    <!--.then(() => {-->
                        <!--this.selectedDoc.sign = `${this.userInfo.name}(${this.currentRole.name})`-->
                        <!--this.selectedDoc.sign_status = this.signModalShow-->
                        <!--this.$toast.success(this.signModalShow === 1 ? '签名成功' : '取消签名成功')-->
                        <!--// 发送签字消息-->
                        <!--experimentService-->
                            <!--.pushMessage({-->
                                <!--experiment_id: this.$route.params.eid,-->
                                <!--node_id: this.$route.params.nid,-->
                                <!--role_id: this.currentRole.id,-->
                                <!--msg: this.signModalShow === 1-->
                                    <!--? `${this.currentRole.name}已经在《${this.selectedDoc.name}》上签字`-->
                                    <!--: `${this.currentRole.name}已经对《${this.selectedDoc.name}》取消签字`,-->
                                <!--type: 'txt'-->
                            <!--})-->
                        <!--this.signModalShow = -1-->
                    <!--})-->
            <!--},-->
            <!--// 保存模板-->
            <!--saveTemplate() {-->
                <!--if (this.template === '') {-->
                    <!--this.$toast.warn('文件内容不能为空')-->
                    <!--return false-->
                <!--}-->

                <!--// 编辑模板-->
                <!--if (this.templateShow === 1) {-->
                    <!--experimentService-->
                        <!--.createExperimentTemplate({-->
                            <!--experiment_id: this.$route.params.eid,-->
                            <!--node_id: this.$route.params.nid,-->
                            <!--doc_id: this.selectedDoc.id,-->
                            <!--content: this.template-->
                        <!--})-->
                        <!--.then(() => {-->
                            <!--// 发送保存模板消息-->
                            <!--experimentService-->
                                <!--.pushMessage({-->
                                    <!--experiment_id: this.$route.params.eid,-->
                                    <!--node_id: this.$route.params.nid,-->
                                    <!--role_id: this.currentRole.id,-->
                                    <!--msg: `保存编辑模板"${this.selectedDoc.name}"`,-->
                                    <!--type: 'txt'-->
                                <!--})-->
                                <!--.then(data => {-->
                                    <!--this.$toast.success('保存编辑模板成功')-->
                                <!--})-->
                        <!--})-->
                    <!--this.selectedDoc.content = this.template-->
                <!--}-->

                <!--// 新建模板-->
                <!--if (this.templateShow === 2) {-->
                    <!--// 填写模板名称-->
                    <!--this.newTempName = ''-->
                    <!--this.newTempOkShow = true-->
                <!--}-->
            <!--},-->
            <!--// 确定新建模板-->
            <!--newTempOk() {-->
                <!--if (!this.newTempName) {-->
                    <!--this.$toast.warn('请输入文件名称')-->
                    <!--return-->
                <!--}-->

                <!--if (this.newTempName.length > 20) {-->
                    <!--this.$toast.warn('文件名称不能超过20个字符')-->
                    <!--return-->
                <!--}-->
                <!--experimentService-->
                    <!--.newExperimentTemplate({-->
                        <!--experiment_id: this.$route.params.eid,-->
                        <!--node_id: this.$route.params.nid,-->
                        <!--role_id: this.currentRole.id,-->
                        <!--name: this.newTempName,-->
                        <!--content: this.template-->
                    <!--})-->
                    <!--.then(() => {-->
                        <!--// 发送保存模板消息-->
                        <!--experimentService-->
                            <!--.pushMessage({-->
                                <!--experiment_id: this.$route.params.eid,-->
                                <!--node_id: this.$route.params.nid,-->
                                <!--role_id: this.currentRole.id,-->
                                <!--msg: `新建文件"${this.newTempName}"`,-->
                                <!--type: 'txt'-->
                            <!--})-->
                            <!--.then(data => {-->
                                <!--this.templateShow = 0-->
                                <!--this.$toast.success('新建文件成功')-->
                                <!--this.newTempOkShow = false-->
                            <!--})-->
                    <!--})-->
            <!--},-->
            <!--// 上传附件成功后发消息，通知所用人-->
            <!--uploadCallback(docs) {-->
                <!--this.uploadModalShow = false-->
                <!--// 发送应用模板消息-->
                <!--experimentService-->
                    <!--.pushMessage({-->
                        <!--experiment_id: this.$route.params.eid,-->
                        <!--node_id: this.$route.params.nid,-->
                        <!--role_id: this.currentRole.id,-->
                        <!--msg: '上传文件: ' + docs.map(doc => doc.name).join('、'),-->
                        <!--cmd: 'action_doc_refresh',-->
                        <!--type: 'cmd'-->
                    <!--})-->
            <!--}-->
        <!--}-->
    <!--}-->
<!--</script>-->
<!--<style>-->
    <!--.template-container {-->
        <!--height: 100%;-->
        <!--background-color: #fff;-->
        <!--border: 1px solid #cdcdcd;-->
    <!--}-->
    <!--.template-container .empty {-->
        <!--width: 100%;-->
        <!--padding-left: 0;-->
        <!--padding-right: 0;-->
        <!--margin-left: auto;-->
        <!--margin-right: auto;-->
        <!--border: 1px solid #e5e9ef;-->
        <!--background-color: #fff;-->
        <!--height: 600px;-->
        <!--line-height: 600px;-->
        <!--text-align: center;-->
        <!--padding: 0;-->
    <!--}-->
    <!--.template-container .empty .text {-->
        <!--font-size: 25px;-->
        <!--color: #777;-->
    <!--}-->
    <!--.template-content {-->
        <!--font-size: 14px;-->
        <!--line-height: 24px;-->
        <!--height: 600px;-->
        <!--overflow-y: scroll;-->
        <!--padding: 16px;-->
    <!--}-->
    <!--.template-textarea {-->
        <!--width: 100%;-->
        <!--height: 100%;-->
        <!--font-size: 14px;-->
        <!--line-height: 28px;-->
        <!--border: none;-->
    <!--}-->
    <!--.sign-modal-content .font-wrap {-->
        <!--padding: 10px 0;-->
    <!--}-->
    <!--.sign-modal-content .font-wrap select {-->
        <!--width: 100px;-->
        <!--height: 32px;-->
    <!--}-->
    <!--.sign-input-wrap {-->
        <!--border: 1px dashed #333;-->
    <!--}-->
    <!--.sign-input-wrap textarea {-->
        <!--padding: 20px 10px;-->
        <!--width: 100%;-->
        <!--height: 80px;-->
        <!--line-height: 40px;-->
        <!--border:none;-->
        <!--font-size: 32px;-->
        <!--text-align: center;-->
    <!--}-->
    <!--.sign-wrap {-->
        <!--padding: 10px 16px;-->
    <!--}-->
    <!--.sign-content {-->
        <!--font-family: '华文行楷', '华文楷体';-->
        <!--height: 40px;-->
        <!--line-height: 40px;-->
        <!--font-size: 20px;-->
        <!--font-weight: bold;-->
        <!--text-align: right;-->
        <!--color: #333;-->
    <!--}-->
<!--</style>-->
