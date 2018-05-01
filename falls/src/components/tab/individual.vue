<template>
  <div>
    <el-card class="box-card" v-if="isEnterpriseUser">
      <div slot="header" class="clearfix">
        <span>发布私单</span>
        <el-button class="button" type="text" @click="shotIndividual" :disabled="!individualFull">发送</el-button>
      </div>
      <div>
        <el-form :model="individual" label-width="120px">
          <el-form-item label="主题">
            <el-input v-model="individual.theme" placeholder="请输入主题" class="individual"></el-input>
          </el-form-item>
          <el-form-item label="需求详情">
            <el-input v-model="individual.demand" placeholder="请输入需求详情" type="textarea" :rows="6" class="individual"></el-input>
          </el-form-item>
          <el-form-item label="酬金(¥)">
            <el-input-number v-model="individual.bonus" :step="1000" placeholder="请输入酬金" class="individual individual-tiny"></el-input-number>
          </el-form-item>
          <el-form-item label="截止日期">
            <el-date-picker
              v-model="individual.deadline"
              type="daterange"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              name="se"
              id="se"
              class="individual individual-short">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <collapse-list :outsourcingList="outsourcingList" :process="true"></collapse-list>
  </div>
</template>

<script>
import moment from 'moment'
import Cookie from 'js-cookie'
import CollapseList from '@/components/tab/collapse-list'
export default {
  name: 'individual',
  components: { CollapseList },
  data () {
    return {
      isEnterpriseUser: false,
      individual: {
        theme: '',
        demand: '',
        bonus: 0,
        deadline: ''
      },
      outsourcingList: []
    }
  },
  computed: {
    individualFull () {
      return Object.keys(this.individual).every(item => this.individual[item])
    }
  },
  mounted () {
    if (Cookie.get('usertype') === '2') {
      this.isEnterpriseUser = true
    }
    this.initOutsourcing()
  },
  methods: {
    async shotIndividual () {
      try {
        this.individual.deadline = JSON.stringify(this.individual.deadline.map(item => moment(item).toISOString()))
        let response = await this.$axios.post('http://localhost:7001/createoutsourcing', this.individual)
        if (response.data.status === 'error') {
          throw response
        }
        this.$message.success(response.data.message)
      } catch (e) {
        this.$message.error(e.data.message)
      }
      this.clearIndividual()
      this.initOutsourcing()
    },
    clearIndividual () {
      Object.keys(this.individual).forEach(item => {
        if (item === 'bonus') {
          this.individual[item] = 0
        } else {
          this.individual[item] = ''
        }
      })
    },
    async initOutsourcing () {
      try {
        this.outsourcingList = []
        let response = await this.$axios.get('http://localhost:7001/findalloutsourcing')
        if (response.data.status === 'error') {
          throw response
        }
        response.data.data.forEach(item => {
          if (!item.status) {
            this.outsourcingList.push(item)
          }
        })
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

  .individual
    width: 80%
    margin-bottom: 10px

  .individual-short
    width: 30%

  .individual-tiny
    width: 16%
</style>

<style lang="sass">
  .el-form-item__label
    margin-right: 30px
    font-weight: 600
</style>
