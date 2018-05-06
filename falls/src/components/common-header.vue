<template>
  <div class="header">
    <div class="left">
      <img src="@/assets/logo.png" class="logo">
      <el-menu :default-active="activeIndex" class="menu" mode="horizontal" @select="selectMenu">
        <el-menu-item index="/">发现</el-menu-item>
        <el-menu-item index="/magazine">周刊</el-menu-item>
        <el-menu-item index="/qa">问答</el-menu-item>
        <el-menu-item index="/collect">摄影图库</el-menu-item>
        <el-menu-item index="/individual" v-if="!isNormalUser">私单</el-menu-item>
      </el-menu>
      <img src="@/assets/plane.png" @click="selectMenu('/release')" class="release">
    </div>

    <div class="right">
      <el-input
        placeholder="搜索设计师、作品、周刊"
        suffix-icon="el-icon-search"
        size="medium"
        v-model="searchContent"
        @focus="changeInSearch(true)"
        @blur="changeInSearch(false)"
        class="searchbox">
      </el-input>

      <div class="log-group" v-show="!isLogin">
        <span class="log signin" @click="signinDialog = true">立即登录</span>
        <span class="log signup" @click="signupDialog = true">注册</span>
      </div>

      <div class="log-group" v-show="isLogin">
        <el-dropdown @command="selectHomepage">
        <span class="el-dropdown-link">
          我的主页
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="daily">我的发布</el-dropdown-item>
            <el-dropdown-item command="faq">我的问答</el-dropdown-item>
            <el-dropdown-item command="photo">我的照片</el-dropdown-item>
            <el-dropdown-item command="service" v-if="!isNormalUser">我的私单</el-dropdown-item>
            <el-dropdown-item command="setting">设置</el-dropdown-item>
            <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <!--注册-->
      <el-dialog
        title="注册"
        :visible.sync="signupDialog"
        width="30%"
        @close="clearSignup"
        center>
        <el-form :model="signup" :rules="signupRules" status-icon label-width="120" ref="signup">
          <el-form-item label="我是" prop="usertype">
            <el-radio-group v-model="signup.usertype" size="medium">
              <el-radio-button :label="0">设计师</el-radio-button>
              <el-radio-button :label="1">普通用户</el-radio-button>
              <el-radio-button :label="2">企业用户</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="用户名" prop="username">
            <el-input v-model="signup.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="signup.password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPassword">
            <el-input type="password" v-model="signup.checkPassword"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="signup.email"></el-input>
          </el-form-item>
          <el-form-item label="公司" prop="company">
            <el-input v-model="signup.company"></el-input>
          </el-form-item>
          <el-form-item label="职位" prop="job">
            <el-input v-model="signup.job"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="clearSignup">取 消</el-button>
          <el-button type="primary" @click="confirmSignup">确 定</el-button>
        </span>
      </el-dialog>

      <!--登录-->
      <el-dialog
        title="登录"
        :visible.sync="signinDialog"
        width="30%"
        @close="clearSignin"
        center>
        <el-form :model="signin" label-width="120" ref="signin">
          <el-form-item label="用户名">
            <el-input v-model="signin.username"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input type="password" v-model="signin.password"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="clearSignin">取 消</el-button>
          <el-button type="primary" @click="confirmSignin" :disabled="!signinFull">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Cookie from 'js-cookie'
