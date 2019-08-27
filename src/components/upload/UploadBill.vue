<template>
  <div class="vue-upload-file" v-show="value">
    <div
            class="vuf-drop-area"
            @click.stop="handleClick"
            @dragleave="handleDragleave"
            @dragover="handleDragover"
            @dragenter="handleDragenter"
            @drop="handleDrop"
    >
      <icon v-show="loading != 1" class="vuf-icon1 iconfont icon-upload2" name="upload"></icon>
      <span class="vuf-hint" v-show="loading !== 1">{{ lang.hint }}</span>
      <span class="vuf-loading" v-show="loading === 1">{{ lang.loading }}</span>
      <div class="vuf-progress-wrap" v-show="loading === 1">
        <span class="vuf-progress" :style="progressStyle"></span>
      </div>
      <span class="vuf-no-supported-hint" v-show="!isSupported">{{ lang.noSupported }}</span>
      <input type="file" accept=".docx" v-show="false" @change="handleChange" ref="fileinput" v-if="limitFileType">
      <input type="file" v-show="false" @change="handleChange" ref="fileinput" v-else>
    </div>
    <div class="vuf-error" v-show="hasError">
      <i class="vuf-icon2"></i>
      {{ errorMsg }}
    </div>
    <div class="vuf-success" v-show="loading === 2">
      <i class="vuf-icon3"></i>
      {{ lang.success }}
    </div>
  </div>
</template>

