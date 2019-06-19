<script>
  import Emitter from '@/mixins/emitter'

  export default {
    name: 'ElCheckboxGroup',

    componentName: 'ElCheckboxGroup',

    mixins: [Emitter],

    props: {
      value: {}
    },

    watch: {
      value(value) {
        this.$emit('change', value);
        this.dispatch('ElFormItem', 'el.form.change', [value])
      }
    }
  }
</script>

<template>
  <div class="px-5">
    <slot></slot>
  </div>
</template>
