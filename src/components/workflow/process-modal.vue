<template>
  <b-modal
    v-model="visible"
    title="对应的程序模块"
    size="lg"
    @cancel="cancelHandler"
    @ok="okHandler"
    ok-title="确定"
    cancel-title="取消"
  >
    <b-row class="process-modal px-0" no-gutters>
      <b-col cols="3" class="bordering">
        <b-form-input type="text" class="search-input mb-1" size="sm" v-model="searchKey"/>
        <b-list-group class="module-list">
          <b-list-group-item
            v-for="(item, index) in searchData"
            :key="index"
            :active="activeProcessIndex==index"
            @click="selectFlowProcess(item, index)"
            class="module-list-item"
          >
            <span class="float-left">{{item.name}}</span>
            <span class="float-right">{{item.type | processType}}</span>
          </b-list-group-item>
        </b-list-group>
      </b-col>
      <b-col cols="9" class="bordering">
        <img
          v-if="activeProcess && activeProcess.image"
          :src="activeProcess.image"
          alt
          style="width: 100%;height: 100%;"
        >
        <div v-else class="not-anime">
          <p class="text">无图片</p>
        </div>
      </b-col>
    </b-row>
  </b-modal>
</template>
<script>
import { processType } from "@/filters/fun";
export default {
  components: {},
  props: {
    flowProcess: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  filters: { processType },
  data() {
    return {
      visible: false,
      searchKey: "",
      activeProcessIndex: 0,
      activeProcess: null
    };
  },
  created() {
    this.$parent.$on("openProcessModal", process => {
      let index = process
        ? this.flowProcess.map(p => p.id).indexOf(process.id)
        : 0;
      this.activeProcessIndex = index;
      this.activeProcess = process || this.flowProcess[0] || null;
      this.visible = true;
    });
  },
  computed: {
    searchData() {
      let that = this;
      return that.flowProcess.filter(function(flowItem) {
        return (
          String(flowItem.name)
            .toLowerCase()
            .indexOf(String(that.searchKey).toLowerCase()) !== -1
        );
      });
    }
  },
  methods: {
    // 选中某个程序模块
    selectFlowProcess(item, index) {
      this.activeProcessIndex = index;
      this.activeProcess = item;
    },
    okHandler() {
      if (this.activeProcess) {
        this.$emit("on-ok", this.activeProcess);
      } else {
        this.$toasted.error("请选择程序模块");
      }
    },
    cancelHandler() {
      this.$emit("on-cancel");
    }
  },
  watch: {}
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.process-modal {
  .bordering {
    border: 1px solid #d0d0d0;
    padding: 2px;
  }
  .search-input {
    border-radius: 0 !important;
  }
  .module-list {
    height: 440px;
    overflow: auto;
    .module-list-item {
      font-size: 14px;
      span.float-right {
        color: #5386d2;
      }
      border: none;
      border-top: 1px solid white;
      border-bottom: 1px solid white;
      cursor: pointer;
    }
    .module-list-item.active {
      color: #345fe0;
      background-color: rgba(73, 133, 255, 0.37);
      border: none;
      border-top: 1px solid white;
      border-bottom: 1px solid white;
    }
    .module-list-item:hover {
      color: #345fe0;
      background-color: rgba(73, 133, 255, 0.37);
    }
    .module-list-item:first-child {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
  }
  .not-anime {
    width: 100%;
    height: auto;
    padding-left: 0;
    padding-right: 0;
    margin-left: auto;
    margin-right: auto;
    border: 1px solid #e5e9ef;
    background: url("~@/assets/img/no_more.png") 50% 100% no-repeat;
    background-color: #fff;
    height: 100%;
    line-height: 458px;
    text-align: center;
    padding: 0;
  }
}
</style>
