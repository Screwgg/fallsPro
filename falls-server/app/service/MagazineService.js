module.exports = app => {
  const moment = require('moment')
  class MagazineService extends app.Service {
    async create() {
      try {
        let date = 'Vol.' + moment().format('YYYYMMDD')
        const checkTitle = await app.model.Magazine.findOne({ title: date })
        if (!checkTitle) {
          let end = moment().toISOString()
          let start = moment().weekday(-3).toISOString()
          const selection = await app.model.Hotlist.find({})
            .populate('releaseId', 'title avatar createdAt', { createdAt: { $gte: start, $lt: end } })
            .sort({ rewardSum: -1 })
          const magazine = selection.filter(item => item.releaseId).slice(0, 5)
          await app.model.Magazine.create({
            title: date,
            content: JSON.stringify(magazine)
          })
        }
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
    async find () {
      try {
        const magazine = await app.model.Magazine.find()
        return {
          data: magazine
        }
      } catch (e) {
        return {
          data: null,
          message: e.message
        }
      }
    }
  }
  return MagazineService
}