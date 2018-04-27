<template>
  <div class="detail">
    <div class="mainbody" v-if="isReleaseDetail">
      <div class="detail-title">{{detail.title}}</div>
      <div class="line"></div>
      <div class="detail-info">
        {{detail.type}} |
        <span @click="jumpUserinfo(detail.userId._id)" class="author">{{detail.userId.username}}</span>
         | {{detail.createdAt}}
      </div>
      <div v-html="detail.content" class="detail-content"></div>
    </div>

    <div class="mainbody" v-else>
      <div class="detail-title">{{outdetail.theme}}</div>
      <div class="line"></div>
      <div class="detail-info">
        <p @click="jumpUserinfo(outdetail.userId._id)" class="author">发布人：{{outdetail.userId.username}}</p>
        <p>发布公司：{{outdetail.userId.company}}</p>
        <p>联系邮箱：{{outdetail.userId.email}}</p>
        <p>私单酬金：¥ {{outdetail.bonus}}</p>
        <p>截止时间：{{outdetail.deadline}}</p>
      </div>
      <p class="detail-content">需求描述：{{outdetail.demand}}</p>
    </div>

    <comment v-if="isReleaseDetail"></comment>
  </div>
</template>

<script>
import moment from 'moment'
import Comment from '@/components/homepage/comment'

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
  components: { Comment },
  data () {
    return {
      detail: {
        title: '',
        type: '',
        createdAt: '',
        userId: {
          username: '',
          _id: ''
        }
      },
      outdetail: {
        theme: '',
        demand: '',
        deadline: '',
        userId: {
          username: '',
          company: '',
          email: ''
        }
      }
    }
  },
  mounted () {
    this.initDetail()
  },
  computed: {
    isReleaseDetail () {
      return this.$route.path === '/detail'
    }
  },
  methods: {
    async initDetail () {
      try {
        if (this.isReleaseDetail) {
          let response = await this.$axios.get('http://localhost:7001/getreleasedetail?_id=' + this.$route.query._id)
          if (response.data.status === 'error') {
            throw response
          }
          this.detail = Object.assign({}, response.data.data)
          this.detail.createdAt = moment(this.detail.createdAt).format('YYYY-MM-DD')
          this.detail.type = this.detail.type.split(',').map(item => detailType[item]).join(' ')
        } else {
          let response = await this.$axios.get('http://localhost:7001/getoutsourcingdetail?_id=' + this.$route.query._id)
          if (response.data.status === 'error') {
            throw response
          }
          this.outdetail = Object.assign({}, response.data.data)
          this.outdetail.deadline = JSON.parse(this.outdetail.deadline).map(item => {
            return moment(item).format('YYYY-MM-DD')
          }).join(' ~ ')
        }
      } catch (e) {
        this.$message.error(e.data.message)
      }
    },
    jumpUserinfo (_id) {
      this.$router.push('/homepage?userId=' + _id)
    }
  }
}
</script>

<style lang="sass" scoped>
  .detail
    width: 70%
    margin: 0 auto

    .mainbody
      margin: 20px 0 80px

      .detail-title
        font-size: 40px
        font-weight: 800

      .line
        width: 32px
        margin: 8px 0
        border-bottom: 4px solid #bb0f24

      .detail-info
        line-height: 40px
        font-weight: 600
        color: #606266

        .author
          cursor: pointer
          &:hover
            color: #bb0f24

        p
          font-weight: 500
          margin: 0

      .detail-content
        /deep/ img
          width: 100%
</style>
