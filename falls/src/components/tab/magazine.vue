<template>
  <div class="magazine">
    <div class="banner-wrap">
      <div class="banner">
        <img src="@/assets/magazine-white.gif">
        <a class="fancy-button bg-gradient1"><span @click="getMagazineList">点击领取最新周刊</span></a>
      </div>
      <div class="banner">
        <a class="fancy-button bg-gradient2"><span>这里集合了过去一周的精选发布</span></a>
        <img src="@/assets/magazine-white2.gif">
      </div>
    </div>

    <div class="magazine-list">
      <div class="head">往期周刊</div>
      <div class="line"><span></span></div>
      <el-collapse v-model="activeName" accordion class="list">
        <el-collapse-item
          v-for="(item, index) in magazineList"
          :title="item.title"
          :name="index"
          :key="index">
          <div class="content"
            v-for="(subitem, subindex) in item.content"
            :key="subindex"
            @click="jumpDetail(subitem.releaseId._id)">
            <div class="title">
              <span>{{subitem.releaseId.title}}</span>
            </div>
            <img :src="subitem.releaseId.avatar">
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'magazine',
  data () {
    return {
      magazineList: [],
      activeName: 0
    }
  },
  mounted () {
    this.createNewMagazine()
  },
  methods: {
    async createNewMagazine () {
      try {
        let currentWeekday = moment().weekday()
        if (currentWeekday === 4) {
          let response = await this.$axios.post('http://localhost:7001/createmagazine')
          if (response.data.status === 'error') {
            throw response
          }
        }
        this.getMagazineList()
      } catch (e) {
        this.$message.error(e.data.message)
      }
    },
    async getMagazineList () {
      try {
        let response = await this.$axios.get('http://localhost:7001/findmagazine')
        if (!response.data.data) {
          throw response
        }
        this.magazineList = response.data.data.map(item => {
          return {
            title: item.title,
            content: JSON.parse(item.content)
          }
        })
        this.$message.success('最新周刊已生成，请查收')
      } catch (e) {
        this.$message.error(e.data.message)
      }
    },
    jumpDetail (_id) {
      this.$router.push('/detail?_id=' + _id)
    }
  }
}
</script>

<style lang="sass" scoped>
.magazine
  .banner-wrap
    padding: 20px 0

    .banner
      padding: 20px 160px
      display: flex
      justify-content: space-between
      align-items: center

      img
        width: 500px

      @mixin gradientBg($startColor, $endColor)
        background: $startColor
        background: -moz-linear-gradient(left, $startColor 0%, $endColor 80%, $endColor 100%)
        background: -webkit-linear-gradient(left, $startColor 0%, $endColor 80%, $endColor 100%)
        background: linear-gradient(to right, $startColor 0%, $endColor 80%, $endColor 100%)

      .bg-gradient1 span, .bg-gradient1:before
        @include gradientBg(#fa6c9f, #ffe140)

      .bg-gradient2 span, .bg-gradient2:before
        @include gradientBg(#52A0FD, #00e2fa)

      .fancy-button
        display: inline-block
        margin: 20px
        font-family: 'Montserrat', Helvetica, Arial, sans-serif
        font-size: 17px
        letter-spacing: 0.03em
        text-transform: uppercase
        color: #ffffff
        position: relative
        cursor: pointer

        &:before
          content: ''
          display: inline-block
          height: 40px
          position: absolute
          bottom: -5px
          left: 30px
          right: 30px
          z-index: -1
          border-radius: 30em
          filter: blur(20px) brightness(0.95)
          transform-style: preserve-3d
          transition: all 0.3s ease-out

        i
          margin-top: -1px
          margin-right: 20px
          font-size: 1.265em
          vertical-align: middle

        span
          display: inline-block
          padding: 16px 50px
          border-radius: 50em
          position: relative
          z-index: 2
          will-change: transform, filter
          transform-style: preserve-3d
          transition: all 0.3s ease-out

        &:focus, &:active
          color: #ffffff

        &:hover
          color: #ffffff

          span
            filter: brightness(1.05) contrast(1.05)
            transform: scale(0.95)

          &:before
            bottom: 0
            filter: blur(10px) brightness(0.95)

        &.pop-onhover

          &:before
            opacity: 0
            bottom: 10px

          &:hover

            &:before
              bottom: -7px
              opacity: 1
              filter: blur(20px)

            span
              transform: scale(1.04)

            &:active

              span
                filter: brightness(1) contrast(1)
                transform: scale(1)
                transition: all 0.15s ease-out

              &:before
                bottom: 0
                filter: blur(10px) brightness(0.95)
                transition: all 0.2s ease-out

  .magazine-list
    padding: 30px
    text-align: center

    .head
      padding: 6px 0
      font-size: 30px
      font-weight: 800

    .line
      span
        width: 2%
        display: inline-block
        border-bottom: #bb0f24 4px solid

    .list
      margin: 40px 140px

      .content
        margin: 60px 0
        font-size: 20px
        font-weight: 500

        .title
          text-align: left
          cursor: pointer

          span
            padding: 0 12px
            margin: 6px 0
            border-left: #bb0f24 4px solid

        img
          width: 100%
</style>

<style lang="sass">
.el-collapse-item__header
  font-size: 18px
</style>
