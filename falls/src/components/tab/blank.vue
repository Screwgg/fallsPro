<template>
  <div class="blank">
    <img src="@/assets/empty.png">
    <span>未登录</span>
  </div>
</template>

<script>
export default {
  name: 'blank'
}
</script>

<style lang="sass" scoped>
  .blank
    height: 400px
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center

    img
      width: 150px
      display: inline-block

    span
      color: #606266
      font-weight: 600
</style>
