<template>
  <div class="collect">
    <el-card class="box-card" v-if="isDesigner">
      <div slot="header" class="clearfix">
        <span>添加摄影作品到图库</span>
        <el-button class="button" type="text" @click="shotCollect" :disabled="!collectFull">发送</el-button>
      </div>
      <div>
        <el-form :model="collect" label-width="120px">
          <el-form-item label="摄影作品">
            <upload-wall type="avatar" v-on:getAvatar="getPhoto" ref="avatar"></upload-wall>
          </el-form-item>
          <el-form-item label="拍摄地点">
            <el-input v-model="collect.spot" placeholder="请输入地点" class="collect"></el-input>
          </el-form-item>
          <el-form-item label="拍摄器材">
            <el-input v-model="collect.material" placeholder="请输入拍摄器材" class="collect"></el-input>
          </el-form-item>
          <el-form-item label="图片故事">
            <el-input v-model="collect.story" placeholder="请输入图片故事" type="textarea" :rows="10" class="collect collect-long"></el-input>
          </el-form-item>
          <el-form-item label="版权定价(¥)">
            <el-input-number v-model="collect.copyright" :step="20" class="collect collect-tiny"></el-input-number>
            <el-checkbox v-model="openSource">开源</el-checkbox>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <collect-list :collectList="collectList"></collect-list>
  </div>
</template>

<script>
import Cookie from 'js-cookie'
import UploadWall from '@/components/homepage/upload-wall'
import CollectList from '@/components/tab/collect-list'
export default {
  name: 'collect',
  components: { UploadWall, CollectList },
  data () {
    return {
      openSource: false,
      collect: {
        photo: '',
        spot: '',
        material: '',
        story: '',
        copyright: 0
      },
      collectList: []
    }
  },
  watch: {
    openSource (val) {
      if (val) {
        this.collect.copyright = 0
      }
    },
    'collect.copyright' (val) {
      if (val) {
        this.openSource = false
      }
    }
  },
  computed: {
    collectFull () {
      return Object.keys(this.collect).every(item => {
        if (item === 'copyright') {
          return this.collect[item] || this.openSource
        } else {
          return this.collect[item]
        }
      })
    },
    isDesigner () {
      return Cookie.get('usertype') === '0'
    }
  },
  mounted () {
    this.initCollect()
  },
  methods: {
    getPhoto (avatar) {
      this.collect.photo = avatar
    },
    async shotCollect () {
      try {
        let response = await this.$axios.post('http://localhost:7001/createcollect', this.collect)
        if (response.data.status === 'error') {
          throw response
        }
        this.$message.success(response.data.message)
      } catch (e) {
        this.$message.error(e.data.message)
      }
      this.clearCollect()
    },
    clearCollect () {
      Object.keys(this.collect).forEach(item => {
        if (item === 'copyright') {
          this.collect[item] = 0
        } else {
          this.collect[item] = ''
        }
      })
      this.openSource = false
      this.$refs.avatar.clearAvatar()
      this.initCollect()
    },
    async initCollect () {
      try {
        let response = await this.$axios.get('http://localhost:7001/findallcollect')
        if (response.data.status === 'error') {
          throw response
        }
        this.collectList = response.data.data.reverse()
      } catch (e) {
        this.$message.error(e.data.message)
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.box-card
  margin: 10px 30px

  .clearfix
    &:before,
    &:after
      display: table
      content: ""

    &:after
      clear: both

    .button
      float: right
      padding: 3px 0

  .collect
    width: 40%
    margin-bottom: 10px

  .collect-long
    width: 90%

  .collect-tiny
    width: 16%
</style>

<style lang="sass">
.collect
  .el-form-item__label
    margin-right: 30px
    font-weight: 600

  .el-input-number
    margin-right: 20px
</style>
