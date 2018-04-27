const Controller = require('egg').Controller

class OutsourcingController extends Controller {
  async createOutsourcing(ctx) {
    const token = ctx.request.headers['x-token']
    ctx.body = await ctx.service.outsourcingService.create(ctx.request.body, token)
  }

  async findOutsourcing(ctx) {
    ctx.body = await ctx.service.outsourcingService.find()
  }

  async getOutsourcingDetail(ctx) {
    ctx.body = await ctx.service.outsourcingService.getDetail(ctx.query._id)
  }
}

module.exports = OutsourcingController