export default {
  name: 'commonHeader',
  data () {
    let validateUsername = async (rule, value, callback) => {
      try {
        if (value === '') {
          callback(new Error('请输入用户名'))
        } else {
          let response = await this.$axios.post('http://localhost:7001/uniqueuser', { type: 'username', value: value })
          if (response.data.status === 'error') {
            callback(new Error(response.data.message))
          }
        }
      } catch (e) {
        this.$message.error(e.message)
      }
    }
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.signup.checkPassword !== '') {
          this.$refs.signup.validateField('checkPassword')
        }
        callback()
      }
    }
    let validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.signup.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    let validateEmail = async (rule, value, callback) => {
      try {
        if (value === '') {
          callback(new Error('请输入邮箱'))
        } else if (!/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+\.){1,63}[a-z0-9]+$/.test(value)) {
          callback(new Error('请检查邮箱格式!'))
        } else {
          let response = await this.$axios.post('http://localhost:7001/uniqueuser', { type: 'email', value: value })
          if (response.data.status === 'error') {
            callback(new Error(response.data.message))
          }
        }
      } catch (e) {
        this.$message.error(e.message)
      }
    }
    return {
      searchContent: '',
      isLogin: false,
      isNormalUser: false,
      signupDialog: false,
      signinDialog: false,
      signup: {
        usertype: '',
        username: '',
        password: '',
        checkPassword: '',
        email: '',
        company: '',
        job: ''
      },
      signupRules: {
        usertype: [
          { required: true, message: '请选择身份', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 4, max: 8, message: '长度在 4 到 8 个字符', trigger: 'blur' },
          { validator: validateUsername, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPassword: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' },
          { validator: validatePassCheck, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        company: [
          { required: true, message: '请输入公司', trigger: 'blur' }
        ],
        job: ''
      },
      signin: {
        username: '',
        password: ''
      }
    }
  },
  computed: {
    signinFull () {
      return this.signin.username && this.signin.password
    },
    activeIndex () {
      return this.$route.path
    }
  },
  mounted () {
    let token = this.getCookie()
    if (token) {
      this.isLogin = true
    }
  },
  methods: {
    selectMenu (index) {
      if (!Cookie.get('token') && !['/', '/magazine'].includes(index)) {
        this.$router.push('/blank')
      } else {
        this.$router.push(index)
      }
    },
    getCookie () {
      const token = Cookie.get('token')
      this.isNormalUser = Cookie.get('usertype') === '1'
      if (token) {
        this.$axios.defaults.headers.common['X-TOKEN'] = token
      }
      return token
    },
    confirmSignup () {
      this.$refs.signup.validate(async (valid) => {
        if (valid) {
          let { checkPassword, ...signupModel } = this.signup
          try {
            let response = await this.$axios.post('http://localhost:7001/createuser', signupModel)
            if (response.data.status === 'error') {
              throw response
            }
            this.$message.success(response.data.message)
          } catch (e) {
            this.$message.error(e.data.message)
          }
          this.clearSignup()
        }
      })
    },
    clearSignup () {
      this.signupDialog = false
      this.$refs.signup.resetFields()
      Object.keys(this.signup).forEach(item => {
        this.signup[item] = ''
      })
    },
    async confirmSignin () {
      try {
        let response = await this.$axios.post('http://localhost:7001/finduser', this.signin)
        if (response.data.status === 'error') {
          throw response
        }
        Cookie.set('token', response.data.data.token, { expires: 3 })
        Cookie.set('usertype', response.data.data.usertype, { expires: 3 })
        this.getCookie()
        this.$message.success(response.data.message)
        this.isLogin = true
        if (this.$route.path === '/blank') {
          this.$router.push('/')
        } else {
          this.$router.go(0)
        }
      } catch (e) {
        this.$message.error(e.data.message)
      }
      this.clearSignin()
    },
    clearSignin () {
      this.signinDialog = false
      Object.keys(this.signin).forEach(item => {
        this.signin[item] = ''
      })
    },
    selectHomepage (command) {
      try {
        switch (command) {
          case 'daily':
            this.$router.push('/homepage/daily')
            break
          case 'faq':
            this.$router.push('/homepage/faq')
            break
          case 'photo':
            this.$router.push('/homepage/photo')
            break
          case 'service':
            this.$router.push('/homepage/service')
            break
          case 'setting':
            this.$router.push('/homepage/setting')
            break
          case 'logout':
            this.$confirm('确认退出登录？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(async () => {
              let token = this.getCookie()
              if (!token) {
                return
              }
              let response = await this.$axios.post('http://localhost:7001/logoutuser')
              if (response.data.status === 'error') {
                throw response
              }
              this.isLogin = false
              Cookie.remove('token')
              Cookie.remove('usertype')
              this.$axios.defaults.headers.common['X-TOKEN'] = ''
              this.isNormalUser = true
              this.$message.success(response.data.message)
              this.$router.go(0)
              if (!['/', '/magazine', '/detail'].includes(this.$route.path)) {
                this.$router.push('/blank')
              }
            }).catch(() => {})
            break
        }
      } catch (e) {
        this.$message.error(e.data.message)
      }
    },
    changeInSearch (value) {
      this.$emit('changeInSearch', value)
    }
  }
}
</script>

<style lang="sass" scoped>
  .header
    display: flex
    justify-content: space-between
    align-items: center
    font-weight: bold
    color: #909399

    .left
      min-width: 470px
      display: flex
      align-items: center

      .logo
        width: 40px
        height: 40px
        padding: 10px

      .menu
        min-width: 300px

      .release
        width: 26px
        height: 26px
        padding: 8px
        cursor: pointer

    .right
      display: flex
      align-items: center

      .searchbox
        margin-right: 10px

      .log-group
        width: 200px
        margin-right: 10px
        font-size: 14px

        .log
          padding: 4px
          cursor: pointer
</style>

<style lang="sass">
  .el-menu--horizontal
    border: none
    > .el-menu-item
      border-bottom: solid 1px #e6e6e6 !important
    > .el-menu-item.is-active
      border-bottom: solid 2px #bb0f24 !important
      color: #303133 !important

  .el-icon-search
    font-weight: bold
    color: #909399

  .el-icon-plus
    font-weight: bold
    color: #af3e3d

  .el-dropdown
    padding: 10px
</style>
