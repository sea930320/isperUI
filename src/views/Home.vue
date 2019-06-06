<template>
    <div class="home-container h-100">
        <!--    <TopHeader>-->
        <!--      <template></template>-->
        <!--    </TopHeader>-->
        <!--    <b-container class=" h-100"> blue -->
        <div class="h-100">
            <b-card class="home-bg h-100">
                <b-row class="h-100">
                    <b-col cols="6" class="d-flex justify-content-center flex-column">
                        <b-card no-body class="opacity-bg">
                            <div class="d-flex justify-content-center p-3">
                                <div class="logo-icon px-3">
                                    <img src="@/assets/imgIsper/3.png">
                                </div>
                                <div class="logo-text px-2 text-color-1">
                                    <h3 class="font-weight-bold">ISPER—2019</h3>
                                    <h4>智慧法治与智慧课堂系统</h4>
                                </div>
                                <div class="login-btn px-2">
                                    <b-button
                                            to="login"
                                            variant="light"
                                            class="px-3"
                                    >{{!isLoggedIn ? "登录" : "转到第一页"}}
                                    </b-button>
                                    <b-button
                                            v-if="!isLoggedIn"
                                            to="register"
                                            variant="light"
                                            class="px-3"
                                    >注册
                                    </b-button>
                                </div>
                            </div>
                        </b-card>
                    </b-col>
                    <b-col cols="6" class="flex-column" style="margin-top: 5%;">
                        <b-card
                                no-body
                                v-for="notification in notificationList"
                                :key="notification.category"
                                class="my-3"
                        >
                            <div class="p-0">
                                <b-row no-gutters>
                                    <b-col
                                            cols="3"
                                            :style="{'backgroundColor': notification.bgcolor}"
                                            class="d-flex justify-content-center flex-column notification-left"
                                    >
                                        {{notification.category}}
                                        <div class="mt-2">
                                            <img :src="notification.category_icon">
                                        </div>
                                    </b-col>
                                    <b-col cols="9">
                                        <div
                                                class="list-header d-flex justify-content-between align-items-center px-4 py-1"
                                                :style="{'fontSize': '18px', 'color': notification.bgcolor, 'borderBottomColor': notification.bgcolor}"
                                        >
                                            {{notification.category}}
                                            <b-link
                                                    :to="notification.all_link"
                                                    :style="{'color': notification.bgcolor}"
                                            >更多>>
                                            </b-link>
                                        </div>
                                        <!-- <hr class="p-0 m-0"> -->
                                        <b-list-group>
                                            <b-list-group-item
                                                    v-for="(post, index) in notification.posts"
                                                    :key="index"
                                                    class="notification-list-item p-2 px-4 d-flex justify-content-between"
                                                    style="font-size:13px"
                                            >
                                                <b-link :to="post.link" style="color:black">
                                                    {{post.title}}&nbsp;&nbsp;
                                                    <span
                                                            class="badge badge-danger"
                                                            v-if="post.isNew==1"
                                                    >New</span>
                                                </b-link>
                                                <span
                                                        v-if="post.created_at"
                                                        style="color: grey"
                                                >{{post.created_at}}</span>
                                            </b-list-group-item>
                                        </b-list-group>
                                    </b-col>
                                </b-row>
                            </div>
                        </b-card>
                    </b-col>
                </b-row>
            </b-card>
        </div>
    </div>
</template>

