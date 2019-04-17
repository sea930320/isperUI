<template>
  <div class="assistant-set">
    <b-card no-body>
      <b-card-header>
        <PersonalCenterTab activeTab="2"/>
      </b-card-header>
      <b-card-body class="text-left">
        <b-row>
          <b-col cols="4">
            <b-card no-body>
              <b-card-header class="assistant-add">
                配置助理
                <b-button variant="href" class="float-right">
                  <icon name="plus-circle"></icon>
                </b-button>
              </b-card-header>
              <b-card-body>
                <b-list-group>
                  <b-list-group-item
                    button
                    class="d-flex justify-content-between align-items-center"
                  >
                    助理1
                    <b-button size="sm">取消绑定</b-button>
                  </b-list-group-item>
                  <b-list-group-item
                    button
                    class="d-flex justify-content-between align-items-center"
                    active
                  >
                    助理2
                    <b-button size="sm">取消绑定</b-button>
                  </b-list-group-item>
                </b-list-group>
              </b-card-body>
            </b-card>
          </b-col>
          <b-col cols="8">
            <b-card no-body class="role-select-card">
              <b-card-body class="text-center">
                <table class="table table-bordered">
                  <thead class="thead-light">
                    <tr>
                      <th class="w-25">一级菜单</th>
                      <th class="w-25">二级菜单</th>
                      <th class="w-50">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>系统功能</td>
                      <td colspan="2" class="m-0 p-0">
                        <b-row no-gutters class>
                          <b-col cols="4" class="p-1">
                            <b-form-checkbox
                              id="checkbox-1"
                              name="checkbox-1"
                              value="accepted"
                              unchecked-value="not_accepted"
                            >流程管理</b-form-checkbox>
                          </b-col>
                          <b-col cols="8"></b-col>
                        </b-row>
                        <b-row no-gutters class>
                          <b-col cols="4" class="p-1">
                            <b-form-checkbox
                              id="checkbox-1"
                              name="checkbox-1"
                              value="accepted"
                              unchecked-value="not_accepted"
                            >项目管理</b-form-checkbox>
                          </b-col>
                          <b-col cols="8"></b-col>
                        </b-row>
                      </td>
                    </tr>
                    <tr>
                      <td>系统设置</td>
                      <td colspan="2"></td>
                    </tr>
                  </tbody>
                </table>
              </b-card-body>
            </b-card>
          </b-col>
        </b-row>
      </b-card-body>
      <b-card-footer class="text-muted">
        <b-button class type="submit" variant="primary">保存</b-button>
      </b-card-footer>
    </b-card>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
// import accountService from "@/services/accountService";
import PersonalCenterTab from "@/components/personal-center/PersonalCenterTab";

export default {
  name: "personal-info",
  components: { PersonalCenterTab },
  data() {
    return {};
  },
  computed: {
    ...mapState(["userInfo"])
  },
  created() {},
  methods: {
    ...mapActions({
      loginAction: "login"
    })
  }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.assistant-set {
  .assistant-add {
    line-height: 38px;
    text-align: center;
  }
  .role-select-card {
    .row > [class*="col-"] {
      border: 1px solid rgba(86, 61, 124, 0.2);
      height: 49px;
    }
  }
}
</style>