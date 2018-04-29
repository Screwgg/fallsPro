module.exports = app => {
  class ContributorService extends app.Service {
    async create(params, token) {
      try {
        const session = await app.model.UserLogin.findOne({ session: token, valid: true })
        if (!session) {
          throw new Error('请重新登录')
        }
        const contributorModel = {
          userId: session.userId,
          ...params
        }
        await app.model.Contributor.create(contributorModel)

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
    async find(outsourcingId) {
      try {
        const contributor = await app.model.Contributor.find({ outsourcingId: outsourcingId }).populate('userId', 'username job')
        return {
          data: contributor,
          status: 'success'
        }
      } catch (e) {
        return {
          data: null,
          status: 'error',
          message: e.message
        }
      }
    }
  }
  return ContributorService
}