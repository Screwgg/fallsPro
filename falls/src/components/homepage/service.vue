<template>
  <div class="service">
    <collapse-list :outsourcingList="outsourcingList" :process="true" v-if="isEnterpriseUser"></collapse-list>
    <collapse-list :outsourcingList="outFinishList" :process="false"></collapse-list>
  </div>
</template>

<script>
import Cookie from 'js-cookie'
import CollapseList from '@/components/tab/collapse-list'
export default {
  name: 'service',
  components: { CollapseList },
  data () {
    return {
      outsourcingList: [],
      outFinishList: []
    }
  },
  computed: {
    isEnterpriseUser () {
      return Cookie.get('usertype') === '2'
    }
  },
  mounted () {
    if (this.isEnterpriseUser) {
      this.initOutsourcing()
    } else {
      this.initSuccessCont()
    }
  },
  methods: {
    async initOutsourcing () {
      try {
        this.outsourcingList = []
        this.outFinishList = []
        let response = await this.$axios.get('http://localhost:7001/findoutsourcing')
        if (response.data.status === 'error') {
          throw response
        }
        response.data.data.forEach(item => {
          if (!item.status) {
            this.outsourcingList.push(item)
          } else {
            this.outFinishList.push(item)
          }
        })
      } catch (e) {
        this.$message.error(e.data.message)
      }
    },
    async initSuccessCont () {
      try {
        this.outFinishList = []
        let response = await this.$axios.get('http://localhost:7001/findmyfilter')
        if (response.data.status === 'error') {
          throw response
        }
        this.outFinishList = response.data.data.map(item => item.outsourcingId)
      } catch (e) {
        this.$message.error(e.data.message)
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.service
  margin: 0 20px
</style>
