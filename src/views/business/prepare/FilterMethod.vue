<template>
    <div class="filter-method container" v-if="userInfo">
        <loading v-if="isRunning"></loading>
        <div class="cardDiv filter-method-panel p-0">
            <div class="transparent-bg">
                <div class="filter-method d-flex justify-content-center">
                    <div class="cardDiv mx-3">
                        <div class="top-img">
                            <img src="@/assets/imgIsper/business/company1.png">
                        </div>
                        <b-button variant="outline-dark" to="/business/prepare/prepare1/company">单位</b-button>
                    </div>
                    <div class="cardDiv mx-3">
                        <div class="top-img">
                            <img src="@/assets/imgIsper/business/affair1.png">
                        </div>
                        <b-button variant="outline-dark" to="/business/prepare/prepare1/office">事务</b-button>
                    </div>
                    <div class="cardDiv mx-3">
                        <div class="top-img">
                            <img src="@/assets/imgIsper/business/search1.png">
                        </div>
                        <b-button variant="outline-dark" to="{name:'business-prepare-by-keyword'}">检索</b-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import Loading from "@/components/loading/Loading";
export default {
    name: "filter-method",
    components: {
        Loading
    },
    filters: {},
    data() {
        return {};
    },
    created() {
        this.$nextTick(() => {});
    },
    computed: {
        ...mapState(["userInfo"])
    },
    watch: {},
    methods: {}
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.filter-method {
    padding-bottom: 10px;
    .filter-method-panel {
        height: calc(100vh - 210px);
        background: url("~@/assets/imgIsper/business/background.jpg");
        .transparent-bg {
            height: 100%;
            background: #8a8fa096;
            .filter-method {
                position: absolute;
                top: 50%;
                left: 50%;
                -ms-transform: translateX(-50%) translateY(-50%);
                transform: translateX(-50%) translateY(-50%);
                .cardDiv {
                    width: 100px;
                    height: 100px;
                    padding-top: 50px;
                }
                .top-img {
                    position: absolute;
                    top: -20px;
                    background: white;
                    border-radius: 32px;
                    img {
                        background-color: rgba(0, 55, 255, 0.5);
                        border-radius: 32px;
                        border: 2px solid black;
                    }
                }
            }
        }
    }
}
</style>