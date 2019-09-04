<template>
    <div class="chat-flash-wrap flash-height">
        <div class="court-title">
            <p>{{metaInfo.name}} - {{metaInfo.nodeName}}</p>
        </div>
        <div class="flash">
            <!-- flash下载提示 -->
            <div v-show="!hasFlash" class="flash-tip-wrapper">
                <div class="flash-tip">
                    <p>该浏览器没有下载flash，或者浏览器禁用了flash</p>
                    <p>
                        请点击
                        <a href="//www.adobe.com/go/getflash?spm=a2h0j.8191423.movie_player.5~5~5~8~A"
                           target="_blank"
                           data-spm-anchor-id="a2h0j.8191423.movie_player.5~5~5~8~A">这里</a>
                    </p>
                </div>
            </div>
            <!-- flash加载动画 -->
            <div v-show="!flashReady.isReady && hasFlash" class="flash-loading">
                <div class="jar">
                    <div class="mouth"></div>
                    <div class="neck"></div>
                    <div class="base">
                        <div class="liquid"> </div>
                        <div class="wave"></div>
                        <div class="wave"></div>
                        <div class="bubble"></div>
                        <div class="bubble"></div>
                    </div>
                    <div class="bubble"></div>
                    <div class="bubble"></div>
                </div>
                <p>loading.....</p>
            </div>
            <!-- flash -->
            <object id="FlashID" ref="flash" name="flash" type="application/x-shockwave-flash" :data="metaInfo.flashSrc">
                <param name="movie" :value="metaInfo.flashSrc" />
                <param name="quality" value="high"/>
                <param name="allowscriptaccess" value="always"/>
                <param name="allowscale" value="true"/>
                <param value="wmode" name="opaque"/>
                <a href="http://www.adobe.com/go/getflash">
                    <img src="http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif" alt="Get Adobe Flash player"/>
                </a>
            </object>
        </div>
    </div>
</template>

