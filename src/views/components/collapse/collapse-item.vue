<template>
  <div class="card collapse-item" :class="{ 'is-fullwidth': $parent.isFullwidth, 'is-active': isActived }">
    <header class="card-header touchable" role="tab" :aria-expanded="selected ? 'true' : 'fase'" @click="toggle">
      <!-- <span class="card-header-icon">

      </span> -->
      <i class="card-header-icon iconfont icon-gengduo"></i>
      <span class="card-header-title">{{ title }}</span>
    </header>
    <transition
      name="collapsed-fade"
      :css="false"
      appear
      @before-appear="before"
      @appear="enter"
      @appear-cancel="cancel"
      @before-enter="before"
      @enter="enter"
      @enter-cancel="cancel"
      @leave="leave"
      @leave-cancel="cancel"
    >
    <div class="card-content" v-show="isActived">
      <div class="card-content-box">
        <slot></slot>
      </div>
    </div>
  </transition>
</div>
</template>

<script>
import anime from 'animejs'

export default {
  props: {
    selected: Boolean,
    title: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      isActived: this.selected
    }
  },

  created () {
    this._isCollapseItem = true
  },

  mounted () {
    this.$on('open', this.$parent.openByIndex)
    if (this.isActived) {
      this.$emit('open', this.index)
    }
  },

  beforeDestroy () {
    if (this.anime && this.targets) {
      anime.remove(this.targets)
    }
    this.$off('open', this.$parent.openByIndex)
  },

  computed: {
    index () {
      return this.$parent.$collapseItems.indexOf(this)
    }
  },

  methods: {
    toggle () {
      if ((this.isActived = !this.isActived)) {
        this.$emit('open', this.index)
      }
    },

    getAnime (targets) {
      if (this.anime) return this.anime
      return this.anime = anime({ targets })
    },

    cancel () {
      this.anime.pause()
    },

    before (targets) {
      if (!this.targets) this.targets = targets
      targets.removeAttribute('style')
    },

    enter (targets, done) {
      const height = targets.scrollHeight
      targets.style.height = 0
      targets.style.opacity = 0
      this.getAnime(targets).play({
        targets,
        duration: 377,
        easing: 'easeOutExpo',
        opacity: [0, 1],
        height,
        complete () {
          targets.removeAttribute('style')
          done()
        }
      })
    },

    leave (targets, complete) {
      this.getAnime(targets).play({
        targets,
        duration: 377,
        easing: 'easeOutExpo',
        opacity: [1, 0],
        height: 0,
        complete
      })
    }
  }
}
</script>
<style>
.collapse-item .card-header {
  cursor: pointer;
  height: 43px;
  line-height: 43px;
  padding-left: 15px;
  background-color: #fff;
  color: #48576a;
  cursor: pointer;
  border-bottom: 1px solid #dfe6ec;
  font-size: 13px;
}
.collapse-item .card-header-icon {
  transition: transform .377s ease;
}
.collapse-item .card-content {
  will-change: height;
  background-color: #fbfdff;
  overflow: hidden;
  box-sizing: border-box;
  border-bottom: 1px solid #dfe6ec;
}
.collapse-item .card-content-box {
  padding: 10px 15px;
  font-size: 13px;
  color: #1f2d3d;
  line-height: 1.769230769230769;
}

.collapse-item.is-active> .card-header>.card-header-icon{
   transform: rotate(90deg);
}
.collapse-item:last-child {
    margin-bottom: -1px;
}
</style>
