module.exports = app => {
  class CommentService extends app.Service {
    async create (params, token) {
      try {
        const session = await app.model.UserLogin.findOne({ session: token, valid: true })
        if (!session) {
          throw new Error('请重新登录')
        }
        const commentModel = {
          userId: session.userId,
          ...params
        }
        await app.model.Comment.create(commentModel)

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
    async find (releaseId) {
      try {
        const comment = await app.model.Comment.find({ releaseId: releaseId }).populate('userId', 'username usertype').sort({ reward: -1 })
        return {
          data: comment,
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
  return CommentService
}