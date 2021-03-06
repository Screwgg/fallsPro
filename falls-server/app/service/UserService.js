module.exports = app => {
  const crypto = require('crypto')

  class UserService extends app.Service {
    async find (params) {
      try {
        const { username, password } = params
        const user = await app.model.User.findOne({username: username})
        if (!user) {
          throw new Error('账号不存在，请注册')
        }

        const passwordMatched = await user.comparePassword(password)
        if (!passwordMatched) {
          throw new Error('密码错误，请重试')
        }

        const session = await app.model.UserLogin.findOne({ userId: user._id, valid: true })
        if (session) {
          session.valid = false
          await session.save()
        }

        const buf = crypto.randomBytes(32).toString('hex')
        await app.model.UserLogin.create({ userId: user._id, session: buf })

        return {
          data: { 
            token: buf,
            usertype: user.usertype
          },
          status: 'success',
          message: '登录成功'
        }
      } catch (e) {
        return {
          data: null,
          status: 'error',
          message: e.message
        }
      }
    }
    async unique (params) {
      try {
        const { type, value } = params
        if (type === 'username') {
          const existUser = await app.model.User.findOne({username: value})
          if (existUser) {
            throw new Error('用户名已存在')
          }
        }
        if (type === 'email') {
          const existEmail = await app.model.User.findOne({email: value})
          if (existEmail) {
            throw new Error('邮箱已注册')
          }
        }
        return {
          status: 'success',
          message: '用户名或邮箱唯一'
        }
      } catch (e) {
        return {
          status: 'error',
          message: e.message
        }
      }
    }
    async create (params) {
      try {
        const user = new app.model.User(params)
        await user.save()
        return {
          status: 'success',
          message: '注册成功'
        }
      } catch (e) {
        return {
          status: 'error',
          message: '注册失败'
        }
      }
    }
    async update (params, token) {
      try {
        const session = await app.model.UserLogin.findOne({ session: token, valid: true })
        if (!session) {
          throw new Error('请重新登录')
        }
        const userInfo = await app.model.User.findOne({ _id: session.userId })
        if (userInfo) {
          userInfo.company = params.company
          userInfo.job = params.job
          if (params.password) {
            userInfo.password = params.password
          }
          await userInfo.save()
          return {
            data: userInfo,
            status: 'success',
            message: '修改成功'
          }
        } else {
          throw new Error('账号未注册')
        }
      } catch (e) {
        return {
          status: 'error',
          message: e.message
        }
      }
    }
    async logout (token) {
      try {
        const session = await app.model.UserLogin.findOne({ session: token, valid: true })
        if (!session) {
          throw new Error('账号未登录')
        }
        session.valid = false
        await session.save()

        return {
          status: 'success',
          message: '退出登录成功'
        }
      } catch (e) {
        return {
          data: null,
          status: 'error',
          message: '退出登录失败'
        }
      }
    }
    async getInfo (userId, token) {
      try {
        if (!userId && token) {
          const session = await app.model.UserLogin.findOne({ session: token, valid: true })
          if (!session) {
            throw new Error('请重新登录')
          }
          userId = session.userId
        }
        const userInfo = await app.model.User.findOne({ _id: userId })
        if (!userInfo) {
          throw new Error('账号未注册')
        }
        return {
          data: userInfo,
          status: 'success',
          message: ''
        }
      } catch (e) {
        return {
          data: null,
          status: 'error',
          message: e.message
        }
      }
    }
    async getPage (username) {
      try {
        const user = await app.model.User.findOne({ username: username })
        if (!user) {
          throw new Error('未搜索到相关用户')
        }
        return {
          data: user._id,
          status: 'success'
        }
      } catch (e) {
        return {
          status: 'error',
          message: e.message
        }
      }
    }
  }
  return UserService
}

