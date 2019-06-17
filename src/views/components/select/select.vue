<template>
  <div :class="containerClasses" >
    <input
      ref="search"
      v-model="searchField"
      :class="placeholderClasses"
      :readonly="!search"
      :placeholder="placeholder"
      @blur="close"
      @input="inputSearch"
      @click.self="toggleOpened">
    <transition name="vuebulmaselect-slide-fade">
      <div v-show="opened" :style="optionsStyles" :class="optionsClasses">
        <template v-if="options.length === 0">
          <button disabled class="button is-white bulma-select__option">
            <slot name="no-results">No options found.</slot>
          </button>
        </template>
        <template v-else>
          <button
            v-for="(option, i) in options"
            @click.stop="selectOption(i)"
            :class="['button is-white', selected === i ? 'is-info' : '', 'bulma-select__option']">
            {{ label !== undefined ? option[label] : option }}
          </button>
        </template>
      </div>
    </transition>
  </div>
</template>

<script>
// Export the component itself
export default {
  name: 'bulma-select',
  props: {
    // Select placeholder
    placeholder: {
      type: String,
      default: 'Select...'
    },
    // Options
    options: {
      type: Array,
      default: () => []
    },
    // Options label
    label: {
      type: String
    },
    // v-model value
    value: {
      type: null,
      default: null
    },
    // Has search?
    search: {
      type: Boolean,
      default: false
    },
    // Max items displayed
    maxItems: {
      type: Number,
      default: 5
    }
  },
  // Component inner state
  data () {
    //
    return {
      opened: false,
      searchField: '',
      saveSearchField: '',
      selected: undefined
    }
  },
  // Computed properties
  computed: {
    // Container computed classes
    containerClasses () {
      return ['bulma-select__container', {'bulma-select__container--active': this.opened}]
    },
    // Placeholder computed classes
    placeholderClasses () {
      return ['bulma-select__placeholder input', {'is-hovered': this.opened}]
    },
    // Options computed classes
    optionsClasses () {
      return [{'is-hovered': this.opened}, 'bulma-select__options']
    },
    // Options styles
    optionsStyles () {
      //
      let styles = {}

      //
      if (this.options.length > this.maxItems) {
        styles.height = 35 * this.maxItems + 'px'
      }

      // Return the styles
      return styles
    },
    // Selected item
    selectedItem () { return this.options[this.selected] },
    // Text for the selected option
    textSelected () {
      //
      if (this.options[this.selected] === undefined) { return '' }

      //
      return this.label !== undefined ? this.selectedItem[this.label] : this.selectedItem
    }
  },
  // Methods
  methods: {
    // Toggle the opened property
    toggleOpened () {
      this.opened ? this.close() : this.open()
    },
    // Open the select
    open () {
      // Primitive return
      if (this.opened) { return }

      // Definitions
      this.searchField = this.saveSearchField
      this.inputSearch()
      this.opened = true
      this.$refs.search.focus()
    },
    // Close the select
    close () {
      // Primitive return
      if (!this.opened) { return }

      // Definitions
      this.opened = false
      this.saveSearchField = this.searchField
      this.searchField = this.textSelected
      this.$refs.search.blur()
    },
    // Set the selected using v-model value
    selectVModel () {
      if (this.options.indexOf(this.value) === -1) { return }
      this.selected = this.options.indexOf(this.value)
    },
    // Select a value based on the index
    selectOption (i) {
      //
      this.selected = i
      this.searchField = this.textSelected
      this.saveSearchField = ''

      // Emit!
      this.$emit('input', this.options[this.selected])
    },
    // Search items
    inputSearch () {
      //
      this.$emit('type', this.searchField)
    }
  },
  // Watchers
  watch: {
    // Value changed
    value () {
      this.selectVModel()
    },
    // Options also change
    options (_, old) {
      //
      let i = this.options.indexOf(old[this.selected])
      if (i > -1) { this.selected = i }
    }
  },
  // When the component is created
  created () {
    // do it
    this.selectVModel()
  }
}
</script>

