<template>
  <label class="radio-wrapper" @click="focus = true">
    <span class="radio"
      :class="{
        'is-disabled': disabled,
        'is-checked': model === label,
        'is-focus': focus
      }"
    >
    <input
      class="radio-input"
      :value="label"
      type="radio"
      v-model="model"
      @focus="focus = true"
      @blur="focus = false"
      :name="name"
      :disabled="disabled">
      <span class="radio-inner"></span>
    </span>
    <span class="radio-label">
      <slot></slot>
      <template v-if="!$slots.default">{{label}}</template>
    </span>
  </label>
</template>
<script>
  import Emitter from '@/mixins/emitter'

  export default {
    name: 'ElRadio',

    mixins: [Emitter],

    componentName: 'ElRadio',

    props: {
      value: {},
      label: {},
      disabled: Boolean,
      name: String
    },

    data() {
      return {
        focus: false
      }
    },

    computed: {
      isGroup() {
        let parent = this.$parent
        while (parent) {
          if (parent.$options.componentName !== 'ElRadioGroup') {
            parent = parent.$parent
          } else {
            this._radioGroup = parent
            return true
          }
        }
        return false
      },

      model: {
        get() {
          return this.isGroup ? this._radioGroup.value : this.value
        },

        set(val) {
          if (this.isGroup) {
            this.dispatch('ElRadioGroup', 'input', [val])
          } else {
            this.$emit('input', val)
          }
        }
      }
    }
  }
</script>
<style>
.radio-wrapper {
    font-size: 12px;
    vertical-align: middle;
    margin-right: 8px;
    cursor: pointer;
}
.radio, .radio-inner,  .radio-wrapper{
    display: inline-block;
    position: relative;
}
.radio-group-vertical .radio-wrapper{
  display: block;
  line-height: 30px;
}
.radio {
    margin-right: 4px;
    white-space: nowrap;
    outline: 0;
    line-height: 1;
    vertical-align: middle;
    cursor: pointer;
}
.radio-inner {
    width: 14px;
    height: 14px;
    top: 0;
    left: 0;
    background-color: #fff;
    border: 1px solid #00c175;
    border-radius: 50%;
    transition: all .2s ease-in-out;
}
.radio-checked .radio-inner, .radio-checked:hover .radio-inner {
    border-color: #00c175;
}
.radio-inner:after {
    position: absolute;
    width: 8px;
    height: 8px;
    left: 2px;
    top: 2px;
    border-radius: 6px;
    display: table;
    border-top: 0;
    border-left: 0;
    content: ' ';
    background-color: #00c175;
    opacity: 0;
    transition: all .2s ease-in-out;
    -ms-transform: scale(0);
    transform: scale(0);
}
.radio-input:checked+.radio-inner:after{
	opacity: 1;
	transform: scale(1);
}
.radio-checked .radio-inner, .radio-checked:hover .radio-inner {
    border-color: #39f;
}
.radio-input {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    opacity: 0;
    cursor: pointer;
}
.radio-label {
  word-break: break-all;
}
</style>
