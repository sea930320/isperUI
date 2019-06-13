<template>
    <b-modal v-model="visible" title="实验成果" :hide-footer="true" size="lg">
        <div class="collapse-wrapper my-notes-wrapper">
            <p class="tip">每个环节对应的实验成果如下</p>
            <div class></div>
        </div>
    </b-modal>
</template>
<script type="text/ecmascript-6">
// import modal from 'components/modal/modal'
// import chataudio from 'components/chataudio/chataudio'
// import collapse from 'components/collapse/collapse'
// import collapseItem from 'components/collapse/collapse-item'
// import pagination from 'components/pagination/pagination'
import businessService from "@/services/businessService";
export default {
    data() {
        return {
            visible: false,
            results: []
        };
    },
    // components: { modal, collapse, collapseItem, pagination, chataudio },
    created() {
        this.$parent.$on("openResultsModal", () => {
            this.visible = true;
        });
    },
    methods: {
        init() {
            if (!this.$route.params.bid) return;
            businessService
                .getBusinessResults({ business_id: this.$route.params.bid })
                .then(data => {
                    this.results = data.results;
                });
        }
    },
    watch: {
        visible(val) {
            if (val) {
                this.init();
            }
        }
    }
};
</script>
<style>
.note-textarea {
    width: 100%;
    height: 200px;
    border: none;
    font-size: 14px;
    line-height: 1.8;
}
.note-text {
    line-height: 24px;
    color: #666;
    font-size: 12px;
}
.results-fix-height {
    max-height: 600px;
    overflow-y: scroll;
}
.results-content .msg {
    word-break: break-all;
}
</style>
