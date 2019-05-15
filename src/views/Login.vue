<template>
    <!--  <div class="login-container"> blue -->
    <div class="login-container" style="margin-top: 5%;">
        <b-container>
            <b-card no-body class="overflow-hidden">
                <b-row no-gutters>
                    <b-col lg="6" sm="12" style="overflow: hidden">
                        <img src="@/assets/imgIsper/4.jpg" class="rounded-0 left-img">
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
                    <b-col lg="6" sm="12">
                        <b-card-body class="text-center">
                            <div class="logo">
                                <img src="@/assets/imgIsper/2.png" class="rounded-0">
                            </div>
                            <h4>ISPER—2019</h4>
                            <div class="mb-2">智慧法治与智慧课堂系统</div>

                            <div class="login-box px-5">
                                <b-input-group>
                                    <b-input-group-prepend>
                                        <span class="input-group-text">
                                            <icon name="user"></icon>
                                        </span>
                                    </b-input-group-prepend>
                                    <b-form-input
                                        :value="user.username"
                                        placeholder="请输入用户名"
                                        @change.native="user.username = $event.target.value"
                                    ></b-form-input>
                                </b-input-group>
                                <b-input-group class="mt-3">
                                    <b-input-group-prepend>
                                        <span class="input-group-text">
                                            <icon name="unlock"></icon>
                                        </span>
                                    </b-input-group-prepend>
                                    <b-form-input
                                        type="password"
                                        v-model="user.password"
                                        placeholder="请输入密码"
                                    ></b-form-input>
                                </b-input-group>
                                <div class="row justify-content-between mx-0 mt-2">
                                    <b-form-checkbox
                                        id="checkbox-1"
                                        v-model="user.remember"
                                        name="checkbox-1"
                                        :value="true"
                                        :unchecked-value="false"
                                    >记住密码</b-form-checkbox>
                                    <b-link to="#">忘记密码?</b-link>
                                </div>
                                <b-button
                                    @click="loginHandle"
                                    @keyup.enter="loginHandle"
                                    block
                                    variant="primary"
                                    class="mt-3"
                                >登录</b-button>
                            </div>

                            <div class="dl-choose px-5 my-3">
                                <b-row>
                                    <b-col
                                        cols="6"
                                        v-for="(permission, index) in permissions"
                                        :key="index"
                                        class="text-left mt-1"
                                    >
                                        <b-form-radio
                                            v-model="user.login_type"
                                            :value="permission[0]"
                                        >{{permission[1]}}</b-form-radio>
                                    </b-col>
                                </b-row>
                            </div>

                            <div class="qrcode-info mt-3 pt-3">
                                <div class="qrcode-title">下载ISPER手机APP, 随时随地参与实验</div>
                                <b-row class="qrcodeImgBox mt-2">
                                    <b-col>
                                        <div class="qrcodeDesc">
                                            <img src="@/assets/img/appleIcon.png" alt="IOS">
                                            <span class="ml-2">iPhone</span>
                                        </div>
                                        <img
                                            v-if="qrcodeImage.ios"
                                            :src="qrcodeImage.ios"
                                            alt="IOS"
                                            class="qrcodeImage mt-2"
                                        >
                                        <div v-else class="qrcodeImage mt-2"/>
                                    </b-col>
                                    <b-col>
                                        <div class="qrcodeDesc">
                                            <img src="@/assets/img/androidIcon.png" alt="Android">
                                            <span class="ml-2">Android</span>
                                        </div>
                                        <img
                                            v-if="qrcodeImage.android"
                                            :src="qrcodeImage.android"
                                            alt="Android"
                                            class="qrcodeImage mt-2"
                                        >
                                        <div v-else class="qrcodeImage mt-2"/>
                                    </b-col>
                                </b-row>
                            </div>
                        </b-card-body>
                    </b-col>
                </b-row>
            </b-card>
        </b-container>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import accountService from "../services/accountService";
import { STORAGE_KEY_USER } from "../store/storageKey";

export default {
    components: {},
    data() {
        return {
            tipModal: false,
            contentDetailFlag: false,
            user: {
                username: "",
                password: "",
                login_type: -1,
                remember: true
            },
            is_director: false,
            is_manage: false,
            is_admin: false,
            is_general: false,
            permissions: [],
            qrcodeImage: {
                ios: "",
                android: ""
            },
            noticeInfo: {
                contentWid: 0,
                content: "",
                attach: "",
                file_name: "",
                create_time: "",
                title: "最新公告"
            }
        };
    },
    computed: {
        ...mapState(["userInfo"])
    },
    created() {
        if (this.isLoggedIn) {
            this.firstPageGo();
        } else {
            this.getQrcode();
        }
    },
    methods: {
        ...mapActions({
            loginAction: "login",
            logoutAction: "logout"
        }),
        loginHandle() {
            accountService.login(this.user).then(data => {
                this.$toasted.success(
                    "successfully logged in, role_id: " + data.role
                );
                this.firstPageGo(data);
            });
        },
        firstPageGo(data = null) {
            if (!data) {
                data = JSON.parse(this.$cookie.get(STORAGE_KEY_USER));
            } else {
                this.$cookie.set(STORAGE_KEY_USER, JSON.stringify(data));
                this.loginAction(data);
            }
            if ([1, 2, 3, 6, 7].includes(data.role)) {
                this.$router.push("/manager/workflow");
            }
        },
        getQrcode() {
            accountService.getQrcode().then(data => {
                this.qrcodeImage.ios = data.ios;
                this.qrcodeImage.android = data.android;
            });
        }
    },
    watch: {
        "user.username": {
            handler: function() {
                this.permissions = [];
                this.user.login_type = -1;
                accountService
                    .getUserIdentity({ username: this.user.username })
                    .then(data => {
                        this.is_director = data.is_director;
                        this.is_manage = data.is_manage;
                        this.is_admin = data.is_admin;
                        this.is_general = true;
                        this.permissions = data.roles;
                        if (this.permissions.length > 0) {
                            this.user.login_type = this.permissions[0][0];
                        }
                    });
            },
            deep: true
        }
    }
};
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss" scoped>
@import "../assets/css/login.scss";
</style>
