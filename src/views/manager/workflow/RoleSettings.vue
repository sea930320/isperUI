<template>
  <div class="role-settings">
    <loading v-if="isRunning"></loading>
    <b-row class="cardDiv px-0">
      <b-col md="3" sm="12">
        <div class style="height: 460px; border: 1px solid #eaeaea; overflow: auto">
          <b-table
            :items="nodes"
            borderless
            small
            hover
            :fields="nodeColumns"
            head-variant
            @row-clicked="nodeOnSelect"
          >
            <template slot="sn" slot-scope="row">{{ row.index + 1 }}</template>
            <template slot="name" slot-scope="row">{{row.item.name}}</template>
            <template slot="process_name" slot-scope="row">
              <a
                href="javascript:;"
                class="case-text"
                @click="showCurImage(row.item.process.image)"
              >{{row.item.process.name}}</a>
            </template>
          </b-table>
        </div>
      </b-col>
      <b-col md="4" sm="12">
        <div class style="height: 460px; border: 1px solid #eaeaea; overflow: auto">
          <b-table :items="roles" borderless small hover :fields="roleColumns" head-variant>
            <template slot="sn" slot-scope="row">{{ row.index + 1 }}</template>
            <template slot="type" slot-scope="row">
              <span v-if="!row.item.edit">{{row.item.type}}</span>
              <b-form-input v-else size="sm" v-model="row.item.type" />
            </template>
            <template slot="name" slot-scope="row">
              <span v-if="!row.item.edit">{{row.item.name}}</span>
              <b-form-input
                v-else
                size="sm"
                :value="row.item.name"
                @input="changeRoleName($event, row.item)"
              />
            </template>
            <template slot="capacity" slot-scope="row">
              <span>{{row.item.capacity}}</span>
            </template>
            <template slot="job_type" slot-scope="row">
              <span v-if="!row.item.edit">{{row.item.job_type && row.item.job_type.name || '无职务'}}</span>
              <b-form-select
                v-else
                size="sm"
                v-model="row.item.job_type.id"
                :options="jobTypes"
                value-field="id"
                text-field="name"
                @change.native="changeRoleJobType($event, row.item)"
              ></b-form-select>
            </template>
            <template slot="action" slot-scope="row">
              <b-button v-if="!row.item.edit" size="sm" variant="link" @click="editRole(row.item)">
                <icon name="edit" />
              </b-button>
              <b-button v-else size="sm" variant="link" @click="saveRole(row.item)">
                <icon name="save" />
              </b-button>
              <b-button size="sm" variant="link" @click="removeRole(row.item)">
                <icon name="trash" />
              </b-button>
            </template>
          </b-table>
          <div
            class="d-flex justify-content-center py-1"
            style="border-top: 1px solid #eaeaea; border-bottom: 1px solid #eaeaea"
          >
            <div class="field-role-sn text-center">#</div>
            <div class="field-role-type text-center px-1">
              <b-form-input size="sm" :value="newRole.type" @input="newRole.type = $event.trim()" />
            </div>
            <div class="field-role-name text-center px-1">
              <b-form-input size="sm" :value="newRole.name" @input="newRole.name = $event.trim()" />
            </div>
            <div class="field-role-capacity text-center px-1">
              <b-form-input size="sm" type="number" min="1" v-model.lazy="newRole.capacity" />
            </div>
            <div class="field-role-job_type text-center px-1">
              <b-form-select
                size="sm"
                v-model="newRole.job_type.id"
                :options="jobTypes"
                value-field="id"
                text-field="name"
              ></b-form-select>
            </div>
            <div class="field-role-action text-center px-1">
              <b-button size="sm" variant="link" @click="addNewRole">
                <icon name="plus" />
              </b-button>
            </div>
          </div>
        </div>
      </b-col>
      <b-col md="5" sm="12">
        <div class style="height: 460px; border: 1px solid #eaeaea; overflow: auto">
          <table class="table b-table table-hover table-borderless table-sm role-allocation">
            <thead role="rowgroup">
              <tr>
                <th class="text-center field-role-assign-sn">
                  <b-form-checkbox v-model="all_check">是否使用</b-form-checkbox>
                </th>
                <th class="text-center field-role-assign-role_name">身份</th>
                <th class="text-center field-role-assign-role_job_type">职务</th>
                <th
                  v-if="activeNode && activeNode.is_start_node"
                  class="text-center field-role-assign-startable"
                >可否启动业务</th>
                <th class="text-center field-role-assign-endable">结束环节权限</th>
                <th class="text-center field-role-assign-takeable">
                  <b-form-checkbox v-model="all_can_brought">是否被带入</b-form-checkbox>
                </th>
                <th class="text-center field-role-assign-action"></th>
              </tr>
            </thead>
            <tbody role="rowgroup">
              <template v-for="(roleGroupAllocation, key) in roleGroupAllocations">
                <tr
                  class="tr-node"
                  v-if="roleGroupAllocation.role_allocations.length > 0"
                  :key="key"
                >
                  <td :colspan="activeNode && activeNode.is_start_node?5:4" class="text-left">
                    <b-form-checkbox
                      v-model="roleGroupAllocation.all_check"
                      :indeterminate="roleGroupAllocation.indeterminated_check"
                      @change="take_inAll($event, roleGroupAllocation)"
                    >{{roleGroupAllocation.role_type}} &nbsp;&nbsp;(类型全选)</b-form-checkbox>
                  </td>
                  <td colspan="2">
                    <b-form-checkbox
                      v-model="roleGroupAllocation.all_can_brought"
                      :indeterminate="roleGroupAllocation.indeterminated_can_brought"
                      @change="can_broughtAll($event, roleGroupAllocation)"
                    >(类型全选)</b-form-checkbox>
                  </td>
                </tr>
                <template v-for="(roleAllocation, index) in roleGroupAllocation.role_allocations">
                  <tr
                    class="tr-allocation"
                    v-for="(allocation, index1) in roleAllocation.allocations"
                    :key="'allocation-index-' + key + '-' + index + '-' + index1"
                  >
                    <td>
                      <b-form-checkbox
                        v-model="allocation.can_take_in"
                        @change="take_in($event, roleGroupAllocation, allocation)"
                      ></b-form-checkbox>
                    </td>
                    <td>{{allocation.role.name}}</td>
                    <td>{{getJobName(allocation.role.job_type)}}</td>
                    <td v-if="activeNode && activeNode.is_start_node">
                      <b-form-checkbox
                        v-model="allocation.can_start"
                        @change="can_start($event, allocation)"
                      ></b-form-checkbox>
                    </td>
                    <td>
                      <b-form-checkbox
                        v-model="allocation.can_terminate"
                        @change="can_terminate($event, roleGroupAllocation, allocation)"
                      ></b-form-checkbox>
                    </td>
                    <td>
                      <b-form-checkbox
                        v-model="allocation.can_brought"
                        @change="can_brought($event, roleGroupAllocation, allocation)"
                      ></b-form-checkbox>
                    </td>
                    <td>
                      <b-button
                        size="sm"
                        variant="link"
                        @click="removeAllocation(roleGroupAllocation, roleAllocation, allocation)"
                      >
                        <icon name="trash" />
                      </b-button>
                    </td>
                  </tr>
                </template>
              </template>
            </tbody>
          </table>
        </div>
      </b-col>
      <b-col cols="12" class="mt-3">
        <b-button variant="primary" class="mr-1" @click="LastPage">上一步</b-button>
        <b-button variant="success" class="mr-1" @click="savePage">保存</b-button>
        <b-button
          variant="primary"
          v-show="flowStep && flowStep>2"
          class="ml-1"
          @click="nextPage"
        >下一步</b-button>
      </b-col>
    </b-row>
    <!-- 查看大图Modal -->
    <image-view
      :visible="processImageModal"
      :src="processImage"
      @on-close="processImageModal=false"
    ></image-view>
    <!-- Delete Role Modal -->
    <b-modal
      v-model="deleteRoleModal"
      title="删除身份"
      ok-title="确定"
      cancel-title="取消"
      @cancel="deleteRoleModal=false"
      @ok="confirmDelete"
    >
      <div class="modal-msg">
        <p class="message">确定要删除吗？</p>
      </div>

      <div slot="modal-footer" class="w-100">
        <b-button variant="danger" class="float-center mr-2" @click="confirmDelete()">确定</b-button>
        <b-button variant="secondary" class="float-center" @click="deleteRoleModal=false">取消</b-button>
      </div>
    </b-modal>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import ImageView from "@/components/imageView/ImageView";
