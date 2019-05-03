<template>
  <vue-toast ref="toast"></vue-toast>
</template>

<script>
import vueToast from 'vue-toast'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: { vueToast },
  computed: {
    ...mapGetters({
      msg: 'message'
    })
  },
  methods: {
    ...mapActions([
      'showMsg',
      'hideMsg'
    ]),
    showToastr(content, type = 'error', position = 'top center') {
      this.$refs.toast.setOptions({ maxToasts: 3, position: position })
      this.$refs.toast.showToast(content, {
        theme: type,
        timeLife: 2800,
        closeBtn: false
      })
    }
  },
  watch: {
    'msg': {
      handler: function (val, oldVal) {
        if (val.content !== '') {
          this.showToastr(val.content, val.type)
          this.hideMsg()
        }
      },
      deep: true
    }
  }
}
</script>
