const Controller = require('egg').Controller

class OutsourcingController extends Controller {
  async createOutsourcing(ctx) {
    const token = ctx.request.headers['x-token']
    ctx.body = await ctx.service.outsourcingService.create(ctx.request.body, token)
  }

  async findAllOutsourcing(ctx) {
    ctx.body = await ctx.service.outsourcingService.findAll()
  }

  async findOutsourcing(ctx) {
    const token = ctx.request.headers['x-token']
    ctx.body = await ctx.service.outsourcingService.find(token)
  }

  async getOutsourcingDetail(ctx) {
    ctx.body = await ctx.service.outsourcingService.getDetail(ctx.query._id)
  }

  async checkOutAuthor(ctx) {
    const token = ctx.request.headers['x-token']
    ctx.body = await ctx.service.outsourcingService.checkAuthor(ctx.query.outsourcingId, token)
  }
}

module.exports = OutsourcingController