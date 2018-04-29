module.exports = app => {
  class OutsourcingService extends app.Service {
    async create(params, token) {
      try {
        const session = await app.model.UserLogin.findOne({ session: token, valid: true })
        if (!session) {
          throw new Error('请重新登录')
        }
        const outsourcingModel = {
          userId: session.userId,
          ...params
        }
        await app.model.Outsourcing.create(outsourcingModel)
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
    async find() {
      try {
        const outsourcing = await app.model.Outsourcing.find()
        return {
          data: outsourcing
        }
      } catch (e) {
        return {
          data: null,
          message: e.message
        }
      }
    }
    async getDetail(outsourcingId) {
      try {
        const outsourcingDetail = await app.model.Outsourcing.findOne({ _id: outsourcingId }).populate('userId', 'username email company')
        if (!outsourcingDetail) {
          throw new Error('该发布不存在或已删除')
        }
        return {
          data: outsourcingDetail,
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
    async checkAuthor(id, token) {
      try {
        const session = await app.model.UserLogin.findOne({ session: token, valid: true })
        if (!session) {
          throw new Error('请重新登录')
        }
        const outsourcing = await app.model.Outsourcing.findOne({ _id: id })
        if (!outsourcing) {
          throw new Error('该发布不存在或已删除')
        }
        let result = session.userId == outsourcing.userId
        return {
          data: result
        }
      } catch (e) {
        return {
          data: null,
          message: e.message
        }
      }
    }
  }
  return OutsourcingService
}