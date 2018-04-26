const Controller = require('egg').Controller

class MagazineController extends Controller {
  async findMagazine (ctx) {
    ctx.body = await ctx.service.magazineService.find()
  }

  async createMagazine (ctx) {
    ctx.body = await ctx.service.magazineService.create()
  }
}

module.exports = MagazineController