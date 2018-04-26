module.exports = app => {
  const qiniu = require('qiniu')
  class ReleaseService extends app.Service {
    async create (params, token) {
      try {
        const session = await app.model.UserLogin.findOne({ session: token, valid: true })
        if (!session) {
          throw new Error('请重新登录')
        }
        const releaseModel = {
          userId: session.userId,
          ...params
        }
        const release = new app.model.Release(releaseModel)
        await release.save()
        return {
          data: release,
          status: 'success',
          message: '发布成功'
        }
      } catch (e) {
        return {
          data: null,
          status: 'error',
          message: e.message
        }
      }
    }
    getToken () {
      const accessKey = 'IhzmNYvB2whZpTPoA_NXNxCyLfF7-9RRihDyLKbs'
      const secretKey = 'mG76QcwieiW_eIhJ6pYzzD78RuOA8oyhv4fj7zeO'
      const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
      var options = {
        scope: 'fallspro',
        expires: 7200
      }
      var putPolicy = new qiniu.rs.PutPolicy(options)
      var uploadToken = putPolicy.uploadToken(mac)
      return uploadToken
    }
    async find(userId, token) {
      try {
        if (!userId && token) {
          const session = await app.model.UserLogin.findOne({ session: token, valid: true })
          if (!session) {
            throw new Error('请重新登录')
          }
          userId = session.userId
        }
        const releaseList = await app.model.Release.find({userId: userId})
        return {
          data: releaseList,
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
    async findAll() {
      try {
        const allReleaseList = await app.model.Release.find()
        return {
          data: allReleaseList,
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
    async getDetail (releaseId) {
      try {
        const releaseDetail = await app.model.Release.findOne({ _id: releaseId}).populate('userId', 'username')
        if (!releaseDetail) {
          throw new Error('该发布不存在或已删除')
        }
        return {
          data: releaseDetail,
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
    async delete (_id, token) {
      try {
        const session = await app.model.UserLogin.findOne({ session: token, valid: true })
        if (!session) {
          throw new Error('请重新登录')
        }
        const release = await app.model.Release.findOneAndRemove(_id)
        if (!release) {
          throw new Error('该发布不存在或已删除')
        }
        return {
          status: 'success',
          message: '删除发布成功'
        }
      } catch (e) {
        return {
          status: 'error',
          message: e.message || '删除发布失败'
        }
      }
    }
  }
  return ReleaseService
}

