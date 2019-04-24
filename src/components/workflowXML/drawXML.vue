<template>
  <div class="canavs-container">
    <div class="content" id="js-drop-zone">
      <div class="screen intro">
        <div class="note">
          <div class="project-logo">
            <a href="http://bpmn.io">
              <span class="bpmn-icon-bpmn-io"></span>
            </a>
          </div>
        </div>
      </div>
      <div class="screen loading">
        <div class="note">
          <div class="project-logo">
            <span class="app-icon-bpmn-io"></span>
          </div>
        </div>
      </div>
      <div class="screen error">
        <div class="note">
          <div class="details">
            <span>Import Error Details</span>
            <textarea class="error-log"></textarea>
          </div>
        </div>
      </div>
      <div class="canvas" id="js-canvas"></div>
    </div>
    <div class="io-alerts">
      <div class="io-control alert" jswidget="import-warnings-alert">
        <a href class="close" aria-hidden="true" jsaction="click:bio.clearImportDetails">&times;</a>
        Diagram may not render correctly due to import warnings.
        <a
          href
          jsaction="click:bio.showImportDetails"
        >Show details</a>.
      </div>
      <div class="io-control alert" jswidget="undo-redo-alert">
        You edited the diagram.
        <a href jsaction="click:bio.undo">Undo last change</a>.
        <a href class="close" aria-hidden="true" jsaction="click:bio.hideUndoAlert">&times;</a>
      </div>
    </div>
    <div class="io-editing-tools" jswidget="editing-tools">
      <ul class="io-control-list io-horizontal">
        <li class="io-control">
          <button title="Toggle keyboard shortcuts overlay" @click="backPage()">返回</button>
        </li>
        <li class="io-control">
          <button title="Toggle keyboard shortcuts overlay" @click="saveHandle">
            <!-- <span class="icon-keyboard"> </span> -->
            保存
          </button>
        </li>
        <li class="io-control">
          <button title="Toggle keyboard shortcuts overlay" @click="keyboardShow = true">
            <span class="icon-keyboard">键盘</span>
          </button>
        </li>
      </ul>
    </div>
    <div class="io-zoom-controls">
      <ul class="io-zoom-reset io-control io-control-list">
        <li>
          <button title="reset zoom" @click="zoomReset">
            <span class="app-icon-size-reset"></span>
          </button>
        </li>
      </ul>
      <ul class="io-zoom io-control io-control-list">
        <li>
          <button title="zoom in" @click="zoomIn">
            <span class="app-icon-plus"></span>
          </button>
        </li>
        <li>
          <hr>
        </li>
        <li>
          <button href title="zoom out" @click="zoomOut">
            <span class="app-icon-minus"></span>
          </button>
        </li>
      </ul>
    </div>

    <div class="io-dialog import-warnings" jswidget="import-warnings-dialog">
      <div class="content">
        <h1>Import Warnings</h1>
        <p>One or more problems have been identified when trying to import the BPMN 2.0 diagram:</p>
        <p>
          <textarea class="error-log"></textarea>
        </p>
        <p></p>
        <p>
          This may have been caused by malformed input data.
          As a result the diagram may not render correctly.
        </p>
        <h2>Need help on this?</h2>
        <p>
          File a report in
          <a href="https://forum.bpmn.io" target="_blank">our forum</a>.
          Attach your diagram and the above error log.
        </p>
        <a class="project-logo" href="http://bpmn.io">
          <span class="app-icon-bpmn-io"></span>
        </a>
      </div>
    </div>

    <div
      class="io-dialog keybindings-dialog"
      :class="{'open': keyboardShow}"
      jswidget="keybindings-dialog"
    >
      <div class="content bindings-mac">
        <span class="iconfont icon-close" @click="handleCloseKeyboard"></span>
        <h1>快捷键</h1>
        <table>
          <tbody>
            <tr>
              <td>撤销</td>
              <td class="binding">⌘ + Z</td>
            </tr>
            <tr>
              <td>重做</td>
              <td class="binding">⌘ + ⇧ + Z</td>
            </tr>
            <tr>
              <td>全选</td>
              <td class="binding">⌘ + A</td>
            </tr>
            <tr>
              <td>垂直移动</td>
              <td class="binding">⌥ + Scrolling</td>
            </tr>
            <tr>
              <td>水平移动</td>
              <td class="binding">⌥ + ⇧ + Scrolling</td>
            </tr>
            <tr>
              <td>直接编辑</td>
              <td class="binding">E</td>
            </tr>
            <tr>
              <td>抓手工具</td>
              <td class="binding">H</td>
            </tr>
            <tr>
              <td>选区工具</td>
              <td class="binding">L</td>
            </tr>
            <tr>
              <td>标尺工具</td>
              <td class="binding">S</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="content bindings-default">
        <span class="iconfont icon-close" @click="handleCloseKeyboard"></span>
        <h1>快捷键</h1>
        <table>
          <tbody>
            <tr>
              <td>撤销</td>
              <td class="binding">ctrl + Z</td>
            </tr>
            <tr>
              <td>重做</td>
              <td class="binding">ctrl + ⇧ + Z</td>
            </tr>
            <tr>
              <td>全选</td>
              <td class="binding">ctrl + A</td>
            </tr>
            <tr>
              <td>垂直移动</td>
              <td class="binding">ctrl + Scrolling</td>
            </tr>
            <tr>
              <td>水平移动</td>
              <td class="binding">ctrl + ⇧ + Scrolling</td>
            </tr>
            <tr>
              <td>直接编辑</td>
              <td class="binding">E</td>
            </tr>
            <tr>
              <td>抓手工具</td>
              <td class="binding">H</td>
            </tr>
            <tr>
              <td>选区工具</td>
              <td class="binding">L</td>
            </tr>
            <tr>
              <td>标尺工具</td>
              <td class="binding">S</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import BpmnModeler from "bpmn-js/lib/Modeler";
