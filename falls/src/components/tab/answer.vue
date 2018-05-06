<template>
  <div class="answer">
    <p class="title">
      {{qaDetail.title}}
      <el-tag type="success" v-if="!qaDetail.answer">待回答</el-tag>
      <el-tag type="warning" v-else>已回答</el-tag>
    </p>
    <p>描述：{{qaDetail.des}}</p>
    <p @click="jumpUserinfo(qaDetail.invite._id)">
      受邀者：<span class="user">{{qaDetail.invite.username}}</span>
    </p>
    <p @click="jumpUserinfo(qaDetail.userId._id)">
      邀请者：<span class="user">{{qaDetail.userId.username}}</span>
    </p>
    <p>问题价值：¥{{qaDetail.worth}}</p>
    <p>围观金额：¥{{qaDetail.onlooker}}</p>
    <p class="answer-detail">详细回答：{{qaDetail.answer}}</p>
  </div>
</template>

<script>
export default {
  name: 'answer',
  data () {
    return {
      qaDetail: {
        invite: {},
        userId: {}
      }
    }
  },
  mounted () {
    this.initDetail()
  },
  methods: {
    async initDetail () {
      try {
        let response = await this.$axios.get('http://localhost:7001/getqadetail?_id=' + this.$route.query._id)
        if (response.data.status === 'error') {
          throw response
        }
        this.qaDetail = Object.assign({}, response.data.data)
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
.answer
  width: 70%
  margin: 0 auto

  p
    font-size: 16px
    color: #999

  .title
    font-size: 24px
    font-weight: 600
    color: #333

  .user
    color: #bb0f24
    cursor: pointer

  .answer-detail
    color: #333333
</style>
