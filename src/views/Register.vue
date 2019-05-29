<template>
    <!--  <div class="register-container"> blue -->
    <div class="register-container" style="margin-top: 5%;">
        <b-container>
            <b-card no-body class="overflow-hidden">
                <b-row no-gutters>
                    <b-col class="register-bg">
                        <div class="iconBar">
                            <div class="logo">
                                <img src="@/assets/imgIsper/2.png" class="rounded-0">
                            </div>
                            <h4>ISPER—2019</h4>
                            <div class="mb-3">智慧法治与智慧课堂系统</div>
                        </div>
                        <div class="img-mask">
                            <div class="mask-title">劳动分工是提高劳动生产力的 主要原因</div>
                            <div class="mask-body d-flex justify-content-between mt-3">
                                <div class="mask-body-text">亚当斯密</div>
                                <div class="mask-body-icon">
                                    <icon name="chevron-right"></icon>
                                </div>
                            </div>
                        </div>
                    </b-col>
                    <b-col>
                        <b-form @submit.prevent="register">
                            <b-card-body class="text-center p-5">
                                <b-form-group
                                    label-cols="4"
                                    label-cols-lg="2"
                                    label="姓 名 *"
                                    label-for="userName"
                                >
                                    <b-form-input
                                        type="text"
                                        v-model="user.name"
                                        placeholder="请输入姓名"
                                        name="userName"
                                        v-validate="'required'"
                                    />
                                    <span
                                        class="err-label"
                                        v-if="errors.has('userName') && !errorCleared"
                                    >Please input valid name</span>
                                </b-form-group>
                                <b-form-group
                                    label-cols="4"
                                    label-cols-lg="2"
                                    label="邮箱"
                                    label-for="email"
                                >
                                    <b-form-input
                                        type="email"
                                        v-model="user.email"
                                        placeholder="请输入邮箱"
                                        name="email"
                                    />
                                </b-form-group>
                                <b-form-group
                                    label-cols="4"
                                    label-cols-lg="2"
                                    label="单位"
                                    label-for="company"
                                >
                                    <b-form-select
                                        v-model="user.company_id"
                                        :options="defaultCompanies"
                                        placeholder="请输入单位"
                                        value-field="id"
                                        text-field="name"
                                    ></b-form-select>
                                </b-form-group>
                                <b-form-group
                                    label-cols="4"
                                    label-cols-lg="2"
                                    label="头像"
                                    label-for="avatar"
                                >
                                    <div @click="toggleShow" style="cursor:pointer; width: 100px">
                                        <b-img-lazy
                                            thumbnail
                                            rounded="circle"
                                            v-if="avatar"
                                            :src="avatar"
                                            alt="Avatar"
                                            class="avatar-img"
                                        />
                                        <div v-else class="avatar-img"/>
                                    </div>
                                </b-form-group>

                                <div
                                    class="text-center my-3"
                                    style="border-bottom: 1px solid gray;"
                                >
                                    <h5>登录信息</h5>
                                </div>
                                <b-form-group
                                    label-cols="4"
                                    label-cols-lg="2"
                                    label="用户名 *"
                                    label-for="userID"
                                >
                                    <b-form-input
                                        type="text"
                                        v-model="user.username"
                                        placeholder="请输入用户名"
                                        name="userID"
                                        v-validate="'required'"
                                    />
                                    <span
                                        class="err-label"
                                        v-if="errors.has('userID') && !errorCleared"
                                    >Please input valid user ID</span>
                                </b-form-group>
                                <b-form-group
                                    label-cols="4"
                                    label-cols-lg="2"
                                    label="密 码 *"
                                    label-for="password"
                                >
                                    <b-form-input
                                        type="text"
                                        v-model="user.password"
                                        placeholder="请输入密码"
                                        name="password"
                                        v-validate="'required'"
                                    />
                                    <span
                                        class="err-label"
                                        v-if="errors.has('password') && !errorCleared"
                                    >Please input valid Password</span>
                                </b-form-group>
                                <b-form-group
                                    label-cols="4"
                                    label-cols-lg="2"
                                    label="密码确认 *"
                                    label-for="password_confirmation"
                                >
                                    <b-form-input
                                        type="text"
                                        v-model="user.passwordConfirmation"
                                        placeholder="请再次输入密码"
                                        name="password_confirmation"
                                    />
                                    <span
                                        class="err-label"
                                        v-if="notSameValidation()"
                                    >Please input same Password</span>
                                </b-form-group>

                                <b-form-group
                                    label-cols="4"
                                    label-cols-lg="2"
                                    label="手机 *"
                                    label-for="phoneNumber"
                                >
                                    <b-input-group prepend="+86">
                                        <b-form-input
                                            type="text"
                                            v-model="user.phone"
                                            name="phoneNumber"
                                            :disabled="session_expire_time > 0 || sendLabel !='获取'"
                                            v-validate="'required'"
                                        />
                                    </b-input-group>
                                    <b-input-group class="mt-2">
                                        <b-form-input
                                            type="number"
                                            v-model="user.verificationCode"
                                            name="verificationCode"
                                            placeholder="手机验证码"
                                            v-validate="'required'"
                                        ></b-form-input>
                                        <b-input-group-append>
                                            <b-button
                                                variant="primary"
                                                @click="sendVerificationCode"
                                                :disabled="!user.phone || session_expire_time > 0 || sendLabel !='获取'"
                                            >{{(session_expire_time &lt;= 0) ? sendLabel: session_expire_time + ' s'}}</b-button>
                                        </b-input-group-append>
                                    </b-input-group>

                                    <span
                                        class="err-label"
                                        v-if="(errors.has('phoneNumber') || errors.has('verificationCode')) && !errorCleared"
                                    >Please verifiy Phone Number</span>
                                </b-form-group>
                                <b-button
                                    type="submit"
                                    variant="primary"
                                    style="width: 83%; margin-left: 17%;"
                                >注册</b-button>
                            </b-card-body>
                        </b-form>
                    </b-col>
                </b-row>
            </b-card>

            <ImageUpload
                field="img"
                @crop-success="cropSuccess"
                @crop-upload-success="cropUploadSuccess"
                @crop-upload-fail="cropUploadFail"
                v-model="avatarOption.show"
                :width="100"
                :height="100"
                :url="apiRootPath + '/account/avatar-img/upload'"
                :params="avatarOption.params"
                :headers="avatarOption.headers"
                img-format="png"
                langType="zh"
                :withCredentials="true"
            ></ImageUpload>
        </b-container>
    </div>