<script>
    export default {
        props: {
            // 域，上传文件name，触发事件会带上（如果一个页面多个图片上传控件，可以做区分
            field: {
                type: String,
                default: "file"
            },
            // 类似于id，触发事件会带上（如果一个页面多个图片上传控件，可以做区分
            keyId: {
                default: 0
            },
            // 显示该控件与否
            value: {
                default: true
            },
            url: {
                type: String,
                default: ""
            },
            // 其他要上传文件附带的数据，对象格式
            params: {
                default: null
            },
            // 单文件大小限制
            maxSize: {
                default: 2048
            },
            // 仅限图片
            onlyImg: {
                default: false
            },
            // 仅限单文件上传
            onlySingle: {
                default: false
            },
            // 文件扩展名
            ext: {
                type: Array,
                default: () => {
                    return [];
                }
            },
            limitFileType:{
                default:false
            },
            // 语言包
            langType: {
                type: String,
                default: "zh"
            },
            // 语言扩展
            langExt: {
                type: Object,
                default: null
            }
        },
        data() {
            let that = this,
                { langExt, langType } = that,
                isSupported = true,
                langBags = {
                    zh: {
                        hint: "点击，或将文件拖动至此处",
                        loading: "正在上传……",
                        noSupported: "浏览器不支持该功能，请使用IE10以上或其他现代浏览器！",
                        success: "上传成功",
                        fail: "上传失败",
                        error: {
                            onlyImg: "仅限图片格式",
                            onlySingle: "仅限单文件上传",
                            outOfSize: "单文件大小不能超过 ",
                            extType: "文件格式只限",
                        }
                    },
                    en: {
                        hint: "Click, or drag the file here",
                        loading: "Uploading……",
                        noSupported:
                            "Browser does not support, please use IE10+ or other browsers",
                        success: "Upload success",
                        fail: "Upload failed",
                        error: {
                            onlyImg: "Images only",
                            onlySingle: "Single file only",
                            outOfSize: "File exceeds size limit: "
                        }
                    }
                },
                lang = langBags[langType] ? langBags[langType] : langBags["zh"];
            if (langExt) {
                Object.assign(lang, langExt);
            }
            if (typeof FormData !== "function") {
                isSupported = false;
            }
            return {
                loading: 0,
                // 0未开始 1正在 2成功 3错误
                lang,
                isSupported,
                hasError: false,
                files: "",
                progress: 0,
                errorMsg: ""
            };
        },
        computed: {
            progressStyle() {
                let { progress } = this;
                return {
                    width: progress + "%"
                };
            }
        },
        watch: {
            value: function(newValue) {
                if (newValue) {
                    this.reset();
                }
            }
        },
        methods: {
            handleDragleave(e) {
                e.preventDefault();
            },
            handleDrop(e) {
                e.preventDefault();
                if (this.loading !== 1) {
                    let files = e.dataTransfer.files;
                    this.reset();
                    if (this.checkFiles(files)) {
                        this.upload(files);
                    }
                }
            },
            handleDragenter(e) {
                e.preventDefault();
            },
            handleDragover(e) {
                e.preventDefault();
            },
            handleClick(e) {
                if (this.loading !== 1) {
                    if (e.target !== this.$refs.fileinput) {
                        e.preventDefault();
                        this.$refs.fileinput.click();
                    }
                }
            },
            handleChange(e) {
                if (this.loading !== 1) {
                    let files = e.target.files;
                    this.errorMsg = "";
                    this.hasError = false;
                    if (this.checkFiles(files)) {
                        this.upload(files);
                    }
                }
            },
            checkFiles(files) {
                let that = this,
                    { lang, maxSize, onlyImg, onlySingle } = that,
                    fileNum = files.length;
                // 是否文件为空
                if (fileNum === 0) {
                    return false;
                }

                // 仅限单文件？
                if (onlySingle && fileNum > 1) {
                    that.hasError = true;
                    that.errorMsg = lang.error.onlySingle;
                    return false;
                }

                for (let i = 0; i < fileNum; i++) {
                    // 仅限图片

                    if (onlyImg && files[i].type.indexOf("image") === -1 && files[i].type.indexOf("wordprocessingml.document") === -1 && files[i].type.indexOf("pdf") === -1) {
                        that.hasError = true;
                        that.errorMsg = lang.error.onlyImg;
                        return false;
                    }

                    // 格式限制
                    if (
                        that.ext.length !== 0 &&
                        that.ext.indexOf(
                            files[i].name
                                .substring(files[i].name.lastIndexOf(".") + 1)
                                .toLowerCase()
                        ) === -1
                    ) {
                        that.hasError = true;
                        that.errorMsg = `${lang.error.extType}${that.ext}类型`;
                        return false;
                    }

                    // 超出大小
                    if (files[i].size / 1024 > maxSize) {
                        that.hasError = true;
                        that.errorMsg = lang.error.outOfSize + maxSize + "kb";
                        return false;
                    }
                }
                return true;
            },
            reset() {
                let that = this;
                that.$refs.fileinput.value = "";
                that.loading = 0;
                that.hasError = false;
                that.errorMsg = "";
                that.progress = 0;
            },
            upload(files) {
                let that = this,
                    { url, params, onlySingle, field, keyId, lang } = this,
                    fmData = new FormData();
                // 判断是否单文件
                if (onlySingle) {
                    fmData.append(field, files[0]);
                } else {
                    fmData.append(field, files);
                }

                // 添加其他参数
                if (typeof params === "object" && params) {
                    Object.keys(params).forEach(k => {
                        fmData.append(k, params[k]);
                    });
                }

                // 监听进度回调
                const uploadProgress = function(event) {
                    if (event.lengthComputable) {
                        that.progress = (100 * Math.round(event.loaded)) / event.total;
                    }
                };

                // 上传文件
                that.loading = 1;
                new Promise(function(resolve, reject) {
                    let client = new XMLHttpRequest();
                    client.open("POST", url, true);
                    client.withCredentials = true
                    client.onreadystatechange = function() {
                        if (this.readyState !== 4) {
                            return;
                        }
                        if (this.status === 200) {
                            resolve(JSON.parse(this.responseText));
                        } else {
                            reject(this.status);
                        }
                    };
                    client.upload.addEventListener("progress", uploadProgress, false); // 监听进度
                    client.send(fmData);
                }).then(
                    // 上传成功
                    function(resData) {
                        if (resData.c === 0) {
                            that.loading = 2;
                            that.$emit("uploadSuccess", resData, field, keyId);
                        } else {
                            that.loading = 3;
                            that.hasError = true;
                            that.errorMsg = resData.m ? resData.m : lang.fail;
                        }

                        setTimeout(() => {
                            that.hasError = false;
                        }, 1000);
                    },
                    // 上传失败
                    function(sts) {
                        that.loading = 3;
                        that.hasError = true;
                        that.errorMsg = lang.fail;
                        setTimeout(() => {
                            that.hasError = false;
                        }, 1000);
                        that.$emit("uploadFail", sts, field, keyId);
                    }
                );
            }
        }
    };
</script>
<style lang='css' scoped>
  @import "./upload.css";
</style>