<script>
    import businessService from "@/services/businessService";
    import CourtFlash from './courtFlash';
    import {
        ACTION_ROLE_SHOW,
        ACTION_ROLE_HIDE,
        ACTION_ROLE_STAND,
        ACTION_ROLE_SITDOWN,
        ACTION_TRANS,
        ACTION_BUSINESS_RESTART,
        ACTION_ROLE_LETIN,
        ACTION_ROLE_LETOUT,
        ACTION_ROLE_TOWARD_REPORT,
        ACTION_ROLE_END_REPORT,
        ACTION_ROLES_EXIT
    } from "@/components/business/common/actionCmds";

    export default {
        name: "court-flash",
        data() {
            return {
                flashObj: null,
                hasFlash: false,
                // eslint-disable-next-line
                flashReady: flash
            }
        },
        computed: {
            metaInfo() {
                return this.$store.state.meta.info
            },
            actionCmd() {
                return this.$store.state.meta.actionCmd
            },
            currentRole() {
                return this.$store.state.meta.currentRoleAllocation
            }
        },
        mounted() {
            this.flashCheck();
            this.initFlashRole();
        },
        watch: {
            $route() {
                this.initFlashRole()
            },
            'flashReady': {
                handler(data) {
                    if (data.isReady) {
                        this.initFlashRole()
                    }
                },
                deep: true
            },
            'actionCmd': {
                handler(action) {
                    if (action) {
                        this.actionHandler(action);
                        this.$store.dispatch('emptyActionCmd')
                    }
                },
                deep: true
            }
        },
        methods: {
            // 初始化flash角色状态
            initFlashRole() {
                if (this.flashReady.isReady) {
                    businessService
                        .getBusinessRoleStatus({
                            business_id: this.$route.params.bid,
                            node_id: this.$route.params.nid
                        })
                        .then(data => {
                            setTimeout(() => {
                                this.initCourtFlash(data)
                            }, 2000)
                        })
                }
            },
            // 初始化flash对象
            initCourtFlash(roleStatus) {
                this.flashObj = new CourtFlash( this.$refs.flash, { status: roleStatus } )
            },
            // 动作处理函数
            actionHandler(action) {
                if (!this.flashObj) {
                    this.$toast.info('flash未初始化');
                    return
                }
                let roleCmd = null;
                switch (action.ext.cmd) {
                    case ACTION_ROLE_SHOW:
                        this.flashObj.sittingRole(action.ext.opt);
                        break;
                    case ACTION_ROLE_HIDE:
                        this.flashObj.roleAction(`cmd=show&rolename=${action.ext.code_position}&operate=dvisible`);
                        break;
                    case ACTION_ROLE_STAND:
                        this.flashObj.roleAction(`cmd=move&rolename=${action.ext.code_position}&direct=up`);
                        break;
                    case ACTION_ROLE_SITDOWN:
                        this.flashObj.roleAction(`cmd=move&rolename=${action.ext.code_position}&direct=down`);
                        break;
                    case ACTION_ROLES_EXIT:
                        action.ext.opt.data.forEach(role => {
                            this.flashObj.roleAction(`cmd=show&rolename=${role.code_position}&operate=dvisible`);
                        });
                        break;
                    case ACTION_TRANS:
                        if (action.ext.code_position) {
                            let msgData = '****';
                            if (this.currentRole.sitting_status === 2) {
                                msgData = action.data
                            }
                            this.flashObj.roleAction(`cmd=speak&rolename=${action.ext.code_position}&says=${msgData}`);
                            setTimeout(() => {
                                this.flashObj.roleAction(action.ext.param)
                            }, 1000)
                        } else {
                            this.flashObj.roleAction(action.ext.param)
                        }
                        break;
                    case ACTION_ROLE_LETIN:
                        this.flashObj.sittingRoles(action.ext.opt.data);
                        break;
                    case ACTION_ROLE_LETOUT:
                        action.ext.opt.data.forEach(item => {
                            this.flashObj.roleAction(`cmd=show&rolename=${item.code_position}&operate=dvisible`);
                        });
                        break;
                    case ACTION_ROLE_TOWARD_REPORT:
                        this.flashObj.roleAction(action.ext.opt.animate_cmd)
                        if (action.ext.opt.origin_position.sitting_status === 2 && action.ext.opt.origin_position.is_self) {
                            this.flashObj.roleShow(action.ext.opt.origin_position.code_position, 0)
                        }
                        roleCmd = this.flashObj.getRoleCmd(action.ext.opt.report_position.code_position, action.ext.opt.gender, action.ext.opt.actors, action.ext.opt.user.name);
                        this.flashObj.setRole(roleCmd);
                        this.flashObj.roleShow(action.ext.opt.report_position.code_position, 1);
                        break;
                    case ACTION_ROLE_END_REPORT:
                        this.flashObj.roleShow(action.ext.opt.report_position.code_position, 0);
                        if (action.ext.opt.sitting_status === 2) {
                            let roleCmd = this.flashObj.getRoleCmd(action.ext.opt.origin_position.code_position, action.ext.opt.gender, action.ext.opt.actors, action.ext.opt.user.name);
                            this.flashObj.setRole(roleCmd);
                            this.flashObj.roleShow(action.ext.opt.origin_position.code_position, 1)
                        }
                        break;
                    case ACTION_BUSINESS_RESTART:
                        this.initFlashRole()
                }
                if (action.ext.code_position) {
                    let msgData = '****';
                    if (this.currentRole.sitting_status === 2) {
                        msgData = action.msg;
                    }
                    this.flashObj.roleAction(`cmd=speak&rolename=${action.ext.code_position}&says=${msgData}`)
                }
            },
            // 检查浏览器的flash情况
            flashCheck() {
                if (window.navigator.plugins) {
                    for (let i = 0; i < window.navigator.plugins.length; i++) {
                        if (window.navigator.plugins[i].name.toLowerCase().indexOf('shockwave flash') >= 0) {
                            this.hasFlash = true;
                            break;
                        }
                    }
                }
            }
        }
    }
</script>

