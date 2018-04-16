<template>
  <div class="detail">
    <div class="mainbody">
      <div class="detail-title">{{detail.title}}</div>
      <div class="line"></div>
      <div class="detail-info">{{detail.type}} | {{author}} | {{detail.createdAt}}</div>
      <div v-html="detail.content" class="detail-content"></div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

const detailType = {
  UI: 'UI设计',
  INTERACTION: '交互设计',
  GRAPHIC: '平面设计',
  PHOTOGRAPHY: '摄影',
  ILLUSTRATION: '插画',
  MOTION: '动效设计',
  ARCHITECTURE: '建筑',
  PRODUCT: '产品设计',
  FASHION: '时尚',
  ADVERTISING: '广告设计',
  FINEARTS: '美术',
  CRAFTS: '工艺品',
  GANE: '游戏设计',
  SOUND: '音效'
}

export default {
  name: 'detail',
  data () {
    return {
      detail: {},
      author: ''
    }
  },
  mounted () {
    this.initDetail()
  },
  methods: {
    async initDetail () {
      try {
        let response = await this.$axios.get('http://localhost:7001/getreleasedetail?_id=' + this.$route.query._id)
        this.detail = response.data.data
        this.detail.createdAt = moment(this.detail.createdAt).format('YYYY-MM-DD')
        this.detail.type = this.detail.type.split(',').map(item => detailType[item]).join(' ')
        let author = await this.$axios.get('http://localhost:7001/getuserinfo?userId=' + this.detail.userId)
        this.author = author.data.data.username
      } catch (e) {
        this.$message.error(e.data.message)
      }
    }
  }
}
</script>

<style lang="sass" scoped>
  .detail
    .mainbody
      width: 70%
      margin: 0 auto

      .detail-title
        font-size: 40px
        font-weight: 800

      .line
        width: 32px
        margin: 8px 0
        border-bottom: 4px solid #bb0f24

      .detail-info
        line-height: 40px

      .detail-content
        /deep/ img
          width: 100%
</style>
