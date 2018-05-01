<template>
  <div class="comment">
    <p class="comment-title">
      {{isReleaseDetail ? `评论（${commentList.length}）` : `投稿（${contributorList.length}）`}}
    </p>
    <div class="comment-area" v-if="!isEnterpriseUser">
      <!-- 已登陆 -->
      <div class="send" v-if="isLogin">
        <!-- 评论 -->
        <div v-if="isReleaseDetail">
          <div class="reward-area">
            <el-checkbox v-model="pick">
              打赏作者<span class="cny">¥</span>
            </el-checkbox>
            <el-input-number
              v-model="comment.reward"
              :min="1"
              :max="20"
              size="small"
              label="请输入打赏金额"
              class="reward">
            </el-input-number>
          </div>
          <el-input
            type="textarea"
            :autosize="{ minRows: 6 }"
            placeholder="说一些什么......"
            v-model="comment.content">
          </el-input>
          <div class="btn">
            <el-button
              type="primary"
              :disabled="!comment.content"
              @click="shotComment">
              发表评论
            </el-button>
          </div>
        </div>

        <!-- 投稿 -->
        <div v-else>
          <div class="picture-wall" v-if="!isFinish">
            <el-form label-width="100px">
              <el-form-item label="上传投稿作品">
                <upload-wall
                  type="wall"
                  v-on:getAvatar="getAvatar"
                  v-on:removeAvatar="removeAvatar">
                </upload-wall>
              </el-form-item>
              <el-form-item label="添加作品描述(可选)">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 6 }"
                  placeholder="说一些什么......"
                  v-model="contributor.description">
                </el-input>
              </el-form-item>
            </el-form>
            <div class="btn">
              <el-button
                type="primary"
                :disabled="!contributor.wall.length"
                @click="shotContribute">
                发布投稿
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 未登录 -->
      <div class="unlogin-tip" v-else>
        <img src="@/assets/comment.png" class="comment-pic">
        <p class="comment-tip">登录后才可以加入{{isReleaseDetail ? '评论' : '投稿'}}噢_(:з」∠)_</p>
      </div>
    </div>

    <!-- 评论列表 -->
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

    <!-- 投稿列表 待接单 -->
    <div class="contributor-list" v-if="!isFinish">
      <el-card
        :body-style="{ padding: '20px' }"
        v-for="(item, index) in contributorList"
        :key="index">
        <div>
          <img :src="subitem" v-for="(subitem, subindex) in item.wall" :key="subindex">
        </div>
        <div class="description">
          <span>{{item.description}}</span>
          <div class="bottom clearfix">
            <time class="username">
              {{item.userId.username}} {{item.userId.job}}
            </time>
            <el-radio
              v-model="checked"
              v-if="isConAuthor"
              :label="item._id"
              border
              size="small"
              class="check">选中</el-radio>
          </div>
        </div>
      </el-card>
      <div v-if="isConAuthor" class="confirm-btn">
        <el-button
          type="primary"
          class="confirm"
          :disabled="!checked"
          @click="confirmCheckDialog = true">
          确认选择
        </el-button>
        <el-dialog
          title="确认选择"
          :visible.sync="confirmCheckDialog"
          width="30%"
          center>
          <span>支付酬金</span>
          <img src="@/assets/QRcode.jpeg">
          <span slot="footer" class="dialog-footer">
            <el-button @click="confirmCheckDialog = false">取 消</el-button>
            <el-button type="primary" @click="confirmPay">确 定 支 付</el-button>
          </span>
        </el-dialog>
      </div>
    </div>

    <!-- 比稿结果 已截单 -->
    <div class="filter-result contributor-list" v-else>
      <p>比稿结果</p>
      <el-card :body-style="{ padding: '20px' }">
        <div>
          <img :src="subitem" v-for="(subitem, subindex) in filterResult.contributor.wall" :key="subindex">
        </div>
        <div class="description">
          <span>{{filterResult.contributor.description}}</span>
          <div class="bottom">
            <time class="username">
              {{filterResult.contributor.userId.username}} {{filterResult.contributor.userId.job}}
            </time>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import Cookie from 'js-cookie'
import moment from 'moment'
import UploadWall from '@/components/homepage/upload-wall'

const USERTYPE = [
  require('@/assets/designer.png'),
  require('@/assets/normal.png'),
  require('@/assets/enterprise.png')
]