<style>
    #FlashID {
        width: 100%;
        height: 100%;
    }
    @media screen and (max-width: 1500px) {
        #FlashID {
            max-height: 680px;
        }
    }
    .flash{
        height: 100%;
        overflow: unset;
    }
    @media screen and (max-width: 1200px) {
        #FlashID {
            max-height: 580px;
        }
    }
    .action-container.clearfix {
        text-align: left;
    }
    .chat-flash-wrap {
        position: relative;
    }
    .chat-flash-wrap .court-title {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        padding: 0 20px;
        height: 40px;
        line-height: 40px;
        color: #fff;
        background-color: rgb(73, 104, 202);
    }
    .panel-container {
        position: relative;
    }
    .flash-loading,
    .flash-tip-wrapper {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: #191F26;
    }
    .flash-tip {
        width: 400px;
        margin: 350px auto 70px;
        position: relative;
        line-height: 2;
        color: #fff;
        font-size: 16px;
        text-align: center;
    }
    .flash-tip a {
        color: #fd4c5b;
    }
    .flash-loading {
        overflow: hidden;
    }
    .flash-loading p {
        color: #fff;
        font-size: 16px;
        line-height: 2;
        text-align: center;
    }
    .jar {
        position: relative;
        width: 200px;
        margin: 300px auto 0;
        text-align: center;
    }
    .jar .mouth {
        width: 40px;
        height: 10px;
        margin: 0 auto -1px;
        border-right: 4px solid #fff;
        border-left: 4px solid #fff;
        -moz-border-radius: 20px;
        -webkit-border-radius: 20px;
        border-radius: 20px;
    }
    .jar .neck {
        width: 35px;
        height: 45px;
        margin: 0 auto -5px;
        z-index: 7;
        position: relative;
        background-color: #191F26;
        border-right: 4px solid #fff;
        border-left: 4px solid #fff;
    }
    .jar .bubble {
        width: 10px;
        height: 10px;
        position: absolute;
        background-color: #35EEFB;
        opacity: 0.4;
        left: 92px;
        z-index: 8;
        top: 110px;
        -moz-border-radius: 100%;
        -webkit-border-radius: 100%;
        border-radius: 100%;
        -moz-animation: buble 2s linear 1s infinite;
        -webkit-animation: buble 2s linear 1s infinite;
        animation: buble 2s linear 1s infinite;
    }
    .jar .bubble + .bubble {
        left: 87px;
        top: 120px;
        width: 15px;
        height: 15px;
        -moz-animation-duration: 3s;
        -webkit-animation-duration: 3s;
        animation-duration: 3s;
    }
    .jar .base {
        margin: auto;
        width: 120px;
        height: 100px;
        border: 4px solid #fff;
        -moz-border-radius: 50%;
        -webkit-border-radius: 50%;
        border-radius: 50%;
        overflow: hidden;
        position: relative;
        z-index: 5;
    }
    .jar .base .bubble {
        left: 15px;
        top: 50px;
        -moz-animation: bounce 2.3s linear 0s infinite alternate;
        -webkit-animation: bounce 2.3s linear 0s infinite alternate;
        animation: bounce 2.3s linear 0s infinite alternate;
    }
    .jar .base .bubble + .bubble {
        left: 75px;
        top: 40px;
        -moz-animation-duration: 3s;
        -webkit-animation-duration: 3s;
        animation-duration: 3s;
    }
    .jar .liquid {
        height: 40px;
        background-color: #35EEFB;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
    }
    .jar .wave {
        width: 60px;
        height: 20px;
        position: absolute;
        background-color: #35EEFB;
        left: 0;
        top: 50px;
        -moz-animation: wave 1s linear 1s infinite alternate;
        -webkit-animation: wave 1s linear 1s infinite alternate;
        animation: wave 1s linear 1s infinite alternate;
        -moz-border-radius: 50%;
        -webkit-border-radius: 50%;
        border-radius: 50%;
    }
    .jar .wave + .wave {
        left: auto;
        right: 0;
    }

    @-moz-keyframes wave {
        from {
            -moz-transform: translateX(100px);
            transform: translateX(100px);
        }
        to {
            -moz-transform: translateX(-100px);
            transform: translateX(-100px);
        }
    }
    @-webkit-keyframes wave {
        from {
            -webkit-transform: translateX(100px);
            transform: translateX(100px);
        }
        to {
            -webkit-transform: translateX(-100px);
            transform: translateX(-100px);
        }
    }
    @keyframes wave {
        from {
            -moz-transform: translateX(100px);
            -ms-transform: translateX(100px);
            -webkit-transform: translateX(100px);
            transform: translateX(100px);
        }
        to {
            -moz-transform: translateX(-100px);
            -ms-transform: translateX(-100px);
            -webkit-transform: translateX(-100px);
            transform: translateX(-100px);
        }
    }
    @-moz-keyframes bounce {
        0% {
            -moz-transform: translate(5px, 15px);
            transform: translate(5px, 15px);
        }
        50% {
            -moz-transform: translate(0, -15px);
            transform: translate(0, -15px);
        }
        100% {
            -moz-transform: translate(-5px, -37px);
            transform: translate(-5px, -37px);
            opacity: 1;
        }
    }
    @-webkit-keyframes bounce {
        0% {
            -webkit-transform: translate(5px, 15px);
            transform: translate(5px, 15px);
        }
        50% {
            -webkit-transform: translate(0, -15px);
            transform: translate(0, -15px);
        }
        100% {
            -webkit-transform: translate(-5px, -37px);
            transform: translate(-5px, -37px);
            opacity: 1;
        }
    }
    @keyframes bounce {
        0% {
            -moz-transform: translate(5px, 15px);
            -ms-transform: translate(5px, 15px);
            -webkit-transform: translate(5px, 15px);
            transform: translate(5px, 15px);
        }
        50% {
            -moz-transform: translate(0, -15px);
            -ms-transform: translate(0, -15px);
            -webkit-transform: translate(0, -15px);
            transform: translate(0, -15px);
        }
        100% {
            -moz-transform: translate(-5px, -37px);
            -ms-transform: translate(-5px, -37px);
            -webkit-transform: translate(-5px, -37px);
            transform: translate(-5px, -37px);
            opacity: 1;
        }
    }
    @-moz-keyframes buble {
        0% {
            -moz-transform: translate(3px, 10px);
            transform: translate(3px, 10px);
        }
        25% {
            -moz-transform: translate(0, 0px);
            transform: translate(0, 0px);
        }
        50% {
            -moz-transform: translate(-3px, -25px);
            transform: translate(-3px, -25px);
        }
        75% {
            -moz-transform: translate(0, -50px);
            transform: translate(0, -50px);
            opacity: 1;
        }
        100% {
            -moz-transform: translate(3px, -100px);
            transform: translate(3px, -100px);
            opacity: 0;
        }
    }
    @-webkit-keyframes buble {
        0% {
            -webkit-transform: translate(3px, 10px);
            transform: translate(3px, 10px);
        }
        25% {
            -webkit-transform: translate(0, 0px);
            transform: translate(0, 0px);
        }
        50% {
            -webkit-transform: translate(-3px, -25px);
            transform: translate(-3px, -25px);
        }
        75% {
            -webkit-transform: translate(0, -50px);
            transform: translate(0, -50px);
            opacity: 1;
        }
        100% {
            -webkit-transform: translate(3px, -100px);
            transform: translate(3px, -100px);
            opacity: 0;
        }
    }
    @keyframes buble {
        0% {
            -moz-transform: translate(3px, 10px);
            -ms-transform: translate(3px, 10px);
            -webkit-transform: translate(3px, 10px);
            transform: translate(3px, 10px);
        }
        25% {
            -moz-transform: translate(0, 0px);
            -ms-transform: translate(0, 0px);
            -webkit-transform: translate(0, 0px);
            transform: translate(0, 0px);
        }
        50% {
            -moz-transform: translate(-3px, -25px);
            -ms-transform: translate(-3px, -25px);
            -webkit-transform: translate(-3px, -25px);
            transform: translate(-3px, -25px);
        }
        75% {
            -moz-transform: translate(0, -50px);
            -ms-transform: translate(0, -50px);
            -webkit-transform: translate(0, -50px);
            transform: translate(0, -50px);
            opacity: 1;
        }
        100% {
            -moz-transform: translate(3px, -100px);
            -ms-transform: translate(3px, -100px);
            -webkit-transform: translate(3px, -100px);
            transform: translate(3px, -100px);
            opacity: 0;
        }
    }
</style>