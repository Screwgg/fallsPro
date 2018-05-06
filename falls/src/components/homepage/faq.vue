<template>
  <div class="faq">
    <el-tabs type="card">
      <el-tab-pane label="我发起的提问">
        <qa-list :faqList="faqList.askList" type="ask" base="homepage"></qa-list>
      </el-tab-pane>
      <el-tab-pane label="有人@我">
        <qa-list :faqList="faqList.inviteList" type="invite" v-on:refresh="initFaq" base="homepage"></qa-list>
      </el-tab-pane>
      <el-tab-pane label="我围观的问题">
        <qa-list :faqList="faqList.onlookList" type="onlook" base="homepage"></qa-list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import QaList from '@/components/homepage/faq-list'
export default {
  name: 'faq',
  components: { QaList },
  data () {
    return {
      faqList: {
        askList: [],
        inviteList: [],
        onlookList: []
      }
    }
  },
  mounted () {
    this.initFaq()
  },
  methods: {
    async initFaq () {
      try {
        let response = await this.$axios.get('http://localhost:7001/findqa')
        if (response.data.status === 'error') {
          throw response
        }
        this.faqList = Object.assign({}, response.data.data)
      } catch (e) {
        this.$message.error(e.data.message)
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.faq
  margin: 0 20px
</style>
