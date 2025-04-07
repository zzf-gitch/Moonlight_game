<script setup>
import { ref, computed } from "vue";
import { useRoute } from 'vue-router'
import { showSuccessToast } from 'vant';
import { useUserStore } from "@/store/modules/user";
const userStore = useUserStore();
const { params } = useRoute()
const props = defineProps({
  data: Object
})

// 格式化时间
const formatTime = computed(() => {
  if (!props.data?.createTime) return '';
  const date = new Date(props.data?.createTime);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
});

const lineactive = ref(false)
const mouseenter = (e) => {
  // 阻止默认行为，避免触发其他事件
  e?.preventDefault?.()
  if (isMobileDevice()) {
    console.log('手机端');
    copy()
  } else {
    console.log('PC端');
  }
  lineactive.value = true
}
const mouseleave = (e) => {
  // 阻止默认行为，避免触发其他事件
  e?.preventDefault?.()
  lineactive.value = false
}

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
      await navigator.clipboard.writeText(props.data.keyword);
      showSuccessToast('复制成功');
    } else {
      throw new Error('无剪贴板权限');
    }
  } catch (err) {
    // 降级到方案一
    copyText(props.data.keyword);
  }
}

// 判断设备类型
const isMobileDevice = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = [
    'android', 'iphone', 'ipod', 'ipad', 'windows phone', 'blackberry', 'webos',
    'opera mini', 'iemobile', 'mobile'
  ];
  return mobileKeywords.some(keyword => userAgent.includes(keyword));
};

</script>

<template>
  <div class="detail-header">
    <div class="other-container flex_vbc">
      <div class="price" :style="{ textDecoration: userStore?.isLogin ? 'line-through' : 'none' }">{{
        Number(data?.price).toFixed(2) }}</div>
      <div class="outher-price" v-if="userStore.isLogin">{{ Number(data?.othersPrice).toFixed(2) }}</div>
      <div class="time">
        <p>编号：{{ data?.keyword }}</p>
        <div>
          <i class="iconfont icon-shouqifuzhi" :class="{ active: lineactive }" title="复制" @click="copy"
            @mouseenter="mouseenter" @mouseleave="mouseleave" @touchstart="mouseenter" @touchend="mouseleave"></i>
        </div>
      </div>
    </div>

    <div class="desc-container flex_cbc">
      <div class="desc">
        {{ data?.desc }}
      </div>
    </div>

    <div class="container_time flex_vbc">
      <div class="name">
        <p>{{ params?.game_name }}</p>
      </div>
      <div class="time">
        <p>时间：{{ formatTime }}</p>
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss">
.detail-header {
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 10px #ccc;
  background-color: #fff;

  /* 移动端样式 */
  @media screen and (max-width: 767px) {
    margin: 10px 20px 10px 15px;
  }

  /* PC 端样式 */
  @media screen and (min-width: 768px) {
    margin: 10px 15px 10px 15px;
  }


  .desc-container {
    padding: 0 10px 10px 0;
    width: 100%;
    align-self: stretch;

    .desc {
      font-size: 14px;
      width: 100%;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 5;
      /* 限制文本的行数 */
      overflow: hidden;
      font-weight: bolder;
    }

  }

  .other-container {
    width: 100%;
    flex: 1;
    padding: 0 10px 10px 0;

    .time {
      font-size: 12px;
      padding-bottom: 5px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .icon-shouqifuzhi {
        margin-left: 5px;
        font-size: 20px;
        cursor: pointer;
      }

      .active {
        color: #feaf00;
      }

    }

    .price {
      font-size: 16px;
      color: red;
      font-weight: bold;
      position: relative;
    }

    .price::before {
      content: "¥";
      font-size: 16px;
      font-weight: bold;
      margin-right: 2px;
    }

    .outher-price {
      font-size: 16px;
      color: #3c8cff;
      font-weight: bold;

      /* 移动端样式 */
      @media screen and (max-width: 767px) {
        margin-left: -25px;
      }

      /* PC 端样式 */
      @media screen and (min-width: 768px) {
        margin-left: -80px;
      }
    }

    .outher-price::before {
      content: "¥";
      font-size: 16px;
      font-weight: bold;
      margin-right: 2px;
    }

  }

  .container_time {
    width: 100%;
    padding: 0 10px 10px 0;

    .name {
      font-size: 12px;
    }

    .time {
      font-size: 10px;
      color: #e7e7e7;
    }
  }

}
</style>
