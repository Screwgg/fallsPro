<template>
  <div class="discover">
    <div class="banner">
        Showcase &amp; Discover<br>
        Creative Work
    </div>

    <waterfall
      align="center"
      :line-gap="340"
      :watch="hotList">
      <waterfall-slot
        v-for="(item, index) in hotList"
        :width="340"
        :height="item.height"
        :order="index"
        :key="index"
        move-class="item-move">
          <div class="card">
            <img :src="item.avatar" class="image">
            <div class="title">
              {{item.title}}
            </div>
          </div>
      </waterfall-slot>
    </waterfall>
  </div>
</template>

<script>
import Waterfall from 'vue-waterfall/lib/waterfall'
import WaterfallSlot from 'vue-waterfall/lib/waterfall-slot'
export default {
  name: 'discover',
  components: { Waterfall, WaterfallSlot },
  data () {
    return {
      hotList: []
    }
  },
  mounted () {
    this.getReleaseList()
  },
  methods: {
    async getReleaseList () {
      try {
        let response = await this.$axios.post('http://localhost:7001/findrelease')
        response.data.data.forEach(item => {
          const res = new Promise((resolve, reject) => { // The Image.prototype.onload property is not a promise. If you're wanting to return the height property after loading, you would instead create a Promise...
            let image = new Image()
            image.onload = () => resolve({
              height: 340 * image.height / image.width + 60,
              ...item
            })
            image.onerror = () => reject(new Error('Could not load image at ' + item.avatar))
            image.src = item.avatar
          })
          res.then(item => this.hotList.push(item))
        })
      } catch (e) {
        this.$message.error(e.data.message)
      }
    }
  }
}
</script>

<style lang="sass" scoped>
  .discover
    margin: 20px 60px

    .banner
      padding-bottom: 36px
      font-size: 70px
      font-weight: 900
      line-height: .95
      text-align: center

    .item-move
      transition: all .5s cubic-bezier(.55,0,.1,1)
      -webkit-transition: all .5s cubic-bezier(.55,0,.1,1)

    .card
      padding: 10px
      &:hover
        background: #eee
        border-radius: 10px
        cursor: pointer

      .image
        width: 320px
        border-radius: 8px

      .title
        padding: 10px
        color: #555
        font-size: 16px
        font-weight: 800
        word-wrap: break-word
        letter-spacing: -.4px
</style>
