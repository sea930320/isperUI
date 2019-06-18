<template>
  <nav class="page-nav">
		<ul class="pagination">
			<li track-by="$index" v-for="unit in units" :class="'page-item ' + unit.class" :disabled="unit.disabled">
				<a @click.prevent="setPage(unit.page)" class="page-link" href="setUrl(unit)" :aria-label="unit.ariaLabel">
					<span v-if="unit.isPager" aria-hidden="true" v-html="unit.html"></span>
					<span v-else v-html="unit.html"></span>
					<span v-if="unit.isPager" class="sr-only" v-html="unit.srHtml"></span>
				</a>
			</li>
		</ul>
	</nav>
</template>
<script >
export default {
  props: {
		page: {
      type: Number,
      default: 1
    },
		total: {
      type: Number,
      default: 0
    },
		pageSize: {
      type: Number,
      default: 10
    },
		eventName: {
      type: String,
      default: 'page-change'
    },
		pageHandler: Function
	},
  data() {
    return {
      maxLink: 5,
  		prevHtml: '«',
  		nextHtml: '»',
  		prevSrHtml: '',
  		nextSrHtml: '',
  		dotsHtml: '...'
    }
  },
  methods: {
			setPage(page) {
				if (page === this.page) return false
				if (this.pageHandler) this.pageHandler(page)
				else if (this.$dispatch) this.$dispatch(this.eventName || zPagenav.default.eventName, page)
			},
			setUrl(unit) {
				return this.createUrl ? this.createUrl(unit) : (unit.page > 1 ? '#page=' + unit.page : '')
			},
      // 分页url
      createUrl(unit) {
        return unit.page > 1 ? '#page=' + unit.page : '#'
      }
		},
		computed: {
			units: function() {
				// let option = zPagenav.default
        // let option = this.data
				let th = this
				let page = th.page
				let pageSize = th.pageSize
				let total = th.total
				let maxLink = th.maxLink > 5 ? th.maxLink : 5

				let linksCount = Math.ceil(total / pageSize)

				if (page > linksCount) page = linksCount + 0

				let hasPrev = page > 1
				let hasNext = page < linksCount
				let realMaxLink = maxLink > linksCount ? linksCount : maxLink
				// let len1, len2, len3, shouldInsertDots12, shouldInsertDots23
				// let len2Start, len3Start

				let units = []
				let arr = computeLens()

				units.push({
					class: hasPrev ? '' : 'disabled',
          page: hasPrev ? page - 1 : page,
					isPager: true,
					isPrev: true,
					isNext: false,
					html: th.prevHtml,
					srHtml: th.prevSrHtml,
					ariaLabel: th.prevSrHtml
				})

				let dotUnit = {
					class: 'disabled',
					page: page,
					isPager: false,
					isPrev: false,
					isNext: true,
					html: th.dotsHtml
				}

				for (let i = 0, len = arr.length; i < len; i++) {
					pushUnit(arr[i])
				}

				units.push({
					class: hasNext ? '' : 'disabled',
					page: hasNext ? page + 1 : page,
					isPager: true,
					isPrev: false,
					isNext: true,
					html: th.nextHtml,
					srHtml: th.nextSrHtml,
					ariaLabel: th.nextSrHtml
				})

				function pushUnit(i) {
					if (typeof i === 'number') {
						units.push({
							page: i,
							isPrev: false,
							isPager: false,
							disabled: false,
							class: i === page ? 'active' : '',
							isNext: false,
							html: i
						})
					} else units.push(dotUnit)
				}

				function computeLens() {
					let a4 = Math.floor((realMaxLink - 2) / 2)
					let a5 = realMaxLink - 3 - a4
					let s2 = page - a4
					let s3 = page + a5
					if (s2 < 2) {
						s2 = 2
					} else if (s3 > linksCount) {
						s2 = linksCount - (realMaxLink - 2)
					}
					let arr = [1]
					if (s2 > 2) arr.push('dot')
					let it
					for (let i = 0, len = realMaxLink - 2 < 1 ? realMaxLink - 1 : realMaxLink - 2; i < len; i++) {
						it = i + s2
						arr.push(it)
					}
					if (it < linksCount - 1) arr.push('dot')
					if (it < linksCount) arr.push(linksCount)
					return arr
				}

				return units
				// end unit
			}
		}
}
</script>
<style>
.page-nav{
	width: 100%;
	text-align: center;
	padding: 10px 0;
}
.pagination {
	display: inline-block;
	padding-left: 0;
	border-radius: 4px;
}
.pagination>li {
	display: inline;
}
.pagination>li>a {
	position: relative;
	float: left;
	padding: 6px 12px;
	line-height: 1.42857143;
	text-decoration: none;
	color: #494949;
	background-color: #fff;
	border: 1px solid #ddd;
	margin-left: -1px;
}
.pagination>li:first-child>a {
	border-bottom-left-radius: 4px;
	border-top-left-radius: 4px;
}
.pagination>li:last-child>a {
	border-bottom-right-radius: 4px;
	border-top-right-radius: 4px;
}
.pagination>.active>a {
	z-index: 2;
	color: #fff;
	background-color: #00c175;
	border-color: #00c175;
	cursor: default;
}
</style>
