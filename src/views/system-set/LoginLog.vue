<template>
  <div class="login-log">
    <loading v-if="isRunning"></loading>
    <b-row class="cardDiv">
      <b-col lg="3" md="6" sm="12">
        <b-input-group :size="template_size">
          <b-input-group-prepend>
            <span class="input-group-text">
              <icon name="search"></icon>
            </span>
          </b-input-group-prepend>
          <b-form-input v-model.lazy="queryDebounceParam.search" placeholder="请输入内容"/>
        </b-input-group>
      </b-col>
      <b-col lg="6" md="6" sm="12" class="align-self-center d-flex justify-content-between">
        <date-picker class="mx-2" v-model="queryParam.range" range format="YYYY-MM-DD"></date-picker>
        <b-form-select
          v-if="userInfo.identity==1"
          :size="template_size"
          class="mx-1"
          v-model="queryParam.group_id"
          :options="groups"
          value-field="id"
          text-field="name"
          style="flex:1"
        ></b-form-select>
        <b-form-select
          v-if="userInfo.identity==1"
          :size="template_size"
          class="mx-1"
          v-model="queryParam.company_id"
          :options="companies"
          value-field="id"
          text-field="name"
          style="flex:1"
        ></b-form-select>
      </b-col>
      <b-col lg="3" md="6" sm="12" class="align-self-center">
        <b-button-group class="float-right">
          <b-button
            v-if="userInfo.identity==1"
            :size="template_size"
            class="styledBtn"
            variant="outline-primary"
            @click="deleteLogs"
          >清理</b-button>
          <b-button
            :size="template_size"
            class="styledBtn"
            variant="outline-primary"
            @click="exportLogs"
          >导出</b-button>
        </b-button-group>
      </b-col>
    </b-row>

    <div class="cardDiv">
      <b-table :items="loginLogList" small hover :fields="columns" head-variant>
        <template slot="HEAD_sn" slot-scope="head">
          <b-form-checkbox v-if="userInfo.identity==1" v-model="allChecked">{{head.label}}</b-form-checkbox>
          <span v-else>{{head.label}}</span>
        </template>
        <template slot="sn" slot-scope="row">
          <b-form-checkbox
            v-if="userInfo.identity==1"
            v-model="row.item.checked"
          >{{ row.index + 1 }}</b-form-checkbox>
          <span v-else>{{ row.index + 1 }}</span>
        </template>
        <template slot="user_id" slot-scope="row">{{row.item.user_id}}</template>
        <template slot="user_name" slot-scope="row">{{row.item.user_name}}</template>
        <template slot="group" slot-scope="row">{{row.item.group && row.item.group.name}}</template>
        <template slot="company" slot-scope="row">{{row.item.company && row.item.company.name}}</template>
        <template slot="role" slot-scope="row">{{row.item.role && row.item.role.name}}</template>
        <template slot="login_time" slot-scope="row">{{row.item.login_time}}</template>
        <template slot="login_ip" slot-scope="row">{{row.item.login_ip}}</template>
      </b-table>
    </div>
    <b-row class="justify-content-center row-margin-tweak cardDiv">
      <b-pagination
        :size="template_size"
        :total-rows="total"
        :per-page="queryParam.size"
        limit="5"
        v-model="queryParam.page"
      ></b-pagination>
    </b-row>
    <!-- Unpublic Modal -->
    <b-modal
      title="Remove Logs"
      v-model="removeLogModal"
      ok-title="确定"
      cancel-title="取消"
      @cancel="removeLogModal=false"
      @ok="removeLogOk"
    >
      <div class="modal-msg">
        <p class="message">Are u sure to remove selected logs</p>
      </div>
    </b-modal>
  </div>
</template>

<script>
import Loading from "@/components/loading/Loading";
import _ from "lodash";
import DatePicker from "vue2-datepicker";
import loginLogService from "@/services/loginLogService";
import groupService from "@/services/groupService";
import utils from "@/utils/util";
import { mapState } from "vuex";

