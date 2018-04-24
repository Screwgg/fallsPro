const Controller = require('egg').Controller

class CommentController extends Controller {
  async createComment (ctx) {
    const token = ctx.request.headers['x-token']
    ctx.body = await ctx.service.commentService.create(ctx.request.body, token)
  }

  async findComment (ctx) {
    ctx.body = await ctx.service.commentService.find(ctx.query.releaseId)
  }
}

module.exports = CommentController