<style>
@keyframes spinAround{
from{transform:rotate(0deg)
}
to{transform:rotate(359deg)
}
}
.button{-moz-appearance:none;-webkit-appearance:none;-ms-flex-align:center;align-items:center;border:none;border-radius:3px;box-shadow:none;display:-ms-inline-flexbox;display:inline-flex;font-size:14px;height:2.5em;-ms-flex-pack:start;justify-content:flex-start;line-height:1.5;padding-left:0.75em;padding-right:0.75em;position:relative;vertical-align:top;-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;background-color:#fff;border-bottom:1px solid #dbdbdb;color:#363636;cursor:pointer;-ms-flex-pack:center;justify-content:center;padding-left:0.75em;padding-right:0.75em;text-align:center;white-space:nowrap
}
.button:focus,.button.is-focused,.button:active,.button.is-active{outline:none
}
.button[disabled],.button.is-disabled{pointer-events:none
}
.button strong{color:inherit
}
.button .icon:first-child:not(:last-child){margin-left:-.25rem;margin-right:.5rem
}
.button .icon:last-child:not(:first-child){margin-left:.5rem;margin-right:-.25rem
}
.button .icon:first-child:last-child{margin-left:calc(-1px + -.25rem);margin-right:calc(-1px + -.25rem)
}
.button .icon.is-small:first-child:not(:last-child){margin-left:0rem
}
.button .icon.is-small:last-child:not(:first-child){margin-right:0rem
}
.button .icon.is-small:first-child:last-child{margin-left:calc(-1px + 0rem);margin-right:calc(-1px + 0rem)
}
.button .icon.is-medium:first-child:not(:last-child){margin-left:-.5rem
}
.button .icon.is-medium:last-child:not(:first-child){margin-right:-.5rem
}
.button .icon.is-medium:first-child:last-child{margin-left:calc(-1px + -.5rem);margin-right:calc(-1px + -.5rem)
}
.button .icon.is-large:first-child:not(:last-child){margin-left:-1rem
}
.button .icon.is-large:last-child:not(:first-child){margin-right:-1rem
}
.button .icon.is-large:first-child:last-child{margin-left:calc(-1px + -1rem);margin-right:calc(-1px + -1rem)
}
.button:hover,.button.is-hovered{border-color:#b5b5b5;color:#363636
}
.button:focus,.button.is-focused{border-color:#00d1b2;box-shadow:0 0 0.5em rgba(0,209,178,0.25);color:#363636
}
.button:active,.button.is-active{border-color:#4a4a4a;box-shadow:inset 0 1px 2px rgba(10,10,10,0.2);color:#363636
}
.button.is-link{background-color:transparent;border-color:transparent;color:#4a4a4a;text-decoration:underline
}
.button.is-link:hover,.button.is-link.is-hovered,.button.is-link:focus,.button.is-link.is-focused,.button.is-link:active,.button.is-link.is-active{background-color:#f5f5f5;color:#363636
}
.button.is-#fff{background-color:#fff;border-color:transparent;color:#0a0a0a
}
.button.is-#fff:hover,.button.is-#fff.is-hovered{background-color:#f9f9f9;border-color:transparent;color:#0a0a0a
}
.button.is-#fff:focus,.button.is-#fff.is-focused{border-color:transparent;box-shadow:0 0 0.5em rgba(255,255,255,0.25);color:#0a0a0a
}
.button.is-#fff:active,.button.is-#fff.is-active{background-color:#f2f2f2;border-color:transparent;box-shadow:inset 0 1px 2px rgba(10,10,10,0.2);color:#0a0a0a
}
.button.is-#fff.is-inverted{background-color:#0a0a0a;color:#fff
}
.button.is-#fff.is-inverted:hover{background-color:#000
}
.button.is-#fff.is-loading:after{border-color:transparent transparent #0a0a0a #0a0a0a !important
}
.button.is-#fff.is-outlined{background-color:transparent;border-color:#fff;color:#fff
}
.button.is-#fff.is-outlined:hover,.button.is-#fff.is-outlined:focus{background-color:#fff;border-color:#fff;color:#0a0a0a
}
.button.is-#fff.is-inverted.is-outlined{background-color:transparent;border-color:#0a0a0a;color:#0a0a0a
}
.button.is-#fff.is-inverted.is-outlined:hover,.button.is-#fff.is-inverted.is-outlined:focus{background-color:#0a0a0a;color:#fff
}
.button.is-#000{background-color:#0a0a0a;border-color:transparent;color:#fff
}
.button.is-#000:hover,.button.is-#000.is-hovered{background-color:#040404;border-color:transparent;color:#fff
}
.button.is-#000:focus,.button.is-#000.is-focused{border-color:transparent;box-shadow:0 0 0.5em rgba(10,10,10,0.25);color:#fff
}
.button.is-#000:active,.button.is-#000.is-active{background-color:#000;border-color:transparent;box-shadow:inset 0 1px 2px rgba(10,10,10,0.2);color:#fff
}
.button.is-#000.is-inverted{background-color:#fff;color:#0a0a0a
}
.button.is-#000.is-inverted:hover{background-color:#f2f2f2
}
.button.is-#000.is-loading:after{border-color:transparent transparent #fff #fff !important
}
.button.is-#000.is-outlined{background-color:transparent;border-color:#0a0a0a;color:#0a0a0a
}
.button.is-#000.is-outlined:hover,.button.is-#000.is-outlined:focus{background-color:#0a0a0a;border-color:#0a0a0a;color:#fff
}
.button.is-#000.is-inverted.is-outlined{background-color:transparent;border-color:#fff;color:#fff
}
.button.is-#000.is-inverted.is-outlined:hover,.button.is-#000.is-inverted.is-outlined:focus{background-color:#fff;color:#0a0a0a
}
.button.is-light{background-color:#f5f5f5;border-color:transparent;color:#363636
}
.button.is-light:hover,.button.is-light.is-hovered{background-color:#eee;border-color:transparent;color:#363636
}
.button.is-light:focus,.button.is-light.is-focused{border-color:transparent;box-shadow:0 0 0.5em rgba(245,245,245,0.25);color:#363636
}
.button.is-light:active,.button.is-light.is-active{background-color:#e8e8e8;border-color:transparent;box-shadow:inset 0 1px 2px rgba(10,10,10,0.2);color:#363636
}
.button.is-light.is-inverted{background-color:#363636;color:#f5f5f5
}
.button.is-light.is-inverted:hover{background-color:#292929
}
.button.is-light.is-loading:after{border-color:transparent transparent #363636 #363636 !important
}
.button.is-light.is-outlined{background-color:transparent;border-color:#f5f5f5;color:#f5f5f5
}
.button.is-light.is-outlined:hover,.button.is-light.is-outlined:focus{background-color:#f5f5f5;border-color:#f5f5f5;color:#363636
}
.button.is-light.is-inverted.is-outlined{background-color:transparent;border-color:#363636;color:#363636
}
.button.is-light.is-inverted.is-outlined:hover,.button.is-light.is-inverted.is-outlined:focus{background-color:#363636;color:#f5f5f5
}
.button.is-dark{background-color:#363636;border-color:transparent;color:#f5f5f5
}
.button.is-dark:hover,.button.is-dark.is-hovered{background-color:#2f2f2f;border-color:transparent;color:#f5f5f5
}
.button.is-dark:focus,.button.is-dark.is-focused{border-color:transparent;box-shadow:0 0 0.5em rgba(54,54,54,0.25);color:#f5f5f5
}
.button.is-dark:active,.button.is-dark.is-active{background-color:#292929;border-color:transparent;box-shadow:inset 0 1px 2px rgba(10,10,10,0.2);color:#f5f5f5
}
.button.is-dark.is-inverted{background-color:#f5f5f5;color:#363636
}
.button.is-dark.is-inverted:hover{background-color:#e8e8e8
}
.button.is-dark.is-loading:after{border-color:transparent transparent #f5f5f5 #f5f5f5 !important
}
.button.is-dark.is-outlined{background-color:transparent;border-color:#363636;color:#363636
}
.button.is-dark.is-outlined:hover,.button.is-dark.is-outlined:focus{background-color:#363636;border-color:#363636;color:#f5f5f5
}
.button.is-dark.is-inverted.is-outlined{background-color:transparent;border-color:#f5f5f5;color:#f5f5f5
}
.button.is-dark.is-inverted.is-outlined:hover,.button.is-dark.is-inverted.is-outlined:focus{background-color:#f5f5f5;color:#363636
}

