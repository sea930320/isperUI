<template>
    <div>
        <loading v-if="isRunning"></loading>
        <b-modal v-model="visible" title="发送留言" size="lg" class>
            <b-container fluid class="checkContainer">
                <p class="title">请选择您要联系的人</p>
                <b-row>
                    <b-col cols="12" class="text-left float-left clear-bothmy-1">
                        <b-form-checkbox v-model="allCheck" @change="toggleAll($event)">&nbsp;全选</b-form-checkbox>
                    </b-col>
                    <template v-for="(item, index) in checkList">
                        <b-col cols="4" class="text-left float-left my-1" :key="index">
                            <b-form-checkbox
                                v-model="item.checked"
                                @change="toggleCheck($event, item)"
                            >&nbsp;{{item.role_name}} ( {{item.user_name}} )</b-form-checkbox>
                        </b-col>
                    </template>
                </b-row>
                <div class="sendBox">
                    <textarea v-model="msg"></textarea>
                </div>
            </b-container>
            <div slot="modal-footer" class="w-100">
                <b-button variant="primary" class="float-center mr-2" @click="send()">发送</b-button>
                <b-button variant="secondary" class="float-center" @click="cancel()">取消</b-button>
            </div>
        </b-modal>
    </div>
</template>
<script>
import Loading from "@/components/loading/Loading";
import businessService from "@/services/businessService";
import { mapState } from "vuex";
export default {
    name: "sendMsgModal",
    components: { Loading },
    data() {
        return {
            visible: false,
            checkList: [],
            msg: "",
            allCheck: false
        };
    },
    created() {
        this.$parent.$on("openSendMsgModal", () => {
            this.getSendMembers();
            this.visible = true;
        });
    },
    watch: {
        visible() {
            this.indeterminatedCheck = false;
            this.allCheck = false;
            this.msg = "";
            this.checkList.forEach(item => {
                item.checked = false;
            });
        }
    },
    computed: {
        ...mapState(["userInfo"]),
        checkedItems() {
            return this.checkList.filter(item => item.checked === true);
        },
        checkedIds() {
            return this.checkedItems.map(item => item.user_id);
        },
        businessId() {
            return this.$route.params.bid;
        }
    },
    methods: {
        toggleAll(val) {
            this.checkList.forEach(item => {
                this.$set(item, "checked", val);
            });
        },
        toggleCheck(val, item) {
            this.$set(item, "checked", val);
            this.allCheck = this.checkList.every(item => {
                return item.checked;
            });
        },
        getSendMembers() {
            this.run();
            let param = { business_id: this.businessId };
            businessService
                .getSendMembers(param)
                .then(data => {
                    data.forEach(item => {
                        item.checked = false;
                    });
                    this.checkList = data.filter(
                        item => item.user_id != this.userInfo.id
                    );
                    this.$emit("data-ready");
                })
                .catch(() => {
                    this.$emit("data-failed");
                });
        },
        cancel() {
            this.visible = false;
        },
        send() {
            if (this.msg === "" || this.checkedItems.length === 0) {
                this.$toasted.error("请选择要发送留言的人并填写留言信息");
                return;
            }
            let param = {};
            param.content = this.msg;
            param.to_user_ids = this.checkedIds.join(",");
            param.business_id = this.businessId;
            this.$emit("on-send", param);
            this.visible = false;
        }
    }
};
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
.checkContainer {
    .custom-control {
        font-size: 16px;
    }
    .sendBox {
        margin-top: 15px;
        width: 100%;
        height: 200px;
    }
    .sendBox textarea {
        display: inline-block;
        width: 100%;
        height: 100%;
        padding: 5px;
        font-size: 14px;
        line-height: 20px;
        border: 1px solid #ccc;
    }
}
</style>
