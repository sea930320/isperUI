<template>
    <div class="post-index">
        <loading v-if="isRunning"></loading>
        <b-container fluid>
            <b-row>
                <b-col sm="9">
                    <b-form-group label-cols="1" label="法案名称:" label-for="input-horizontal1">
                        <b-form-input
                                class="cardDiv mt-0"
                                id="input-horizontal1"
                                maxlength="32"
                                v-model="bill_name"
                                placeholder="请输入名称（32个字以下）"
                                required
                        ></b-form-input>
                    </b-form-group>
                </b-col>
                <b-col sm="3">
                    <b-button-group class="float-center">
                        <b-button
                            :size="template_size"
                            class="styledBtn"
                            variant="outline-primary"
                            @click="documentUploadToPart()"
                        >文件上传</b-button>

                        <b-button
                            :size="template_size"
                            class="styledBtn"
                            variant="outline-primary"
                            @click="handleDownload()"
                        >法案预览</b-button>
                    </b-button-group>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="9">
                    <b-form-group label-cols="1" label="法案模式:" label-for="input-horizontal2">
                        <b-form-group>
                            <b-form-radio-group
                                    id="radio-group-1"
                                    v-model="selected"
                                    :options="options"
                                    name="radio-options"
                            ></b-form-radio-group>
                        </b-form-group>
                    </b-form-group>
                </b-col>
                <b-col sm="3">
                    <b-button-group class="float-center">
                        <b-button
                                :size="template_size"
                                class="styledBtn"
                                variant="outline-primary"
                                @click="addNewBill()"
                        >增加法条</b-button>
                        <b-button
                                :size="template_size"
                                class="styledBtn"
                                variant="outline-primary"
                                @click="insertNewPartModal()"
                        >插入法条</b-button>
                    </b-button-group>
                </b-col>
            </b-row>

            <div class="cardDiv">
                <b-table
                        :items="bill_data"
                        v-if="selected==1"
                        responsive
                        selectable
                        ref="selectableTable"
                        select-mode="single"
                        @row-selected="partSelectedFunc"
                        small hover
                        :fields="columns"
                        head-variant
                >
                    <template slot="sn" slot-scope="row">
                        {{ row.index + 1 }}
                    </template>
                    <template slot="chapter_number" slot-scope="row">{{row.item.chapter_number}}</template>
                    <template slot="chapter_title" slot-scope="row">{{row.item.chapter_title}}</template>
                    <template slot="section_number" slot-scope="row">{{row.item.section_number}}</template>
                    <template slot="section_title" slot-scope="row">{{row.item.section_title}}</template>
                    <template slot="part_number" slot-scope="row">{{row.item.part_number}}</template>
                    <template slot="part_title" slot-scope="row">{{row.item.part_title}}</template>
                    <template slot="part_text" slot-scope="row">{{row.item.part_content}}</template>
                    <template slot="control_button" slot-scope="row">
                        <b-row>
                            <b-col sm="12">
                                <b-button-group class="float-center">
                                    <b-button
                                            :size="template_size"
                                            class="styledBtn"
                                            variant="outline-primary"
                                            @click="updatePartsModal1(row.item.part_id)"
                                    >修改</b-button>
                                    <b-button
                                            :size="template_size"
                                            class="styledBtn"
                                            variant="outline-primary"
                                            @click="changeArrayUp1(row.item.part_id)"
                                    >上移</b-button>
                                    <b-button
                                            :size="template_size"
                                            class="styledBtn"
                                            variant="outline-primary"
                                            @click="changeArrayDown1(row.item.part_id)"
                                    >下移</b-button>
                                    <b-button
                                            :size="template_size"
                                            class="styledBtn"
                                            variant="outline-primary"
                                            @click="deletePartsModal1(row.item.part_id)"
                                    >刪除</b-button>
                                </b-button-group>
                            </b-col>
                        </b-row>
                    </template>
                </b-table>
                <b-table :items="bill_data" v-if="selected==2" selectable
                         ref="selectableTable1"
                         select-mode="single" responsive small hover :fields="columns1" head-variant @row-selected="partSelectedFunc">
                    <template slot="sn" slot-scope="row">
                        {{ row.index + 1 }}
                    </template>
                    <template slot="part_number" slot-scope="row">{{row.item.part_number}}</template>
                    <template slot="part_title" slot-scope="row">{{row.item.part_title}}</template>
                    <template slot="part_text" slot-scope="row">{{row.item.part_content}}</template>
                    <template slot="control_button" slot-scope="row">
                        <b-row>
                            <b-col sm="12">
                                <b-button-group class="float-center">
                                    <b-button
                                            :size="template_size"
                                            class="styledBtn"
                                            variant="outline-primary"
                                            @click="updatePartsModal1(row.item.part_id)"
                                    >修改</b-button>
                                    <b-button
                                            :size="template_size"
                                            class="styledBtn"
                                            variant="outline-primary"
                                            @click="changeArrayUp1(row.item.part_id)"
                                    >上移</b-button>
                                    <b-button
                                            :size="template_size"
                                            class="styledBtn"
                                            variant="outline-primary"
                                            @click="changeArrayDown1(row.item.part_id)"
                                    >下移</b-button>
                                    <b-button
                                            :size="template_size"
                                            class="styledBtn"
                                            variant="outline-primary"
                                            @click="deletePartsModal1(row.item.part_id)"
                                    >刪除</b-button>
                                </b-button-group>
                            </b-col>
                        </b-row>
                    </template>
                </b-table>
            </div>
        </b-container>
        <div class="create-btns">
            <b-button size="sm" class="styledBtn" variant="outline-primary" @click="saveBillList()">
                <icon name="save"></icon>&nbsp;保存
            </b-button>
            <b-button
                    v-if="currentRoleAllocation.can_terminate"
                    size="sm"
                    class="styledBtn"
                    variant="outline-primary"
                    @click="commitEnd = true"
            >结束并走向</b-button>
        </div>
        <end-node-handle :isCommit="commitEnd" @on-cancel="endNodeCancel"></end-node-handle>
        <siderUserBar></siderUserBar>
        <!--update confirm-->
        <b-modal
                title="修改法案"
                v-model="edit_full_modal_show"
                ok-title="确定"
                cancel-title="取消"
                size="xl"
                @cancel="edit_full_modal_show=false"
                @ok="updateParts1"
        >
            <div class="modal-msg">
                <p class="message">您能修改法案:</p>
            </div>
            <b-container fluid>
                <b-row align-v="center" v-if="selected==1">
                    <b-col sm="6">
                        <b-form-group
                                id="fieldset-horizontal1"
                                label-cols-sm="4"
                                label-cols-lg="3"
                                label="章名:"
                                label-for="input-horizonta2"
                                class="text-left"
                        >
                            <b-form-input id="input-horizontal2" v-model="edit_modal_data.chapter_title"></b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col sm="6">
                        <b-form-group
                                id="fieldset-horizontal3"
                                label-cols-sm="4"
                                label-cols-lg="3"
                                label="节名:"
                                label-for="input-horizontal"
                                class="text-left"
                        >
                            <b-form-input id="input-horizontal" required oninvalid="this.setCustomValidity('这是必填栏')" oninput="this.setCustomValidity('')"
                                          v-model="edit_modal_data.section_title"></b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row align-v="center">
                    <b-col sm="6">
                        <b-form-group
                                id="fieldset-horizontal1"
                                label-cols-sm="4"
                                label-cols-lg="3"
                                label="条名:"
                                label-for="input-horizonta3"
                                class="text-left"
                        >
                            <b-form-input id="input-horizontal3" v-model="edit_modal_data.part_title" ></b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col sm="6">
                        <b-form-group
                                id="fieldset-horizontal3"
                                label-cols-sm="4"
                                label-cols-lg="3"
                                label="正文:"
                                label-for="input-horizonta4"
                                class="text-left"
                        >
                            <b-form-input id="input-horizonta4" required oninvalid="this.setCustomValidity('这是必填栏')" oninput="this.setCustomValidity('')"
                                          v-model="edit_modal_data.part_content"></b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>
            </b-container>
        </b-modal>
        <!--delete confirm-->
        <b-modal
                title="刪除法案"
                v-model="delete_modal_show"
                ok-title="确定"
                cancel-title="取消"
                size="xl"
                @cancel="delete_modal_show=false"
                @ok="deleteParts1"
        >
            <div class="modal-msg">
                <p class="message">Are you sure to delete this part?</p>
            </div>
        </b-modal>
        <!--add part-->
        <b-modal
                title="增加法条"
                v-model="add_new_bill"
                ok-title="确定"
                cancel-title="取消"
                @hidden="addModalClear"
                size="xl"
                hide-footer
                ref="vuemodal"
        >
            <b-container fluid>
            <b-form @submit.stop.prevent="addConfirm">
                    <b-row>
                        <b-col sm="6">
                            <b-form-group label-cols-sm="4" label="章序号:" label-for="inputAdd1">
                                <b-form-select id="inputAdd1" required ref="chapterSelectBox" v-model="chapterSelected" :options="chapterOptions" @change="changeChapter()">
                                    <template slot="first">
                                        <option :value="null" disabled>-- Please select an option --</option>
                                    </template>
                                </b-form-select>
                            </b-form-group>
                        </b-col>
                        <b-col sm="6">
                            <b-form-group label-cols-sm="4" label="章名:" label-for="inputAdd2">
                                <b-form-input id="inputAdd2" required v-model="chapterSelected" ></b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col sm="6">
                            <b-form-group label-cols-sm="4" ref="sectionSelctebox" label="节序号:" label-for="inputAdd3">
                                <b-form-select id="inputAdd3" required v-model="sectionSelected" :options="sectionOptions" @change="changeSection()"></b-form-select>
                            </b-form-group>
                        </b-col>
                        <b-col sm="6">
                            <b-form-group label-cols-sm="4" label="节名:" label-for="inputAdd4">
                                <b-form-input id="inputAdd4" required v-model="sectionSelected" ></b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col sm="6">
                            <b-form-group label-cols-sm="4" label="条文序号:" label-for="inputAdd5">
                                <b-form-input id="inputAdd5" required type="number" :min="partMin" disabled v-model="partSelected"></b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col sm="6">
                            <b-form-group label-cols-sm="4" label="条文名称:" label-for="inputAdd6">
                                <b-form-input id="inputAdd6" required v-model="partSelectedName" ></b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                        <b-row>
                            <b-col sm="12">
                                <b-form-group label="条文正文:" label-for="textarea1">
                                    <b-form-textarea
                                            required
                                            id="textarea1"
                                            v-model="selectedPartContent"
                                            placeholder="Enter something..."
                                            rows="6"
                                            max-rows="12"
                                    ></b-form-textarea>
                                </b-form-group>
                                <b-form-group label="制定理由:" label-for="textarea2">
                                    <b-form-textarea
                                            required
                                            id="textarea2"
                                            v-model="selectedPartReason"
                                            placeholder="Enter something..."
                                            rows="6"
                                            max-rows="12"
                                    ></b-form-textarea>
                                </b-form-group>
                            </b-col>
                    </b-row>
                    <b-button class="float-center" type="submit" variant="primary">确 定
                    </b-button>
                </b-form>
            </b-container>
        </b-modal>
        <!--document upload-->
        <b-modal
                title="文件上传"
                v-model="document_upload_modal"
                ok-title="确定"
                cancel-title="取消"
                @hidden="uploadModalClear"
                size="xl"
                hide-footer
                ref="vuemodal"
        >
            <b-container fluid>
                <b-row>
                    <b-col sm="12">
                        <b-table :items="section_docs_lists"
                                 select-mode="single" responsive small hover :fields="columns_upload" head-variant>
                            <template slot="sn" slot-scope="row">
                                {{ row.index + 1 }}
                            </template>
                            <template slot="upload_doc_name" slot-scope="row">{{row.item.doc_name}}</template>
                            <template slot="upload_desc" slot-scope="row">{{row.item.doc_conception}}</template>
                            <template slot="upload_control" slot-scope="row">{{row.item.part_content}}
                                <b-row>
                                    <b-col sm="12">
                                        <b-button-group class="float-center">
                                            <b-button
                                                    :size="template_size"
                                                    class="styledBtn"
                                                    variant="outline-primary"
                                                    @click="deletePartDoc(row.item.id)"
                                            >刪除</b-button>
                                        </b-button-group>
                                    </b-col>
                                </b-row>
                            </template>
                        </b-table>
                    </b-col>
                </b-row>
                <br><br>
                <b-row>
                    <b-col sm="10">
                        <b-form-group label-cols-sm="2" label="上传文件:" label-for="uploadInputAdd1">
                            <b-form-input id="uploadInputAdd1" disabled v-model="upload_doc_url" ></b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col sm="2">
                        <business-bill-upload @getFileURL="getFileURL"></business-bill-upload>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col sm="10">
                        <b-form-group label-cols-sm="2" label="备注:" label-for="uploadInputAdd2">
                            <b-form-input id="uploadInputAdd2" v-model="doc_desc_text" ></b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col sm="2">
                        <b-button
                                size="sm"
                                class="styledBtn"
                                variant="outline-primary"
                                @click="showPreviewPage()"
                                id="tooltip-button-variant"
                        >

                            <icon name="eye" ></icon> 浏 览</b-button>
                        <b-tooltip target="tooltip-button-variant" variant="danger">Can be shown Less than 15MB</b-tooltip>
                    </b-col>
                </b-row>
                <br>
                <b-row>
                    <b-col sm="12">
                        <b-button size="sm" class="styledBtn float-center" variant="outline-primary" @click="saveDoctoPart()">
                            <icon name="save"></icon>&nbsp;保存
                        </b-button>
                    </b-col>
                </b-row>
                <br>
                <VueDocPreview v-if="previewShow==1" :value="encodedURLDOCX" type="office" />
            </b-container>
        </b-modal>
        <!--insert part-->
        <b-modal
                title="插入法案"
                v-model="part_insert_modal_show"
                ok-title="确定"
                cancel-title="取消"
                size="xl"
                @hidden="insertModalClear"
                hide-footer
        >
            <div class="modal-msg">
                <p class="message">您能插入法案:</p>
            </div>
            <b-container fluid>
                <b-form @submit.stop.prevent="insertPart">
                    <b-row>
                        <b-col sm="6">
                            <b-form-group label-cols-sm="4" label="章序号:" label-for="insertPart1">
                                <b-form-input id="insertPart1" disabled v-model="selected_data.chapter_number" ></b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col sm="6">
                            <b-form-group label-cols-sm="4" label="章名:" label-for="insertPart2">
                                <b-form-input id="insertPart2" disabled v-model="selected_data.chapter_title" ></b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col sm="6">
                            <b-form-group label-cols-sm="4" label="节序号:" label-for="insertPart3">
                                <b-form-input id="insertPart3" disabled v-model="selected_data.section_number" ></b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col sm="6">
                            <b-form-group label-cols-sm="4" label="节名:" label-for="insertPart4">
                                <b-form-input id="insertPart4" disabled v-model="selected_data.section_title" ></b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col sm="6">
                            <b-form-group label-cols-sm="4" label="条文序号:" label-for="insertPart5">
                                <b-form-input id="insertPart5" disabled v-model="selected_data.part_number"></b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col sm="6">
                            <b-form-group label-cols-sm="4" label="条文名称:" label-for="insertPart6">
                                <b-form-input id="insertPart6" required v-model="insertPartTitle" ></b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col sm="12">
                            <b-form-group label="条文正文:" label-for="insertTextarea1">
                                <b-form-textarea
                                        required
                                        id="insertTextarea1"
                                        v-model="insertPartContent"
                                        placeholder="Enter something..."
                                        rows="6"
                                        max-rows="12"
                                ></b-form-textarea>
                            </b-form-group>
                            <b-form-group label="制定理由:" label-for="insertTextarea2">
                                <b-form-textarea
                                        required
                                        id="insertTextarea2"
                                        v-model="insertPartReason"
                                        placeholder="Enter something..."
                                        rows="6"
                                        max-rows="12"
                                ></b-form-textarea>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-button class="float-center" type="submit" variant="primary">确 定
                    </b-button>
                </b-form>
            </b-container>
        </b-modal>
    </div>