</template>

<script>
import accountService from "@/services/accountService";
import ImageUpload from "vue-image-crop-upload";

export default {
    name: "register",
    components: { ImageUpload },
    data() {
        return {
            apiRootPath: process.env.VUE_APP_API_ENDPOINT,
            avatar: "",
            user: {
                username: "",
                name: "",
                password: "",
                passwordConfirmation: "",
                phone: "",
                email: "",
                company_id: null,
                avatar_id: "",
                verificationCode: ""
            },
            defaultCompanies: [
                {
                    id: null,
                    name: "---Select Company---"
                }
            ],
            avatarOption: {
                show: false,
                params: {},
                headers: {
                    // smail: "*_~"
                }
            },
            session_expire_time: 0,
            sendLabel: "获取",
            timer: null,
            errorCleared: false
        };
    },
    created() {
        this.$nextTick(() => {
            this.getDefaultCompanies();
        });
    },
    methods: {
        getDefaultCompanies() {
            accountService.getDefaultCompanies().then(response => {
                this.defaultCompanies = [
                    ...this.defaultCompanies,
                    ...response.companies
                ];
            });
        },
        register() {
            this.$validator
                .validateAll()
                .then(response => {
                    if (!response) return;
                    if (this.notSameValidation()) return;
                    accountService.createAccount(this.user).then(() => {
                        this.errorCleared = true;
                        this.avatar = "";
                        this.user = {
                            username: "",
                            name: "",
                            password: "",
                            passwordConfirmation: "",
                            phone: "",
                            email: "",
                            company_id: null,
                            avatar_id: "",
                            verificationCode: ""
                        };
                        this.session_expire_time = 0;
                        if (this.timer) {
                            clearInterval(this.timer);
                        }
                        this.$toasted.success(
                            "Please wait until we review your profile"
                        );
                        setTimeout(() => {
                            this.errorCleared = false;
                            this.errors.clear();
                        }, 0);
                    });
                })
                .catch(() => {});
        },
        toggleShow() {
            this.avatarOption.show = !this.avatarOption.show;
        },
        cropSuccess(imgDataUrl) {
            this.avatar = imgDataUrl;
        },
        // eslint-disable-next-line
        cropUploadSuccess(jsonData, field) {
            this.user.avatar_id = jsonData.d.id;
        },
        // eslint-disable-next-line
        cropUploadFail(status, field) {},
        sendVerificationCode() {
            if (!this.user.phone) {
                return;
            }
            if (this.timer) {
                clearInterval(this.timer);
            }
            this.sendLabel = "发送中...";
            accountService
                .sendCode({
                    to: this.user.phone
                })
                .then(
                    () => {
                        this.$toasted.success("Please check your phone");
                        this.startTimer();
                        this.sendLabel = "获取";
                    },
                    () => {
                        this.sendLabel = "获取";
                    }
                )
                .catch(() => {
                    this.sendLabel = "获取";
                });
        },
        startTimer() {
            this.session_expire_time = 300;
            this.timer = setInterval(() => {
                if (this.session_expire_time <= 0) {
                    this.session_expire_time = 0;
                    clearInterval(this.timer);
                    return;
                }
                this.session_expire_time--;
            }, 1000);
        },
        notSameValidation() {
            if (this.user.password != this.user.passwordConfirmation)
                return true;
            return false;
        }
    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.register-container {
    .register-bg {
        background: url("~@/assets/imgIsper/4.jpg");
        background-position: center;
        background-size: cover;
        border: 0px;
        .opacity-bg {
            background: rgba(255, 255, 255, 0.8);
        }
        .iconBar {
            margin-top: 20%;
            background-color: #ffffffc9;
            padding: 10px;
            font-weight: bold;
        }

        .img-mask {
            position: absolute;
            background: #27376ce6;
            top: 60%;
            width: 80%;
            left: 5%;
            border-radius: 4px;
            padding: 10px 30px;
            color: white;
            text-align: left;
            font-size: 25px;
            font-weight: bold;

            .mask-body-text {
                border-top: 5px solid #d75852;
            }

            .mask-body-icon {
                width: 30px;
                height: 30px;
                text-align: center;
                background: white;
                border-radius: 42px;
                color: black;
                font-weight: 900;
                margin-top: 8px;

                svg {
                    margin-top: -10px;
                }
            }
        }
    }
    .avatar-img {
        width: 100px;
        height: 100px;
        border: 1px solid grey;
    }
    span.err-label {
        color: #dc3545 !important;
        text-align: left;
        float: left;
        font-size: 13px;
    }
}
</style>