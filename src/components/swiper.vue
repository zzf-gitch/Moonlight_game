<script setup>
import { ref } from 'vue'
import gril from '@/assets/gril.png'
import Audi from '@/assets/奥迪.png'
const images = ref([gril,Audi])
</script>

<template>
  <div class="swiper-container">
    <van-swipe class="my-swipe" :autoplay="3000">
      <van-swipe-item v-for="image in images" :key="image">
        <img :src="image" />
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<style lang="scss" scoped>
.swiper-container{
  width: 100%;
  height: 200px;
  .my-swipe {
    width: 100%;
    height: 200px;
    .van-swipe-item img{
      width: 100%;
      height: 200px;
    }
  }
}
</style>
