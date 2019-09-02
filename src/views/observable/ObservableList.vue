<template>
  <div class="manager-container main-bg" style="height:100%">
    <loading v-if="isRunning"></loading>
    <div class="container" style="height:100%; padding: 40px 0 0 0;">
      <h4 style="float:left; color:#007bff; cursor: pointer;">
        <a class="btn-link" title="返回" @click="$router.go(-1)">
          <icon name="arrow-left"></icon>&nbsp;返回
        </a>
      </h4>
      <h1>业 务 观 摩</h1>
      <div class="cardDiv">
        <b-table :items="observable.list" responsive small hover :fields="columns" head-variant>
          <template slot="business_name" slot-scope="row">{{row.item.business.name}}</template>
          <template slot="node_name" slot-scope="row">{{row.item.node.name}}</template>
          <template slot="created_at" slot-scope="row">{{row.item.business.create_time}}</template>
          <template slot="actions" slot-scope="row">
            <div>
              <b-link
                :to="`/observable/progress/${row.item.node.process_type}/${row.item.business.id}/${row.item.node.id}`"
                style="color:#007bff"
              >
                <icon name="eye"></icon>
              </b-link>
            </div>
          </template>
        </b-table>
      </div>
      <b-row class="justify-content-center row-margin-tweak cardDiv">
        <b-pagination
          :size="template_size"
          :total-rows="observable.total"
          :per-page="queryParam.size"
          limit="5"
          v-model="queryParam.page"
        />
      </b-row>
    </div>
  </div>
</template>
<script>
import Loading from "@/components/loading/Loading";
import BusinessService from "@/services/businessService";

export default {
  name: "observable_list",
  components: {
    Loading
  },
  created() {
    this.$nextTick(() => {
      this.observable.initiated = false;
      this.queryObservableNodeList();
    });
  },
  data() {
    return {
      observable: {
        initiated: false,
        source: [],
        list: [],
        total: 0
      },
      columns: {
        business_name: {
          label: "业务名称",
          sortable: false,
          class: "text-center w-30"
        },
        node_name: {
          label: "环节名称",
          sortable: false,
          class: "text-center w-30"
        },
        created_at: {
          label: "业务开始时间",
          sortable: false,
          class: "text-center w-30"
        },
        actions: {
          label: "",
          sortable: false,
          class: "text-center w-10"
        }
      },
      queryParam: {
        page: 1,
        size: 10
      }
    };
  },

  watch: {
    queryParam: {
      handler() {
        this.queryObservableNodeList();
      },
      deep: true
    }
  },
  computed: {},
  methods: {
    queryObservableNodeList() {
      if (this.observable.initiated) {
        this.observable.list = this.observable.source.slice(
          (this.queryParam.page - 1) * this.queryParam.size,
          this.queryParam.page * this.queryParam.size
        );
        return;
      }
      this.run();
      BusinessService.observableNodeList()
        .then(data => {
          this.observable.initiated = true;
          this.observable.source = data.nodes;
          this.observable.total = data.nodes.length;
          this.observable.list = data.nodes.slice(
            (this.queryParam.page - 1) * this.queryParam.size,
            this.queryParam.page * this.queryParam.size
          );
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
</style>

