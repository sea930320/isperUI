<template>
  <div class="system-set">
    <b-tabs v-if="userInfo.identity===1">
      <b-tab title="角色管理">Role Management</b-tab>
      <b-tab title="安全维护" class="pt-2">
        <b-tabs class="security-log">
          <b-tab title="操作日志">Work Log</b-tab>
          <b-tab title="登录记录">
            <login-log/>
          </b-tab>
          <b-tab title="记录统计">Record Statistic</b-tab>
        </b-tabs>
      </b-tab>
      <b-tab title="字典管理">
          <Dictionary />
      </b-tab>
      <b-tab title="公告管理">
          <Advertising />
      </b-tab>
    </b-tabs>
      <b-tabs v-if="userInfo.identity===2">
          <b-tab title="操作日志">Work Log</b-tab>
          <b-tab title="登录记 录">
              <login-log/>
          </b-tab>
          <b-tab title="记录统计">Record Statistic</b-tab>
      </b-tabs>
      <b-tabs v-if="userInfo.identity===3">
          <b-tab title="日志管理" class="pt-2">
              <b-tabs class="security-log">
                  <b-tab title="操作日志">Work Log</b-tab>
                  <b-tab title="登录记录">
                      <login-log/>
                  </b-tab>
                  <b-tab title="记录统计">Record Statistic</b-tab>
              </b-tabs>
          </b-tab>
      </b-tabs>
  </div>
</template>

<script>
    import LoginLog from "./LoginLog";
    import Dictionary from "./Dictionary";
    import Advertising from "./Advertising";
    import { mapState } from "vuex";

    export default {
        name: "system-set",
        components: {
            LoginLog,
            Dictionary,
            Advertising,
        },
        computed: {
            ...mapState(["userInfo"])
        },
        created() {
        },
        methods: {}
    };
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
    .system-set {
        .tabs {
            ul.nav-tabs {
                justify-content: center;

                .nav-link.active,
                .nav-item.show .nav-link {
                    color: #007bff !important;
                    background-color: transparent;
                }

                .nav-item .nav-link {
                    color: #253568;
                }
            }
        }

        .tabs.security-log {
            ul.nav-tabs {
                border-bottom: 0px !important;

                .nav-link.active,
                .nav-item.show .nav-link {
                    color: #007bff;
                    background-color: transparent;
                }

                .nav-item {
                    border-bottom: 1px solid #dee2e6;
                }

                .nav-link.active,
                .nav-item.show .nav-link {
                    border: 0px solid;
                }
            }
        }

        .nav-item {
            width: 10%;
        }
    }
</style>