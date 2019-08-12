<template>
  <div class="module-settings">
    <loading v-if="isRunning"></loading>
    <b-tabs class="menu-select" v-if="is_loaded">
      <b-tab title="动画" v-if="has_animation_node">
        <b-tabs class="animation-setting">
          <b-tab title="动作设置">
            <action-settings></action-settings>
          </b-tab>
          <b-tab title="动画设置">
            <animation-settings></animation-settings>
          </b-tab>
          <b-tab title="角色设置">
            <position-settings></position-settings>
          </b-tab>
        </b-tabs>
      </b-tab>
      <b-tab title="判断与选择">
        <select-decide-settings></select-decide-settings>
      </b-tab>
    </b-tabs>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import ActionSettings from "@/views/manager/workflow/ActionSettings";
import AnimationSettings from "@/views/manager/workflow/AnimationSettings";
import PositionSettings from "@/views/manager/workflow/PositionSettings";
import SelectDecideSettings from "@/views/manager/workflow/SelectDecideSettings";
import workflowService from "@/services/workflowService";
import Loading from "@/components/loading/Loading";
import _ from "lodash";

export default {
  name: "module-settings",
  components: {
    ActionSettings,
    AnimationSettings,
    PositionSettings,
    SelectDecideSettings,
    Loading
  },
  data() {
    return {
      nodes: [],
      has_animation_node: false,
      is_loaded: false
    };
  },
  computed: {
    ...mapState(["userInfo", "flowStep"]),
    flowId() {
      return this.$route.params.flow_id;
    }
  },
  created() {
    this.$nextTick(() => {
      this.init();
    });
  },
  watch: {},
  methods: {
    ...mapActions(["setFlowStep"]),
    init() {
      this.run();
      let param = { flow_id: this.flowId };
      workflowService
        .getWorkflowDetail(param)
        .then(response => {
          this.nodes = response.nodes;
          this.has_animation_node = _.some(this.nodes, node => {
            return node.process && node.process.type == 1;
          });
          this.is_loaded = true;
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
.module-settings {
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

  .menu-select {
    ul.nav-tabs {
      justify-content: left;
      border-bottom: 0px !important;
      padding-top: 10px;
      .nav-link.active,
      .nav-item.show .nav-link {
        color: #007bff;
        background: #a4b4e6;
      }
    }
    .animation-setting {
      ul.nav-tabs {
        justify-content: center;
        .nav-link.active,
        .nav-item.show .nav-link {
          color: #007bff;
          background-color: transparent;
        }
      }
    }
  }
}
</style>
