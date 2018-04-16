const Controller = require('egg').Controller

class UserController extends Controller {
  async createUser(ctx) {
    ctx.body = await ctx.service.userService.create(ctx.request.body)
  }

  async uniqueUser(ctx) {
    ctx.body = await ctx.service.userService.unique(ctx.request.body)
  }

  async findUser(ctx) {
    ctx.body = await ctx.service.userService.find(ctx.request.body)
  }

  async logoutUser(ctx) {
    const token = ctx.request.headers['x-token']
    ctx.body = await ctx.service.userService.logout(token)
  }

  async updateUser(ctx) {
    ctx.body = await ctx.service.userService.update({ _id: ctx.query._id })
  }

  async getUserInfo(ctx) {
    ctx.body = await ctx.service.userService.getInfo(ctx.query.userId)
  }
}

module.exports = UserController