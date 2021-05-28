<template>
  <div class='welcome-container'>
      <img src="../../assets/images/welcome.jpg" alt="">
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  async  created () {
    const { data } = await this.$http.get('menus')
    console.log(data)
  }
}
</script>

<style scoped lang='less'>
img{
    display: block;
    margin: 0 auto;
}</style>
