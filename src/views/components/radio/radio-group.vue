<template>
  <div class="radio-group" :class="{'radio-group-vertical': vertical}">
    <slot></slot>
  </div>
</template>
<script>
  import Emitter from '@/mixins/emitter'

  export default {
    name: 'ElRadioGroup',
    componentName: 'ElRadioGroup',
    mixins: [Emitter],
    props: {
      value: [String, Number, Boolean, Object],
      size: String,
      vertical: {
        type: Boolean,
        default: false
      },
      fill: {
        type: String,
        default: '#20a0ff'
      },
      textColor: {
        type: String,
        default: '#fff'
      }
    },
    watch: {
      value(value) {
        this.$emit('change', value)
        this.dispatch('ElFormItem', 'el.form.change', [this.value])
      }
    }
  }
</script>
