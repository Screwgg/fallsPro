module.exports = app => {
  const moment = require('moment')
  class MagazineService extends app.Service {
    async create() {
      try {
        let date = 'Vol.' + moment().format('YYYYMMDD')
        const checkTitle = await app.model.Magazine.findOne({ title: date })
        if (!checkTitle) {
          let end = moment().toISOString()
          let start = moment().weekday(-6).toISOString()

          const rewardSum = await app.model.Comment.aggregate([
            { 
              $group: { 
                _id: '$releaseId', 
                rewardSum: { $sum: '$reward' },
                commentCount: { $sum: 1 } 
              } 
            }, { 
              $sort: { rewardSum: -1 } 
            }, {
              $lookup: {
                from: 'releases',
                localField: '_id',
                foreignField: '_id',
                as: 'recentRelease'
              }
            }, {
              $unwind: '$recentRelease'
            }, {
              $project: {
                _id: 0,
                releaseId: '$_id',
                rewardSum: 1,
                commentCount: 1,
                recentRelease: {
                  title: 1,
                  avatar: 1
                },
                createdAt: '$recentRelease.createdAt'
              }
            }, {
              $match: { 
                createdAt: { 
                  $gte: new Date(start),
                  $lt: new Date(end)
                }
              }
            }, {
              $limit: 5
            }
          ])
          await app.model.Magazine.create({
            title: date,
            content: JSON.stringify(rewardSum)
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