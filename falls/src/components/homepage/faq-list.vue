<template>
  <div class="faq-list">
    <el-row>
      <el-col :span="span" v-for="(item, index) in faqList" :key="index">
        <el-card>
          <p class="title">{{item.title}}</p>
          <p v-if="type === 'invite'">描述：{{item.des}}</p>
          <p @click="jumpUserinfo(item.invite._id)">
            受邀者：<span class="user">{{item.invite.username}}</span>
          </p>
          <p @click="jumpUserinfo(item.userId._id)">
            邀请者：<span class="user">{{item.userId.username}}</span>
          </p>
          <p>问题价值：¥{{item.worth}}</p>
          <p>围观金额：¥{{item.onlooker}}</p>
          <el-tag type="success" v-if="!item.answer">待回答</el-tag>
          <el-tag type="warning" v-else>已回答</el-tag>
          <el-button
            type="text"
            size="small"
            v-if="type === 'invite' && !item.answer && base === 'homepage'"
            @click="addAnswer(item._id)"
            class="answer">
            添加回答
          </el-button>
          <el-button
            type="text"
            size="small"
            v-if="type === 'invite' && item.answer && base === 'show'"
            @click="payAnswer(item._id)"
            class="answer">
            付费围观问题答案
          </el-button>
          <el-button
            type="text"
            size="small"
            v-if="type === 'invite' && base === 'show'"
            class="answer">
            加入讨论
          </el-button>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      title="添加回答"
      :visible.sync="answerFormVisible">
      <el-input v-model="answer" placeholder="请输入回答" type="textarea" :rows="10"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clearAnswer">取 消</el-button>
        <el-button type="primary" @click="shotAnswer">发 送</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="付费围观问题答案"
      :visible.sync="payVisible"
      width="30%"
      center>
      <img src="@/assets/QRcode.jpeg">
      <span slot="footer" class="dialog-footer">
        <el-button @click="payVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmPay">确 定 支 付</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'faq-list',
  props: ['faqList', 'type', 'base'],
  data () {
    return {
      answerFormVisible: false,
      answer: '',
      qaId: '',
      payVisible: false,
      payId: ''
    }
  },
  computed: {
    span () {
      if (this.type === 'invite') {
        return 24
      } else {
        return 8
      }
    }
  },
  methods: {
    jumpUserinfo (_id) {
      this.$router.push('/homepage?userId=' + _id)
    },
    addAnswer (_id) {
      this.qaId = _id
      this.answerFormVisible = true
    },
    async shotAnswer () {
      try {
        const answerModel = {
          _id: this.qaId,
          answer: this.answer
        }
        let response = await this.$axios.post('http://localhost:7001/createanswer', answerModel)
        if (response.data.status === 'error') {
          throw response
        }
        this.$emit('refresh')
        this.$message.success(response.data.message)
      } catch (e) {
        this.$message.error(e.data.message)
      }
      this.clearAnswer()
    },
    clearAnswer () {
      this.qaId = ''
      this.answer = ''
      this.answerFormVisible = false
    },
    async payAnswer (_id) {
      try {
        this.payId = _id
        let response = await this.$axios.get('http://localhost:7001/findpay?_id=' + this.payId)
        if (response.data.status === 'error') {
          throw response
        }
        if (response.data.data === 'already') {
          this.$router.push('/answer?_id=' + this.payId)
        } else {
          this.payVisible = true
        }
      } catch (e) {
        this.$message.error(e.data.message)
      }
    },
    async confirmPay () {
      try {
        let response = await this.$axios.post('http://localhost:7001/payanswer', { _id: this.payId })
        if (response.data.status === 'error') {
          throw response
        }
        this.$router.push('/answer?_id=' + this.payId)
      } catch (e) {
        this.$message.error(e.data.message)
      }
      this.payId = ''
      this.payVisible = false
    }
  }
}
</script>

<style lang="sass" scoped>
.faq-list
  p
    font-size: 13px
    color: #999

  .title
    font-size: 16px
    font-weight: 600
    color: #333

  .user
    color: #bb0f24
    cursor: pointer

  .answer
    margin: 0 8px
</style>

<style lang="sass">
.faq-list
  .el-dialog--center .el-dialog__body
    padding: 50px 92px
    text-align: center

    span
      display: block
      font-weight: 600
      font-size: 16px

    img
      display: block
      width: 200px
</style>
