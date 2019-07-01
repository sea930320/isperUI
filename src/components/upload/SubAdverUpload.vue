<template>
    <div class="toggle-upload-wrapper">
        <b-button size="lg" class="styledBtn" variant="outline-primary" @click.stop="subAdverUploadShow()">
            <icon name="upload"></icon>&nbsp;{{success ? '已上传' : '上传'}}
        </b-button>
        <my-upload
                :url="apiRootPath + '/file/upload'"
                :only-single="true"
                :value="uploadShow"
                field="file"
                :keyId="key"
                max-size="2048"
                :only-img="true"
                @uploadSuccess="uploadSuccess"
                @uploadFail="uploadFail"
                :limit-file-type="true"
        ></my-upload>
    </div>
</template>
<script>
    import Upload from "./Upload_advertising.vue";
    export default {
        props: {
            item: {},
            keyId: {
                type: Number,
                default: 1
            }
        },
        data() {
            return {
                apiRootPath: process.env.VUE_APP_API_ENDPOINT,
                uploadShow: false,
                success: false,
                key: 0
            };
        },
        methods: {
            // 渲染动画1上传框显示与隐藏
            subAdverUploadShow() {
                this.uploadShow = !this.uploadShow;
            },
            // 渲染动画上传成功回调
            uploadSuccess(data) {
                var file_url = window.location.protocol + "//" + window.location.host + data.d.url;
                this.$copyText(file_url).then(() => {
                    this.$toasted.success('链接复制完了');
                })
                    .catch(() => {
                        this.$toasted.error('链接复制失败');
                    });
            },
            // 渲染动画上传失败回调
            uploadFail() {
                this.$toasted.error("上传失败");
                this.success = false;
            }
        },
        components: {
            "my-upload": Upload,
        },
        mounted() {
            document.addEventListener("click", () => {
                this.uploadShow = false;
            });
        }
    };
</script>
<style>
    .upload-btn {
        border: none;
        display: inline-block;
        width: 100px;
        height: 30px;
        line-height: 30px;
        border: 1px solid #91dabf;
        border-radius: 4px;
        text-align: center;
    }

    .upload-btn .icon-upload {
        color: #00c175;
        font-size: 16px;
        margin-right: 4px;
    }

    .toggle-upload-wrapper {
        position: relative;
    }

    .toggle-upload-wrapper .vue-upload-file .vuf-drop-area {
        border: 2px solid rgba(0, 0, 0, 0.8);
    }
</style>
