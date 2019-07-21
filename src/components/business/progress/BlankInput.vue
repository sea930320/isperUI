<template>
  <div class="blank-input mr-1">
    <b-input-group>
      <template v-for="(input, index) in inputs">
        <b-form-input
          maxlength="1"
          @input="focusInput(index)"
          :ref="'blank-input' + index"
          :key="index"
          v-model="inputs[index]"
          class="ml-1"
          style="width: 45px !important;"
        ></b-form-input>
      </template>
    </b-input-group>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  name: "blank-input",
  props: {
    inputLength: {
      type: Number,
      default: 1
    }
  },
  components: {},
  data() {
    return {
      inputs: []
    };
  },
  mounted() {
    this.inputs = Array(this.inputLength).fill("");
  },
  computed: {},
  methods: {
    focusInput(curIndex) {
      let index = curIndex + 1;
      if (this.inputs[curIndex].length == 0) {
        index = curIndex - 1;
      }
      let refs = this.$refs["blank-input" + index];
      if (refs && refs.length > 0) {
        let ref = refs[0];
        ref.$el.focus();
      }
    }
  },
  watch: {
    inputs: {
      handler: function(inputs) {
        let newVal = _.map(inputs, (input, index) => {
          if (input.length > 1) {
            input = input.substr(-1);
            this.inputs[index] = input;
          }
          return input || " ";
        });
        let mergedVal = newVal.join("");
        this.$emit("blank-input-change", mergedVal);
      },
      deep: true
    }
  }
};
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
.blank-input {
}
</style>
