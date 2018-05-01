<template>
  <div class="outsourcing-list">
    <div class="head">{{process ? '待接私单' : '已截私单'}}</div>
    <div class="line"><span></span></div>
    <el-collapse v-model="activeName" accordion class="list">
      <el-collapse-item
        v-for="(item, index) in outsourcingList"
        :title="item.theme"
        :name="index"
        :key="index">
        <div class="content" @click="jumpDetail(item._id)">
          <p>{{item.demand}}</p>
          <div class="more"><i class="el-icon-back"></i></div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  name: 'collapse-list',
  props: ['outsourcingList', 'process'],
  data () {
    return {
      activeName: 0
    }
  },
  methods: {
    jumpDetail (_id) {
      this.$router.push('/outdetail?_id=' + _id)
    }
  }
}
</script>

<style lang="sass" scoped>
.outsourcing-list
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
      cursor: pointer

      p
        padding: 0 30px
        text-align: left
        overflow: hidden
        text-overflow: ellipsis
        display: -webkit-box
        -webkit-line-clamp: 3
        -webkit-box-orient: vertical

      .more
        padding: 0 36px
        text-align: right

        i
          transform: rotateY(180deg)
          color: #bb0f24
          font-weight: 600
</style>
