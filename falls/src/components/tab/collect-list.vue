<template>
  <div class="collect-list">
    <el-card
      :body-style="{ padding: '40px' }"
      v-for="(item, index) in collectList"
      :key="index">
      <div class="photo">
        <img :src="item.photo">
      </div>
      <div class="description">
        <span>图片故事：{{item.story}}</span>
        <div class="info">
          <img src="@/assets/spot.png">
          <span>{{item.spot}}</span>
          <img src="@/assets/material.png">
          <span>{{item.material}}</span>
        </div>
        <div class="copyright">
          <div class="left">
            <el-tag size="medium" type="success" v-if="!item.copyright">开源</el-tag>
            <span v-if="item.copyright">
              版权价格：{{item.copyright.toLocaleString('zh', { style: 'currency', currency: 'CNY' })}}
            </span>
          </div>
          <div class="right" v-if="item.copyright">
            <el-button size="small" @click="buy(item._id)">购买商用版权</el-button>
            <el-dialog
              title="购买商用版权"
              :visible.sync="confirmCheckDialog"
              width="30%"
              center>
              <img src="@/assets/QRcode.jpeg">
              <span slot="footer" class="dialog-footer">
                <el-button @click="confirmCheckDialog = false">取 消</el-button>
                <el-button type="primary" @click="confirmPay">确 定 支 付</el-button>
              </span>
            </el-dialog>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'collect-list',
  props: ['collectList'],
  data () {
    return {
      confirmCheckDialog: false,
      tempId: ''
    }
  },
  methods: {
    buy (collectId) {
      this.confirmCheckDialog = true
      this.tempId = collectId
    },
    async confirmPay () {
      try {
        let response = await this.$axios.post('http://localhost:7001/recordcopyright', { collectId: this.tempId })
        if (response.data.status === 'error') {
          throw response
        }
        this.$message.success(response.data.message)
      } catch (e) {
        this.$message.error(e.data.message)
      }
      this.confirmCheckDialog = false
    }
  }
}
</script>

<style lang="sass" scoped>
.collect-list
  padding: 30px

  .photo
    img
      width: 100%

  .description
    .info
      display: flex
      align-items: center

      img
        width: 18px

      span
        margin-left: 6px
        margin-right: 24px

    .copyright
      margin-top: 24px
      display: flex
      justify-content: space-between

      .right
        span
          margin-right: 10px
</style>

<style lang="sass">
.collect-list
  .el-card
    line-height: 3
    letter-spacing: 1.5px
    color: #999
    font-size: 12px
    font-weight: 600

  .el-dialog--center .el-dialog__body
    padding: 50px 92px
    text-align: center

    span
      display: block
      font-weight: 600
      font-size: 16px

    img
      display: block
      width: 200px
</style>
