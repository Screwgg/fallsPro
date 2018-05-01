module.exports = app => {
  class FilterService extends app.Service {
    async create(params) {
      try {
        await app.model.Filter.create(params)

        const outsourcing = await app.model.Outsourcing.findOne({ _id: params.outsourcingId })
        if (!outsourcing) {
          throw new Error('该私单不存在')
        }
        outsourcing.status = true
        await outsourcing.save()

        return {
          status: 'success',
          message: '筛选成功'
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
        const outsourcing = await app.model.Outsourcing.findOne({ _id: outsourcingId })
        if (!outsourcing) {
          throw new Error('该私单不存在')
        }
        const filter = await app.model.Filter.findOne({ outsourcingId: outsourcingId})
        if (!filter) {
          throw new Error('该私单未截单')
        }
        const contributor = await app.model.Contributor.findOne({ _id: filter.contributorId }).populate('userId', 'username job')
        if (!contributor) {
          throw new Error('该投稿不存在')
        }
        return {
          data: {
            outsourcing,
            contributor
          },
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
    async findMy(token) {
      try {
        const session = await app.model.UserLogin.findOne({ session: token, valid: true })
        if (!session) {
          throw new Error('请重新登录')
        }
        const contributor = await app.model.Contributor.find({ userId: session.userId })
        if (!contributor) {
          throw new Error('该投稿不存在')
        }
        let filterList = []
        for (let i in contributor) {
          const filter = await app.model.Filter.findOne({ contributorId: contributor[i]._id }).populate('outsourcingId', 'theme demand')
          if (filter) {
            filterList.push(filter)
          }
        }
        return {
          data: filterList,
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
  return FilterService
}