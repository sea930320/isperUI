<template>
    <div class="workflow-xml-container">
        <div class="workflow-xml">
            <div class="top pt-2">
                <a class="icon-full" href="javascript:;" @click="xmlModalShow = true">全屏</a>
                <h4 class="aside-paint-title">{{flowName}}</h4>
                <p class="xml-view-tip">提示：如果不能看到完整的流程图，请用鼠标拖拽缩放试试</p>
            </div>
            <div class="workflow-body" id="smallContainer" ref="container"></div>
        </div>
        <!-- 查看流程图 -->
        <view-xml :visible="xmlModalShow" :xml="flowXml" @on-close="xmlModalShow = false"></view-xml>
    </div>
</template>
<script>
import ViewXml from "@/components/workflowXML/ViewXML";
import BpmnViewer from "bpmn-js/lib/NavigatedViewer";
export default {
    components: { ViewXml },
    props: {
        flowName: {
            type: String,
            default: ""
        },
        flowXml: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            viewer: null,
            xmlModalShow: false
        };
    },
    methods: {
        createXml(xml) {
            this.$refs.container.innerHTML = "";
            this.viewer = new BpmnViewer({
                container: "#smallContainer",
                width: "100%",
                height: "100%"
            });
            this.viewer.importXML(xml, err => {
                if (err) {
                    this.$toasted.error("加载流程图失败");
                }
                var canvas = this.viewer.get("canvas");
                canvas.zoom("fit-viewport");
                let dx =
                    (canvas.viewbox().outer.width -
                        canvas._viewport.getBoundingClientRect().width) /
                    2;
                let dy =
                    (canvas.viewbox().outer.height -
                        canvas._viewport.getBoundingClientRect().height) /
                    2;
                canvas.scroll({
                    dx,
                    dy
                });
            });
        }
    },
    mounted() {
        if (this.flowXml && this.flowXml !== "") {
            this.createXml(this.flowXml);
        }
    },
    watch: {
        flowXml(val) {
            if (val && val !== "") this.createXml(val);
        }
    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.workflow-xml-container {
    height: 100%;
    border: 1px solid #eaeaea;
    .xml-view-tip {
        padding: 0 10px;
        color: #253568;
        font-size: 12px;
    }
}
.workflow-xml {
    position: relative;
    height: 100%;
}
.workflow-xml .icon-full {
    position: absolute;
    top: 15px;
    right: 16px;
}
.workflow-xml .top {
    position: relative;
    top: 0;
    left: 0;
    z-index: 999;
    width: 100%;
}
.workflow-xml .workflow-body {
    height: calc(100% - 78px);
    box-sizing: border-box;
}
</style>
