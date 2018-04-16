<template>
  <div class="wrapper">
    <el-container class="container">
      <el-header>
        <common-header v-on:changeInSearch="changeInSearch"></common-header>
      </el-header>

      <el-main class="main">
        <div class="mask" v-if="inSearch"></div>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import commonHeader from '@/components/common-header'
export default {
  name: 'index',
  components: { commonHeader },
  data () {
    return {
      inSearch: false
    }
  },
  directives: {
    listen: {
      bind: function (el) {
        el.addEventListener('scroll', () => {
          console.log(el)
        })
      }
    }
  },
  methods: {
    changeInSearch (value) {
      this.inSearch = value
    }
  }
}
</script>

<style lang="sass" scoped>
  .wrapper, .container
    height: 100%

    .main
      position: relative

      .mask
        width: 100%
        height: 100%
        position: absolute
        top: 0
        left: 0
        z-index: 2000
        background: rgba(0, 0, 0, .5)
</style>

<style lang="sass">
  .el-header
    border-bottom: solid 1px #e6e6e6
</style>
