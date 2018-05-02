module.exports = app => {
  class CollectService extends app.Service {
    async create(params, token) {
      try {
        const session = await app.model.UserLogin.findOne({ session: token, valid: true })
        if (!session) {
          throw new Error('请重新登录')
        }
        const collectModel = {
          userId: session.userId,
          ...params
        }
        await app.model.Collect.create(collectModel)

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
    async findAll() {
      try {
        const collect = await app.model.Collect.find()
        // const purchase = await app.model.Collect.aggregate([
        //   {
        //     $lookup: {
        //       from: 'copyrights',
        //       localField: '_id',
        //       foreignField: 'collectId',
        //       as: 'purchase'
        //     }
        //   }, {
        //     $unwind: '$purchase'
        //   }, {
        //     $group: {
        //       _id: '$_id',
        //       purchaseCount: { $sum: 1 }
        //     }
        //   }
        // ])
        return {
          data: collect,
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
        const collect = await app.model.Collect.find({ userId: session.userId })
        return {
          data: collect,
          status: 'success'
        }
      } catch (e) {
        return {
          status: 'error',
          message: e.message
        }
      }
    }
    async record(params, token) {
      try {
        const session = await app.model.UserLogin.findOne({ session: token, valid: true })
        if (!session) {
          throw new Error('请重新登录')
        }
        const collect = await app.model.Collect.findOne({ _id: params.collectId })
        if (!collect) {
          throw new Error('该照片不存在')
        }
        if (collect.userId == session.userId) {
          throw new Error('您持有该作品著作权')
        }
        const copyright = await app.model.Copyright.findOne({ collectId: params.collectId, userId: session.userId})
        if (copyright) {
          throw new Error('您已购买过该作品商用版权')
        }
        await app.model.Copyright.create({ collectId: params.collectId, userId: session.userId })
        return {
          status: 'success',
          message: '版权购买成功'
        }
      } catch (e) {
        return {
          status: 'error',
          message: e.message
        }
      }
    }
    async findRecord(token) {
      try {
        const session = await app.model.UserLogin.findOne({ session: token, valid: true })
        if (!session) {
          throw new Error('请重新登录')
        }
        const copyright = await app.model.Copyright.find({ userId: session.userId }).populate('collectId', 'photo spot material')
        return {
          data: copyright,
          status: 'success'
        }
      } catch (e) {
        return {
          status: 'error',
          message: e.message
        }
      }
    }
    async delete(_id, token) {
      try {
        const session = await app.model.UserLogin.findOne({ session: token, valid: true })
        if (!session) {
          throw new Error('请重新登录')
        }
        const collect = await app.model.Collect.findOneAndRemove(_id)
        if (!collect) {
          throw new Error('该照片不存在或已删除')
        }
        await app.model.Copyright.deleteMany({ collectId: _id._id })
        return {
          status: 'success',
          message: '删除照片成功'
        }
      } catch (e) {
        return {
          status: 'error',
          message: e.message
        }
      }
    }
  }
  return CollectService
}