// import bpmnJsColor from 'bpmn-js-in-color'
import { mapGetters, mapActions } from "vuex";
import workflowService from "src/services/workflowService";
const defaultXML = `<?xml version="1.0" encoding="UTF-8"?>
          <bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
          <bpmn:process id="Process_1" isExecutable="false" />
          <bpmndi:BPMNDiagram id="BPMNDiagram_1">
          <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1" />
          </bpmndi:BPMNDiagram>
          </bpmn:definitions>`;
export default {
  data() {
    return {
      keyboardShow: false,
      bpmnModeler: null
    };
  },
  computed: {
    flowId() {
      return this.$route.params.flow_id;
    }
  },
  methods: {
    handleCloseKeyboard() {
      this.keyboardShow = false;
    },
    initBpmnViewer(xml) {
      // let customTranslate = ['value', require('assets/bpmn/customTranslate/customTranslate')]
      // this.bpmnModeler = new BpmnModeler({
      //   container: '#js-canvas',
      //   additionalModules: [
      //     customTranslate,
      //     bpmnJsColor
      //   ],
      //   keyboard: { bindTo: document }
      // })
      this.bpmnModeler = new BpmnModeler({
        container: "#js-canvas",
        keyboard: { bindTo: document }
      });
      this.bpmnModeler.importXML(xml, function(err) {
        if (err) {
          return console.error("could not import BPMN 2.0 diagram", err);
        }
      });

      var canvas = this.bpmnModeler.get("canvas");
      canvas.zoom("fit-viewport");
      // let eventBus = this.bpmnModeler.get('eventBus')
      // eventBus.on('element.dblclick', function(e) {
      //   console.log('element.click', 'on', e.element.id)
      // })
    },
    updateBpmnViewer(xml) {
      this.bpmnModeler.importXML(xml, function(err) {
        if (err) {
          return console.error("could not import BPMN 2.0 diagram", err);
        }
      });
    },
    // 保存编辑的流程
    saveHandle() {
      let _this = this;

      _this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
        if (err) {
          _this.$toast.error("对不起保存失败");
        } else {
          workflowService
            .drawWorkflow({
              flow_id: _this.flowId,
              xml: xml
            })
            .then(data => {
              _this.$toast.success("保存流程图成功");
            });
        }
      });
    },
    // 返回上一步
    backPage() {
      this.$router.go(-1);
    },
    zoomReset() {
      this.bpmnModeler.get("zoomScroll").reset();
    },
    zoomIn() {
      this.bpmnModeler.get("zoomScroll").stepZoom(1);
    },
    zoomOut() {
      this.bpmnModeler.get("zoomScroll").stepZoom(-1);
    }
  },
  mounted() {
    workflowService.getWorkflowDetail({ flow_id: this.flowId }).then(data => {
      this.initBpmnViewer(data.xml ? data.xml : defaultXML);
    });
  }
};
</script>
<style>
@import "./bpmn/css/diagram-js.css";
@import "./bpmn/css/bpmn-embedded.css";
@import "./bpmn/css/app.css";
.canavs-container {
  width: 100%;
  height: 100%;
}
</style>
