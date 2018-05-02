<template>
  <div class="homepage">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb" v-show="!isUserinfo">
      <el-breadcrumb-item
        v-for="(item, index) in breadList"
        :to="item.path"
        :key="index">
        {{item.pathname}}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <router-view>
    </router-view>
  </div>
</template>

<script>
const breadMap = {
  homepage: '我的主页',
  daily: '我的发布',
  photo: '我的照片',
  service: '我的私单',
  setting: '设置'
}
export default {
  name: 'homepage',
  computed: {
    breadList () {
      let route = this.$route.path.split('/')
      route.shift()
      return route.map(item => {
        return {
          path: { path: '/' + item },
          pathname: breadMap[item]
        }
      })
    },
    isUserinfo () {
      return this.breadList.length === 1
    }
  }
}
</script>

<style lang="sass" scoped>
  .breadcrumb
    margin: 10px 20px 50px
    font-size: 16px
</style>
