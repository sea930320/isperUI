<template>
  <div :class="tabsClass">
    <div class="tabs-header">
      <ul class="tabs-nav">
        <li v-for="(title,index) in tabtitles"
          :class="['tab-item', {'current': index+1===currentPage}]"
          :key="index"
          @click="setPage(index+1)">{{title}}</li>
      </ul>
    </div>
    <div class="tabs-content">
      <div v-if="slidable"
         class="tabswiper"
         :class="{'invisible':invisible}"
         @touchstart="_onTouchStart">
        <div class="tabswiper-wrap"
           ref="tabswiper-wrap"
           :class="{'dragging': dragging}"
           :style="{'transform' : 'translateX(' + translateX + 'px)'}"
           @transitionend="_onTransitionEnd">
          <slot></slot>
        </div>
      </div>
      <div v-else class="tabswiper"
         :class="{'invisible':invisible}">
        <div class="tabswiper-wrap"
           ref="tabswiper-wrap"
           :class="{'dragging': dragging}"
           :style="{'transform' : 'translateX(' + translateX + 'px)'}"
           @transitionend="_onTransitionEnd">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/babel">
const JUDGE_INITIAL = 0
const JUDGE_SLIDEING = 1
const JUDGE_SCROLLING = 2

export default {
  props: {
    tabtitles: {
      type: Array,
      default: []
    },
    curPage: {
      type: Number,
      default: 1
    },
    slidable: {
      type: Boolean,
      default: true
    },
    color: {
      type: String,
      default: 'blue'
    },
    type: {
      type: String,
      default: 'border-card'
    }
  },
  watch: {
    curPage: () => {
      this.currentPage = this.curPage
    }
  },
  data() {
    return {
      lastPage: 1,
      currentPage: this.curPage,
/*       translateX: 0, */
      startTranslateX: 0,
      delta: 0,
      deltaY: 0,
      clientWidth: 0,
      dragging: false,
      startPos: null,
      startPosY: null,
      transitioning: false,
      slideEls: [],
      invisible: true,
      judge: JUDGE_INITIAL
    }
  },
  computed: {
    tabsClass() {
      return [
        'tabs',
        {
          [`tabs-${this.type}`]: !!this.type,
          [`tabs-${this.color}`]: !!this.color
        }
      ]
    },
    translateX() {
      return -(this.slideEls[0] ? this.clientWidth * (this.currentPage - 1) : 0)
    }
  },
  mounted() {
    /* var that = this
    window.onresize = function() {
      that.clientWidth = that.$refs['tabswiper-wrap'].children[0].clientWidth
      var childs = that.$refs['tabswiper-wrap'].querySelector('.tabswiper-wrap')
      if (childs) {
        let per = Math.round(parseInt(childs.style.transform.replace(/[^0-9]/ig, '')) / childs.children[0].clientWidth)
        childs.style.transform = 'translateX(' + -(per * childs.children[0].clientWidth) + 'px)'
      }
    } */
    this.$nextTick(function () {
      this._onTouchMove = this._onTouchMove.bind(this)
      this._onTouchEnd = this._onTouchEnd.bind(this)
      this.slideEls = this.$refs['tabswiper-wrap'].children
      this.clientWidth = this.slideEls[0].clientWidth
      this.dragging = true
      this.setPage(this.currentPage)
      let _this = this
      setTimeout(() => {
        _this.dragging = _this.invisible = false
      }, 100)
      window.addEventListener('resize', function() {
        _this.clientWidth = _this.$refs['tabswiper-wrap'].children[0].clientWidth
        var childs = _this.$refs['tabswiper-wrap'].querySelector('.tabswiper-wrap')
        if (childs) {
          let per = Math.round(parseInt(childs.style.transform.replace(/[^0-9]/ig, '')) / childs.children[0].clientWidth)
          childs.style.transform = 'translateX(' + -(per * childs.children[0].clientWidth) + 'px)'
        }
      }, false)
    })
  },
  methods: {
    next() {
      var page = this.currentPage
      if (page < this.slideEls.length) {
        page++
        this.setPage(page)
      } else {
        this._revert()
      }
    },
    prev() {
      var page = this.currentPage
      if (page > 1) {
        page--
        this.setPage(page)
      } else {
        this._revert()
      }
    },
    setPage(page) {
      this.lastPage = this.currentPage
      this.currentPage = page
      this.clientWidth = this.$refs['tabswiper-wrap'].children[0].clientWidth
      this._onTransitionStart()
    },
    _onTouchStart(e) {
      this.startPos = this._getTouchPos(e)
      this.startYPos = this._getTouchYPos(e)
      this.delta = 0
      this.startTranslateX = this.translateX
      this.startTime = new Date().getTime()
      this.dragging = true

      document.addEventListener('touchmove', this._onTouchMove, false)
      document.addEventListener('touchend', this._onTouchEnd, false)
    },
    _onTouchMove(e) {
      this.delta = this._getTouchPos(e) - this.startPos
      this.deltaY = Math.abs(this._getTouchYPos(e) - this.startYPos)

      switch (this.judge) {
        case JUDGE_INITIAL:
            // if (Math.abs(this.delta) > 20 && this.deltaY<25) {//judge to allow/prevent scroll
          if (Math.abs(this.delta) / this.deltaY > 1.5) {
            this.judge = JUDGE_SLIDEING
            e.preventDefault()
            e.stopPropagation()
          } else {
            this.judge = JUDGE_SCROLLING
          }
          break
        case JUDGE_SCROLLING:
          break
        case JUDGE_SLIDEING:
          this.translateX = this.startTranslateX + this.delta
          break
        default:
          break
      }
    },
    _onTouchEnd(e) {
      this.dragging = false
      if (this.judge === JUDGE_SLIDEING) {
        var isQuickAction = new Date().getTime() - this.startTime < 1000
        if (this.delta < -100 || (isQuickAction && this.delta < -15 && this.deltaY / this.delta > -6)) {
          this.next()
        } else if (this.delta > 100 || (isQuickAction && this.delta > 15 && this.deltaY / this.delta < 6)) {
          this.prev()
        } else {
          this._revert()
        }
      }
      this.judge = JUDGE_INITIAL
      document.removeEventListener('touchmove', this._onTouchMove)
      document.removeEventListener('touchend', this._onTouchEnd)
    },
    _revert() {
      this.setPage(this.currentPage)
    },
    _getTouchPos(e) {
      var key = 'pageX'
      return e.changedTouches ? e.changedTouches[0][key] : e[key]
    },
    _getTouchYPos(e) {
      var key = 'pageY'
      return e.changedTouches ? e.changedTouches[0][key] : e[key]
    },
    _onTransitionStart() {
      this.transitioning = true
      if (this._isPageChanged()) {
        this.$emit('tab-change-start', this.currentPage)
      } else {
        this.$emit('tab-revert-start', this.currentPage)
      }
    },
    _onTransitionEnd(e) {
      e.stopPropagation()
      if (e.target.className !== 'tabswiper-wrap') return
      this.transitioning = false
      if (this._isPageChanged()) {
        this.$emit('tab-change-end', this.currentPage)
      } else {
        this.$emit('tab-revert-end', this.currentPage)
      }
    },
    _isPageChanged() {
      return this.lastPage !== this.currentPage
    }
  }
}
</script>

