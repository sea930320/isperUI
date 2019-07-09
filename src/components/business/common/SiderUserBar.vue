<template>
    <div class="siderUserBar">
        <a href="javascript:void(0);"
           class="handle-right handle-control"
           @click="activeSidebar = !activeSidebar"
           v-if="!activeSidebar">
            <img src="/media/invite.png"/>
        </a>
        <div
            class="online-user p-1"
            :class="{'inactive': !this.activeSidebar, 'active': this.activeSidebar}"
        >
            <div class="online-user-list">
                <b-list-group>
                    <b-list-group-item
                        class="mb-1 online-user-list-item"
                        v-for="(nodeRoleAlloc, index) in nodeRoleAllocs"
                        :key="index"
                    >
                        <img
                            src="/media/avatar/userAvatar.png"
                            :class="{'is_online':nodeRoleAlloc.is_online}"
                        />
                        <div class="user-info" :class="{'is_online':nodeRoleAlloc.is_online}">
                            <div class="role-name text-left">
                                <div
                                    class="online-status"
                                    :class="{'online': nodeRoleAlloc.is_online}"
                                ></div>
                                {{nodeRoleAlloc.name}}
                            </div>
                            <div class="user-name text-left">姓名：{{nodeRoleAlloc.user_name}}</div>

                            <b-button
                                class="notify"
                                v-if="nodeRoleAlloc.user_id === null && currentRoleAllocation.can_terminate"
                                size="sm"
                                @click="notify(0, nodeRoleAlloc.id)"
                            >邀请
                            </b-button>
                        </div>
                    </b-list-group-item>
                </b-list-group>
            </div>

            <div class="online-user-handle">
                <a class="handle-left handle-control"
                   href="javascript:void(0);"
                   @click="activeSidebar = !activeSidebar">
                    <img src="/media/invite.png"/>
                </a>
            </div>
        </div>
        <b-modal v-model="inviteShow" hide-footer centered title="请邀请无职务参与人员">
            <div>
                <b-form-select v-model="selectedUser" :options="ownGUsers"></b-form-select>
                <b-button variant="success" @click="notify(1)" class="mt-5" :disabled="selectedUser === null">确&emsp;定
                </b-button>
            </div>
        </b-modal>
    </div>
</template>

<script>
    import businessService from "@/services/businessService";
    import {mapState} from "vuex";

    export default {
        name: "SideUserBar",
        components: {},
        sockets: {
            onlineAllocs(data) {
                this.onlineAllocs = data.allocs;
            }
        },
        data() {
            return {
                modalShow: 0,
                applyOptData: {
                    opt_status: false,
                    opt: {}
                },
                inviteShow: false,
                selectedUser: null,
                selectedId: null,
                signedDocDetail: null,
                activeSidebar: false,
                onlineAllocs: [],
                ownGUsers: [],
            };
        },
        computed: {
            ...mapState({
                userRoleAllocs: state => state.meta.info.user_role_allocs,
                currentRoleAllocation: state => state.meta.currentRoleAllocation,
                messages: state => state.meta.messages,
                userInfo: state => state.userInfo,
                roleAllocs: state => state.meta.info.role_allocs,
                node_id: state => state.meta.info.node_id
            }),
            nodeRoleAllocs() {
                let nodeRoleAllocs = _.filter(this.roleAllocs, {
                    node_id: this.node_id
                });
                nodeRoleAllocs = _.map(nodeRoleAllocs, nodeRoleAlloc => {
                    nodeRoleAlloc.is_online = !!_.some(this.onlineAllocs, onlineAlloc => {
                        return onlineAlloc.alloc_id === nodeRoleAlloc.id;
                    });
                    return nodeRoleAlloc;
                });
                return nodeRoleAllocs;
            },
        },
        watch: {
            currentRoleAllocation: {
                handler: function (val) {
                    this.$socket.emit("userIsOnline", {alloc_id: val.alloc_id});
                },
                deep: true
            }
        },
        created() {
            this.$nextTick(() => {
                this.getOwnGUsers();
            });
        },
        mounted() {
            if (this.currentRoleAllocation.alloc_id) {
                this.$socket.emit("userIsOnline", {
                    alloc_id: this.currentRoleAllocation.alloc_id
                });
            }
        },
        methods: {
            getOwnGUsers() {
                businessService.getOwnGUsers().then(res => {
                    this.ownGUsers = res.result;
                });
            },
            notify(status, id) {
                if (status === 0) {
                    this.inviteShow = true;
                    this.selectedUser = null;
                    this.selectedId = id;
                } else {
                    businessService.setNoneUser({
                        role_alloc_id: this.selectedId,
                        user_id: this.selectedUser
                    }).then(() => {
                        this.inviteShow = false;
                        this.$toasted.success("邀请成功");
                        this.roleAllocs.map(item => {
                            if (item.id === this.selectedId) {
                                item.user_id = this.selectedUser;
                                item.user_name = this.ownGUsers.filter(x => x.value === this.selectedUser)[0].text;
                            }
                            return item
                        });
                    });
                }
            }
        }
    }
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
    .siderUserBar {
        .online-user {
            background: rgb(221, 231, 249);
            box-shadow: -5px 0px 10px 1px #a6c3f9;
            height: calc(100% - 80px);
            width: 300px;
            position: fixed;
            top: 80px;
            overflow-y: overlay;
            right: 0px;

            .online-user-handle {
                position: fixed;
                top: 90vh;
                right: 35px;
            }

            .user-name {
                font-size: 14px;
            }
        }

        .online-user.active {
            .online-user-handle {
                position: fixed;
                top: 90vh;
                right: 270px;
            }
        }

        .online-user.inactive {
            visibility: hidden;
            opacity: 0;
            transition: visibility 0s linear 300ms, opacity 300ms;
        }

        .online-user.active {
            visibility: visible;
            opacity: 1;
            transition: visibility 0s linear 0s, opacity 300ms;
        }

        .handle-right {
            position: absolute;
            top: 90vh;
            right: 35px;

            img {
                width: 60px;
                height: 60px;
                filter: drop-shadow(3px 3px 4px #222);
            }
        }

        .handle-left {
            img {
                width: 60px;
                height: 60px;
                filter: drop-shadow(3px 3px 4px #222);
            }
        }

        .handle-control {
            color: #a6c3f9;
        }

        .online-user-list-item {
            display: flex;
            padding: 5px;

            img {
                width: 50px;
                height: 50px;
                margin-right: 10px;
                border: 2px solid #b1b1b1;
                border-radius: 50px;
                opacity: 0.5;
                filter: alpha(opacity=50); /* For IE8 and earlier */
            }

            .user-info {
                position: relative;
                width: 100%;
                color: #a29b9b;
            }

            .is_online {
                color: black;
            }

            img.is_online {
                opacity: 1;
                filter: alpha(opacity=100); /* For IE8 and earlier */
            }

            .role-name {
                display: flex;
            }

            .online-status {
                width: 10px;
                height: 10px;
                margin-top: 8px;
                margin-right: 8px;
                background: #bec0c2;
                border-radius: 10px;
            }

            .online-status.online {
                background: #5dc26a;
            }

            .notify {
                right: 0px;
                bottom: 0px;
                position: absolute;
            }
        }
    }
</style>
