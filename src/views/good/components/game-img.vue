<script setup>
import { ref, computed } from 'vue'
import { showImagePreview, showLoadingToast, showSuccessToast } from "vant"
const props = defineProps({
  data: Object,
  ImageUrl: String,
})

// 预览详情图
const previewImages = computed(() => {
  return props.data.images.map(item => {
    return props.ImageUrl + item
  })
})
const previewImage = (item, index) => {
  showImagePreview({
    images: previewImages.value,
    startPosition: index,
    closeable: true,
  })
}

// 保存长图
// 加载单张图片
const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // 处理跨域问题
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = url;
  });
};

// 拼接并下载长图
const stitchAndDownload = async () => {
  try {
    showLoadingToast({
      message: '正在生成长图...',
      forbidClick: true,
      duration: 0,
      loadingType: 'spinner'
    });
    // 并行加载所有图片
    const images = await Promise.all(previewImages.value.map(url => loadImage(url)));

    // 计算画布尺寸
    let totalHeight = 0;
    let maxWidth = 0;
    images.forEach(img => {
      totalHeight += img.height;
      maxWidth = Math.max(maxWidth, img.width);
    });

    // 创建画布
    const canvas = document.createElement('canvas');
    canvas.width = maxWidth;
    canvas.height = totalHeight;
    const ctx = canvas.getContext('2d');

    // 垂直拼接图片
    let yOffset = 0;
    images.forEach(img => {
      ctx.drawImage(img, 0, yOffset, img.width, img.height);
      yOffset += img.height;
    });

    // 生成下载链接
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = '商品详情.png';
    link.href = dataUrl;
    link.click();

    showSuccessToast('下载完成');
  } catch (error) {
    console.error('图片处理出错:', error);
    showToast('图片加载失败，请检查图片地址和跨域权限');
  }
};

// 复制编号
const copyText = (text) => {
  // 1. 创建临时输入元素
  const input = document.createElement('textarea');
  input.value = text;
  input.style.position = 'fixed'; // 避免移动端键盘弹出
  document.body.appendChild(input);

  // 2. 选中文本（移动端可能需要焦点）
  input.select();
  input.setSelectionRange(0, 99999); // 兼容移动端

  try {
    // 3. 执行复制（必须在用户同步操作中）
    document.execCommand('copy');
    showSuccessToast('复制成功');
  } catch (err) {
    showSuccessToast('复制失败，请手动复制');
  } finally {
    // 4. 清理元素
    document.body.removeChild(input);
  }
}

const copy = async () => {
  try {
    // 请求剪贴板权限（部分浏览器需要）
    const permission = await navigator.permissions.query({ name: 'clipboard-write' });
    if (permission.state === 'granted' || permission.state === 'prompt') {
      await navigator.clipboard.writeText(`商品编号：${props.data.keyword}\n商品标题：${props.data.name}\n描述信息：${props.data.desc}`);
      showSuccessToast('复制成功');
    } else {
      throw new Error('无剪贴板权限');
    }
  } catch (err) {
    // 降级到方案一
    copyText(`商品编号：${props.data.keyword}\n商品标题：${props.data.name}\n描述信息：${props.data.desc}`);
  }
}

</script>

<template>
  <div class="game-img">
    <div class="Image" v-for="(item, index) in data.images" :key="index" @click="previewImage(item, index)">
      <img :src="ImageUrl + item" alt="">
    </div>

    <van-button type="primary" class="copy" @click="copy">一键复制</van-button>
    <van-button type="primary" class="saveImage" @click="stitchAndDownload">保存长图</van-button>
  </div>
</template>

<style scoped lang="scss">
.game-img {
  width: 100%;
  height: auto;
  background: #fff;
  position: relative;

  /* 移动端样式 */
  @media screen and (max-width: 767px) {
    padding: 10px 20px 10px 10px;
  }

  /* PC 端样式 */
  @media screen and (min-width: 768px) {
    padding: 10px;
  }

  .Image {
    width: 100%;
    height: 100%;
    font-size: 0;
    display: block;

    img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }

  .copy {
    position: fixed;
    bottom: 50px;
    left: 50px;
    width: 100px;
    height: 40px;
  }

  .saveImage {
    position: fixed;
    bottom: 50px;
    right: 50px;
    width: 100px;
    height: 40px;
  }

}
</style>
