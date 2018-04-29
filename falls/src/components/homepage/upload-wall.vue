<template>
  <div>
    <!-- 单图上传 -->
    <div v-if="type === 'avatar'">
      <el-upload
        :show-file-list="false"
        :action="qnLocation"
        :before-upload="beforeUpload"
        :data="uploadData"
        :on-success="uploadWall"
        class="avatar-uploader">
        <img v-if="avatar" :src="avatar" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div>

    <!-- 多图上传 -->
    <div v-else>
      <el-upload
        list-type="picture-card"
        :action="qnLocation"
        :before-upload="beforeUpload"
        :data="uploadData"
        :on-success="uploadWall"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl">
      </el-dialog>
    </div>
  </div>
</template>

<script>
const STATICDOMAIN = 'http://p6ujmjz7y.bkt.clouddn.com/'
const LOCATION = 'http://upload.qiniu.com/'

export default {
  name: 'upload-wall',
  props: ['type'],
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      qnLocation: LOCATION,
      uploadData: {},
      fullscreenLoading: false,
      avatar: ''
    }
  },
  methods: {
    // 图片上传之前调取的函数, 这个钩子还支持 promise
    beforeUpload (file) {
      return this.qnUpload(file)
    },
    // 图片上传前获得数据token数据
    async qnUpload (file) {
      try {
        this.fullscreenLoading = true
        const suffix = file.name.split('.')
        const ext = suffix.splice(suffix.length - 1, 1)[0]
        // TODO 图片格式/大小限制
        let token = await this.$axios.post('http://localhost:7001/gettoken')
        this.uploadData = {
          key: `image/${suffix.join('.')}_${new Date().getTime()}.${ext}`,
          token: token.data
        }
        return this.uploadData
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    // 上传成功回调
    uploadWall (e) {
      this.fullscreenLoading = false
      this.avatar = STATICDOMAIN + e.key
      this.$emit('getAvatar', this.avatar)
    },
    handleRemove (file) {
      this.$emit('removeAvatar', STATICDOMAIN + file.response.key)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="sass">
  .avatar-uploader
    .el-upload
      border: 1px dashed #d9d9d9
      border-radius: 6px
      cursor: pointer
      position: relative
      overflow: hidden

    .el-upload:hover
      border-color: #409EFF

    .avatar-uploader-icon
      font-size: 28px
      color: #8c939d
      width: 178px
      height: 178px
      line-height: 178px
      text-align: center

    .avatar
      width: 178px
      height: 178px
      display: block
</style>
