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
                                @click="allBillPreviewModal()"
                        >法案预览</b-button>
                    </b-button-group>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="9">
                    <span v-if="selected==1">章节条模式</span>
                    <span v-if="selected==2">条模式</span>
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
                                            @click="updatePartsModal2(row.item.part_id)"
                                    >修改</b-button>
                                    <b-button
                                            :size="template_size"
                                            class="styledBtn"
                                            variant="outline-primary"
                                            @click="changeArrayUp2(row.item.part_id)"
                                    >上移</b-button>
                                    <b-button
                                            :size="template_size"
                                            class="styledBtn"
                                            variant="outline-primary"
                                            @click="changeArrayDown2(row.item.part_id)"
                                    >下移</b-button>
                                    <b-button
                                            :size="template_size"
                                            class="styledBtn"
                                            variant="outline-primary"
                                            @click="deletePartsModal2(row.item.part_id)"
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
        <br>
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
                </b-row>
                <b-row align-v="center">
                    <b-col sm="12">
                        <b-form-group label="正文:" label-for="textarea3">
                            <b-form-textarea
                                    required
                                    id="textarea3"
                                    v-model="edit_modal_data.part_content"
                                    placeholder="Enter something..."
                                    rows="6"
                                    max-rows="12"
                            ></b-form-textarea>
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
                v-model="add_new_bill_modal_show"
                ok-title="确定"
                cancel-title="取消"
                @hidden="addModalClear"
                size="xl"
                hide-footer
        >
            <div v-if="selected==1">
                <b-form-group label-cols="1" label="增加模式:" label-for="radio-group-2">
                    <b-form-radio-group
                            id="radio-group-2"
                            v-model="add_modal_selected"
                            :options="add_modal_options"
                            name="add-modal-options"
                    ></b-form-radio-group>
                </b-form-group>
                <b-container v-if="add_modal_selected==3" fluid>
                    <b-form @submit.stop.prevent="addConfirm_part">
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
                                    <b-form-select id="inputAdd3" required ref="sectionSelected" v-model="sectionSelected" :options="sectionOptions" @change="changeSection()">
                                        <template slot="first">
                                            <option :value="null" disabled>-- Please select an option --</option>
                                        </template>
                                    </b-form-select>
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
                <b-container v-if="add_modal_selected==2" fluid>
                    <b-form @submit.stop.prevent="addConfirm_section">
                        <b-row>
                            <b-col sm="6">
                                <b-form-group label-cols-sm="4" label="章序号:" label-for="inputAdd_section1">
                                    <b-form-select id="inputAdd_section1" required ref="chapterSelectBox" v-model="chapterSelected" :options="chapterOptions" @change="changeChapter()">
                                        <template slot="first">
                                            <option :value="null" disabled>-- Please select an option --</option>
                                        </template>
                                    </b-form-select>
                                </b-form-group>
                            </b-col>
                            <b-col sm="6">
                                <b-form-group label-cols-sm="4" label="章名:" label-for="inputAdd_section2">
                                    <b-form-input id="inputAdd_section2" required v-model="chapterSelected" ></b-form-input>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col sm="6">
                                <b-form-group label-cols-sm="4" label="节号:" label-for="inputAdd_section4">
                                    <b-form-input id="inputAdd_section4" required v-model="sectionSelected_section" ></b-form-input>
                                </b-form-group>
                            </b-col>
                            <b-col sm="6">
                                <b-form-group label-cols-sm="4" label="第一条名称:" label-for="inputAdd_section6">
                                    <b-form-input id="inputAdd_section6" required v-model="partSelected_section" ></b-form-input>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col sm="12">
                                <b-form-group label="条文正文:" label-for="textarea_section1">
                                    <b-form-textarea
                                            required
                                            id="textarea_section1"
                                            v-model="selectedPartContent_section"
                                            placeholder="Enter something..."
                                            rows="6"
                                            max-rows="12"
                                    ></b-form-textarea>
                                </b-form-group>
                                <b-form-group label="制定理由:" label-for="textarea_section2">
                                    <b-form-textarea
                                            required
                                            id="textarea_section2"
                                            v-model="selectedPartReason_section"
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
                <b-container v-if="add_modal_selected==1" fluid>
                    <b-form @submit.stop.prevent="addConfirm_chapter">
                        <b-row>
                            <b-col sm="12">
                                <b-form-group label-cols-sm="4" label="章名:" label-for="inputAdd_chapter2">
                                    <b-form-input id="inputAdd_chapter2" required v-model="chapterSelected_chapter" ></b-form-input>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col sm="12">
                                <b-form-group label-cols-sm="4" label="第一节名:" label-for="inputAdd_chapter4">
                                    <b-form-input id="inputAdd_chapter4" required v-model="sectionSelected_chapter" ></b-form-input>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col sm="12">
                                <b-form-group label-cols-sm="4" label="第一条名称:" label-for="inputAdd_chapter6">
                                    <b-form-input id="inputAdd_chapter6" required v-model="partSelected_chapter" ></b-form-input>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col sm="12">
                                <b-form-group label="条文正文:" label-for="textarea_chapter1">
                                    <b-form-textarea
                                            required
                                            id="textarea_chapter1"
                                            v-model="selectedPartContent_chapter"
                                            placeholder="Enter something..."
                                            rows="6"
                                            max-rows="12"
                                    ></b-form-textarea>
                                </b-form-group>
                                <b-form-group label="制定理由:" label-for="textarea_chapter2">
                                    <b-form-textarea
                                            required
                                            id="textarea_chapter2"
                                            v-model="selectedPartReason_chapter"
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
            </div>
            <div v-if="selected==2">
                <b-container fluid>
                    <b-form @submit.stop.prevent="addConfirm_part">
                        <b-row>
                            <b-col sm="6">
                                <b-form-group label-cols-sm="4" label="条文序号:" label-for="inputAddPart5">
                                    <b-form-input id="inputAddPart5" required type="number" :min="partMin" disabled v-model="partSelected"></b-form-input>
                                </b-form-group>
                            </b-col>
                            <b-col sm="6">
                                <b-form-group label-cols-sm="4" label="条文名称:" label-for="inputAddPart6">
                                    <b-form-input id="inputAddPart6" required v-model="partSelectedName" ></b-form-input>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col sm="12">
                                <b-form-group label="条文正文:" label-for="textareaPart1">
                                    <b-form-textarea
                                            required
                                            id="textareaPart1"
                                            v-model="selectedPartContent"
                                            placeholder="Enter something..."
                                            rows="6"
                                            max-rows="12"
                                    ></b-form-textarea>
                                </b-form-group>
                                <b-form-group label="制定理由:" label-for="textareaPart2">
                                    <b-form-textarea
                                            required
                                            id="textareaPart2"
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
            </div>
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
                                            <b-button
                                            :size="template_size"
                                            class="styledBtn"
                                            variant="outline-primary"
                                            @click="downoloadDoc(row.item.doc_url)"
                                            ><icon name="download" ></icon> 下载</b-button>
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
            <b-container v-if="selected==1" fluid>
                <b-form @submit.stop.prevent="insertPart">
                    <b-row>
                        <b-col sm="6">
                            <b-form-group label-cols-sm="4" label="章序号:" label-for="insertPart1">
                                <b-form-input id="insertPart1" disabled v-model="selected_chapter_number" ></b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col sm="6">
                            <b-form-group label-cols-sm="4" label="章名:" label-for="insertPart2">
                                <b-form-input id="insertPart2" disabled v-model="selected_chapter_title" ></b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col sm="6">
                            <b-form-group label-cols-sm="4" label="节序号:" label-for="insertPart3">
                                <b-form-input id="insertPart3" disabled v-model="selected_section_number" ></b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col sm="6">
                            <b-form-group label-cols-sm="4" label="节名:" label-for="insertPart4">
                                <b-form-input id="insertPart4" disabled v-model="selected_section_title" ></b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col sm="6">
                            <b-form-group label-cols-sm="4" label="条文序号:" label-for="insertPart5">
                                <b-form-input id="insertPart5" disabled v-model="selected_part_number"></b-form-input>
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
            <b-container v-if="selected==2" fluid>
                <b-form @submit.stop.prevent="insertPart">
                    <b-row>
                        <b-col sm="6">
                            <b-form-group label-cols-sm="4" label="条文序号:" label-for="insertPartMode5">
                                <b-form-input id="insertPartMode5" disabled v-model="selected_part_number"></b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col sm="6">
                            <b-form-group label-cols-sm="4" label="条文名称:" label-for="insertPartMode6">
                                <b-form-input id="insertPartMode6" required v-model="insertPartTitle" ></b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col sm="12">
                            <b-form-group label="条文正文:" label-for="insertTextareaMode1">
                                <b-form-textarea
                                        required
                                        id="insertTextareaMode1"
                                        v-model="insertPartContent"
                                        placeholder="Enter something..."
                                        rows="6"
                                        max-rows="12"
                                ></b-form-textarea>
                            </b-form-group>
                            <b-form-group label="制定理由:" label-for="insertTextareaMode2">
                                <b-form-textarea
                                        required
                                        id="insertTextareaMode2"
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

        <!--preview bill-->
        <b-modal
                title="法案预览"
                v-model="all_bill_preview_modal_show"
                ok-title="确定"
                cancel-title="取消"
                @hidden="allBillPreviewModalClear"
                size="xl"
                hide-footer
        >
            <b-container fluid>
                <b-row v-if="selected==1">
                    <b-col sm="6">
                        <b-card-group deck>
                            <b-card header="现 行 法 案">
                                <ul class="list-group">
                                    <li class="list-group-item" v-for="(bill_data_origin_one,index) in bill_data_origin" :key="index">
                                        <!--{{bill_data_origin_one}}-->
                                        {{ bill_data_origin_one.chapter_number }} . {{ bill_data_origin_one.chapter_title }} <br>
                                        {{ bill_data_origin_one.section_number }} . {{ bill_data_origin_one.section_title }} <br>
                                        {{ bill_data_origin_one.part_number }} . {{ bill_data_origin_one.part_title }} <br>
                                        {{ bill_data_origin_one.part_content }}
                                    </li>
                                </ul>
                            </b-card>
                        </b-card-group>
                    </b-col>
                    <b-col sm="6">
                        <b-card-group deck>
                            <b-card header="新 法 案">
                                <ul class="list-group">
                                    <li class="list-group-item" v-for="(bill_data_one,index) in bill_data_comparison" :key="index">
                                        <!--updated-->
                                        <span v-if="bill_data_one.added_flag=='1'" style="color:red">
                                            <!--{{bill_data_one}}-->
                                                {{ bill_data_one.chapter_number }} . {{ bill_data_one.chapter_title }} <br>
                                                {{ bill_data_one.section_number }} . {{ bill_data_one.section_title }} <br>
                                                {{ bill_data_one.part_number }} . {{ bill_data_one.part_title }} <br>
                                                {{ bill_data_one.part_content }}
                                            </span>
                                        <!--inserted-->
                                        <span v-if="bill_data_one.added_flag=='2'" style="color:blue">
                                                <!--{{bill_data_one}}-->
                                                {{ bill_data_one.chapter_number }} . {{ bill_data_one.chapter_title }} <br>
                                                {{ bill_data_one.section_number }} . {{ bill_data_one.section_title }} <br>
                                                {{ bill_data_one.part_number }} . {{ bill_data_one.part_title }} <br>
                                                {{ bill_data_one.part_content }}
                                            </span>
                                        <!--deleted-->
                                        <span v-if="bill_data_one.added_flag=='3'" style="text-decoration:line-through;color:red">
                                                <!--{{bill_data_one}}-->
                                                {{ bill_data_one.chapter_number }} . {{ bill_data_one.chapter_title }} <br>
                                                {{ bill_data_one.section_number }} . {{ bill_data_one.section_title }} <br>
                                                {{ bill_data_one.part_number }} . {{ bill_data_one.part_title }} <br>
                                                {{ bill_data_one.part_content }}
                                            </span>
                                        <span v-if="bill_data_one.added_flag=='0'">
                                                <!--{{bill_data_one}}-->
                                                {{ bill_data_one.chapter_number }} . {{ bill_data_one.chapter_title }} <br>
                                                {{ bill_data_one.section_number }} . {{ bill_data_one.section_title }} <br>
                                                {{ bill_data_one.part_number }} . {{ bill_data_one.part_title }} <br>
                                                {{ bill_data_one.part_content }}
                                            </span>

                                    </li>
                                </ul>
                            </b-card>
                        </b-card-group>
                    </b-col>
                </b-row>
                <b-row v-if="selected==2">
                    <b-col sm="6">
                        <b-card-group deck>
                            <b-card header="现 行 法 案">
                                <ul class="list-group">
                                    <li class="list-group-item" v-for="(bill_data_origin_one,index) in bill_data_origin" :key="index">
                                        <!--{{bill_data_origin_one}}-->
                                        {{ bill_data_origin_one.part_number }} . {{ bill_data_origin_one.part_title }} <br>
                                        {{ bill_data_origin_one.part_content }}
                                    </li>
                                </ul>
                            </b-card>
                        </b-card-group>
                    </b-col>
                    <b-col sm="6">
                        <b-card-group deck>
                            <b-card header="新 法 案">
                                <ul class="list-group">
                                    <li class="list-group-item" v-for="(bill_data_one,index) in bill_data_comparison" :key="index">
                                        <!--updated-->
                                        <span v-if="bill_data_one.added_flag=='1'" style="color:red">
                                        <!--{{bill_data_one}}-->
                                            {{ bill_data_one.part_number }} . {{ bill_data_one.part_title }} <br>
                                            {{ bill_data_one.part_content }}
                                        </span>
                                        <!--inserted-->
                                        <span v-if="bill_data_one.added_flag=='2'" style="color:blue">
                                            <!--{{bill_data_one}}-->
                                            {{ bill_data_one.part_number }} . {{ bill_data_one.part_title }} <br>
                                            {{ bill_data_one.part_content }}
                                        </span>
                                        <!--deleted-->
                                        <span v-if="bill_data_one.added_flag=='3'" style="text-decoration:line-through;color:red">
                                            <!--{{bill_data_one}}-->
                                            {{ bill_data_one.part_number }} . {{ bill_data_one.part_title }} <br>
                                            {{ bill_data_one.part_content }}
                                        </span>
                                        <span v-if="bill_data_one.added_flag=='0'">
                                            <!--{{bill_data_one}}-->
                                            {{ bill_data_one.part_number }} . {{ bill_data_one.part_title }} <br>
                                            {{ bill_data_one.part_content }}
                                        </span>
                                    </li>
                                </ul>
                            </b-card>
                        </b-card-group>
                    </b-col>
                </b-row>
            </b-container>
        </b-modal>

        <!--Save bill-->
        <b-modal
                title="保存法案"
                v-model="save_modal_show"
                ok-title="确定"
                cancel-title="取消"
                size="xl"
                @cancel="save_modal_show=false"
                @ok="saveParts1"
        >
            <div class="modal-msg">
                <p class="message">Are you sure to save this bill?</p>
            </div>
        </b-modal>

        <!--show mode setting modal-->
        <b-modal
                title="法案模式"
                v-model="setting_show_mode_modal_show"
                ok-title="确定"
                cancel-title="取消"
                size="xl"
                ok-only
                @ok="setting_show_mode_modal_show=false"
        >
            <b-form-group label-cols="1" label="法案模式:" label-for="input-horizontal2">
                <b-form-radio-group
                        id="radio-group-1"
                        v-model="selected"
                        :options="options"
                        name="radio-options"
                ></b-form-radio-group>
            </b-form-group>
        </b-modal>


    </div>
