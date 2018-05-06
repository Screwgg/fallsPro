module.exports = app => {
  class QaService extends app.Service {
    async create(params, token) {
      try {
        const session = await app.model.UserLogin.findOne({ session: token, valid: true })
        if (!session) {
          throw new Error('请重新登录')
        }
        const qaModel = {
          userId: session.userId,
          ...params
        }
        await app.model.Qa.create(qaModel)
        return {
          status: 'success',
          message: '发布成功'
        }
      } catch (e) {
        return {
          status: 'error',
          message: e.message
        }
      }
    }
    async checkInvite(params, token) {
      try {
        const session = await app.model.UserLogin.findOne({ session: token, valid: true })
        if (!session) {
          throw new Error('请重新登录')
        }
        const user = await app.model.User.findOne({ username: params.value })
        if (!user) {
          throw new Error('未知用户')
        }
        if (user._id == session.userId) {
          throw new Error('请勿邀请自己')
        }
        if (user.usertype !== 0) {
          throw new Error('只能邀请设计师')
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
    async find(token) {
      try {
        const session = await app.model.UserLogin.findOne({ session: token, valid: true })
        if (!session) {
          throw new Error('请重新登录')
        }
        const askList = await app.model.Qa.find({ userId: session.userId }).populate('invite userId', 'username')
        const inviteList = await app.model.Qa.find({ invite: session.userId }).populate('userId invite', 'username')
        return {
          data: {
            askList: askList,
            inviteList: inviteList,
            onlookList: []
          },
          status: 'success'
        }
      } catch (e) {
        return {
          status: 'error',
          message: e.message
        }
      }
    }
    async findAll() {
      try {
        const askList = await app.model.Qa.find().populate('invite userId', 'username')
        const inviteList = await app.model.Qa.find().populate('userId invite', 'username')
        return {
          data: {
            askList: askList,
            inviteList: inviteList,
            onlookList: []
          },
          status: 'success'
        }
      } catch (e) {
        return {
          status: 'error',
          message: e.message
        }
      }
    }
    async getQaDetail(qaId) {
      try {
        const qa = await app.model.Qa.findOne({_id: qaId}).populate('invite userId', 'username')
        return {
          data: qa,
          status: 'success'
        }
      } catch (e) {
        return {
          status: 'error',
          message: e.message
        }
      }
    }
    async update(params, token) {
      try {
        const session = await app.model.UserLogin.findOne({ session: token, valid: true })
        if (!session) {
          throw new Error('请重新登录')
        }
        const qa = await app.model.Qa.findOne({ _id: params._id })
        if (!qa) {
          throw new Error('该提问不存在')
        }
        if (qa.invite != session.userId) {
          throw new Error('您不是该问题受邀人')
        }
        if (qa.answer) {
          throw new Error('您已回答过该问题')
        } else {
          qa.answer = params.answer
          await qa.save()
        }
        return {
          status: 'success',
          message: '回答成功'
        }
      } catch (e) {
        return {
          status: 'error',
          message: e.message
        }
      }
    }
    async pay(params, token) {
      try {
        const session = await app.model.UserLogin.findOne({ session: token, valid: true })
        if (!session) {
          throw new Error('请重新登录')
        }
        const onlookModel = {
          userId: session.userId,
          qaId: params._id,
          payAnswer: true
        }
        await app.model.Onlook.create(onlookModel)
        return {
          status: 'success'
        }
      } catch (e) {
        return {
          status: 'error',
          message: e.message
        }
      }
    }
    async findPay(qaId, token) {
      try {
        const session = await app.model.UserLogin.findOne({ session: token, valid: true })
        if (!session) {
          throw new Error('请重新登录')
        }
        const onlook = await app.model.Onlook.findOne({ qaId: qaId, userId: session.userId })
        if (onlook) {
          return {
            data: 'already',
            message: '已支付围观金额'
          }
        } else {
          return {
            data: 'never',
            message: '未支付围观金额'
          }
        }
      } catch (e) {
        return {
          status: 'error',
          message: e.message
        }
      }
    }
  }
  return QaService
}