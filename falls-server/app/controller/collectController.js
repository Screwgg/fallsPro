const Controller = require('egg').Controller

class CollectController extends Controller {
  async createCollect(ctx) {
    const token = ctx.request.headers['x-token']
    ctx.body = await ctx.service.collectService.create(ctx.request.body, token)
  }

  async findAllCollect(ctx) {
    ctx.body = await ctx.service.collectService.findAll()
  }

  async findCollect(ctx) {
    const token = ctx.request.headers['x-token']
    ctx.body = await ctx.service.collectService.find(token)
  }

  async deleteCollect(ctx) {
    const token = ctx.request.headers['x-token']
    ctx.body = await ctx.service.collectService.delete(ctx.request.body, token)
  }

  async recordCopyright(ctx) {
    const token = ctx.request.headers['x-token']
    ctx.body = await ctx.service.collectService.record(ctx.request.body, token)
  }

  async findCopyright(ctx) {
    const token = ctx.request.headers['x-token']
    ctx.body = await ctx.service.collectService.findRecord(token)
  }
}

module.exports = CollectController