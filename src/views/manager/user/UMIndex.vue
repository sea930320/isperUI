<template>
  <div class="user-manage-index">
    <b-tabs v-if="userInfo.identity===1">
      <b-tab title="普通用户">
          <SuperUser1 />
      </b-tab>
      <b-tab title="管理员用户">
          <SuperUser2 />
      </b-tab>
      <b-tab title="指导者用户">
          <SuperUser3 />
      </b-tab>
      <b-tab title="学校学生">
          <SuperUser4 />
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
    import { mapState } from "vuex";
    import SuperUser1 from './SuperUser1';
    import SuperUser2 from './SuperUser2';
    import SuperUser3 from './SuperUser3';
    import SuperUser4 from './SuperUser4';

    export default {
        name: "user-manage-index",
        components: {
            SuperUser1,
            SuperUser2,
            SuperUser3,
            SuperUser4
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
    .user-manage-index {
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

        .nav-item {
            width: 10%;
        }
    }
</style>