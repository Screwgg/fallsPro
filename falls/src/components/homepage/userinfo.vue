<template>
  <div class="userinfo">
    <div class="baseinfo">
      <img :src="identity.url" class="identity">
      <p class="username">{{userinfo.username}}</p>
      <p class="base"><img src="@/assets/company.png" class="icon"><span>{{userinfo.company}}</span><span class="job">{{userinfo.job}}</span></p>
      <p class="base"><img src="@/assets/email.png" class="icon">{{userinfo.email}}</p>
    </div>
    <daily></daily>
  </div>
</template>

<script>
import Daily from '@/components/homepage/daily'
const USERTYPE = [
  {
    tip: '我是设计师',
    url: require('@/assets/designer.png')
  },
  {
    tip: '我是普通用户',
    url: require('@/assets/normal.png')
  },
  {
    tip: '我是企业用户',
    url: require('@/assets/enterprise.png')
  }
]
export default {
  name: 'userinfo',
  data () {
    return {
      userinfo: {
        username: '',
        email: '',
        company: '',
        job: ''
      },
      identity: ''
    }
  },
  components: { Daily },
  mounted () {
    this.initUserinfo()
  },
  methods: {
    async initUserinfo () {
      try {
        let response
        if (this.$route.query.userId) {
          response = await this.$axios.get('http://localhost:7001/getuserinfo?userId=' + this.$route.query.userId)
        } else {
          response = await this.$axios.get('http://localhost:7001/getuserinfo')
        }
        Object.keys(this.userinfo).forEach(item => {
          this.userinfo[item] = response.data.data[item]
        })
        this.identity = Object.assign({}, USERTYPE[response.data.data.usertype])
      } catch (e) {
        this.$message.error(e.data.message)
      }
    }
  }
}
</script>

<style lang="sass" scoped>
  .userinfo
    margin: 0 20px

    .baseinfo
      margin: 10px 0 40px
      text-align: center

      .identity
        width: 100px
        height: 100px

      .username
        margin: 4px 0 16px
        font-size: 36px
        font-weight: 900

      .icon
        width: 16px
        height: 16px
        padding: 0 8px
        vertical-align: -3px

      .base
        margin: 4px 0
        font-size: 14px
        font-weight: 600
        color: #606266

        .job
          margin-left: 10px
</style>