</template>

<script>
    import Loading from "@/components/loading/Loading";
    import BillService from "@/services/billService";
    import { mapState } from "vuex";
    //    import { number2chinese } from 'number2chinese';
    import VueDocPreview from 'vue-doc-preview'
    import BusinessBillUpload from "@/components/upload/BusinessBillUpload";
    import endNodeHandle from "@/components/business/modal/endNodeHandle";
    import siderUserBar from "@/components/business/common/SiderUserBar";
    import { openFile } from "@/utils/previewFile";
    export default {
        components: { Loading, BusinessBillUpload, endNodeHandle, siderUserBar, VueDocPreview },
        data() {
            return {
                bill_data_origin:[],
                bill_data_comparison:[],
                comparison_fields:{
                    sn: {
                        label: "现 行 法 案",
                        sortable: false,
                        class: "text-left field-100"
                    },
                    data:{
                        label: "现 行 法 案",
                        sortable: false,
                        class: "text-left field-100"
                    }
                },
                edit_modal_data:{},
                selected:'1',
                add_modal_selected:'1',
                options: [
                    { text: '章节条模式', value: 1 },
                    { text: '条模式', value: 2 },
                ],
                add_modal_options: [
                    { text: '增加章', value: '1' },
                    { text: '增加节', value: '2' },
                    { text: '增加条', value: '3' },
                ],
                bill_name:"",
                bill_data:[],
                selected_data:[],
                edit_full_modal_show:false,
                delete_modal_show:false,
                part_insert_modal_show:false,
                add_new_bill_modal_show:false,
                save_modal_show:false,
                setting_show_mode_modal_show:false,
                chapterSelected:"",
                chapterOptions:[],
                sectionSelected:null,
                sectionOptions:[],
                partSelected:0,
                partSelectedName:"",
                selectedPartContent:"",
                selectedPartReason:"",
                partMin:0,
                chapterSelected_chapter:"",
                sectionSelected_chapter:"",
                partSelected_chapter:"",
                selectedPartContent_chapter:"",
                selectedPartReason_chapter:"",
                sectionSelected_section:"",
                partSelected_section:"",
                selectedPartContent_section:"",
                selectedPartReason_section:"",
                selected_chapter_number:"",
                selected_chapter_title:"",
                selected_section_number:"",
                selected_section_title:"",
                selected_part_number:"",
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
                all_bill_preview_modal_show:false,
                all_bill_preview_modalURL:"",
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
//                    this.init();
                },
                deep: true
            },
        },
        mounted() {},
        methods: {
            previewFile(fileUrl) {
                openFile(fileUrl, this.userInfo.id);
            },
            downoloadDoc(docURL){
                window.open(docURL);
            },
            gadget_sort(data){
                if (this.selected == 1){
                    data.sort(function(a, b) {
                        return a.chapter_number - b.chapter_number  ||  a.section_number - b.section_number ||  a.part_number - b.part_number;
                    });
                }
                if (this.selected == 2 ){
                    data.sort(function(a, b) {
                        return a.part_number - b.part_number;
                    });
                }
                return true
            },
            gadget_sort_comparison(){
                if (this.selected == 1){
                    this.bill_data_comparison.sort(function(a, b) {
                        return a.chapter_number - b.chapter_number  ||  a.section_number - b.section_number ||  a.part_number - b.part_number ;
                    });
                }
                if (this.selected == 2){
                    this.bill_data_comparison.sort(function(a, b) {
                        return a.part_number - b.part_number ;
                    });
                }
                return true
            },
            init() {
                this.run();
                BillService.getBillNameOnly({
                    business_id: this.$route.params.bid,
                    node_id: this.$route.params.nid,
                }).then(data1 => {
                    if (data1.bill_name == ""){
                        this.setting_show_mode_modal_show = true;
                        this.$emit("data-ready");
                        return
                    }
                    else {
                        this.selected = parseInt(data1.edit_mode);
                        BillService.getBillName({
                            business_id: this.$route.params.bid,
                            node_id: this.$route.params.nid,
                            show_mode:this.selected
                        })
                            .then(data => {
                                this.bill_name = data.bill_name;
                                this.bill_data = data.bill_data;
                                if (this.selected == 1){
                                    var checkChapter=[];
                                    this.chapterOptions = [];
                                    for (let i =0;i<this.bill_data.length;i++){
                                        if (!(checkChapter.includes(this.bill_data[i].chapter_number))){
                                            checkChapter.push(this.bill_data[i].chapter_number);
                                            this.chapterOptions.push({
                                                "text":this.bill_data[i].chapter_number,
                                                "value":this.bill_data[i].chapter_title
                                            });
                                        }
                                    }
                                }
                                this.partSelected="";
                                this.partSelectedName="";
                                this.$emit("data-ready");
                            })
                            .catch(() => {
                                this.$emit("data-failed");
                            });
                    }
                });
            },
            updatePartsModal1(part_id){
                this.$refs.selectableTable.clearSelected();
                this.selected_data = [];
                for (let i=0; i<this.bill_data.length;i++){
                    if (this.bill_data[i].part_id == part_id){
                        this.edit_modal_data.part_id = this.bill_data[i].part_id;
                        this.edit_modal_data.chapter_title = this.bill_data[i].chapter_title;
                        this.edit_modal_data.chapter_number = this.bill_data[i].chapter_number;
                        this.edit_modal_data.section_title = this.bill_data[i].section_title;
                        this.edit_modal_data.section_number = this.bill_data[i].section_number;
                        this.edit_modal_data.part_title = this.bill_data[i].part_title;
                        this.edit_modal_data.part_number = this.bill_data[i].part_number;
                        this.edit_modal_data.part_content = this.bill_data[i].part_content;
                        this.edit_modal_data.part_reason = this.bill_data[i].part_reason;
                        this.edit_full_modal_show = true;
                    }
                }
            },
            updatePartsModal2(part_id){
                this.$refs.selectableTable1.clearSelected();
                this.selected_data = [];
                for (let i=0; i<this.bill_data.length;i++){
                    if (this.bill_data[i].part_id == part_id){
                        this.edit_modal_data.part_id = this.bill_data[i].part_id;
                        this.edit_modal_data.part_title = this.bill_data[i].part_title;
                        this.edit_modal_data.part_number = this.bill_data[i].part_number;
                        this.edit_modal_data.part_content = this.bill_data[i].part_content;
                        this.edit_modal_data.part_reason = this.bill_data[i].part_reason;
                        this.edit_full_modal_show = true;
                    }
                }
            },
            updateParts1(){
                if (this.selected == 1){
                    for (let i=0; i<this.bill_data.length;i++){
                        if (this.bill_data[i].chapter_number == this.edit_modal_data.chapter_number){
                            this.bill_data[i].chapter_title = this.edit_modal_data.chapter_title;
                            if (this.bill_data[i].section_number == this.edit_modal_data.section_number){
                                this.bill_data[i].section_title = this.edit_modal_data.section_title;
                                if (this.bill_data[i].part_id == this.edit_modal_data.part_id){
                                    this.bill_data[i].part_title = this.edit_modal_data.part_title;
                                    this.bill_data[i].part_content = this.edit_modal_data.part_content;
                                }
                            }
                        }
                    }
                }
                if (this.selected == 2){
                    for (let i=0; i<this.bill_data.length;i++) {
                        if (this.bill_data[i].part_id == this.edit_modal_data.part_id) {
                            this.bill_data[i].part_title = this.edit_modal_data.part_title;
                            this.bill_data[i].part_content = this.edit_modal_data.part_content;
                        }
                    }
                }
                this.edit_full_modal_show = true;
                this.gadget_sort(this.bill_data);
                this.edit_modal_data = {};
                return true
            },
            deletePartsModal1(part_id){
                this.$refs.selectableTable.clearSelected();
                for (let i=0; i<this.bill_data.length;i++){
                    this.selected_data = [];
                    if (this.bill_data[i].part_id == part_id){
                        this.edit_modal_data.part_id = this.bill_data[i].part_id;
                        this.edit_modal_data.chapter_title = this.bill_data[i].chapter_title;
                        this.edit_modal_data.chapter_number = this.bill_data[i].chapter_number;
                        this.edit_modal_data.section_title = this.bill_data[i].section_title;
                        this.edit_modal_data.section_number = this.bill_data[i].section_number;
                        this.edit_modal_data.part_title = this.bill_data[i].part_title;
                        this.edit_modal_data.part_number = this.bill_data[i].part_number;
                        this.edit_modal_data.part_content = this.bill_data[i].part_content;
                        this.edit_modal_data.part_reason = this.bill_data[i].part_reason;
                        this.delete_modal_show = true;
                    }
                }
            },
            deletePartsModal2(part_id){
                this.$refs.selectableTable1.clearSelected();
                for (let i=0; i<this.bill_data.length;i++){
                    this.selected_data = [];
                    if (this.bill_data[i].part_id == part_id){
                        this.edit_modal_data.part_id = this.bill_data[i].part_id;
                        this.edit_modal_data.part_title = this.bill_data[i].part_title;
                        this.edit_modal_data.part_number = this.bill_data[i].part_number;
                        this.edit_modal_data.part_content = this.bill_data[i].part_content;
                        this.edit_modal_data.part_reason = this.bill_data[i].part_reason;
                        this.delete_modal_show = true;
                    }
                }
            },
            deleteParts1(){
                let deleted_index = 0;
                if (this.selected == 1) {
                    for (let i = 0; i < this.bill_data.length; i++) {
                        if (this.bill_data[i].chapter_number == this.edit_modal_data.chapter_number) {
                            if (this.bill_data[i].section_number == this.edit_modal_data.section_number) {
                                if (this.bill_data[i].part_id == this.edit_modal_data.part_id) {
                                    deleted_index = i;
                                    break
                                }
                            }
                        }
                    }
                    let deleted_chapter_part_amount = 0;
                    let deleted_section_part_amount = 0;
                    for (let j = 0; j < this.bill_data.length; j++) {
                        if (this.bill_data[j].chapter_number == this.edit_modal_data.chapter_number) {
                            deleted_chapter_part_amount = deleted_chapter_part_amount + 1;
                            if (this.bill_data[j].section_number == this.edit_modal_data.section_number) {
                                deleted_section_part_amount = deleted_section_part_amount + 1;
                            }
                        }
                    }
                    if (deleted_section_part_amount < 2) {
                        for (let l = 0; l < this.bill_data.length; l++) {
                            if (this.bill_data[l].chapter_number == this.edit_modal_data.chapter_number) {
                                if (parseInt(this.bill_data[l].section_number) == parseInt(this.edit_modal_data.section_number) + 1) {
                                    this.bill_data[l].section_number = parseInt(this.edit_modal_data.section_number);
                                }
                            }
                        }
                    } else {
                        for (let l = 0; l < this.bill_data.length; l++) {
                            if (this.bill_data[l].chapter_number == this.edit_modal_data.chapter_number) {
                                if (this.bill_data[l].section_number == this.edit_modal_data.section_number) {
                                    if (parseInt(this.bill_data[l].part_number) > parseInt(this.edit_modal_data.part_number)) {
                                        this.bill_data[l].part_number = parseInt(this.bill_data[l].part_number) - 1;
                                    }
                                }
                            }
                        }
                    }
                    if (deleted_chapter_part_amount < 2) {
                        for (let k = deleted_index + 1; k < this.bill_data.length; k++) {
                            this.bill_data[k].chapter_number = parseInt(this.bill_data[k].chapter_number) - 1;
                        }
                    }
                }
                if ( this.selected == 2 ){
                    for (let i = 0; i < this.bill_data.length; i++) {
                        if (this.bill_data[i].part_id == this.edit_modal_data.part_id) {
                            deleted_index = i;
                            break
                        }
                    }
                    for (let l = 0; l < this.bill_data.length; l++) {
                        if (parseInt(this.bill_data[l].part_number) > parseInt(this.edit_modal_data.part_number)) {
                            this.bill_data[l].part_number = parseInt(this.bill_data[l].part_number) - 1;
                        }
                    }
                }
                this.bill_data.splice( deleted_index,1 );
                this.gadget_sort(this.bill_data);
                this.edit_modal_data = {};
                return true
            },
            changeArrayUp1(part_id){
                this.$refs.selectableTable.clearSelected();
                this.selected_data = [];
                for (let i=0; i<this.bill_data.length;i++){
                    if (this.bill_data[i].part_id == part_id){
                        this.edit_modal_data.part_id = this.bill_data[i].part_id;
                        this.edit_modal_data.chapter_title = this.bill_data[i].chapter_title;
                        this.edit_modal_data.chapter_number = this.bill_data[i].chapter_number;
                        this.edit_modal_data.section_title = this.bill_data[i].section_title;
                        this.edit_modal_data.section_number = this.bill_data[i].section_number;
                        this.edit_modal_data.part_title = this.bill_data[i].part_title;
                        this.edit_modal_data.part_number = this.bill_data[i].part_number;
                        this.edit_modal_data.part_content = this.bill_data[i].part_content;
                    }
                }
                let index = 0;
                for (let i=0; i<this.bill_data.length;i++){
                    if (this.bill_data[i].chapter_number == this.edit_modal_data.chapter_number){
                        if (this.bill_data[i].section_number == this.edit_modal_data.section_number){
                            if (this.bill_data[i].part_id == this.edit_modal_data.part_id){
                                index = i;
                                break
                            }
                        }
                    }
                }
                if (parseInt(this.bill_data[index].part_number) == 1){
                    this.$toasted.error("不能上移");
                    return false;
                }
                for (let j=0; j<this.bill_data.length;j++){
                    if (this.bill_data[j].chapter_number == this.edit_modal_data.chapter_number){
                        if (this.bill_data[j].section_number == this.edit_modal_data.section_number){
                            if (this.bill_data[j].part_id != this.edit_modal_data.part_id){
                                if ((parseInt(this.bill_data[j].part_number) + 1) == parseInt(this.edit_modal_data.part_number)){
                                    this.bill_data[j].part_number = parseInt(this.edit_modal_data.part_number);
                                    this.bill_data[j].added_flag = "1";
                                }
                            }
                        }
                    }
                }
                for (let j=0; j<this.bill_data.length;j++){
                    if (this.bill_data[j].chapter_number == this.edit_modal_data.chapter_number){
                        if (this.bill_data[j].section_number == this.edit_modal_data.section_number){
                            if (this.bill_data[j].part_id == this.edit_modal_data.part_id){
                                this.edit_modal_data.part_number = parseInt(this.edit_modal_data.part_number) - 1;
                                this.bill_data[j].part_number = parseInt(this.edit_modal_data.part_number);
                                this.bill_data[j].added_flag = "1";
                            }
                        }
                    }
                }
                this.edit_modal_data = {};
                this.gadget_sort(this.bill_data);
                return true
            },
            changeArrayDown1(part_id){
                this.$refs.selectableTable.clearSelected();
                this.selected_data = [];
                for (let i=0; i<this.bill_data.length;i++){
                    if (this.bill_data[i].part_id == part_id){
                        this.edit_modal_data.part_id = this.bill_data[i].part_id;
                        this.edit_modal_data.chapter_title = this.bill_data[i].chapter_title;
                        this.edit_modal_data.chapter_number = this.bill_data[i].chapter_number;
                        this.edit_modal_data.section_title = this.bill_data[i].section_title;
                        this.edit_modal_data.section_number = this.bill_data[i].section_number;
                        this.edit_modal_data.part_title = this.bill_data[i].part_title;
                        this.edit_modal_data.part_number = this.bill_data[i].part_number;
                        this.edit_modal_data.part_content = this.bill_data[i].part_content;
                    }
                }
                let checkDownTmp = 0;
                for (let j=0; j<this.bill_data.length;j++){
                    if ( this.bill_data[j].chapter_number == this.edit_modal_data.chapter_number ){
                        if ( this.bill_data[j].section_number == this.edit_modal_data.section_number ){
                            if (parseInt(this.bill_data[j].part_number) > parseInt(this.edit_modal_data.part_number)){
                                checkDownTmp = checkDownTmp + 1;
                                break;
                            }
                        }
                    }
                }
                if (checkDownTmp == 0){
                    this.$toasted.error("不能下移");
                    return false;
                }
                for (let k=0; k<this.bill_data.length;k++){
                    if (this.bill_data[k].chapter_number == this.edit_modal_data.chapter_number){
                        if (this.bill_data[k].section_number == this.edit_modal_data.section_number){
                            if (this.bill_data[k].part_id != this.edit_modal_data.part_id){
                                if ((parseInt(this.bill_data[k].part_number) - 1) == parseInt(this.edit_modal_data.part_number)){
                                    this.bill_data[k].part_number = parseInt(this.edit_modal_data.part_number);
                                    this.bill_data[k].added_flag = "1";
                                }
                            }
                        }
                    }
                }
                for (let l=0; l<this.bill_data.length;l++){
                    if (this.bill_data[l].chapter_number == this.edit_modal_data.chapter_number){
                        if (this.bill_data[l].section_number == this.edit_modal_data.section_number){
                            if (this.bill_data[l].part_id == this.edit_modal_data.part_id){
                                this.edit_modal_data.part_number = parseInt(this.edit_modal_data.part_number) + 1;
                                this.bill_data[l].part_number = parseInt(this.edit_modal_data.part_number);
                                this.bill_data[l].added_flag = "1";
                            }
                        }
                    }
                }
                this.gadget_sort(this.bill_data);
                this.edit_modal_data = {};
                return true
            },
            changeArrayUp2(part_id){
                this.$refs.selectableTable1.clearSelected();
                this.selected_data = [];
                for (let i=0; i<this.bill_data.length;i++){
                    if (this.bill_data[i].part_id == part_id){
                        this.edit_modal_data.part_id = this.bill_data[i].part_id;
                        this.edit_modal_data.part_title = this.bill_data[i].part_title;
                        this.edit_modal_data.part_number = this.bill_data[i].part_number;
                        this.edit_modal_data.part_content = this.bill_data[i].part_content;
                    }
                }
                let index = 0;
                for (let i=0; i<this.bill_data.length;i++){
                    if (this.bill_data[i].part_id == this.edit_modal_data.part_id){
                        index = i;
                        break
                    }
                }
                if (parseInt(this.bill_data[index].part_number) == 1){
                    this.$toasted.error("不能上移");
                    return false;
                }
                for (let j=0; j<this.bill_data.length;j++){
                    if (this.bill_data[j].part_id != this.edit_modal_data.part_id){
                        if ((parseInt(this.bill_data[j].part_number) + 1) == parseInt(this.edit_modal_data.part_number)){
                            this.bill_data[j].part_number = parseInt(this.edit_modal_data.part_number);
                            this.bill_data[j].added_flag = "1";
                        }
                    }
                }
                for (let j=0; j<this.bill_data.length;j++){
                    if (this.bill_data[j].part_id == this.edit_modal_data.part_id){
                        this.edit_modal_data.part_number = parseInt(this.edit_modal_data.part_number) - 1;
                        this.bill_data[j].part_number = parseInt(this.edit_modal_data.part_number);
                        this.bill_data[j].added_flag = "1";
                    }
                }
                this.edit_modal_data = {};
                this.gadget_sort(this.bill_data);
                return true
            },
            changeArrayDown2(part_id){
                this.$refs.selectableTable1.clearSelected();
                this.selected_data = [];
                for (let i=0; i<this.bill_data.length;i++){
                    if (this.bill_data[i].part_id == part_id){
                        this.edit_modal_data.part_id = this.bill_data[i].part_id;
                        this.edit_modal_data.part_title = this.bill_data[i].part_title;
                        this.edit_modal_data.part_number = this.bill_data[i].part_number;
                        this.edit_modal_data.part_content = this.bill_data[i].part_content;
                    }
                }
                let checkDownTmp = 0;
                for (let j=0; j<this.bill_data.length;j++){
                    if (parseInt(this.bill_data[j].part_number) > parseInt(this.edit_modal_data.part_number)){
                        checkDownTmp = checkDownTmp + 1;
                        break;
                    }
                }
                if (checkDownTmp == 0){
                    this.$toasted.error("不能下移");
                    return false;
                }
                for (let k=0; k<this.bill_data.length;k++){
                    if (this.bill_data[k].part_id != this.edit_modal_data.part_id){
                        if ((parseInt(this.bill_data[k].part_number) - 1) == parseInt(this.edit_modal_data.part_number)){
                            this.bill_data[k].part_number = parseInt(this.edit_modal_data.part_number);
                            this.bill_data[k].added_flag = "1";
                        }
                    }
                }
                for (let l=0; l<this.bill_data.length;l++){
                    if (this.bill_data[l].part_id == this.edit_modal_data.part_id){
                        this.edit_modal_data.part_number = parseInt(this.edit_modal_data.part_number) + 1;
                        this.bill_data[l].part_number = parseInt(this.edit_modal_data.part_number);
                        this.bill_data[l].added_flag = "1";
                    }
                }
                this.gadget_sort(this.bill_data);
                this.edit_modal_data = {};
                return true
            },
/////////////////////////////////////////////////////////////////
            addNewBill(){
                if (this.selected == 2){
                    this.partSelected = this.bill_data.length + 1;
                }
                this.add_new_bill_modal_show = true;
            },
            addConfirm_chapter(){
                let blankID_chapter = 0;
                let blankID_section = 0;
                let blankID_part = 0;
                let blankNumber_chapter = 0;
                let blankNumber_section = 1;
                let blankNumber_part = 1;
                for (let j=0; j<this.bill_data.length;j++){
                    if (parseInt(this.bill_data[j].part_id)>=blankID_part){
                        blankID_part = parseInt(this.bill_data[j].part_id);
                    }
                    if (parseInt(this.bill_data[j].section_id)>=blankID_section){
                        blankID_section = parseInt(this.bill_data[j].section_id);
                    }
                    if (parseInt(this.bill_data[j].chapter_id)>=blankID_chapter){
                        blankID_chapter = parseInt(this.bill_data[j].chapter_id);
                    }
                    if (parseInt(this.bill_data[j].chapter_number)>blankNumber_chapter){
                        blankNumber_chapter = parseInt(this.bill_data[j].chapter_number);
                    }
                }
                let added_part = {};
                added_part.chapter_id = blankID_chapter + 1;
                added_part.chapter_number = blankNumber_chapter + 1;
                added_part.chapter_title = this.chapterSelected_chapter;
                added_part.chapter_content = "";
                added_part.section_id = blankID_section + 1;
                added_part.section_number = blankNumber_section;
                added_part.section_title = this.sectionSelected_chapter;
                added_part.section_content = "";
                added_part.part_id = blankID_part + 1;
                added_part.part_number = blankNumber_part;
                added_part.part_title = this.partSelected_chapter;
                added_part.part_content = this.selectedPartContent_chapter;
                added_part.part_reason = this.selectedPartReason_chapter;
                added_part.added_flag = "3";
                this.bill_data.push(added_part);
                this.gadget_sort(this.bill_data);
                this.chapterOptions = [];
                var checkChapter=[];
                for (let i =0;i<this.bill_data.length;i++){
                    if (!(checkChapter.includes(this.bill_data[i].chapter_number))){
                        checkChapter.push(this.bill_data[i].chapter_number);
                        this.chapterOptions.push({
                            "text":this.bill_data[i].chapter_number,
                            "value":this.bill_data[i].chapter_title
                        });
                    }
                }
                this.add_new_bill_modal_show = false;
                return true
            },
            addConfirm_section(){
                let blankID_section = 0;
                let blankID_part = 0;
                let blankNumber_section = 0;
                let blankNumber_part = 1;
                let addedChapterNumber = 0;
                let addedChapterID = 0;
                for (let j=0; j<this.bill_data.length;j++){
                    if (parseInt(this.bill_data[j].part_id)>=blankID_part){
                        blankID_part = parseInt(this.bill_data[j].part_id);
                    }
                    if (parseInt(this.bill_data[j].section_id)>=blankID_section){
                        blankID_section = parseInt(this.bill_data[j].section_id);
                    }
                    if (this.bill_data[j].chapter_title == this.chapterSelected){
                        addedChapterNumber = parseInt(this.bill_data[j].chapter_number);
                        addedChapterID = parseInt(this.bill_data[j].chapter_id);
                    }
                }
                for (let k=0; k<this.bill_data.length;k++){
                    if (this.bill_data[k].chapter_number == addedChapterNumber){
                        if (parseInt(this.bill_data[k].section_number)>blankNumber_section){
                            blankNumber_section = parseInt(this.bill_data[k].section_number);
                        }
                    }
                }
                let added_part = {};
                added_part.chapter_id = addedChapterID;
                added_part.chapter_number = addedChapterNumber;
                added_part.chapter_title = this.chapterSelected;
                added_part.chapter_content = "";
                added_part.section_id = blankID_section + 1;
                added_part.section_number = blankNumber_section + 1;
                added_part.section_title = this.sectionSelected_section;
                added_part.section_content = "";
                added_part.part_id = blankID_part + 1;
                added_part.part_number = blankNumber_part;
                added_part.part_title = this.partSelected_section;
                added_part.part_content = this.selectedPartContent_section;
                added_part.part_reason = this.selectedPartReason_section;
                added_part.added_flag = "3";
                this.bill_data.push(added_part);
                this.gadget_sort(this.bill_data);
                this.add_new_bill_modal_show = false;
                return true
            },
            addConfirm_part(){
                if (this.selected == 1){
                    let blankID = 0;
                    for (let j=0; j<this.bill_data.length;j++){
                        if (parseInt(this.bill_data[j].part_id)>=blankID){
                            blankID = parseInt(this.bill_data[j].part_id) + 1;
                        }
                    }
                    let added_part = {};
                    for (let i=0; i<this.bill_data.length;i++){
                        if (this.bill_data[i].chapter_title == this.chapterSelected){
                            if (this.bill_data[i].section_title == this.sectionSelected){
                                added_part.part_id = blankID;
                                added_part.chapter_id = this.bill_data[i].chapter_id;
                                added_part.chapter_number = this.bill_data[i].chapter_number;
                                added_part.chapter_title = this.bill_data[i].chapter_title;
                                added_part.chapter_content = this.bill_data[i].chapter_content;
                                added_part.section_id = this.bill_data[i].section_id;
                                added_part.section_number = this.bill_data[i].section_number;
                                added_part.section_title = this.bill_data[i].section_title;
                                added_part.section_content = this.bill_data[i].section_content;
                                added_part.part_number = this.partSelected;
                                added_part.part_title = this.partSelectedName;
                                added_part.part_content = this.selectedPartContent;
                                added_part.part_reason = this.selectedPartReason;
                                added_part.added_flag = "2";
                                break
                            }
                        }
                    }
                    this.bill_data.push(added_part);
                }
                if (this.selected == 2){
                    let blankID = 0;
                    for (let j=0; j<this.bill_data.length;j++){
                        if (parseInt(this.bill_data[j].part_id)>=blankID){
                            blankID = parseInt(this.bill_data[j].part_id) + 1;
                        }
                    }
                    let added_part = {};
                    added_part.part_id = blankID;
                    added_part.part_number = this.partSelected;
                    added_part.part_title = this.partSelectedName;
                    added_part.part_content = this.selectedPartContent;
                    added_part.part_reason = this.selectedPartReason;
                    added_part.added_flag = "2";
                    this.bill_data.push(added_part);
                }
                this.gadget_sort(this.bill_data);
                this.add_new_bill_modal_show = false;
                return true
            },
            addModalClear(){
                this.partSelected="";
                this.partSelectedName="";
                this.selectedPartContent="";
                this.selectedPartReason="";
                this.chapterSelected="";
                this.sectionSelected="";
                this.chapterSelected_chapter="";
                this.sectionSelected_chapter="";
                this.partSelected_chapter="";
                this.selectedPartContent_chapter="";
                this.selectedPartReason_chapter="";
                this.sectionSelected_section="";
                this.partSelected_section="";
                this.selectedPartContent_section="";
                this.selectedPartReason_section="";
            },
            changeChapter(){
                this.sectionOptions = [];
                this.sectionSelected = "";
                let checkSections = [];
                for (let i=0;i<this.bill_data.length;i++){
                    if (this.bill_data[i].chapter_title == this.chapterSelected){
                        if (!(checkSections.includes(this.bill_data[i].section_number))){
                            checkSections.push(this.bill_data[i].section_number);
                            this.sectionOptions.push({
                                "text":this.bill_data[i].section_number,
                                "value":this.bill_data[i].section_title
                            });
                        }
                    }
                }
            },
            changeSection(){
                let partListAmount = 0;
                for (let i=0;i<this.bill_data.length;i++){
                    if ((this.bill_data[i].chapter_title == this.chapterSelected) &&
                        (this.bill_data[i].section_title == this.sectionSelected)){
                        partListAmount = partListAmount + 1;
                    }
                }
                this.partMin = partListAmount + 1;
                this.partSelected = this.partMin;
            },
            insertNewPartModal(){
                if ((!this.selected_data)||(this.selected_data.length === 0)){
                    this.$toasted.error("请选择条");
                } else {
                    this.selected_chapter_number=this.selected_data.chapter_number;
                    this.selected_chapter_title=this.selected_data.chapter_title;
                    this.selected_section_number=this.selected_data.section_number;
                    this.selected_section_title=this.selected_data.section_title;
                    this.selected_part_number=this.selected_data.part_number;
                    this.part_insert_modal_show = true;
                }
            },
            insertPart(){
                if(this.selected == 1) {
                    let blankID = 0;
                    for (let j = 0; j < this.bill_data.length; j++) {
                        if (parseInt(this.bill_data[j].part_id) >= blankID) {
                            blankID = parseInt(this.bill_data[j].part_id) + 1;
                        }
                    }
                    for (let i = 0; i < this.bill_data.length; i++) {
                        if (this.bill_data[i].chapter_title == this.selected_data.chapter_title) {
                            if (this.bill_data[i].section_title == this.selected_data.section_title) {
                                if (parseInt(this.bill_data[i].part_number) >= parseInt(this.selected_data.part_number)) {
                                    this.bill_data[i].part_number = parseInt(this.bill_data[i].part_number) + 1;
                                    this.bill_data[i].added_flag = "1";
                                }
                            }
                        }
                    }
                    let insert_part = {};
                    for (let i = 0; i < this.bill_data.length; i++) {
                        if (this.bill_data[i].chapter_title == this.selected_data.chapter_title) {
                            if (this.bill_data[i].section_title == this.selected_data.section_title) {
                                if (this.bill_data[i].part_title == this.selected_data.part_title) {
                                    insert_part.part_id = blankID;
                                    insert_part.chapter_id = this.bill_data[i].chapter_id;
                                    insert_part.chapter_number = this.bill_data[i].chapter_number;
                                    insert_part.chapter_title = this.bill_data[i].chapter_title;
                                    insert_part.chapter_content = this.bill_data[i].chapter_content;
                                    insert_part.section_id = this.bill_data[i].section_id;
                                    insert_part.section_number = this.bill_data[i].section_number;
                                    insert_part.section_title = this.bill_data[i].section_title;
                                    insert_part.section_content = this.bill_data[i].section_content;
                                    insert_part.part_number = parseInt(this.selected_data.part_number) - 1;
                                    insert_part.part_title = this.insertPartTitle;
                                    insert_part.part_content = this.insertPartContent;
                                    insert_part.part_reason = this.insertPartReason;
                                    insert_part.added_flag = "2"; // inserted
                                    break
                                }
                            }
                        }
                    }
                    this.bill_data.push(insert_part);
                }
                if (this.selected == 2){
                    let blankID = 0;
                    for (let j = 0; j < this.bill_data.length; j++) {
                        if (parseInt(this.bill_data[j].part_id) >= blankID) {
                            blankID = parseInt(this.bill_data[j].part_id) + 1;
                        }
                    }
                    for (let i = 0; i < this.bill_data.length; i++) {
                        if (parseInt(this.bill_data[i].part_number) >= parseInt(this.selected_data.part_number)) {
                            this.bill_data[i].part_number = parseInt(this.bill_data[i].part_number) + 1;
                            this.bill_data[i].added_flag = "1";
                        }
                    }
                    let insert_part = {};
                    for (let i = 0; i < this.bill_data.length; i++) {
                        if (this.bill_data[i].part_title == this.selected_data.part_title) {
                            insert_part.part_id = blankID;
                            insert_part.part_number = parseInt(this.selected_data.part_number) - 1;
                            insert_part.part_title = this.insertPartTitle;
                            insert_part.part_content = this.insertPartContent;
                            insert_part.part_reason = this.insertPartReason;
                            insert_part.added_flag = "2"; // inserted
                            break
                        }
                    }
                    this.bill_data.push(insert_part);
                }
                this.gadget_sort(this.bill_data);
                this.part_insert_modal_show = false;
                return true
            },
            insertModalClear(){
                this.selected_chapter_number="";
                this.selected_chapter_title="";
                this.selected_section_number="";
                this.selected_section_title="";
                this.selected_part_number="";
                this.insertPartTitle="";
                this.insertPartContent="";
                this.insertPartReason="";
            },
            allBillPreviewModal(){
                BillService.getBillName({
                    business_id: this.$route.params.bid,
                    node_id: this.$route.params.nid,
                    show_mode:this.selected
                })
                    .then(data => {
                        this.bill_data_comparison=[];
                        this.bill_data_origin = [];
                        this.bill_data_origin = data.bill_data;
                        if (this.selected == 1){
                            for(let i=0; i<this.bill_data.length;i++){
                                if (this.bill_data[i].hasOwnProperty('added_flag')){
                                    if(this.bill_data[i].added_flag == "2"){
                                        this.bill_data_comparison.push(this.bill_data[i]);
                                        continue // inserted
                                    }
                                }
                                for (let j=0;j<this.bill_data_origin.length;j++){
                                    if ((this.bill_data[i].chapter_id == this.bill_data_origin[j].chapter_id)&&
                                        (this.bill_data[i].chapter_number == this.bill_data_origin[j].chapter_number)&&
                                        (this.bill_data[i].chapter_title == this.bill_data_origin[j].chapter_title)&&
                                        (this.bill_data[i].chapter_content == this.bill_data_origin[j].chapter_content)&&
                                        (this.bill_data[i].section_id == this.bill_data_origin[j].section_id)&&
                                        (this.bill_data[i].section_number == this.bill_data_origin[j].section_number)&&
                                        (this.bill_data[i].section_title == this.bill_data_origin[j].section_title)&&
                                        (this.bill_data[i].section_content == this.bill_data_origin[j].section_content)&&
                                        (this.bill_data[i].part_content == this.bill_data_origin[j].part_content)&&
                                        (this.bill_data[i].part_reason == this.bill_data_origin[j].part_reason)&&
                                        (this.bill_data[i].part_number == this.bill_data_origin[j].part_number)&&
                                        (this.bill_data[i].part_title == this.bill_data_origin[j].part_title)){
                                        this.bill_data[i].added_flag = "0"; // remained
                                        break
                                    } else {
                                        this.bill_data[i].added_flag = "1"; // updated
                                    }
                                }
                                this.bill_data_comparison.push(this.bill_data[i]);
                            }
                            for (let k=0;k<this.bill_data_origin.length;k++){
                                let deleted_flag = false;
                                for(let l=0; l<this.bill_data.length;l++){
                                    if (this.bill_data_origin[k].part_id == this.bill_data[l].part_id){
                                        deleted_flag = false;
                                        break
                                    } else {
                                        deleted_flag = true;
                                        continue;
                                    }
                                }
                                if (deleted_flag){
                                    this.bill_data_origin[k].added_flag = "3"; //deleted
                                    this.bill_data_comparison.push(this.bill_data_origin[k]);
                                }
                            }
                        }
                        if (this.selected == 2){
                            for(let i=0; i<this.bill_data.length;i++){
                                if (this.bill_data[i].hasOwnProperty('added_flag')){
                                    if(this.bill_data[i].added_flag == "2"){
                                        this.bill_data_comparison.push(this.bill_data[i]);
                                        continue // inserted
                                    }
                                }
                                for (let j=0;j<this.bill_data_origin.length;j++){
                                    if ((this.bill_data[i].part_content == this.bill_data_origin[j].part_content)&&
                                        (this.bill_data[i].part_reason == this.bill_data_origin[j].part_reason)&&
                                        (this.bill_data[i].part_number == this.bill_data_origin[j].part_number)&&
                                        (this.bill_data[i].part_title == this.bill_data_origin[j].part_title)){
                                        this.bill_data[i].added_flag = "0"; // remained
                                        break
                                    } else {
                                        this.bill_data[i].added_flag = "1"; // updated
                                    }
                                }
                                this.bill_data_comparison.push(this.bill_data[i]);
                            }
                            for (let k=0;k<this.bill_data_origin.length;k++){
                                let deleted_flag = false;
                                for(let l=0; l<this.bill_data.length;l++){
                                    if (this.bill_data_origin[k].part_id == this.bill_data[l].part_id){
                                        deleted_flag = false;
                                        break
                                    } else {
                                        deleted_flag = true;
                                        continue;
                                    }
                                }
                                if (deleted_flag){
                                    this.bill_data_origin[k].added_flag = "3"; //deleted
                                    this.bill_data_comparison.push(this.bill_data_origin[k]);
                                }
                            }
                        }
                        this.gadget_sort_comparison();
                        this.all_bill_preview_modal_show = true;
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
            },
            allBillPreviewModalClear(){
                this.bill_data_origin = [];
                this.bill_data_comparison = [];
            },
            documentUploadToPart(){
                if ((!this.selected_data)||(this.selected_data.length === 0)){
                    this.$toasted.error("请选择条");
                    return false
                } else {
                    let checkArray = 0;
                    BillService.getBillName({
                        business_id: this.$route.params.bid,
                        node_id: this.$route.params.nid,
                        show_mode:this.selected
                    })
                        .then(data => {
                            this.bill_data_origin = [];
                            this.bill_data_origin = data.bill_data;
                            if (this.selected == 1){
                                for (let i=0;i<this.bill_data.length;i++){
                                    for (let j=0;j<this.bill_data_origin.length;j++){
                                        if ((this.bill_data[i].chapter_id == this.bill_data_origin[j].chapter_id)&&
                                            (this.bill_data[i].chapter_number == this.bill_data_origin[j].chapter_number)&&
                                            (this.bill_data[i].chapter_title == this.bill_data_origin[j].chapter_title)&&
                                            (this.bill_data[i].chapter_content == this.bill_data_origin[j].chapter_content)&&
                                            (this.bill_data[i].section_id == this.bill_data_origin[j].section_id)&&
                                            (this.bill_data[i].section_number == this.bill_data_origin[j].section_number)&&
                                            (this.bill_data[i].section_title == this.bill_data_origin[j].section_title)&&
                                            (this.bill_data[i].section_content == this.bill_data_origin[j].section_content)&&
                                            (this.bill_data[i].part_number == this.bill_data_origin[j].part_number)&&
                                            (this.bill_data[i].part_content == this.bill_data_origin[j].part_content)&&
                                            (this.bill_data[i].part_reason == this.bill_data_origin[j].part_reason)&&
                                            (this.bill_data[i].part_title == this.bill_data_origin[j].part_title)){
                                            checkArray = 0;
                                            break;
                                        } else {
                                            checkArray = 1;
                                            continue;
                                        }
                                    }
                                    if (checkArray >0){
                                        this.$toasted.error("在上传文件之前请保存好法案内容");
                                        return false;
                                    }
                                }
                            }
                            if (this.selected == 2){
                                for (let i=0;i<this.bill_data.length;i++){
                                    for (let j=0;j<this.bill_data_origin.length;j++){
                                        if ((this.bill_data[i].part_number == this.bill_data_origin[j].part_number)&&
                                            (this.bill_data[i].part_content == this.bill_data_origin[j].part_content)&&
                                            (this.bill_data[i].part_reason == this.bill_data_origin[j].part_reason)&&
                                            (this.bill_data[i].part_title == this.bill_data_origin[j].part_title)){
                                            checkArray = 0;
                                            break;
                                        } else {
                                            checkArray = 1;
                                            continue;
                                        }
                                    }
                                    if (checkArray >0){
                                        this.$toasted.error("在上传文件之前请保存好法案内容");
                                        return false;
                                    }
                                }
                            }
                            BillService.getDocList({"part_id":this.selected_data.part_id,"edit_mode":this.selected})
                                .then((data) => {
                                    this.section_docs_lists = data.doc_data;
                                    this.document_upload_modal = true;
                                })
                                .catch(() => {
                                    this.$emit("data-failed");
                                });
                        });
                }
            },
            saveDoctoPart(){
                if ((this.upload_doc_id == 0) || (this.upload_doc_url == "")){
                    this.$toasted.error("请上传文件。");
                    return false
                }
                BillService.uploadDoc({"doc_id":this.upload_doc_id,"doc_url":this.upload_doc_url,"doc_conception":this.doc_desc_text,"part_id":this.selected_data.part_id,"edit_mode":this.selected})
                    .then(() => {
                        this.upload_doc_id = 0;
                        this.upload_doc_url = "";
                        this.doc_desc_text = "";
                        BillService.getDocList({"part_id":this.selected_data.part_id,"edit_mode":this.selected})
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
            saveBillList(){
                if (this.bill_name == ""){
                    this.$toasted.error("请输入法案名称。");
                } else {
                    this.save_modal_show=true;
                }
            },
            saveParts1(){
                if (this.bill_name == ""){
                    this.$toasted.error('请输入法案名');
                    return false;
                } else {
                    BillService.saveBill({'business_id': this.$route.params.bid, 'bill_name': this.bill_name,'bill_data':JSON.stringify(this.bill_data),'edit_mode':this.selected})
                        .then(() => {
                            this.init();
                        })
                        .catch(() => {
                            this.$emit("data-failed");
                        });
                    return true;
                }
            },
            partSelectedFunc(items){
                this.selected_data = items[0];
                return true
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
            uploadModalClear(){
                this.upload_doc_id = 0;
                this.upload_doc_url = "";
                this.doc_desc_text = "";
                this.encodedURLDOCX = "";
                this.previewShow = 0;
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
        .field-100{
            width:100%;
        }
    }
</style>
