<script setup>
import { ref,computed } from 'vue'
import { showImagePreview } from "vant"
const props = defineProps({
  data:Object,
  detailArr:Array
})

// 预览详情图
const previewImage = (item,index) => {
  showImagePreview({
    images:props.detailArr,
    startPosition:index,
    closeable: true,
  })
}
</script>

<template>
<div class="game-img">
  游戏截图
</div>
</template>

<style scoped lang="scss">
.game-img{
  width: 100%;
  height: auto;
  background: #fff;
  padding: 10px;
  margin-top: 10px;
}
</style>
