<template>
  <div class="editor">
    <p class="headline">编辑发布内容</p>
    <el-form ref="form" :model="release" label-width="40px">
      <el-form-item label="标题">
        <el-input v-model="release.title" placeholder="请输入标题" class="release"></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="release.type" multiple placeholder="请输入类型" class="release">
          <el-option
            v-for="item in releaseType"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="封面">
        <el-upload
          :action="qnLocation"
          :show-file-list="false"
          :before-upload="beforeUpload"
          :data="uploadData"
          :on-success="uploadAvatar"
          class="avatar-uploader">
          <img v-if="release.avatar" :src="release.avatar" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
    </el-form>

    <quill-editor v-model="release.content"
      ref="quillEditor"
      :content="release.content"
      :options="editorOption"
      @change="onEditorChange($event)">
    </quill-editor>

    <el-upload
      :action="qnLocation"
      :before-upload="beforeUpload"
      :data="uploadData"
      :on-success="upSuccess"
      ref="upload"
      class="upload">
      <el-button
        id="imgInput"
        v-loading.fullscreen.lock="fullscreenLoading"
        element-loading-spinner="el-icon-loading"
        element-loading-text="插入中,请稍候">
      </el-button>
    </el-upload>

    <div class="btn-group">
      <el-button type="primary" @click="shot" class="btn" :disabled="!releaseFull">发布</el-button>
      <el-button @click="cancelShot" class="btn">取消</el-button>
    </div>
  </div>
</template>

<script>
import Quill from 'quill'

const releaseTypeOption = [{
  value: 'UI',
  label: 'UI设计'
}, {
  value: 'INTERACTION',
  label: '交互设计'
}, {
  value: 'GRAPHIC',
  label: '平面设计'
}, {
  value: 'PHOTOGRAPHY',
  label: '摄影'
}, {
  value: 'ILLUSTRATION',
  label: '插画'
}, {
  value: 'MOTION',
  label: '动效设计'
}, {
  value: 'ARCHITECTURE',
  label: '建筑'
}, {
  value: 'PRODUCT',
  label: '产品设计'
}, {
  value: 'FASHION',
  label: '时尚'
}, {
  value: 'ADVERTISING',
  label: '广告设计'
}, {
  value: 'FINEARTS',
  label: '美术'
}, {
  value: 'CRAFTS',
  label: '工艺品'
}, {
  value: 'GANE',
  label: '游戏设计'
}, {
  value: 'SOUND',
  label: '音效'
}]

const toolbarOption = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ 'header': 1 }, { 'header': 2 }],
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'script': 'sub' }, { 'script': 'super' }],
  [{ 'indent': '-1' }, { 'indent': '+1' }],
  [{ 'direction': 'rtl' }],
  [{ 'size': ['small', false, 'large', 'huge'] }],
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ 'font': [] }],
  [{ 'color': [] }, { 'background': [] }],
  [{ 'align': [] }],
  ['clean'],
  ['link', 'image']
]

const STATICDOMAIN = 'http://p6ujmjz7y.bkt.clouddn.com/'
const LOCATION = 'http://upload.qiniu.com/'

export default {
  name: 'release',
  data () {
    return {
      release: {
        title: '',
        type: [],
        avatar: '',
        content: ''
      },
      releaseType: releaseTypeOption,
      editorOption: {
        modules: {
          toolbar: toolbarOption
        }
      },
      qnLocation: LOCATION,
      addRange: [],
      uploadData: {},
      fullscreenLoading: false
    }
  },
  computed: {
    releaseFull () {
      return Object.keys(this.release).every(item => this.release[item])
    }
  },
  mounted () {
    // 为图片ICON绑定事件, getModule为编辑器的内部属性
    this.$refs.quillEditor.quill.getModule('toolbar').addHandler('image', this.imgHandler)
  },
  methods: {
    onEditorChange ({ quill, html, text }) {
      this.release.content = html
    },
    // 点击图片ICON触发事件
    imgHandler (state) {
      this.addRange = this.$refs.quillEditor.quill.getSelection()
      if (state) {
        document.getElementById('imgInput').click()
      }
    },

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

    // 图片上传成功回调, 插入到编辑器中
    upSuccess (e) {
      this.fullscreenLoading = false
      let vm = this
      let url = STATICDOMAIN + e.key // 获得文件上传后的URL地址

      if (url != null && url.length > 0) { // 将文件上传后的URL地址插入到编辑器文本中
        let value = url
        // 获取光标位置对象，里面有两个属性，一个是index 还有 一个length，这里要用range.index，即当前光标之前的内容长度，然后再利用 insertEmbed(length, 'image', imageUrl)，插入图片即可。
        vm.addRange = vm.$refs.quillEditor.quill.getSelection()
        value = value.indexOf('http') !== -1 ? value : 'http:' + value
        vm.$refs.quillEditor.quill.insertEmbed(vm.addRange !== null ? vm.addRange.index : 0, 'image', value, Quill.sources.USER) // 调用编辑器的 insertEmbed 方法，插入URL
      } else {
        this.$message.error(`图片插入失败`)
      }
      this.$refs['upload'].clearFiles() // 插入成功后清除input的内容
    },

    // 封面图上传成功回调
    uploadAvatar (e) {
      this.fullscreenLoading = false
      this.release.avatar = STATICDOMAIN + e.key
    },

    async shot () {
      try {
        let response = await this.$axios.post('http://localhost:7001/createrelease', this.release)
        this.$message({
          message: response.data.message,
          type: response.data.status
        })
      } catch (e) {
        this.$message.error(e.data.message)
      }
      this.clearRelease()
    },
    clearRelease () {
      Object.keys(this.release).forEach(item => {
        this.release[item] = ''
      })
      this.$router.push('/homepage/daily')
    },
    cancelShot () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="sass" scoped>
  .editor
    margin: 0 20px

    .headline
      font-size: 24px
      font-weight: 700

    .release
      width: 30%
      margin-bottom: 10px

    .upload
      display: none

    .btn
      margin-top: 20px
</style>

<style lang="sass">
  .el-form-item__label
    margin-right: 30px
    font-weight: 600

  .ql-container
    height: 400px

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
