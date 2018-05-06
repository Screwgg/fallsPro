<template>
  <div class="qa">
    <div class="banner-wrap">
      <div class="banner">
        <img src="@/assets/qa.gif">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>提问</span>
            <el-button class="button" type="text" @click="shotQa" :disabled="!qaFull">发送</el-button>
          </div>
          <div>
            <el-form :model="qa" :rules="qaRules" inline-message status-icon label-width="90px" ref="qa">
              <el-form-item label="标题">
                <el-input v-model="qa.title" placeholder="请输入标题" class="qaform"></el-input>
              </el-form-item>
              <el-form-item label="描述">
                <el-input v-model="qa.des" placeholder="请输入描述" type="textarea" :rows="10" class="qaform"></el-input>
              </el-form-item>
              <el-form-item label="邀请" prop="inviteName">
                <el-input v-model="qa.inviteName" placeholder="请输入邀请的设计师名" class="qaform qaform-short">
                  <template slot="prepend">@</template>
                </el-input>
              </el-form-item>
              <el-form-item label="问题价值(¥)">
                <el-input-number v-model="qa.worth" :step="10" class="qaform qaform-tiny"></el-input-number>
              </el-form-item>
              <el-form-item label="围观金额(¥)">
                <el-input-number v-model="qa.onlooker" :step="1" class="qaform qaform-tiny"></el-input-number>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </div>
    </div>

    <div class="qalist">
      <div class="title">
        <div class="head">问答列表</div>
        <div class="line"><span></span></div>
      </div>
      <qa-list :faqList="faqList.inviteList" type="invite" v-on:refresh="initFaq" base="show"></qa-list>
    </div>
  </div>
</template>

<script>
import QaList from '@/components/homepage/faq-list'
export default {
  name: 'qa',
  components: { QaList },
  data () {
    let validateInvite = async (rule, value, callback) => {
      try {
        if (value === '') {
          callback(new Error('请输入邀请的设计师名'))
        } else {
          let response = await this.$axios.post('http://localhost:7001/checkinvite', { value: value })
          if (response.data.status === 'error') {
            callback(new Error(response.data.message))
          }
          this.qa.invite = response.data.data
        }
      } catch (e) {
        this.$message.error(e.message)
      }
    }
    return {
      qa: {
        title: '',
        des: '',
        invite: '',
        inviteName: '',
        worth: 0,
        onlooker: 0
      },
      qaRules: {
        inviteName: [
          { required: true, message: '请输入邀请的设计师名', trigger: 'blur' },
          { validator: validateInvite, trigger: 'blur' }
        ]
      },
      faqList: {
        askList: [],
        inviteList: [],
        onlookList: []
      }
    }
  },
  computed: {
    qaFull () {
      return Object.keys(this.qa).every(item => this.qa[item])
    }
  },
  mounted () {
    this.initFaq()
  },
  methods: {
    async shotQa () {
      try {
        const { inviteName, ...qaModel } = this.qa
        let response = await this.$axios.post('http://localhost:7001/createqa', qaModel)
        if (response.data.status === 'error') {
          throw response
        }
      } catch (e) {
        this.$message.error(e.data.message)
      }
      this.clearQa()
    },
    clearQa () {
      this.qa = Object.assign({}, {
        title: '',
        des: '',
        invite: '',
        inviteName: '',
        worth: 0,
        onlooker: 0
      })
      this.$refs.qa.resetFields()
    },
    async initFaq () {
      try {
        let response = await this.$axios.get('http://localhost:7001/findallqa')
        if (response.data.status === 'error') {
          throw response
        }
        this.faqList = Object.assign({}, response.data.data)
      } catch (e) {
        this.$message.error(e.data.message)
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.qa
  .banner-wrap
    .banner
      padding: 20px
      display: flex
      justify-content: center
      align-items: center

      img
        width: 500px
        margin-right: 20px

      .box-card
        width: 600px
        .clearfix
          &:before,
          &:after
            display: table
            content: ""

          &:after
            clear: both

          .button
            float: right
            padding: 3px 0

        .qaform
          width: 90%
          margin-bottom: 10px

        .qaform-short
          width: 60%

        .qaform-tiny
          width: 45%

  .qalist
    padding: 30px

    .title
      text-align: center

      .head
        padding: 6px 0
        font-size: 30px
        font-weight: 800

      .line
        span
          width: 2%
          margin: 20px 0
          display: inline-block
          border-bottom: #bb0f24 4px solid
</style>

<style lang="sass">
.qa
  .el-form-item__label
    margin-right: 30px
    font-weight: 600

  .el-input-number
    margin-right: 20px
</style>
