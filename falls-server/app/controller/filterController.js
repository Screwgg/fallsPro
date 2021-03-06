const Controller = require('egg').Controller

class FilterController extends Controller {
  async createFilter(ctx) {
    ctx.body = await ctx.service.filterService.create(ctx.request.body)
  }

  async findFilter(ctx) {
    ctx.body = await ctx.service.filterService.find(ctx.query.outsourcingId)
  }

  async findMyFilter(ctx) {
    const token = ctx.request.headers['x-token']
    ctx.body = await ctx.service.filterService.findMy(token)
  }
}

module.exports = FilterController