<template>
  <div class="detail">
    <div class="mainbody">
      <div class="detail-title">{{detail.title}}</div>
      <div class="line"></div>
      <div class="detail-info">{{detail.type}} | <span @click="jumpUserinfo(detail.userId)" class="author">{{author}}</span> | {{detail.createdAt}}</div>
      <div v-html="detail.content" class="detail-content"></div>
    </div>

    <div class="comment">
      <p class="comment-title">评论（{{this.commentList.length}}）</p>
      <div class="comment-area">
        <div class="send" v-if="isLogin">
          <div class="reward-area">
            <el-checkbox v-model="pick">
              打赏作者<span class="cny">¥</span>
            </el-checkbox>
            <el-input-number v-model="comment.reward" :min="1" :max="20" size="small" label="请输入打赏金额" class="reward"></el-input-number>
          </div>
          <el-input
            type="textarea"
            :autosize="{ minRows: 6 }"
            placeholder="说一些什么......"
            v-model="comment.content">
          </el-input>
          <div class="btn">
            <el-button type="primary" :disabled="!comment.content" @click="shotComment">发表评论</el-button>
          </div>
        </div>

        <div class="unlogin-tip" v-if="!isLogin">
          <img src="@/assets/comment.png" class="comment-pic">
          <p class="comment-tip">登录后才可以加入讨论噢_(:з」∠)_</p>
        </div>
      </div>

      <div class="comment-list">
        <div class="comment-item" v-for="(item, index) in commentList" :key="index">
          <div>
            <img :src="item.userId.usertype">
          </div>
          <div>
            <p>
              <span @click="jumpUserinfo(item.userId._id)" class="comment-author">{{item.userId.username}}</span>
              <span class="date">{{item.createdAt}}</span>
              <span class="reward" v-if="item.reward">打赏 {{item.reward}}</span>
            </p>
            <p>{{item.content}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Cookie from 'js-cookie'

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

const USERTYPE = [
  require('@/assets/designer.png'),
  require('@/assets/normal.png'),
  require('@/assets/enterprise.png')
]

export default {
  name: 'detail',
  data () {
    return {
      detail: {},
      author: '',
      pick: '',
      comment: {
        content: '',
        reward: ''
      },
      commentList: []
    }
  },
  mounted () {
    this.initDetail()
    this.initComment()
  },
  computed: {
    isLogin () {
      return Cookie.get('token')
    }
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
    },
    async initComment () {
      try {
        let response = await this.$axios.get('http://localhost:7001/findcomment?releaseId=' + this.$route.query._id)
        if (response.data.status === 'error') {
          throw response
        }
        this.commentList = response.data.data.map((item) => {
          return Object.assign({}, item, item.userId)
        })
        this.commentList.forEach(item => {
          item.createdAt = moment(item.createdAt).format('YYYY-MM-DD')
          item.userId.usertype = USERTYPE[item.userId.usertype]
        })
      } catch (e) {
        this.$message.error(e.data.message)
      }
    },
    jumpUserinfo (_id) {
      this.$router.push('/homepage?userId=' + _id)
    },
    async shotComment () {
      try {
        if (!this.pick) {
          this.comment.reward = ''
        } else {
          this.comment.reward = this.comment.reward.toLocaleString('zh', { style: 'currency', currency: 'CNY' })
        }
        const commentModel = {
          releaseId: this.$route.query._id,
          ...this.comment
        }
        let response = await this.$axios.post('http://localhost:7001/createcomment', commentModel)
        if (response.data.status === 'error') {
          throw response
        }
        this.$message.success(response.data.message)
        this.initComment()
      } catch (e) {
        this.$message.error(e.data.message)
      }
      this.clearComment()
    },
    clearComment () {
      Object.keys(this.comment).forEach(item => {
        this.comment[item] = ''
      })
      this.pick = ''
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

      .detail-content
        /deep/ img
          width: 100%

    .comment
      .comment-title
        line-height: 30px
        font-size: 20px
        font-weight: 600

      .comment-area
        padding: 20px 0
        border-bottom: #e3e3e3 1px solid

        .send
          .reward-area
            margin-bottom: 24px

            .cny
              margin: 0 4px 0 16px

          .btn
            margin: 20px 0
            text-align: right

        .unlogin-tip
          text-align: center

          .comment-pic
            width: 50px

          .comment-tip
            color: #606266

      .comment-list
        .comment-item
          display: flex
          padding: 20px 30px

          .comment-author
            cursor: pointer
            &:hover
              color: #bb0f24

          img
            width: 40px
            margin-right: 24px
            padding: 10px
            border-radius: 50%
            box-shadow: 0 10px 20px #efefef

          p
            margin: 3px 0
            color: #3c3c3c
            font-size: 16px
            font-weight: bold

            .date
              color: #a9a9a9
              font-size: 11px
              font-weight: 500

              &::before
                content: '\2022'
                margin: 0 6px

            .reward
              padding: 0 12px
              color: #bb0f24
              font-size: 11px
              font-weight: 500

          p+p
            color: #484848
            font-size: 17px
            line-height: 24px
            font-weight: normal
</style>
