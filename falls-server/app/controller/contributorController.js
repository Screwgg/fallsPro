const Controller = require('egg').Controller

class ContributorController extends Controller {
  async createContributor(ctx) {
    const token = ctx.request.headers['x-token']
    ctx.body = await ctx.service.contributorService.create(ctx.request.body, token)
  }

  async findContributor(ctx) {
    ctx.body = await ctx.service.contributorService.find(ctx.query.outsourcingId)
  }
}

module.exports = ContributorController