export default {
  name: "login-log",
  components: {
    Loading,
    DatePicker
  },
  created() {
    this.$nextTick(() => {
      this.getLoginLogs();
      if (this.userInfo.identity == 1) {
        this.getGroupList();
      }
    });
  },
  data() {
    return {
      columns: {
        sn: {
          label: "序号",
          sortable: false,
          class: "text-center field-sn"
        },
        user_id: {
          label: "用户名",
          sortable: false,
          class: "text-center field-user_id"
        },
        user_name: {
          label: "姓名",
          sortable: false,
          class: "text-center field-user_name"
        },
        group: {
          label: "集群",
          sortable: false,
          class: "text-center field-group"
        },
        company: {
          label: "单位",
          sortable: false,
          class: "text-center field-company"
        },
        role: {
          label: "登录角色",
          sortable: false,
          class: "text-center field-role"
        },
        login_time: {
          label: "登录时间",
          sortable: false,
          class: "text-center field-login_time"
        },
        login_ip: {
          label: "登录IP",
          sortable: false,
          class: "text-center field-login_ip"
        }
      },
      loginLogList: [],
      total: 1,
      // 查询参数
      queryParam: {
        page: 1,
        size: 5,
        range: "",
        group_id: null,
        company_id: null
      },
      queryDebounceParam: {
        search: ""
      },
      groups: [],
      allChecked: false,
      removeLogModal: false
    };
  },
  watch: {
    // 监控查询参数，如有变化 查询列表数据
    queryParam: {
      handler() {
        this.getLoginLogs();
      },
      deep: true
    },
    "queryParam.group_id": {
      handler() {
        this.queryParam.company_id = null;
      }
    },
    queryDebounceParam: {
      deep: true,
      handler: _.debounce(function() {
        this.getLoginLogs();
      }, 500)
    },
    allChecked: {
      handler(val) {
        if (val) {
          this.loginLogList.map(item => {
            item.checked = true;
            return item;
          });
        } else {
          this.loginLogList.map(item => {
            item.checked = false;
            return item;
          });
        }
      }
    }
  },
  computed: {
    ...mapState(["userInfo"]),
    companies() {
      let items = [
        {
          id: null,
          name: "单位筛选"
        }
      ];
      if (!this.queryParam.group_id) {
        return items;
      }
      let currentGroup = this.groups.filter(
        group => group.id == this.queryParam.group_id
      );
      if (currentGroup.length > 0) {
        items = [...items, ...currentGroup[0]["companies"]];
      }
      return items;
    },
    checkedItems() {
      return this.loginLogList.filter(item => item.checked === true);
    },
    checkedIds() {
      return this.checkedItems.map(item => item.id);
    }
  },
  methods: {
    getGroupList() {
      groupService
        .fetchAllGroupDetail()
        .then(data => {
          this.groups = data.results;
          this.groups.unshift({
            id: null,
            name: "集群筛选"
          });
        })
        .catch(() => {});
    },
    getLoginLogs() {
      this.allChecked = false;
      this.run();
      let param = {
        ...this.queryParam,
        ...this.queryDebounceParam
      };
      delete param.range;
      if (this.queryParam.range != "") {
        param["start_date"] = this.queryParam.range[0]
          ? this.$moment(this.queryParam.range[0]).format("YYYY-MM-DD")
          : "";
        param["end_date"] = this.queryParam.range[1]
          ? this.$moment(this.queryParam.range[1]).format("YYYY-MM-DD")
          : "";
      } else {
        param["start_date"] = "";
        param["end_date"] = "";
      }
      loginLogService
        .fetchLogs(param)
        .then(data => {
          data.results.forEach(item => {
            if (item.checked === undefined) {
              item.checked = false;
            }
          });
          this.total = data.paging.count;
          this.loginLogList = data.results;
          this.$emit("data-ready");
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },
    exportLogs() {
      let param = {
        ...this.queryParam,
        ...this.queryDebounceParam
      };
      delete param.range;
      if (this.queryParam.range != "") {
        param["start_date"] = this.queryParam.range[0]
          ? this.$moment(this.queryParam.range[0]).format("YYYY-MM-DD")
          : "";
        param["end_date"] = this.queryParam.range[1]
          ? this.$moment(this.queryParam.range[1]).format("YYYY-MM-DD")
          : "";
      } else {
        param["start_date"] = "";
        param["end_date"] = "";
      }
      param = utils.jsonToQueryString(param);
      let url = "/api/account/export/loginlogs" + param;
      window.open(url);
    },
    deleteLogs() {
      if (this.checkedItems.length > 0) {
        this.removeLogModal = true;
      } else {
        this.$toasted.error("请选择要清理的日志。");
      }
    },
    removeLogOk() {
      this.removeLogModal = false;
      loginLogService
        .removeLogs({ data: JSON.stringify(this.checkedIds) })
        .then(() => {
          this.getLoginLogs();
          this.$toasted.success("清理成功");
        });
    }
  }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.login-log {
  .mx-input {
    height: 31px;
  }
  .field-sn {
    text-align: left !important;
    padding-left: 20px;
    width: 6%;
  }
  .field-user_id {
    width: 15%;
  }
  .field-user_name {
    width: 15%;
  }
  .field-group {
    width: 15%;
  }
  .field-company {
    width: 15%;
  }
  .field-role {
    width: 15%;
  }
  .field-login_time {
    width: 9%;
  }
  .field-login_ip {
    width: 10%;
  }
}
</style>