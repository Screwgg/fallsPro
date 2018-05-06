const Controller = require('egg').Controller

class QaController extends Controller {
  async createQa(ctx) {
    const token = ctx.request.headers['x-token']
    ctx.body = await ctx.service.qaService.create(ctx.request.body, token)
  }

  async checkInvite(ctx) {
    const token = ctx.request.headers['x-token']
    ctx.body = await ctx.service.qaService.checkInvite(ctx.request.body, token)
  }

  async findQa(ctx) {
    const token = ctx.request.headers['x-token']
    ctx.body = await ctx.service.qaService.find(token)
  }

  async findAllQa(ctx) {
    ctx.body = await ctx.service.qaService.findAll()
  }

  async getQaDetail(ctx) {
    ctx.body = await ctx.service.qaService.getQaDetail(ctx.query._id)
  }

  async updateQa(ctx) {
    const token = ctx.request.headers['x-token']
    ctx.body = await ctx.service.qaService.update(ctx.request.body, token)
  }

  async payAnswer(ctx) {
    const token = ctx.request.headers['x-token']
    ctx.body = await ctx.service.qaService.pay(ctx.request.body, token)
  }

  async findPay(ctx) {
    const token = ctx.request.headers['x-token']
    ctx.body = await ctx.service.qaService.findPay(ctx.query._id, token)
  }
}

module.exports = QaController