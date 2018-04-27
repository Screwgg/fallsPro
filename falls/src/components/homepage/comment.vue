<template>
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

      <div class="unlogin-tip" v-else>
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
</template>

<script>
import Cookie from 'js-cookie'
import moment from 'moment'

const USERTYPE = [
  require('@/assets/designer.png'),
  require('@/assets/normal.png'),
  require('@/assets/enterprise.png')
]

export default {
  name: 'comment',
  data () {
    return {
      pick: '',
      comment: {
        content: '',
        reward: 0
      },
      commentList: []
    }
  },
  mounted () {
    this.initComment()
  },
  computed: {
    isLogin () {
      return Cookie.get('token')
    }
  },
  methods: {
    async initComment () {
      try {
        let response = await this.$axios.get('http://localhost:7001/findcomment?releaseId=' + this.$route.query._id)
        if (response.data.status === 'error') {
          throw response
        }
        this.commentList = response.data.data.map((item) => {
          return Object.assign({}, item)
        })
        this.commentList.forEach(item => {
          item.createdAt = moment(item.createdAt).format('YYYY-MM-DD')
          item.userId.usertype = USERTYPE[item.userId.usertype]
          if (item.reward) {
            item.reward = item.reward.toLocaleString('zh', { style: 'currency', currency: 'CNY' })
          }
        })
      } catch (e) {
        this.$message.error(e.data.message)
      }
    },
    async shotComment () {
      try {
        if (!this.pick) {
          this.comment.reward = 0
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
      this.comment = Object.assign({}, { content: '', reward: 0 })
      this.pick = ''
    }
  }
}
</script>

<style lang="sass" scoped>
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
