<template>
  <div class="box-search">
    <input v-if="lazy" type="text" class="inp-search" :placeholder="placeholder" v-model.lazy="currentValue" @change="handleInput">
    <input v-else type="text" class="inp-search" :placeholder="placeholder" v-model="currentValue" @change="handleInput">
    <span class="btn-search" @click="handleInput"></span>
  </div>
</template>
<script >
import emitter from '@/mixins/emitter'
export default {
  name: 'ElInput',
  componentName: 'ElInput',
  mixins: [emitter],
  props: {
    // value: String,
    placeholder: String,
    lazy: {
      type: Boolean,
      default: false
    },
    validateEvent: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      currentValue: ''
    }
  },
  // watch: {
  //   'value'(val, oldValue) {
  //     this.setCurrentValue(val)
  //   }
  // },
  methods: {
    // updateValue(value) {
    //   this.setCurrentValue(value)
    // },
    // onEnter(value) {
    //   this.$emit('input', value)
    //   this.$emit('change', value)
    // },
    handleInput() {
      this.$emit('on-search', this.currentValue)
    }
    // handleFocus(event) {
    //   this.$emit('focus', event)
    // },
    // handleBlur(event) {
    //   this.$emit('blur', event)
    //   if (this.validateEvent) {
    //     this.dispatch('ElFormItem', 'el.form.blur', [this.currentValue])
    //   }
    // },
    // setCurrentValue(value) {
    //   if (value === this.currentValue) return
    //   this.currentValue = value
    //
    //   if (this.validateEvent) {
    //     this.dispatch('ElFormItem', 'el.form.change', [value])
    //   }
    // }
  }
}
</script>
