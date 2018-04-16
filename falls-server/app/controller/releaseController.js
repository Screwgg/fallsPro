const Controller = require('egg').Controller

class ReleaseController extends Controller {
  async createRelease(ctx) {
    const token = ctx.request.headers['x-token']
    ctx.body = await ctx.service.releaseService.create(ctx.request.body, token)
  }

  async getToken(ctx) {
    ctx.body = await ctx.service.releaseService.getToken()
  }

  async findRelease(ctx) {
    const token = ctx.request.headers['x-token']
    ctx.body = await ctx.service.releaseService.find(token)
  }

  async getReleaseDetail(ctx) {
    ctx.body = await ctx.service.releaseService.getDetail(ctx.query._id)
  }

  async deleteRelease(ctx) {
    const token = ctx.request.headers['x-token']
    ctx.body = await ctx.service.releaseService.delete(ctx.request.body, token)
  }
}

module.exports = ReleaseController