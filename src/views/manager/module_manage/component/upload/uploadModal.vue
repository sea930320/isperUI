<template>
  <b-modal centered  v-model="modalShow" size="xl" :title="title" :ok-only="cancelHide" @ok="onUploadConfirm" @cancel="onUploadCancel" :ok-title="okText" cancel-title="取消">
    <div class="upload-wrapper">
      <!-- <div class="doc-usage">
        <p>请先选择素材用途</p>
        <select v-model="usage">
          <option :value="3">模板</option>
          <option :value="4">材料</option>
          <option :value="5">公文</option>
          <option :value="6">成果参考</option>
          <option :value="7">项目提示</option>
        </select>
      </div> -->
      <slot></slot>
      <div class="upload-main">
        <p class="upload-tip">单个素材最大20M限制</p>
        <upload :url="uploadUrl"
                :value="modalShow"
                :only-single="true"
                field="file"
                key="0"
                max-size="20480"
                ref="upload"
                :only-img="false"
                :params="uploadParams"
                @uploadSuccess="uploadSuccess"
                @uploadFail="uploadFail">
        </upload>
      </div>
      <p v-if="uploadFiles.length > 0">已成功上传：</p>
      <ul class="upload-lists">
        <li v-for="(fileItem, index) in uploadFiles" :key="index">
          <i class="iconfont icon-files"></i>
          <a href="javascript:;">{{fileItem.name}}</a>
        </li>
      </ul>
    </div>
  </b-modal>
</template>
<script type="text/ecmascript-6">
import upload from './upload'
export default {
  props: {
    title: {
      type: String,
      default: '上传素材'
    },
    okText: {
      type: String,
      default: '确定'
    },
    cancelHide: {
      type: Boolean,
      default: true
    },
    modalShow: {
      type: Boolean,
      default: false
    },
    uploadUrl: {
      type: String,
      default: '/api/file/upload'
    },
    uploadParams: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      // 选定素材的用途
      usage: 0,
      uploadFiles: []
    }
  },
  computed: {
    // 上传格式限制
    uploadExt() {
      return ''
    }
  },
  methods: {
    // 确认上传
    onUploadConfirm () {
      if (this.$refs.upload.loading === 1) {
        this.$refs.upload.reset()
      }
      this.$emit('on-uploadConfirm', this.uploadFiles)
    },
    // 上传取消
    onUploadCancel () {
      if (this.$refs.upload.loading === 1) {
        this.$refs.upload.reset()
      }
      this.$emit('on-cancel');
      if (this.uploadFiles.length > 0) {
        this.$emit('on-uploadConfirm', this.uploadFiles)
      }
    },
    // 上传文件成功操作
    uploadSuccess(data) {
      if (data.c === 0) {
        if (data.d) {
          this.$set(data.d, 'name', data.d.filename ? data.d.filename : data.d.name)
          this.uploadFiles.push(data.d)
        }
      } else {
        this.$toast.error(data.m)
      }
		},
    // 上传文件失败操作
		uploadFail() {
		}
  },
  components: {
    upload
  },
  watch: {
    modalShow(val) {
      if (val) {
        this.uploadFiles = []
      }
    }
  }
}
</script>
<style>
.upload-wrapper {
	position: relative;
}
.upload-main .vue-upload-file{
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
</style>