import Loading from "@/components/loading/Loading";
import workflowService from "@/services/workflowService";
import _ from "lodash";

export default {
  name: "role-settings",
  components: { Loading, ImageView },
  data() {
    return {
      nodeColumns: {
        sn: {
          label: "序号",
          sortable: false,
          class: "text-center field-node-sn"
        },
        name: {
          label: "环节名称",
          sortable: false,
          class: "text-center field-node-name"
        },
        process_name: {
          label: "对应模块",
          sortable: false,
          class: "text-center field-node-process_name"
        }
      },
      roleColumns: {
        sn: {
          label: "序号",
          sortable: false,
          class: "text-center field-role-sn"
        },
        type: {
          label: "身份类型",
          sortable: false,
          class: "text-center field-role-type"
        },
        name: {
          label: "身份",
          sortable: false,
          class: "text-center field-role-name"
        },
        capacity: {
          label: "数量",
          sortable: false,
          class: "text-center field-role-capacity"
        },
        job_type: {
          label: "对应职务",
          sortable: false,
          class: "text-center field-role-job_type"
        },
        action: {
          label: "",
          sortable: false,
          class: "text-center field-role-action"
        }
      },
      workflow: {},
      nodes: [],
      roles: [],
      jobTypes: [],
      newRole: {
        type: "",
        name: "",
        capacity: 1,
        job_type: {
          id: null
        }
      },
      nodeActiveIndex: -1,
      deleteRoleModal: false,
      currentDeleteRole: {},
      processImageModal: false,
      processImage: "",
      roleGroupAllocations: [],
      nodeRoleGroupAllocations: [],
      all_check: false,
      all_can_brought: false
    };
  },
  computed: {
    ...mapState(["userInfo", "flowStep"]),
    flowId() {
      return this.$route.params.flow_id;
    },
    activeNode() {
      if (this.nodes.length === 0 || this.nodeActiveIndex == -1) return null;
      return this.nodes[this.nodeActiveIndex];
    }
  },
  created() {
    this.$nextTick(() => {
      this.init();
    });
  },
  watch: {
    "newRole.name": {
      handler: async function() {
        this.newRole.job_type = await this.getCandidateJobType(
          this.newRole.name
        );
      },
      deep: true
    },
    nodeActiveIndex() {
      this.roleAllocationList();
    },
    roleGroupAllocations: {
      handler: function() {
        this.nodeRoleGroupAllocations[
          this.nodeActiveIndex
        ] = this.roleGroupAllocations;
      },
      deep: true
    },
    all_check(value) {
      if (this.roleGroupAllocations.length == 0) return;
      this.roleGroupAllocations.forEach(rga => {
        rga.all_check = value;
        rga.indeterminated_check = false;
        this.take_inAll(value, rga);
      });
    },
    all_can_brought(value) {
      if (this.roleGroupAllocations.length == 0) return;
      this.roleGroupAllocations.forEach(rga => {
        rga.all_can_brought = value;
        rga.indeterminated_can_brought = false;
        this.can_broughtAll(value, rga);
      });
    }
  },
  methods: {
    ...mapActions(["setFlowStep"]),
    init() {
      this.run();
      let param = { flow_id: this.flowId };
      const apis = [
        workflowService.getWorkflowDetail(param),
        workflowService.getWorkflowRoleList(param)
      ];
      Promise.all(apis)
        .then(response => {
          this.workflow = response[0];
          this.nodes = response[0].nodes;
          this.setFlowStep(response[0].step);
          this.roles = response[1].roles;
          this.jobTypes = response[1].job_types;
          this.jobTypes.unshift({
            id: null,
            name: "无职务",
            content: ""
          });
          this.$emit("data-ready");

          if (this.nodes.length > 0) {
            this.nodeOnSelect(this.nodes[0], 0);
          }
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },
    getCandidateJobType(name) {
      return workflowService
        .getCandidateJobType({ name })
        .then(response => {
          return response.job_type ? response.job_type : { id: null };
        })
        .catch(() => {});
    },
    addNewRole() {
      if (!this.newRole.type || !this.newRole.name) {
        this.$toasted.error("请完善输入信息");
        return;
      }
      this.run();
      let newRole = { ...this.newRole };
      newRole.flow_id = this.flowId;
      newRole.job_type_id = newRole.job_type ? newRole.job_type.id : null;
      workflowService
        .createWorkflowRole(newRole)
        .then(data => {
          let params = {
            flow_id: this.flowId,
            node_ids: JSON.stringify(_.map(this.nodes, "id")),
            role_id: data.id
          };
          workflowService
            .roleAllocationCreate(params)
            .then(() => {
              this.setFlowStep(data.step);
              newRole.id = data.id;
              newRole = {
                ...newRole,
                ...data
              };
              this.roles.unshift(newRole);
              this.newRole = {
                name: "",
                capacity: 1,
                job_type: { id: null }
              };
              this.roleAllocationList();
              this.$toasted.success("保存角色成功");
              this.$emit("data-ready");
            })
            .catch(() => {
              this.$emit("data-failed");
            });
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },
    async changeRoleName(value, role) {
      this.$set(role, "name", value.trim());
      let jobType = await this.getCandidateJobType(value.trim());
      this.$set(role, "job_type", jobType);
    },
    changeRoleJobType($event, role) {
      let val = $event.target.value;
      let jobType = this.jobTypes.find(jobType => {
        return jobType.id == val;
      });
      this.$set(role, "job_type", jobType);
    },
    editRole(role) {
      this.$set(role, "edit", true);
    },
    saveRole(role) {
      this.$set(role, "edit", false);
      role.job_type_id = role.job_type ? role.job_type.id : null;
      this.run();
      workflowService
        .updateWorkflowRole(role)
        .then(() => {
          this.$toasted.success("更新角色成功");
          this.$emit("data-ready");
          this.roleAllocationList();
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },
    removeRole(role) {
      this.deleteRoleModal = true;
      this.currentDeleteRole = role;
    },
    confirmDelete() {
      this.deleteRoleModal = false;
      let role = this.currentDeleteRole;
      this.run();
      let params = {
        flow_id: this.flowId,
        ids: JSON.stringify([role.id])
      };
      workflowService
        .deleteWorkflowRoles(params)
        .then(data => {
          this.roles.splice(this.roles.indexOf(role), 1);
          this.setFlowStep(data.step);
          this.$emit("data-ready");
          this.roleAllocationList();
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },
    // 查看对应模块大图
    showCurImage(image) {
      if (!image) {
        this.$toasted.error("当前程序模块没有图片,无法展示");
        return;
      }
      this.processImageModal = true;
      this.processImage = image;
    },
    // Click Node
    nodeOnSelect(item, index) {
      this.nodeActiveIndex = index;
      this.nodes.map(node => {
        this.$set(node, "_rowVariant", "");
        return node;
      });
      this.$set(item, "_rowVariant", "primary");
    },
    // get Allocations per selected Node
    roleAllocationList() {
      if (!this.activeNode) return;
      this.run();
      let params = {
        flow_id: this.flowId,
        node_id: this.activeNode.id
      };
      workflowService
        .roleAllocationList(params)
        .then(data => {
          this.roleGroupAllocations = _.map(
            data.role_group_allocations,
            roleGroupAllocation => {
              let oldRoleGroupAllocation = _.find(
                this.nodeRoleGroupAllocations[this.nodeActiveIndex],
                {
                  role_type: roleGroupAllocation.role_type
                }
              );
              if (!oldRoleGroupAllocation) {
                return roleGroupAllocation;
              }
              roleGroupAllocation.role_allocations = _.map(
                roleGroupAllocation.role_allocations,
                roleAllocation => {
                  let oldRoleAllocation = _.find(
                    oldRoleGroupAllocation.role_allocations,
                    {
                      role_id: roleAllocation.role_id
                    }
                  );
                  if (!oldRoleAllocation) {
                    return roleAllocation;
                  }
                  roleAllocation.allocations = _.map(
                    roleAllocation.allocations,
                    allocation => {
                      let oldAllocation = _.find(
                        oldRoleAllocation.allocations,
                        {
                          id: allocation.id
                        }
                      );
                      if (!oldAllocation) {
                        return allocation;
                      }
                      return {
                        ...allocation,
                        ..._.pick(oldAllocation, [
                          "can_take_in",
                          "can_brought",
                          "can_terminate",
                          "can_start"
                        ])
                      };
                    }
                  );
                  return roleAllocation;
                }
              );
              return {
                ...roleGroupAllocation,
                ..._.pick(oldRoleGroupAllocation, [
                  "all_check",
                  "indeterminated_check",
                  "all_can_brought",
                  "indeterminated_can_brought"
                ])
              };
            }
          );
          this.$emit("data-ready");
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },
    getJobName(id) {
      if (this.jobTypes.length == 0) return "";
      let jobType = _.find(this.jobTypes, { id });
      return jobType ? jobType.name : "";
    },
    take_inAll(value, roleGroupAllocation) {
      this.$set(roleGroupAllocation, "indeterminated_check", false);
      roleGroupAllocation.role_allocations.forEach(roleAllocation => {
        roleAllocation.allocations.forEach(allocation => {
          if (!value) {
            this.$set(allocation, "can_start", false);
          }
          this.$set(allocation, "can_take_in", value);
        });
      });
    },
    take_in(value, roleGroupAllocation, allocation) {
      this.$set(allocation, "can_take_in", value);
      if (!value) {
        this.$set(allocation, "can_start", false);
      }
      let isAllSelected = roleGroupAllocation.role_allocations.every(
        roleAllocation => {
          return roleAllocation.allocations.every(allocation => {
            return allocation.can_take_in;
          });
        }
      );
      let isAllNotSelected = roleGroupAllocation.role_allocations.every(
        roleAllocation => {
          return roleAllocation.allocations.every(allocation => {
            return !allocation.can_take_in;
          });
        }
      );
      if (isAllSelected) {
        this.$set(roleGroupAllocation, "indeterminated_check", false);
        this.$set(roleGroupAllocation, "all_check", true);
      } else if (isAllNotSelected) {
        this.$set(roleGroupAllocation, "indeterminated_check", false);
        this.$set(roleGroupAllocation, "all_check", false);
      } else {
        this.$set(roleGroupAllocation, "indeterminated_check", true);
        this.$set(roleGroupAllocation, "all_check", false);
      }
    },
    can_broughtAll(value, roleGroupAllocation) {
      this.$set(roleGroupAllocation, "indeterminated_can_brought", false);
      roleGroupAllocation.role_allocations.forEach(roleAllocation => {
        roleAllocation.allocations.forEach(allocation => {
          this.$set(allocation, "can_brought", value);
        });
      });
    },
    can_brought(value, roleGroupAllocation, allocation) {
      this.$set(allocation, "can_brought", value);
      let isAllSelected = roleGroupAllocation.role_allocations.every(
        roleAllocation => {
          return roleAllocation.allocations.every(allocation => {
            return allocation.can_brought;
          });
        }
      );
      let isAllNotSelected = roleGroupAllocation.role_allocations.every(
        roleAllocation => {
          return roleAllocation.allocations.every(allocation => {
            return !allocation.can_brought;
          });
        }
      );
      if (isAllSelected) {
        this.$set(roleGroupAllocation, "indeterminated_can_brought", false);
        this.$set(roleGroupAllocation, "all_can_brought", true);
      } else if (isAllNotSelected) {
        this.$set(roleGroupAllocation, "indeterminated_can_brought", false);
        this.$set(roleGroupAllocation, "all_can_brought", false);
      } else {
        this.$set(roleGroupAllocation, "indeterminated_can_brought", true);
        this.$set(roleGroupAllocation, "all_can_brought", false);
      }
    },
    can_terminate(value, roleGroupAllocation, allocation) {
      if (value) {
        roleGroupAllocation.role_allocations.forEach(roleAllocation => {
          roleAllocation.allocations.forEach(item => {
            this.$set(item, "can_terminate", false);
          });
        });
      }
      this.$set(allocation, "can_terminate", value);
    },
    can_start(value, allocation) {
      if (value) {
        if (!allocation.can_take_in) {
          this.$toasted.error("参与第一环节的人才能启动业务！");
          setTimeout(() => {
            this.$set(allocation, "can_start", false);
          }, 500);
          return;
        }
        this.roleGroupAllocations.forEach(roleGroupAllocation => {
          roleGroupAllocation.role_allocations.forEach(roleAllocation => {
            roleAllocation.allocations.forEach(item => {
              this.$set(item, "can_start", false);
            });
          });
        });
      }
      this.$set(allocation, "can_start", value);
    },
    removeAllocation(roleGroupAllocation, roleAllocation, allocation) {
      for (let key in this.nodeRoleGroupAllocations) {
        let nodeRoleGroupAllocation = _.find(
          this.nodeRoleGroupAllocations[key],
          {
            role_type: roleGroupAllocation.role_type
          }
        );
        if (!nodeRoleGroupAllocation) continue;
        let nodeRoleAllocation = _.find(
          nodeRoleGroupAllocation.role_allocations,
          {
            role_id: roleAllocation.role_id
          }
        );
        if (!nodeRoleAllocation) {
          continue;
        }
        let nodeAllocation = _.find(nodeRoleAllocation.allocations, {
          no: allocation.no
        });
        if (nodeAllocation && nodeAllocation.can_take_in) {
          this.$toasted.error("该身份已经在使用！");
          return false;
        }
      }
      let params = {
        id: allocation.id,
        role_id: roleAllocation.role_id
      };
      this.run();
      workflowService
        .roleAllocationRemove(params)
        .then(() => {
          workflowService
            .getWorkflowRoleList({ flow_id: this.flowId })
            .then(response => {
              this.roles = response.roles;
              this.jobTypes = response.job_types;
              this.roleAllocationList();
            })
            .catch(() => {
              this.$emit("data-failed");
            });
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },
    LastPage() {
      this.$router.push({ name: "setworkflow-doc" });
    },
    // 点击保存
    savePage() {
      let allocations = [];
      let hasStartRole = false;
      for (let nodeIndex in this.nodeRoleGroupAllocations) {
        // let isStartNode = false;
        // if (this.nodes[nodeIndex].is_start_node) {
        //     isStartNode = true;
        // }
        for (let typeIndex in this.nodeRoleGroupAllocations[nodeIndex]) {
          for (let roleIndex in this.nodeRoleGroupAllocations[nodeIndex][
            typeIndex
          ].role_allocations) {
            if (
              !this.nodeRoleGroupAllocations[nodeIndex][typeIndex]
                .role_allocations[roleIndex].allocations
            )
              continue;
            for (let index in this.nodeRoleGroupAllocations[nodeIndex][
              typeIndex
            ].role_allocations[roleIndex].allocations) {
              let allocation = _.pick(
                this.nodeRoleGroupAllocations[nodeIndex][typeIndex]
                  .role_allocations[roleIndex].allocations[index],
                [
                  "id",
                  "can_take_in",
                  "can_terminate",
                  "can_brought",
                  "can_start"
                ]
              );
              if (allocation.can_start != 0) {
                hasStartRole = true;
              }
              allocations.push(allocation);
            }
          }
        }
      }
      if (!hasStartRole) {
        this.$toasted.error("There is no start role");
        return;
      }
      let params = {
        flow_id: this.flowId,
        allocations: JSON.stringify(allocations)
      };
      this.run();
      workflowService
        .roleAllocationBulkUpdate(params)
        .then(response => {
          this.$emit("data-ready");
          this.$toasted.success("保存成功");
          if (response.step) {
            this.setFlowStep(response.step);
          }
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },
    nextPage() {
      this.$router.push({
        name: "setworkflow-module",
        params: {
          flow_id: this.flowId
        }
      });
    }
  }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.role-settings {
  .field-node-sn {
    vertical-align: middle;
    width: 15%;
  }
  .field-node-name {
    vertical-align: middle;
    width: 45%;
  }
  .field-node-process_name {
    vertical-align: middle;
    width: 40%;
  }
  .field-role-sn {
    vertical-align: middle;
    width: 10%;
  }
  .field-role-type {
    vertical-align: middle;
    width: 20%;
  }
  .field-role-name {
    vertical-align: middle;
    width: 20%;
  }
  .field-role-capacity {
    vertical-align: middle;
    width: 10%;
  }
  .field-role-job_type {
    vertical-align: middle;
    width: 20%;
  }
  .field-role-action {
    vertical-align: middle;
    width: 20%;
  }
  .field-role-assign-sn {
    vertical-align: middle;
    width: 15%;
  }
  .field-role-assign-role_name {
    vertical-align: middle;
    width: 12%;
  }
  .field-role-assign-role_job_type {
    vertical-align: middle;
    width: 13%;
  }
  .field-role-assign-startable {
    vertical-align: middle;
    width: 20%;
  }
  .field-role-assign-endable {
    vertical-align: middle;
    width: 20%;
  }
  .field-role-assign-takeable {
    vertical-align: middle;
    width: 15%;
  }
  .field-role-assign-action {
    vertical-align: middle;
    width: 5%;
  }
  .role-allocation {
    .tr-node {
      background: #25356838;
    }
    td {
      vertical-align: middle;
    }
  }
}
</style>