.button.is-info{background-color:#3273dc;border-color:transparent;color:#fff
}
.button.is-info:hover,.button.is-info.is-hovered{background-color:#276cda;border-color:transparent;color:#fff
}
.button.is-info:focus,.button.is-info.is-focused{border-color:transparent;box-shadow:0 0 0.5em rgba(50,115,220,0.25);color:#fff
}
.button.is-info:active,.button.is-info.is-active{background-color:#2366d1;border-color:transparent;box-shadow:inset 0 1px 2px rgba(10,10,10,0.2);color:#fff
}
.button.is-info.is-inverted{background-color:#fff;color:#3273dc
}
.button.is-info.is-inverted:hover{background-color:#f2f2f2
}
.button.is-info.is-loading:after{border-color:transparent transparent #fff #fff !important
}
.button.is-info.is-outlined{background-color:transparent;border-color:#3273dc;color:#3273dc
}
.button.is-info.is-outlined:hover,.button.is-info.is-outlined:focus{background-color:#3273dc;border-color:#3273dc;color:#fff
}
.button.is-info.is-inverted.is-outlined{background-color:transparent;border-color:#fff;color:#fff
}
.button.is-info.is-inverted.is-outlined:hover,.button.is-info.is-inverted.is-outlined:focus{background-color:#fff;color:#3273dc
}
.button[disabled],.button.is-disabled{opacity:0.5
}
.button.is-fullwidth{display:-ms-flexbox;display:flex;width:100%
}
.button.is-loading{color:transparent !important;pointer-events:none
}
.button.is-loading:after{animation:spinAround 500ms infinite linear;border:2px solid #dbdbdb;border-radius:290486px;border-right-color:transparent;border-top-color:transparent;content:"";display:block;height:1rem;position:relative;width:1rem;left:50%;margin-left:-8px;margin-top:-8px;position:absolute;top:50%;position:absolute !important
}
.input:focus,.input.is-focused,.input:active,.input.is-active,.textarea:focus,.textarea.is-focused,.textarea:active,.textarea.is-active{outline:none
}
.input[disabled],.input.is-disabled,.textarea[disabled],.textarea.is-disabled{pointer-events:none
}
.input:hover,.input.is-hovered,.textarea:hover,.textarea.is-hovered{border-color:#b5b5b5
}
.input:focus,.input.is-focused,.input:active,.input.is-active,.textarea:focus,.textarea.is-focused,.textarea:active,.textarea.is-active{border-color:#00d1b2
}
.select,.bulma-select__container{display:inline-block;height:2.5em;position:relative;vertical-align:top
}
.select:after,.bulma-select__container:after{border:1px solid #00d1b2;border-right:0;border-top:0;content:" ";display:block;height:0.5em;pointer-events:none;position:absolute;transform:rotate(-45deg);width:0.5em;margin-top:-0.375em;right:1.125em;top:50%;z-index:4
}
.select select,.bulma-select__container select,.select .bulma-select__placeholder,.bulma-select__container .bulma-select__placeholder{-moz-appearance:none;-webkit-appearance:none;-ms-flex-align:center;align-items:center;border:none;border-radius:3px;box-shadow:none;display:-ms-inline-flexbox;display:inline-flex;font-size:1rem;height:2.5em;-ms-flex-pack:start;justify-content:flex-start;line-height:1.5;padding-left:0.75em;padding-right:0.75em;position:relative;vertical-align:top;background-color:#fff;border:1px solid #dbdbdb;color:#363636;cursor:pointer;display:block;font-size:1em;outline:none;padding-right:2.5em
}
.select select:focus,.bulma-select__container select:focus,.select .bulma-select__placeholder:focus,.bulma-select__container .bulma-select__placeholder:focus,.select select.is-focused,.bulma-select__container select.is-focused,.select .is-focused.bulma-select__placeholder,.bulma-select__container .is-focused.bulma-select__placeholder,.select select:active,.bulma-select__container select:active,.select .bulma-select__placeholder:active,.bulma-select__container .bulma-select__placeholder:active,.select select.is-active,.bulma-select__container select.is-active,.select .is-active.bulma-select__placeholder,.bulma-select__container .is-active.bulma-select__placeholder{outline:none
}
.select select[disabled],.bulma-select__container select[disabled],.select [disabled].bulma-select__placeholder,.bulma-select__container [disabled].bulma-select__placeholder,.select select.is-disabled,.bulma-select__container select.is-disabled,.select .is-disabled.bulma-select__placeholder,.bulma-select__container .is-disabled.bulma-select__placeholder{pointer-events:none
}
.select select:hover,.bulma-select__container select:hover,.select .bulma-select__placeholder:hover,.bulma-select__container .bulma-select__placeholder:hover,.select select.is-hovered,.bulma-select__container select.is-hovered,.select .is-hovered.bulma-select__placeholder,.bulma-select__container .is-hovered.bulma-select__placeholder{border-color:#b5b5b5
}
.select select:focus,.bulma-select__container select:focus,.select .bulma-select__placeholder:focus,.bulma-select__container .bulma-select__placeholder:focus,.select select.is-focused,.bulma-select__container select.is-focused,.select .is-focused.bulma-select__placeholder,.bulma-select__container .is-focused.bulma-select__placeholder,.select select:active,.bulma-select__container select:active,.select .bulma-select__placeholder:active,.bulma-select__container .bulma-select__placeholder:active,.select select.is-active,.bulma-select__container select.is-active,.select .is-active.bulma-select__placeholder,.bulma-select__container .is-active.bulma-select__placeholder{border-color:#00d1b2
}
.select select[disabled],.bulma-select__container select[disabled],.select [disabled].bulma-select__placeholder,.bulma-select__container [disabled].bulma-select__placeholder,.select select.is-disabled,.bulma-select__container select.is-disabled,.select .is-disabled.bulma-select__placeholder,.bulma-select__container .is-disabled.bulma-select__placeholder{background-color:#f5f5f5;border-color:#f5f5f5;box-shadow:none;color:#7a7a7a
}
.select select[disabled]::-moz-placeholder,.bulma-select__container select[disabled]::-moz-placeholder,.select [disabled].bulma-select__placeholder::-moz-placeholder,.bulma-select__container [disabled].bulma-select__placeholder::-moz-placeholder,.select select.is-disabled::-moz-placeholder,.bulma-select__container select.is-disabled::-moz-placeholder,.select .is-disabled.bulma-select__placeholder::-moz-placeholder,.bulma-select__container .is-disabled.bulma-select__placeholder::-moz-placeholder{color:rgba(54,54,54,0.3)
}
.select select[disabled]::-webkit-input-placeholder,.bulma-select__container select[disabled]::-webkit-input-placeholder,.select [disabled].bulma-select__placeholder::-webkit-input-placeholder,.bulma-select__container [disabled].bulma-select__placeholder::-webkit-input-placeholder,.select select.is-disabled::-webkit-input-placeholder,.bulma-select__container select.is-disabled::-webkit-input-placeholder,.select .is-disabled.bulma-select__placeholder::-webkit-input-placeholder,.bulma-select__container .is-disabled.bulma-select__placeholder::-webkit-input-placeholder{color:rgba(54,54,54,0.3)
}
.select select[disabled]:-moz-placeholder,.bulma-select__container select[disabled]:-moz-placeholder,.select [disabled].bulma-select__placeholder:-moz-placeholder,.bulma-select__container [disabled].bulma-select__placeholder:-moz-placeholder,.select select.is-disabled:-moz-placeholder,.bulma-select__container select.is-disabled:-moz-placeholder,.select .is-disabled.bulma-select__placeholder:-moz-placeholder,.bulma-select__container .is-disabled.bulma-select__placeholder:-moz-placeholder{color:rgba(54,54,54,0.3)
}
.select select[disabled]:-ms-input-placeholder,.bulma-select__container select[disabled]:-ms-input-placeholder,.select [disabled].bulma-select__placeholder:-ms-input-placeholder,.bulma-select__container [disabled].bulma-select__placeholder:-ms-input-placeholder,.select select.is-disabled:-ms-input-placeholder,.bulma-select__container select.is-disabled:-ms-input-placeholder,.select .is-disabled.bulma-select__placeholder:-ms-input-placeholder,.bulma-select__container .is-disabled.bulma-select__placeholder:-ms-input-placeholder{color:rgba(54,54,54,0.3)
}
.select select:hover,.bulma-select__container select:hover,.select .bulma-select__placeholder:hover,.bulma-select__container .bulma-select__placeholder:hover{border-color:#b5b5b5
}
.select select::ms-expand,.bulma-select__container select::ms-expand,.select .bulma-select__placeholder::ms-expand,.bulma-select__container .bulma-select__placeholder::ms-expand{display:none
}
.select:hover:after,.bulma-select__container:hover:after{border-color:#363636
}
.select.is-small,.is-small.bulma-select__container{border-radius:2px;font-size:.75rem
}
.select.is-medium,.is-medium.bulma-select__container{font-size:1.25rem
}
.select.is-large,.is-large.bulma-select__container{font-size:1.5rem
}
.select.is-fullwidth,.is-fullwidth.bulma-select__container{width:100%
}
.select.is-fullwidth select,.is-fullwidth.bulma-select__container select,.select.is-fullwidth .bulma-select__placeholder,.is-fullwidth.bulma-select__container .bulma-select__placeholder{width:100%
}
.label{color:#363636;display:block;font-weight:bold
}
.label:not(:last-child){margin-bottom:0.5em
}
.help{display:block;font-size:.75rem;margin-top:5px
}
.help.is-#fff{color:#fff
}
.help.is-#000{color:#0a0a0a
}
.help.is-light{color:#f5f5f5
}
.help.is-dark{color:#363636
}
.help.is-primary{color:#00d1b2
}
.help.is-info{color:#3273dc
}
.help.is-success{color:#23d160
}
.help.is-warning{color:#ffdd57
}
.help.is-danger{color:#ff3860
}
@media screen and (max-width: 768px){
.control-label{margin-bottom:0.5em
}
}
@media screen and (min-width: 769px){
.control-label{-ms-flex-preferred-size:0;flex-basis:0;-ms-flex-positive:1;flex-grow:1;-ms-flex-negative:0;flex-shrink:0;margin-right:1.5em;padding-top:0.5em;text-align:right
}
}
.control{position:relative;text-align:left
}
.control:not(:last-child){margin-bottom:0.75rem
}
.control.has-addons{display:-ms-flexbox;display:flex;-ms-flex-pack:start;justify-content:flex-start
}
.control.has-addons .button,.control.has-addons .input,.control.has-addons .select,.control.has-addons .bulma-select__container{border-radius:0;margin-right:-1px;width:auto
}
.control.has-addons .button:hover,.control.has-addons .input:hover,.control.has-addons .select:hover,.control.has-addons .bulma-select__container:hover{z-index:2
}
.control.has-addons .button:focus,.control.has-addons .button:active,.control.has-addons .input:focus,.control.has-addons .input:active,.control.has-addons .select:focus,.control.has-addons .bulma-select__container:focus,.control.has-addons .select:active,.control.has-addons .bulma-select__container:active{z-index:3
}
.control.has-addons .button:first-child,.control.has-addons .input:first-child,.control.has-addons .select:first-child,.control.has-addons .bulma-select__container:first-child{border-radius:3px 0 0 3px
}
.control.has-addons .button:first-child select,.control.has-addons .button:first-child .bulma-select__placeholder,.control.has-addons .input:first-child select,.control.has-addons .input:first-child .bulma-select__placeholder,.control.has-addons .select:first-child select,.control.has-addons .bulma-select__container:first-child select,.control.has-addons .select:first-child .bulma-select__placeholder,.control.has-addons .bulma-select__container:first-child .bulma-select__placeholder{border-radius:3px 0 0 3px
}
.control.has-addons .button:last-child,.control.has-addons .input:last-child,.control.has-addons .select:last-child,.control.has-addons .bulma-select__container:last-child{border-radius:0 3px 3px 0
}
.control.has-addons .button:last-child select,.control.has-addons .button:last-child .bulma-select__placeholder,.control.has-addons .input:last-child select,.control.has-addons .input:last-child .bulma-select__placeholder,.control.has-addons .select:last-child select,.control.has-addons .bulma-select__container:last-child select,.control.has-addons .select:last-child .bulma-select__placeholder,.control.has-addons .bulma-select__container:last-child .bulma-select__placeholder{border-radius:0 3px 3px 0
}
.control.has-addons .button.is-expanded,.control.has-addons .input.is-expanded,.control.has-addons .select.is-expanded,.control.has-addons .is-expanded.bulma-select__container{-ms-flex-positive:1;flex-grow:1;-ms-flex-negative:0;flex-shrink:0
}
.control.has-addons .select select:hover,.control.has-addons .bulma-select__container select:hover,.control.has-addons .select .bulma-select__placeholder:hover,.control.has-addons .bulma-select__container .bulma-select__placeholder:hover{z-index:2
}
.control.has-addons .select select:focus,.control.has-addons .bulma-select__container select:focus,.control.has-addons .select .bulma-select__placeholder:focus,.control.has-addons .bulma-select__container .bulma-select__placeholder:focus,.control.has-addons .select select:active,.control.has-addons .bulma-select__container select:active,.control.has-addons .select .bulma-select__placeholder:active,.control.has-addons .bulma-select__container .bulma-select__placeholder:active{z-index:3
}
.control.has-addons.has-addons-centered{-ms-flex-pack:center;justify-content:center
}
.control.has-addons.has-addons-right{-ms-flex-pack:end;justify-content:flex-end
}
.control.has-addons.has-addons-fullwidth .button,.control.has-addons.has-addons-fullwidth .input,.control.has-addons.has-addons-fullwidth .select,.control.has-addons.has-addons-fullwidth .bulma-select__container{-ms-flex-positive:1;flex-grow:1;-ms-flex-negative:0;flex-shrink:0
}
.control.has-icon .icon{color:#dbdbdb;pointer-events:none;position:absolute;top:1.25rem;z-index:4
}
.control.has-icon .input:focus+.icon{color:#7a7a7a
}
.control.has-icon .input.is-small+.icon{top:.9375rem
}
.control.has-icon .input.is-medium+.icon{top:1.5625rem
}
.control.has-icon .input.is-large+.icon{top:1.875rem
}
.control.has-icon:not(.has-icon-right) .icon{left:1.25rem;transform:translateX(-50%) translateY(-50%)
}
.control.has-icon:not(.has-icon-right) .input{padding-left:2.5em
}
.control.has-icon:not(.has-icon-right) .input.is-small+.icon{left:.9375rem
}
.control.has-icon:not(.has-icon-right) .input.is-medium+.icon{left:1.5625rem
}
.control.has-icon:not(.has-icon-right) .input.is-large+.icon{left:1.875rem
}
.control.has-icon.has-icon-right .icon{right:1.25rem;transform:translateX(50%) translateY(-50%)
}
.control.has-icon.has-icon-right .input{padding-right:2.5em
}
.control.has-icon.has-icon-right .input.is-small+.icon{right:.9375rem
}
.control.has-icon.has-icon-right .input.is-medium+.icon{right:1.5625rem
}
.control.has-icon.has-icon-right .input.is-large+.icon{right:1.875rem
}
.control.is-grouped{display:-ms-flexbox;display:flex;-ms-flex-pack:start;justify-content:flex-start
}
.control.is-grouped>.control{-ms-flex-preferred-size:0;flex-basis:0;-ms-flex-negative:0;flex-shrink:0
}
.control.is-grouped>.control:not(:last-child){margin-bottom:0;margin-right:0.75rem
}
.control.is-grouped>.control.is-expanded{-ms-flex-positive:1;flex-grow:1;-ms-flex-negative:1;flex-shrink:1
}
.control.is-grouped.is-grouped-centered{-ms-flex-pack:center;justify-content:center
}
.control.is-grouped.is-grouped-right{-ms-flex-pack:end;justify-content:flex-end
}
@media screen and (min-width: 769px){
.control.is-horizontal{display:-ms-flexbox;display:flex
}
.control.is-horizontal>.control{display:-ms-flexbox;display:flex;-ms-flex-preferred-size:0;flex-basis:0;-ms-flex-positive:5;flex-grow:5;-ms-flex-negative:1;flex-shrink:1
}
}
.control.is-loading:after{animation:spinAround 500ms infinite linear;border:2px solid #dbdbdb;border-radius:290486px;border-right-color:transparent;border-top-color:transparent;content:"";display:block;height:1rem;position:relative;width:1rem;position:absolute !important;right:0.75em;top:0.75em
}
.bulma-select__container{position:relative;width:100%
}
.bulma-select__container:after{transition:all 0.2s ease
}
.bulma-select__container--active:after{transform:rotate(-225deg);top:60% !important
}
.bulma-select__placeholder{box-sizing:border-box;text-align:left;width:100%
}
.bulma-select__placeholder.is-hovered{border-radius:3px 3px 0 0
}
.bulma-select__options{-moz-appearance:none;-webkit-appearance:none;-ms-flex-align:center;align-items:center;border:none;border-radius:3px;box-shadow:none;display:-ms-inline-flexbox;display:inline-flex;font-size:1rem;height:2.5em;-ms-flex-pack:start;justify-content:flex-start;line-height:1.5;padding-left:0.75em;padding-right:0.75em;position:relative;vertical-align:top;background-color:#fff;border:1px solid #dbdbdb;color:#363636;display:block;overflow:auto;padding:0;z-index:5;min-width:100%;height:auto;box-sizing:border-box;border-top:0;border-radius:0 0 3px 3px;position:absolute
}
.bulma-select__options:focus,.bulma-select__options.is-focused,.bulma-select__options:active,.bulma-select__options.is-active{outline:none
}
.bulma-select__options[disabled],.bulma-select__options.is-disabled{pointer-events:none
}
.bulma-select__options:hover,.bulma-select__options.is-hovered{border-color:#b5b5b5
}
.bulma-select__options:focus,.bulma-select__options.is-focused,.bulma-select__options:active,.bulma-select__options.is-active{border-color:#00d1b2
}
.bulma-select__options[disabled],.bulma-select__options.is-disabled{background-color:#f5f5f5;border-color:#f5f5f5;box-shadow:none;color:#7a7a7a
}
.bulma-select__options[disabled]::-moz-placeholder,.bulma-select__options.is-disabled::-moz-placeholder{color:rgba(54,54,54,0.3)
}
.bulma-select__options[disabled]::-webkit-input-placeholder,.bulma-select__options.is-disabled::-webkit-input-placeholder{color:rgba(54,54,54,0.3)
}
.bulma-select__options[disabled]:-moz-placeholder,.bulma-select__options.is-disabled:-moz-placeholder{color:rgba(54,54,54,0.3)
}
.bulma-select__options[disabled]:-ms-input-placeholder,.bulma-select__options.is-disabled:-ms-input-placeholder{color:rgba(54,54,54,0.3)
}
.bulma-select__option{width:100%;text-align:left;border-radius:0;display:block
}
.vuebulmaselect-slide-fade-enter-active{transition:all 0.2s ease
}
.vuebulmaselect-slide-fade-leave-active{transition:all 0.1s cubic-bezier(1, 0.5, 0.8, 1)
}
.vuebulmaselect-slide-fade-enter,.vuebulmaselect-slide-fade-leave-active{padding-top:10px;opacity:0
}
</style>
