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
    const token = ctx.request.headers['x-token']
    ctx.body = await ctx.service.userService.update(ctx.request.body, token)
  }

  async getUserInfo(ctx) {
    const token = ctx.request.headers['x-token']
    ctx.body = await ctx.service.userService.getInfo(ctx.query.userId, token)
  }

  async getUserPage(ctx) {
    ctx.body = await ctx.service.userService.getPage(ctx.query.username)
  }
}

module.exports = UserController