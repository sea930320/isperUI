<template>
  <label class="checkbox">
    <span class="checkbox-input"
      :class="{
        'is-disabled': disabled,
        'is-checked': isChecked,
        'is-indeterminate': indeterminate,
        'is-focus': focus
      }"
    >
    <input
      v-if="trueLabel || falseLabel"
      class="checkbox-original"
      type="checkbox"
      :name="name"
      :disabled="disabled"
      :true-value="trueLabel"
      :false-value="falseLabel"
      v-model="model"
      @click="clickHandler"
      @focus="focus = true"
      @blur="focus = false">
    <input
      v-else
      class="checkbox-original"
      type="checkbox"
      :disabled="disabled"
      :value="value"
      :name="name"
      v-model="model"
      @click="clickHandler"
      @focus="focus = true"
      @blur="focus = false">
      <span class="checkbox-inner"></span>
    </span>
    <span class="checkbox-label" v-if="$slots.default || label">
      <slot></slot>
      <template v-if="!$slots.default">{{label}}</template>
    </span>
  </label>
</template>
<script>
  import Emitter from '@/mixins/emitter'

  export default {
    name: 'ElCheckbox',

    mixins: [Emitter],

    componentName: 'ElCheckbox',

    data() {
      return {
        selfModel: false,
        focus: false
      }
    },

    computed: {
      model: {
        get() {
          return this.isGroup
            ? this.store : this.value !== undefined
            ? this.value : this.selfModel
        },

        set(val) {
          if (this.isGroup) {
            this.dispatch('ElCheckboxGroup', 'input', [val])
          } else if (this.value !== undefined) {
            this.$emit('input', val)
          } else {
            this.selfModel = val
          }
        }
      },

      isChecked() {
        if ({}.toString.call(this.model) === '[object Boolean]') {
          return this.model
        } else if (Array.isArray(this.model)) {
          return this.model.indexOf(this.label) > -1
        } else if (this.model !== null && this.model !== undefined) {
          return this.model === this.trueLabel
        }
      },

      isGroup() {
        let parent = this.$parent
        while (parent) {
          if (parent.$options.componentName !== 'ElCheckboxGroup') {
            parent = parent.$parent
          } else {
            this._checkboxGroup = parent
            return true
          }
        }
        return false
      },

      store() {
        return this._checkboxGroup ? this._checkboxGroup.value : this.value
      }
    },

    props: {
      value: {},
      label: {},
      indeterminate: Boolean,
      disabled: Boolean,
      checked: Boolean,
      name: String,
      trueLabel: [String, Number],
      falseLabel: [String, Number]
    },

    methods: {
      addToStore() {
        if (
          Array.isArray(this.model) &&
          this.model.indexOf(this.label) === -1
        ) {
          this.model.push(this.label)
        } else {
          this.model = this.trueLabel || true
        }
      },
      clickHandler(e) {
        this.$emit('on-change', this.model)
        e.target.blur()
      }
    },
    created() {
      this.checked && this.addToStore()
    }
  }
</script>
<style>
  .checkbox {
      color: #1f2d3d;
      position: relative;
      cursor: pointer;
      display: inline-block;
      white-space: nowrap;
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
  }
  .checkbox-input {
      white-space: nowrap;
      cursor: pointer;
      outline: none;
      display: inline-block;
      line-height: 1;
      position: relative;
      vertical-align: middle;
  }
  .checkbox-inner {
      display: inline-block;
      position: relative;
      border: 1px solid #c0ccda;
      border-radius: 2px;
      box-sizing: border-box;
      width: 14px;
      height: 14px;
      background-color: #fff;
      z-index: 1;
      transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46);
  }
  .is-disabled .checkbox-inner{
  	background-color: #eef1f6;
    border-color: #d1dbe5;
    cursor: not-allowed;
  }
  .checkbox-inner:after {
      box-sizing: content-box;
      content: "✔";
      font-size: 18px;
  		color: #00c175;
      left: 0px;
      position: absolute;
      top: -5px;
      transition: all .15s;
      opacity: 0;
  		transition: all 0.2s ease-in;
  }
  .checkbox-original:checked +.checkbox-inner{
  	border: 1px solid #00c175;
  }
  .checkbox-original:checked +.checkbox-inner:after{
  	opacity: 1;
  }
  .checkbox-original {
      opacity: 0;
      outline: none;
      position: absolute;
      margin: 0;
      left: -9999px;
  }
</style>
