<template>
    <div class="report-index">
        <div>
            <b-card-group>
                <b-card header-tag="header">
                    <b-row slot="header">
                        <b-col lg="3" md="6" sm="12" class="align-self-center">
                            <span class="float-left">
                                任务完成
                            </span>
                        </b-col>
                        <b-col lg="9" md="6" sm="12" class="align-self-center">
                            <b-button-group class="float-right">
                                <b-button
                                        class="styledBtn"
                                        variant="outline-primary"
                                >
                                    导出
                                </b-button>
                            </b-button-group>
                        </b-col>
                    </b-row>
                    <b-card-text>
                        <BulmaAccordion
                                :dropdown="false"
                                :icon="'custom'"
                        >
                            <BulmaAccordionItem class="linkpoint" v-for="(node,index) in report.nodes" :key="index">
                                <h4 slot="title" class="align-self-center float-left"> <icon name="angle-right"></icon> {{node.node_name}}</h4>
                                <div slot="content" style="text-align: left;padding:20px">
                                    <p>
                                        <span v-if="node.type === 4">实验心得：</span>
                                        <span v-else>交流记录：</span>
                                        <!--<a href="javascript:;" class="btn-link" @click="handlerDetailClick(1,node.messages)">详情</a>-->
                                        <span v-if="node.type === 4 && node.messages.length == 0">无</span>
                                        <a v-else href="javascript:;" class="btn-link" @click="handlerDetailClick(1,node.messages)">详情</a>
                                    </p>
                                    <p v-if="node.type === 5">
                                        <span>投票结果：</span>
                                        <span v-if="!node.vote_status || node.vote_status.length == 0">无</span>
                                        <a v-else href="javascript:;" class="btn-link" @click="handlerDetailClick(6, node.vote_status)">详情</a>
                                    </p>
                                    <p>
                                        <span v-if="node.type === 3">展示文件：</span>
                                        <span v-else>提交文件：</span>
                                        <span v-if="node.docs && node.docs.length == 0">无</span>
                                        <a v-else href="javascript:;" class="btn-link" @click="handlerDetailClick(2, node.docs)">详情</a>
                                    </p>
                                    <p>自我备忘：
                                        <span v-if="node.note == null">无</span>
                                        <a v-else href="javascript:;" class="btn-link" @click="handlerDetailClick(3, node.note)">详情</a>
                                    </p>
                                    <template v-if="status == 2">
                                        <p>操作指南：
                                            <!--<span v-if="node.operation_guides.length == 0">无</span>-->
                                            <!--<a v-else href="javascript:;" class="btn-link" @click="handlerDetailClick(4, node.operation_guides)">详情</a>-->
                                        </p>
                                        <p>项目素材：
                                            <!--<span v-if="node.project_docs.length == 0">无</span>-->
                                            <!--<a v-else href="javascript:;" class="btn-link" @click="handlerDetailClick(5, node.project_docs)">详情</a>-->
                                        </p>
                                    </template>
                                </div>
                            </BulmaAccordionItem>
                        </BulmaAccordion>
                        <br>
                        <b-row>
                            <b-col sm="12">
                                    <b-form-textarea
                                            id="textarea"
                                            placeholder="请填写心得！"
                                            rows="3"
                                            max-rows="4"
                                            v-model="experienceContent"
                                    >
                                    </b-form-textarea>
                            </b-col>
                        </b-row>
                        <br>
                        <b-row>
                            <b-col sm="12" class="align-self-center">
                                <b-button
                                        class="styledBtn"
                                        variant="outline-primary"
                                        @click="handleSave()"
                                >
                                    提交心得
                                </b-button>
                            </b-col>
                        </b-row>

                    </b-card-text>
                </b-card>
            </b-card-group>
        </div>
        <b-modal v-model="modalShow" title="查看详情" size="lg" :showPerson="true">
            <div>
                <div class="result-detail-content" v-if="detail.type == 1">
                    <ul>
                        <li v-for="(record, index) in detail.data" :key="index">
                            <div class="time text_blue">
                                <cite><i>{{record.timestamp}}</i> -- {{record.role_name}}({{record.user_name}})</cite>
                            </div>
                            <p v-if="record.url">
                                <chataudio :src="record.url"></chataudio>
                            </p>
                            <p v-else-if="record.ext.cmd == 'action_role_letin'">请入
                                <span v-for="(recordData, index) in record.ext.opt.data" :key="index">
                                    {{recordData.role_name}}、
                                </span>
                                <!--{{record.ext.opt.data.map(role=>role.role_name).join('、')}}-->
                            </p>
                            <p v-else-if="record.ext.cmd == 'action_submit_experience'">{{record.ext.opt.content}}</p>
                            <p v-else>{{record.msg}}</p>
                        </li>
                    </ul>
                </div>

                <div class="result-detail-content" v-if="detail.type == 2">
                    <table class="table table-gray table-striped table-border">
                        <thead>
                        <tr>
                            <th>文件名</th>
                            <th>文件类型</th>
                            <th>签字</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(file, index) in detail.data" :key="index">
                            <td>{{file.filename}}</td>
                            <td>-</td>
                            <td>
                                <div class="pr">
                                    <span class="btn-link" target="_blank" @click.stop="showSignHandle(index)">查看</span>
                                    <div class="sign-view-detail" v-show="signShow === index">
                                        <p v-if="file.signs.length == 0">暂无</p>
                                        <p v-else v-for="(sign, index) in file.signs" :key="index">
                                            <!-- {{#if sign.sign_status == 1}}
                                            {{/if}} -->
                                            <!-- {{sign.sign_status == 1 ? sign.sign}}'已签字'
                                            {{sign.sign_status == 2 ? sign.sign'已取消签字'}} -->
                                            <span v-if="sign.sign_status == 1">{{sign.sign}}已签字</span>
                                            <span v-if="sign.sign_status == 2">{{sign.sign}}已拒绝签字</span>
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <a href="javascript:void(0);" class="btn-link" @click="previewFile(file.url)" >预览</a>
                                <a :href="file.url" class="btn-link" target="_blank">下载</a>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div class="result-detail-content" v-if="detail.type == 3">
                    <p>{{detail.data}}</p>
                </div>

                <div class="result-detail-content" v-if="detail.type == 4">
                    <p v-for="(file, index) in detail.data" :key="index" v-replace="file.content"></p>
                </div>

                <div class="result-detail-content" v-if="detail.type == 5">
                    <table class="table table-gray table-striped table-border">
                        <thead>
                        <tr>
                            <th>文件名</th>
                            <th>文件类型</th>
                            <th>文件用途</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(file, index) in detail.data" :key="index">
                            <td>{{file.name}}</td>
                            <td>{{file.type}}</td>
                            <td>{{file.usage | docUsage}}</td>
                            <td>
                                <a href="javascript:void(0);" class="btn-link" @click="previewFile(file.url)" >预览</a>
                                <a :href="file.url" class="btn-link" target="_blank">下载</a>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div class="result-detail-content" v-if="detail.type == 6">
                    <ul>
                        <li class="voteLi" v-for="(vote, index) in detail.data" :key="index">
                            <span class="voteName">{{vote.status}} ( {{vote.num}}票 )</span>
                            <div class="precentBox">
                                <span class="precentLine" :style="precentStyle(vote, detail.data)" ></span>
                            </div>
                            <span class="votePercent">{{precentItem(vote, detail.data)}}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </b-modal>
    </div>
</template>

<script>
    import BusinessService from '@/services/businessService';
    import { mapState } from "vuex";
    import { BulmaAccordion, BulmaAccordionItem } from 'vue-bulma-accordion'
    import BFormTextarea from "bootstrap-vue/src/components/form-textarea/form-textarea";
    import { openFile } from "@/utils/previewFile";
//    import { docUsage } from "@/filters/fun";

    export default {
        components: {
            BFormTextarea,
            BulmaAccordion,
            BulmaAccordionItem,
        },
        data () {
            return {
                report:{
                    data:{},
                    nodes:[]
                },
                experienceContent:"",
                signShow: -1,
                modalShow: false,
                detail: {
                    type: 1,   // 查看详情类型 1：交流记录，2：提交文件，3：自我备忘
                    data: {}
                }
            }
        },
        created() {
            this.$nextTick(() => {
                this.generateBusinessReport();
            });
        },
        computed:{
            ...mapState(["userInfo"]),
        },
        mounted(){},
        methods: {
            generateBusinessReport(){
                this.run();
                BusinessService.genarateBusinessReport({
                    business_id: this.$route.params.bid,
                    user_id: this.userInfo.id
                })
                    .then(data => {
                        this.report.data = data;
                        this.report.nodes = data.nodes;
                        this.$emit("data-ready");
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
            },
            handlerDetailClick(type, data) {
                this.detail.type = type;
                this.detail.data = data;
                this.modalShow = true
            },
            // 查看签字处理
            showSignHandle(index) {
                this.signShow === index
                    ? this.signShow = -1
                    : this.signShow = index
            },
            precentStyle(item, arr) {
                let num = item.num;
                let total = 0;
                arr.forEach(element => {
                    total += element.num
                });
                let percent = parseFloat((num / total) * 100).toFixed(2)
                return {
                    width: percent + '%'
                }
            },
            precentItem(item, arr) {
                let num = item.num;
                let total = 0;
                arr.forEach(element => {
                    total += element.num
                });
                let percent = parseFloat((num / total) * 100).toFixed(2) + '%'
                return percent
            },
            previewFile(fileUrl) {
                openFile(fileUrl, this.userInfo.id)
            },
            handleSave(){
                if (this.experienceContent === ''){
                    this.$toasted.error('请输入实验心得');
                    return
                }
                BusinessService
                    .postBusinessExperience({
                        business_id:this.$route.params.bid,
                        content:this.experienceContent
                    })
                    .then(() =>{
                        this.$toasted.success('保存成功');
                    })
            }
        }
    }
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
    .report-index {
        .flash-height {
            height: 800px;
        }
        .court-flash-container {
            float: left;
            background-color: #eee;
            width: 1000px;
        }
        .court-chat-container {
            background-color: #eee;
        }

        .court-action-wrap {
            padding: 10px;
            height: 192px;
            margin-right: -5px;
        }
        .btn-ex {
            display: inline-block;
            font-size: 12px;
            width: 82px;
            margin-right: 5px;
            height: 31px;
            line-height: 31px;
            text-align: center;
            color: #fff;
            padding: 0;
            -webkit-transition: all 0.3s ease;
            -moz-transition: all 0.3s ease;
            transition: all 0.3s ease;
        }
        .btn-ex-green {
            background-color: #2dcb70;
        }
        .btn-ex-green:hover {
            background-color: #00c175;
            color: #fff;
        }
        .btn-ex-blue {
            background-color: #68a3d5;
        }
        .btn-ex-blue:hover {
            background-color: #44a5f7;
            color: #fff;
        }
        .action-container .btn-ex {
            margin-bottom: 10px;
        }
        .speak-container .speak-field {
            height: 120px;
            border-bottom: 1px solid #cdcdcd;
        }
        @media screen and (max-width: 1380px) {
            .court-flash-container {
                width: 760px;
            }
            .court-chat-container {
                margin-left: 760px;
            }
            .flash-height {
                height: 560px;
            }
            .speak-container .speak-field {
                height: 86px;
            }
            .court-action-wrap {
                height: 158px;
            }
            .btn-ex {
                width: 66px;
                height: 26px;
                line-height: 26px;
            }
        }
        @media screen and (min-width: 1380px) and (max-width: 1600px) {
            .court-flash-container {
                width: 900px;
            }
            .court-chat-container {
                margin-left: 900px;
            }
            .flash-height {
                height: 680px;
            }
            .speak-container .speak-field {
                height: 88px;
            }
            .court-action-wrap {
                height: 160px;
            }
        }
    }
    .linkpoint{
        cursor:pointer
    }
    .result-detail-content {
        min-height: 200px;
    }
    .result-detail-content p {
        word-break: break-all;
    }
    .result-detail-content::-webkit-scrollbar-track-piece {
        background-color: rgba(0, 0, 0, 0);
        border-left: 1px solid rgba(0, 0, 0, 0);
    }
    .result-detail-content::-webkit-scrollbar {
        width: 8px;
        height: 13px;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
    }
    .result-detail-content::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.5);
        background-clip: padding-box;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        min-height: 28px;
    }
    .result-detail-content::-webkit-scrollbar-thumb:hover {
        background-color: rgba(0, 0, 0, 0.5);
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
    }
    .voteLi{
        padding: 5px;
    }
    .voteLi .voteName{
        display: inline-block;
        color: #3a7de0;
        line-height: 20px;
        margin-right: 5px;
        width: 95px;
        text-align: right;
    }
    .voteLi .precentBox{
        display: inline-block;
        width: 500px;
        height: 20px;
        background-color: #fff;
        vertical-align: middle;
        position: relative;
    }
    .precentBox .precentLine{
        display: inline-block;
        position: absolute;
        left: 0;
        top: 7px;
        border-top: 2px solid rgb(24, 185, 86);
        border-bottom: 2px solid rgb(24, 185, 86);
    }
    .voteLi .votePercent{
        display: inline-block;
        color: #111;
        line-height: 20px;
        margin-left: 5px;
    }
</style>