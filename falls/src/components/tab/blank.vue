<template>
  <div class="blank">
    <img src="@/assets/empty.png">
    <span>立即登录与世界分享你刚画的飞机稿(๑˙ー˙๑)</span>
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
      padding: 8px
      color: #606266
</style>