<style type="text/css">
.tab-container{
  width: 100%;
}
.invisible{
  visibility:hidden;
}
.tabswiper {
  position: relative;
  overflow: hidden;
}
.tabswiper-wrap {
  display: flex;
  display: inline-flex;
  width: 100%;
  height: 100%;
  transition: all 0.2s ease;
  flex-direction: row;
}
.tabswiper-wrap.dragging{
  transition: none;
}
.tabswiper-wrap> .tab-container {
  overflow-x:hidden;
  flex-shrink: 0;
  width: 100%;
  margin: 0px;
  padding: 20px 15px;
  line-height: 25px;
  overflow: auto;
}

::-webkit-scrollbar
{
    width: 0px;
}
.mb15 {margin-bottom: 15px;}

.tab-only{
	background-color: #3a7de0;
}
.tabs-nav>.tab-item{
	display: inline-block;
	height: 36px;
	line-height: 36px;
	position: relative;
	text-align: center;
	cursor: pointer;
}
.tabs-green .tab-item{
	color: #999;
}
.tabs-blue .current{
	color: #fff;
	background-color: #3a7de0;
}
.tabs-green .current{
	color: #fff;
	background-color: #00c175;
}
.tabs-border-card>.tabs-header>.tabs-nav>.tab-item {
	width: 127px;
}
.tabs-border-card>.tabs-header>.tabs-nav>.current:after{
	content: '';
	width: 10px;
	height: 10px;
	position: absolute;
	top: 30px;
	left: 55px;
	z-index: 9;
	transform:rotate(45deg);
	-ms-transform:rotate(45deg); 	/* IE 9 */
	-moz-transform:rotate(45deg); 	/* Firefox */
	-webkit-transform:rotate(45deg); /* Safari 和 Chrome */
	-o-transform:rotate(45deg); 	/* Opera */
}
.tabs-border-card.tabs-blue>.tabs-header>.tabs-nav>.current:after{
	background-color: #3a7de0;
}
.tabs-border-card.tabs-green>.tabs-header>.tabs-nav>.current:after{
	background-color: #00c175;
}
.tabs-border-card>.tabs-header{
	background-color: #dedede;
}
.tabs-border-card>.tabs-header>.tabs-nav>.tab-item {
	color: #999;
}
.tabs>.tabs-header>.tabs-nav>.current{
	color: #fff;
}
.tabs-border-card>.tabs-content {
	border: 1px solid #dfdfdf;
	border-top: none;
  background-color: #fff;
}
.tabs-capsule>.tabs-header {
	text-align: center;
}
.tabs-capsule>.tabs-header>.tabs-nav {
	display: inline-block;
	border-radius: 4px;
}
.tabs-capsule>.tabs-header>.tabs-nav>.tab-item {
	width: 80px;
	height: 30px;
	line-height: 30px;
}
.tabs-capsule.tabs-blue>.tabs-header>.tabs-nav {
	border: 1px solid #3b8cff;
}
.tabs-capsule.tabs-green>.tabs-header>.tabs-nav {
	border: 1px solid #00c175;
}
.cont>li{
	display: none;
	padding: 10px 15px;
	height: 210px;
	line-height: 25px;
	overflow: auto;
}
.cont-height > li {
	height: 524px;
}

</style>
