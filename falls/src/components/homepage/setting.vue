<template>
  <div class="setting">
    <el-form ref="setting" :model="userinfo" :rules="settingRules" inline-message label-width="60px">
      <el-form-item label="用户名">
        <el-input v-model="userinfo.username" disabled class="release"></el-input>
        <el-tooltip class="item" effect="dark" :content="identity.tip" placement="right">
          <img :src="identity.url" class="identity">
        </el-tooltip>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <span class="passwd" @click="changePasswd = true" v-if="!changePasswd">修改密码</span>
        <el-input type="password" v-model="userinfo.password" placeholder="请输入新密码" class="release" v-if="changePasswd" @blur="hidePasswdbox"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="userinfo.email" disabled placeholder="请输入邮箱" class="release"></el-input>
      </el-form-item>
      <el-form-item label="公司" prop="company">
        <el-input v-model="userinfo.company" placeholder="请输入公司" class="release"></el-input>
      </el-form-item>
      <el-form-item label="职位">
        <el-input v-model="userinfo.job" placeholder="请输入职位" class="release"></el-input>
      </el-form-item>
    </el-form>
    <div class="btn-group">
      <el-button type="primary" @click="submit" class="btn">提交修改</el-button>
      <el-button class="btn">取消</el-button>
    </div>
  </div>
</template>

<script>
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
  name: 'setting',
  data () {
    return {
      userinfo: {
        username: '',
        password: '',
        email: '',
        company: '',
        job: ''
      },
      changePasswd: false,
      identity: {},
      settingRules: {
        password: [
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        company: [
          { required: true, message: '请输入公司', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.initUserinfo()
  },
  methods: {
    async initUserinfo () {
      try {
        let response = await this.$axios.get('http://localhost:7001/getuserinfo')
        Object.keys(this.userinfo).forEach(item => {
          this.userinfo[item] = response.data.data[item]
        })
        this.userinfo.password = ''
        this.identity = Object.assign({}, USERTYPE[response.data.data.usertype])
      } catch (e) {
        this.$message.error(e.data.message)
      }
    },
    hidePasswdbox () {
      if (!this.userinfo.password) {
        this.changePasswd = false
      }
    },
    submit () {
      this.$refs.setting.validate(async (valid) => {
        if (valid) {
          try {
            let response = await this.$axios.post('http://localhost:7001/updateuser', this.userinfo)
            if (response.data.status === 'error') {
              throw response
            }
            this.$message.success(response.data.message)
          } catch (e) {
            this.$message.error(e.data.message)
          }
        }
      })
    }
  }
}
</script>

<style lang="sass" scoped>
  .setting
    margin: 0 20px

    .release
      width: 30%

    .identity
      width: 20px
      height: 20px
      vertical-align: -4px
      margin-left: 6px

    .passwd
      margin-bottom: 10px
      line-height: 40px
      font-weight: 500
      color: #bb0f24
      cursor: pointer

    .btn-group
      margin-top: 50px
</style>

<style lang="sass">
  .el-form-item__label
    margin-right: 30px
    font-weight: 600
</style>
