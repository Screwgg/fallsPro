<template>
  <div class="photo">
    <el-tabs type="card">
      <el-tab-pane label="我贡献的照片" v-if="isDesigner">
        <photo-list :photoList="photoList" :isDesigner="isDesigner" v-on:deletePhoto="deletePhoto"></photo-list>
      </el-tab-pane>
      <el-tab-pane label="我购买的版权">
        <photo-list :photoList="purchaseList" :isDesigner="isDesigner"></photo-list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Cookie from 'js-cookie'
import PhotoList from '@/components/homepage/photo-list'
export default {
  name: 'photo',
  components: { PhotoList },
  data () {
    return {
      photoList: [],
      purchaseList: []
    }
  },
  mounted () {
    this.initPhoto()
    this.initPurchase()
  },
  computed: {
    isDesigner () {
      return Cookie.get('usertype') === '0'
    }
  },
  methods: {
    async initPhoto () {
      try {
        let response = await this.$axios.get('http://localhost:7001/findcollect')
        if (response.data.status === 'error') {
          throw response
        }
        this.photoList = response.data.data
      } catch (e) {
        this.$message.error(e.data.message)
      }
    },
    async deletePhoto (collectId) {
      try {
        let response = await this.$axios.post('http://localhost:7001/deletecollect', { _id: collectId })
        if (response.data.status === 'error') {
          throw response
        }
        this.initPhoto()
      } catch (e) {
        this.$message.error(e.data.message)
      }
    },
    async initPurchase () {
      try {
        let response = await this.$axios.get('http://localhost:7001/findcopyright')
        if (response.data.status === 'error') {
          throw response
        }
        this.purchaseList = response.data.data.map(item => item.collectId)
      } catch (e) {
        this.$message.error(e.data.message)
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.photo
  margin: 0 20px
</style>
