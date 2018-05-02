<template>
  <div class="photo-list">
    <el-row>
      <el-col :span="6" v-for="(item, index) in photoList" :key="index">
        <el-card>
          <img :src="item.photo" class="image">
          <div class="info">
            <span>{{item.spot}}</span>
            <div class="bottom clearfix">
              <span class="material">{{item.material}}</span>
              <i class="el-icon-delete button" @click="deletePhoto(item._id)" v-if="isDesigner"></i>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'photo-list',
  props: ['photoList', 'isDesigner'],
  methods: {
    deletePhoto (collectId) {
      this.$emit('deletePhoto', collectId)
    }
  }
}
</script>

<style lang="sass" scoped>
.photo-list
  .image
    width: 258px
    height: 162px
    display: block

  .info
    padding: 14px 6px

    .bottom
      margin-top: 13px
      line-height: 12px

      .material
        font-size: 13px
        color: #999

      .button
        padding: 0
        float: right
        color: #aeaeae
        cursor: pointer

    .clearfix
      &:before,
      &:after
        display: table
        content: ""

      &:after
        clear: both
</style>