<script>
    import AdvertisingService from "../services/advertisingService";
    import {mapState} from "vuex";
    export default {
        name: "home",
        components: {},
        watch: {
            // 监控查询参数，如有变化 查询列表数据
            queryParam: {
                handler() {
                    this.queryAdvertisingList();
                },
                deep: true
            }
        },
        computed: {
            ...mapState(["userInfo"])
        },
        created() {
            this.queryAdvertisingList();
        },
        data() {
            return {
                notificationList: [
                    {
                        category: "公告通知",
                        bgcolor: "#2a3970",
                        category_icon: require("@/assets/imgIsper/cat-1.png"),
                        all_link: "/advertisings",
                        posts: []
                    },
                    {
                        category: "业务观摩",
                        bgcolor: "#d75852",
                        category_icon: require("@/assets/imgIsper/cat-2.png"),
                        posts: [
                            {
                                title: "2018药品管理法实验",
                                link: "/advertising/1"
                            },
                            {
                                title: "律师调解通用模拟实验3",
                                link: "#"
                            },
                            {
                                title: "省级人大常委会立法过程实验提案阶段2",
                                link: "#"
                            },
                            {
                                title: "蔡获侵权责任纠纷案民事诉讼审前实验",
                                link: "#"
                            },
                            {
                                title: "美美形体中心个体工商户设立登记的模拟实验2",
                                link: "#"
                            }
                        ]
                    },
                    {
                        category: "问卷调查",
                        bgcolor: "#4e73ff",
                        category_icon: require("@/assets/imgIsper/cat-3.png"),
                        posts: [
                            {
                                title: "关于2018届毕业生就业情况的问卷调查",
                                link: "#",
                                created_at: "2019-04-17"
                            },
                            {
                                title: "学校2018年ISPER系统UI用户体验调查",
                                link: "#",
                                created_at: "2019-04-17"
                            },
                            {
                                title: "江夏区食品监管与质量抽检调查",
                                link: "#",
                                created_at: "2019-04-17"
                            },
                            {
                                title: "大学生心理健康问卷调查",
                                link: "#",
                                created_at: "2019-04-17"
                            },
                            {
                                title: "大学生身体素质问卷调查",
                                link: "#",
                                created_at: "2019-04-17"
                            }
                        ]
                    }
                ],
                advertising: {
                    list: [],
                    total: 0
                },
                queryParam: {
                    status: "",
                    page: 1,
                    size: 5,
                    is_home:true
                },
                queryDebounceParam: {
                    search: ""
                }
            };
        },
        methods: {
            queryAdvertisingList() {
                AdvertisingService.getAdvertisingListHome({...this.queryParam})
                    .then(data => {
                        var today = new Date();
                        var dd = today.getDate();
                        var mm = ("0" + (today.getMonth() + 1)).slice(-2);
                        var yyyy = today.getFullYear();
                        today = yyyy + "-" + mm + "-" + dd;
                        this.advertising.list = data.results;
                        this.advertising.total = 0;
                        for (let j = 0; j < this.advertising.list.length; j++) {
                            var tmpJSON = {};
                            tmpJSON.title = this.advertising.list[j].name;
                            tmpJSON.created_at = this.advertising.list[
                                j
                                ].public_time;
                            if (tmpJSON.created_at.split(' ')[0] == today) {
                                tmpJSON.isNew = 1;
                            } else {
                                tmpJSON.isNew = 0;
                            }
                            var arr = this.advertising.list[j].path_html.split("/");
                            tmpJSON.link =
                                "/advertising/" +
                                arr[arr.length - 1].replace(".html", "");
                            this.notificationList[0].posts.push(tmpJSON);
                        }
                        this.$emit("data-ready");
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
            }
        }
    };
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
    .home-container {
        .home-bg {
            background: url("~@/assets/imgIsper/4.jpg");
            background-position: center;
            background-size: cover;
            border: 0px;
            .opacity-bg {
                background: rgba(255, 255, 255, 0.8);
            }
        }
        .list-header {
            border-bottom: 1px solid;
        }
        .notification-left {
            color: white;
            font-size: 22px;
        }
        .notification-list-item {
            border-right-width: 0 !important;
            border-bottom-width: 0 !important;
        }
        .notification-list-item.list-group-item:first-child {
            border-top-left-radius: 0;
            border-top-right-radius: 0;
        }
        .logo-icon {
            display: flex;
            flex-direction: column;
            justify-content: center;
            img {
                width: 100px;
            }
        }
        .logo-text {
            align-self: center;
        }
        .login-btn {
            align-self: center;
        }
        .card-body {
            height: 100%;
        }
    }
</style>