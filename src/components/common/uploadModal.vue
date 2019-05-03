<template>
  <b-modal
    v-model="modalShow"
    :title="title"
    size="lg"
    @ok="onUploadConfirm"
    @cancel="onUploadCancel"
  >
    <div class="upload-wrapper">
      <slot></slot>
      <div class="upload-main">
        <p class="upload-tip">单个素材最大20M限制</p>
        <upload
          :url="uploadUrl"
          :value="modalShow"
          :only-single="true"
          field="file"
          key="0"
          max-size="20480"
          ref="upload"
          :only-img="false"
          :params="uploadParams"
          @uploadSuccess="uploadSuccess"
          @uploadFail="uploadFail"
        ></upload>
      </div>
      <p v-if="uploadFiles.length > 0">已成功上传：</p>
      <ul class="upload-lists p-0">
        <li v-for="(fileItem, index) in uploadFiles" :key="index">
          <icon name="file"/>
          <a href="javascript:;" class="ml-2">{{fileItem.name}}</a>
        </li>
      </ul>
    </div>
    <div slot="modal-footer" class="w-100">
      <b-button variant="primary" size="sm" @click="onUploadConfirm">{{okText}}</b-button>
      <b-button v-if="!cancelHide" variant="secondary" size="sm" @click="onUploadCancel">取消</b-button>
    </div>
  </b-modal>
</template>

<script>
import upload from "@/components/upload/Upload";
export default {
  data() {
    return {
      // 选定素材的用途
      modalShow: false,
      uploadUrl: "/api/file/upload",
      cancelHide: true,
      title: "上传素材",
      okText: "确定",
      usage: 0,
      uploadFiles: [],
      uploadParams: []
    };
  },
  computed: {
    // 上传格式限制
    uploadExt() {
      return "";
    }
  },
  created() {
    this.$parent.$on("openUploadModal", params => {
      this.uploadParams = params.uploadParams;
      this.title = params.title ? params.title : "上传素材";
      this.uploadUrl = params.uploadUrl ? params.uploadUrl : "/api/file/upload";
      this.cancelHide = params.cancelHide ? params.cancelHide : true;
      this.okText = params.okText ? params.okText : "确定";
      this.modalShow = true;
    });
  },
  methods: {
    // 确认上传
    onUploadConfirm() {
      if (this.$refs.upload.loading === 1) {
        this.$refs.upload.reset();
      }
      this.$emit("on-uploadConfirm", this.uploadFiles);
      this.modalShow = false;
    },
    // 上传取消
    onUploadCancel() {
      if (this.$refs.upload.loading === 1) {
        this.$refs.upload.reset();
      }
      this.$emit("on-cancel");
      if (this.uploadFiles.length > 0) {
        this.$emit("on-uploadConfirm", this.uploadFiles);
      }
      this.modalShow = false;
    },
    // 上传文件成功操作
    uploadSuccess(data) {
      if (data.c === 0) {
        if (data.d) {
          this.$set(
            data.d,
            "name",
            data.d.filename ? data.d.filename : data.d.name
          );
          this.uploadFiles.push(data.d);
        }
      } else {
        this.$toasted.error(data.m);
      }
    },
    // 上传文件失败操作
    // eslint-disable-next-line
    uploadFail(status, field, key) {}
  },
  components: {
    upload
  }
};
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
.upload-wrapper {
  position: relative;
  text-align: left;
  font-size: 14px;

  .upload-main .vue-upload-file {
    position: static;
    width: 100%;
    margin-top: 0;
    margin-left: 0;
    margin-bottom: 10px;
  }
  .upload-main .vue-upload-file:before {
    border-bottom: 7px solid transparent;
  }
  .upload-tip {
    line-height: 32px;
    color: #f70000;
    padding-left: 4px;
  }
  .upload-lists {
    text-align: left;
    width: 100%;
    max-height: 300px;
    overflow: auto;
    list-style: none;
    font-size: 12px;

    a {
      vertical-align: middle;
    }
  }
  .upload-lists > li {
    padding: 0px 6px;
    height: 30px;
    line-height: 30px;
    margin-bottom: 4px;
    background-color: #f2f9ff;
    border-top: 1px solid #e9f0f8;
    border-bottom: 1px solid #e9f0f8;
  }
}
</style>
