<template>
  <div class="daily">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">我的主页</el-breadcrumb-item>
      <el-breadcrumb-item>我的发布</el-breadcrumb-item>
    </el-breadcrumb>
    <ul>
      <li v-for="item in dailyList" :key="item._Id" class="dailylist">
        <div class="left" @click="jumpDetail(item._id)">
          <div>
            <img :src="item.avatar" class="thumbnail">
          </div>
          <div class="intro">
            <div>
              <p class="title">{{item.title}}</p>
              <p class="type">{{item.type}}</p>
            </div>
            <div class="comment">
              <i class="el-icon-message"></i>
              <span class="comment-count">35</span>
            </div>
          </div>
        </div>
        <div class="right">
          <i class="el-icon-delete" @click="deleteRelease(item._id)"></i>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'daily',
  data () {
    return {
      dailyList: []
    }
  },
  mounted () {
    this.getDailyList()
  },
  methods: {
    async getDailyList () {
      try {
        let response = await this.$axios.post('http://localhost:7001/findrelease')
        this.dailyList = response.data.data
      } catch (e) {
        this.$message.error(e.data.message)
      }
    },
    jumpDetail (_id) {
      this.$router.push('/detail?_id=' + _id)
    },
    async deleteRelease (_id) {
      try {
        this.$confirm('确认删除此条发布？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let response = await this.$axios.post('http://localhost:7001/deleterelease', { _id: _id })
          if (response.data.status === 'error') {
            throw response
          }
          this.getDailyList()
        }).catch(() => {})
      } catch (e) {
        this.$message.error(e.data.message)
      }
    }
  }
}
</script>

<style lang="sass" scoped>
  .daily
    margin: 0 20px

    .breadcrumb
      margin: 10px 0 20px
      font-size: 14px

    ul
      padding: 0
      list-style: none

      .dailylist
        display: flex
        margin: 24px 0
        justify-content: space-between

        .left
          display: flex

          .thumbnail
            width: 400px

          .intro
            display: flex
            margin-left: 30px
            flex-direction: column
            justify-content: space-between

            .title
              margin: 0
              font-size: 22px
              font-weight: bold
              cursor: pointer
              hover: #bb0f24

            .type
              font-size: 14px
              color: #333

            .comment
              display: flex
              align-items: center
              margin-bottom: 8px
              cursor: pointer

              .comment-count
                margin-left: 4px
                font-size: 12px
                color: #aeaeae

        .right
          margin-right: 10px

        i
          color: #aeaeae
          cursor: pointer
</style>