</template>

<script>
    import Loading from "@/components/loading/Loading";
//    import BusinessService from "@/services/businessService";
    import BillService from "@/services/billService";
    import { mapState } from "vuex";
    import VueDocPreview from 'vue-doc-preview'
//    import { VueEditor } from "vue2-editor";
    import BusinessBillUpload from "@/components/upload/BusinessBillUpload";
    import endNodeHandle from "@/components/business/modal/endNodeHandle";
    import siderUserBar from "@/components/business/common/SiderUserBar";

    export default {
//        components: { Loading, VueEditor, BusinessPostUpload, endNodeHandle, siderUserBar },
        components: { Loading, BusinessBillUpload, endNodeHandle, siderUserBar, VueDocPreview },
        data() {
            return {
                selected:'1',
                options: [
                    { text: '章节条模式', value: '1' },
                    { text: '条模式', value: '2' },
                ],
                bill_name:"",
                bill_data:[],
                edit_modal_data:{},
                selected_data:[],
                edit_full_modal_show:false,
                delete_modal_show:false,
                part_insert_modal_show:false,
                add_new_bill:false,

                chapterSelected:"",
                chapterOptions:[],
                sectionSelected:null,
                sectionOptions:[],
                partSelected:0,
                partSelectedName:"",
                selectedPartContent:"",
                selectedPartReason:"",
                partMin:0,
                selectedEditChapterID:0,
                selectedEditSectionID:0,


                document_upload_modal:false,
                section_docs_lists:[],
                upload_doc_url:"",
                doc_desc_text:"",
                upload_doc_id:0,
                previewShow:0,
                encodedURLDOCX:"",
                insertPartTitle:"",
                insertPartContent:"",
                insertPartReason:"",

                commitEnd: false,
                columns: {
                    sn: {
                        label: "行号",
                        sortable: false,
                        class: "text-left field-5"
                    },
                    chapter_number: {
                        label: "序章号",
                        sortable: false,
                        class: "text-left field-5"
                    },
                    chapter_title: {
                        label: "章名",
                        sortable: false,
                        class: "text-left field-10"
                    },
                    section_number: {
                        label: "节序号",
                        sortable: false,
                        class: "text-left field-5"
                    },
                    section_title: {
                        label: "节名",
                        sortable: false,
                        class: "text-left field-10"
                    },
                    part_number: {
                        label: "条序名",
                        sortable: false,
                        class: "text-left field-5"
                    },
                    part_title: {
                        label: "条名",
                        sortable: false,
                        class: "text-left field-10"
                    },
                    part_text: {
                        label: "正文",
                        sortable: false,
                        class: "text-left field-30"
                    },
                    control_button: {
                        label: "操作",
                        sortable: false,
                        class: "text-center field-20"
                    },
                },
                columns1: {
                    sn: {
                        label: "行号",
                        sortable: false,
                        class: "text-left field-5"
                    },
                    part_number: {
                        label: "条序名",
                        sortable: false,
                        class: "text-left field-5"
                    },
                    part_title: {
                        label: "条名",
                        sortable: false,
                        class: "text-left field-10"
                    },
                    part_text: {
                        label: "正文",
                        sortable: false,
                        class: "text-left field-30"
                    },
                    control_button: {
                        label: "操作",
                        sortable: false,
                        class: "text-center field-20"
                    },
                },
                columns_upload:{
                    sn: {
                        label: "序号",
                        sortable: false,
                        class: "text-left field-10"
                    },
                    upload_doc_name: {
                        label: "文件名",
                        sortable: false,
                        class: "text-left field-30"
                    },
                    upload_desc: {
                        label: "备注",
                        sortable: false,
                        class: "text-left field-30"
                    },
                    upload_control: {
                        label: "操作",
                        sortable: false,
                        class: "text-left field-30"
                    },
                },
            };
        },
        created() {
            this.$nextTick(() => {
                this.init();
            });
        },
        computed: {
            ...mapState(["userInfo"]),
            currentRoleAllocation() {
                return this.$store.state.meta.currentRoleAllocation;
            }
        },
        watch: {
            // 监控查询参数，如有变化 查询列表数据
            selected: {
                handler() {


                    this.selected_data = [];
                    this.init();
                },
                deep: true
            },
        },
        mounted() {},
        methods: {
            init() {
                this.run();
                BillService.getBillName({
                    business_id: this.$route.params.bid,
                    node_id: this.$route.params.nid,
                    show_mode:this.selected
                })
                    .then(data => {
                        this.bill_name = data.bill_name;
                        this.bill_data = data.bill_data;
                        var checkChapter=[];
                        this.chapterOptions = [];
                        for (let i =0;i<this.bill_data.length;i++){
                            if (!(checkChapter.includes(this.bill_data[i].chapter_number))){
                                checkChapter.push(this.bill_data[i].chapter_number);
                                this.chapterOptions.push({
                                    "text":this.bill_data[i].chapter_number,
                                    "value":this.bill_data[i].chapter_title
                                });
                                checkChapter.push(this.bill_data[i].chapter_number);
                            }
                        }
                        this.partSelected="";
                        this.partSelectedName="";

                        this.$emit("data-ready");``
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
            },
            updatePartsModal1(part_id){
                if (this.selected ==1){
                    this.$refs.selectableTable.clearSelected();
                } else {
                    this.$refs.selectableTable1.clearSelected();
                }
                this.selected_data = [];
              for (let i=0; i<this.bill_data.length;i++){
                  if (this.bill_data[i].part_id == part_id){
                      this.edit_modal_data = this.bill_data[i];
                      this.edit_full_modal_show = true;
                  }
              }
            },
            deletePartsModal1(part_id){
                for (let i=0; i<this.bill_data.length;i++){
                    if (this.selected ==1){
                        this.$refs.selectableTable.clearSelected();
                    } else {
                        this.$refs.selectableTable1.clearSelected();
                    }
                    this.selected_data = [];
                    if (this.bill_data[i].part_id == part_id){
                        this.edit_modal_data = this.bill_data[i];
                        this.delete_modal_show = true;
                    }
                }
            },
            insertNewPartModal(){
                if ((!this.selected_data)||(this.selected_data.length === 0)){
                    this.$toasted.error("Please select part");
                } else {
                    this.part_insert_modal_show = true;
                }
            },
            insertPart(){
                if ((!this.selected_data)||(this.selected_data.length === 0)){
                    this.$toasted.error("Please select part");
                } else {
                    let insert_part_data = {};
                    insert_part_data = this.selected_data;
                    insert_part_data.part_title = this.insertPartTitle;
                    insert_part_data.part_content = this.insertPartContent;
                    insert_part_data.part_reason = this.insertPartReason;

                    BillService.insertPart(insert_part_data)
                        .then(() => {
                            this.init();
                            this.insertModalClear();
                            this.part_insert_modal_show = false;
                        })
                        .catch(() => {
                            this.$emit("data-failed");
                        });
                }
            },
            insertModalClear(){
                this.insertPartTitle="";
                this.insertPartContent="";
                this.insertPartReason="";
            },

            changeArrayUp1(part_id){
                for (let i=0; i<this.bill_data.length;i++){
                    if (this.bill_data[i].part_id == part_id){
                        this.edit_modal_data = this.bill_data[i];
                    }
                }
                BillService.changePartUp(this.edit_modal_data)
                    .then(() => {
                        this.init();
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
                return true
            },
            changeArrayDown1(part_id){
                for (let i=0; i<this.bill_data.length;i++){
                    if (this.bill_data[i].part_id == part_id){
                        this.edit_modal_data = this.bill_data[i];
                    }
                }
                BillService.changePartDown(this.edit_modal_data)
                    .then(() => {
                        this.init();
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
                return true
            },

            updateParts1(){
                this.run();
                BillService.updateFullBills(this.edit_modal_data)
                    .then(() => {
                        this.init();
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
                this.edit_modal_data = {};
                return true
            },

            partSelectedFunc(items){
                this.selected_data = items[0];
                return true
            },

            documentUploadToPart(){
                if ((!this.selected_data)||(this.selected_data.length === 0)){
                    this.$toasted.error("Please select part");
                } else {
                    BillService.getDocList({"part_id":this.selected_data.part_id})
                        .then((data) => {
                            this.section_docs_lists = data.doc_data;
                            this.document_upload_modal = true;
                        })
                        .catch(() => {
                            this.$emit("data-failed");
                        });
                }
            },
            deletePartDoc(doc_id){
                BillService.deleteDoc({"doc_id":doc_id,"part_id":this.selected_data.part_id})
                    .then(() => {
                        BillService.getDocList({"part_id":this.selected_data.part_id})
                            .then((data) => {
                                this.section_docs_lists = data.doc_data;
                                this.document_upload_modal = true;
                            })
                            .catch(() => {
                                this.$emit("data-failed");
                            });
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
            },

            getFileURL(data){
                this.upload_doc_id = data.id;
                this.upload_doc_url = data.fileURL;
            },
            saveDoctoPart(){
                if ((this.upload_doc_id == 0) || (this.upload_doc_url == "")){
                    this.$toasted.error("请上传文件。");
                    return false
                }
                BillService.uploadDoc({"doc_id":this.upload_doc_id,"doc_url":this.upload_doc_url,"doc_conception":this.doc_desc_text,"part_id":this.selected_data.part_id})
                    .then(() => {
                        this.upload_doc_id = 0;
                        this.upload_doc_url = "";
                        this.doc_desc_text = "";
                        BillService.getDocList({"part_id":this.selected_data.part_id})
                            .then((data) => {
                                this.section_docs_lists = data.doc_data;
                            })
                            .catch(() => {
                                this.$emit("data-failed");
                            });
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
            },
            uploadModalClear(){
                this.upload_doc_id = 0;
                this.upload_doc_url = "";
                this.doc_desc_text = "";
                this.encodedURLDOCX = "";
                this.previewShow = 0;

            },
            deleteParts1(){
                this.run();
                BillService.deletePart(this.edit_modal_data)
                    .then(() => {
                        this.init();
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
                this.edit_modal_data = {};
                return true
            },
            saveBillList(){
//                alert(this.$route.params.bid);
                if (this.bill_name == ""){
                    alert('请输入法案名');
                    return false;
                } else {
                    BillService.updateBillListName({'business_id': this.$route.params.bid, 'bill_name': this.bill_name})
                        .then(() => {
                           this.init();
                        })
                        .catch(() => {
                            this.$emit("data-failed");
                        });
                    return true;
                }
            },
            addNewBill(){
                this.add_new_bill = true;
            },

            showPreviewPage(){
                if (this.previewShow == 0){
                    if (this.upload_doc_url != ""){
                        this.encodedURLDOCX = encodeURIComponent(this.upload_doc_url);
                        this.previewShow = 1;
                    }
                } else {
                    this.previewShow = 0;
                    this.encodedURLDOCX = "";
                }

            },

            changeChapter(){
                this.sectionOptions=[];
                this.sectionSelected="";
                this.selectedEditChapterID = 0;
                let sectionsListTemp = [];
                for (let i=0;i<this.bill_data.length;i++){
                    if (this.bill_data[i].chapter_title == this.chapterSelected){
                        this.selectedEditChapterID = this.bill_data[i].chapter_id;
                        sectionsListTemp.push(this.bill_data[i]);
                    }
                }
                let checkSections=[];
                for (let j = 0; j<sectionsListTemp.length; j++){
                    if (!(checkSections.includes(sectionsListTemp[j].section_number))){
                        checkSections.push(sectionsListTemp[j].section_number);
                        this.sectionOptions.push({
                            "text":sectionsListTemp[j].section_number,
                            "value":sectionsListTemp[j].section_title
                        });
                    }
                }
            },
            changeSection(){
                let partListTemp = [];
                for (let i=0;i<this.bill_data.length;i++){
                    if ((this.bill_data[i].chapter_title == this.chapterSelected) &&
                    (this.bill_data[i].section_title == this.sectionSelected)){
                        this.selectedEditSectionID =this.bill_data[i].section_id;
                        partListTemp.push(this.bill_data[i]);
                    }
                }
                this.partMin = partListTemp.length + 1;
                this.partSelected = this.partMin;
            },
            addConfirm(){
                let requestData = {};
                requestData.chapter_id = this.selectedEditChapterID;
                requestData.section_id = this.selectedEditSectionID;
                requestData.part_number = this.partSelected;
                requestData.part_title = this.partSelectedName;
                requestData.part_content = this.selectedPartContent;
                requestData.part_reason = this.selectedPartReason;
                this.add_new_bill = false;

                this.run();
                BillService.addPart(requestData)
                    .then(() => {
                        this.init();
                        this.addModalClear();
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
                return true
            },
            addModalClear(){
                this.selectedEditChapterID="";
                this.selectedEditSectionID="";
                this.partSelected="";
                this.partSelectedName="";
                this.selectedPartContent="";
                this.selectedPartReason="";
                this.sectionOptions=[];
                this.chapterOptions=[];
                this.chapterSelected="";
                this.sectionSelected="";
            },
            endNodeCancel() {
                this.commitEnd = false;
            },

        }
    };
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
    .post-index {
        .create-btns {
            display: flex;
            justify-content: center;
        }
        .vue-upload-file {
            left: 50% !important;
        }
        .field-1 {
            width: 1%;
        }
        .field-5 {
            width: 5%;
        }
        .field-10 {
            width: 10%;
            text-overflow: ellipsis;
        }
        .field-15 {
            width: 15%;
            text-overflow: ellipsis;
        }
        .field-20 {
            width: 20%;
            text-overflow: ellipsis;
        }
        .field-30 {
            width: 30%;
        }
        .field-40 {
            width: 40%;
        }
        .field-50 {
            width: 50%;
        }
        .field-60 {
            width: 60%;
        }
        .field-70 {
            width: 70%;
        }
        .field-80 {
            width: 80%;
        }
        .field-90 {
            width: 90%;
        }
        .field-100 {
            width: 100%;
        }
        .field-sn {
            width: 3%;
        }
        .field-name {
            width: 25%;
        }
        .field-creator {
            width: 9%;
        }
        .field-create_time {
            width: 13%;
        }
        .field-rend_ani_1 {
            width: 19%;
        }
        .field-rend_ani_2 {
            width: 10%;
        }
        .field-experiment_type_label {
            width: 7%;
        }
        .field-experiment_task_label {
            width: 15%;
        }
        .field-status {
            width: 5%;
        }
        .field-action {
            width: 20%;
        }
    }
</style>