export default {
  name: 'comment',
  props: ['isReleaseDetail', 'isFinish'],
  components: { UploadWall },
  data () {
    return {
      pick: '',
      comment: {
        content: '',
        reward: 0
      },
      commentList: [],
      contributor: {
        wall: [],
        description: ''
      },
      contributorList: [],
      checked: '',
      isConAuthor: false,
      confirmCheckDialog: false,
      filterResult: {
        outsourcing: {},
        contributor: {
          userId: {}
        }
      }
    }
  },
  mounted () {
    this.initComment()
  },
  computed: {
    isLogin () {
      return Cookie.get('token')
    },
    isEnterpriseUser () {
      return Cookie.get('usertype') === '2'
    }
  },
  methods: {
    async initComment () {
      try {
        let response
        if (this.isReleaseDetail) {
          response = await this.$axios.get('http://localhost:7001/findcomment?releaseId=' + this.$route.query._id)
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
        } else {
          response = await this.$axios.get('http://localhost:7001/findcontributor?outsourcingId=' + this.$route.query._id)
          if (response.data.status === 'error') {
            throw response
          }
          this.contributorList = response.data.data.map((item) => {
            return Object.assign({}, item)
          })
          this.contributorList.forEach(item => {
            item.wall = JSON.parse(item.wall)
          })
          let author = await this.$axios.get('http://localhost:7001/checkoutauthor?outsourcingId=' + this.$route.query._id)
          if (author.data.status === 'error') {
            throw author
          }
          this.isConAuthor = author.data.data
          if (this.isFinish) {
            this.initFilter()
          }
        }
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
    async shotContribute () {
      try {
        const contributorModel = {
          outsourcingId: this.$route.query._id,
          wall: JSON.stringify(this.contributor.wall),
          description: this.contributor.description
        }
        let response = await this.$axios.post('http://localhost:7001/createcontributor', contributorModel)
        if (response.data.status === 'error') {
          throw response
        }
        this.$message.success(response.data.message)
        this.initComment()
        this.$router.go(0)
      } catch (e) {
        this.$message.error(e.data.message)
      }
      this.clearComment()
    },
    clearComment () {
      this.comment = Object.assign({}, { content: '', reward: 0 })
      this.pick = ''
      this.contributor = Object.assign({}, { wall: [], description: '' })
    },
    getAvatar (avatar) {
      this.contributor.wall.push(avatar)
    },
    removeAvatar (avatar) {
      let pos = this.contributor.wall.indexOf(avatar)
      if (pos > -1) {
        this.contributor.wall.splice(pos, 1)
      }
    },
    async confirmPay () {
      this.confirmCheckDialog = false
      try {
        const filterModel = {
          outsourcingId: this.$route.query._id,
          contributorId: this.checked
        }
        let response = await this.$axios.post('http://localhost:7001/createfilter', filterModel)
        if (response.data.status === 'error') {
          throw response
        }
        this.$router.go(0)
      } catch (e) {
        this.$message.error(e.data.message)
      }
    },
    async initFilter () {
      try {
        let response = await this.$axios.get('http://localhost:7001/findfilter?outsourcingId=' + this.$route.query._id)
        if (response.data.status === 'error') {
          throw response
        }
        this.filterResult = Object.assign({}, response.data.data)
        this.filterResult.contributor.wall = JSON.parse(this.filterResult.contributor.wall)
      } catch (e) {
        this.$message.error(e.data.message)
      }
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

  .contributor-list
    padding: 30px 50px

    img
      width: 30%
      padding: 10px

    .description
      padding: 10px

      .username
        font-size: 13px
        color: #999

      .bottom
        margin-top: 13px
        line-height: 12px

      .check
        float: right

      .clearfix
        &:before,
        &:after
          display: table
          content: ""

        &:after
          clear: both

    .confirm-btn
      padding: 10px 0
</style>

<style lang="sass">
.picture-wall
  .el-form-item__content
    margin-left: 130px !important

.contributor-list
  .confirm-btn
    .el-button.confirm
      width: 100%

    .el-dialog--center .el-dialog__body
      padding: 50px 82px
      text-align: center

      span
        display: block
        font-weight: 600
        font-size: 16px

      img
        display: block
        width: 200px
</style>
