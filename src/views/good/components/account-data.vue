<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  data: Object
});

// const accountData = [
//   { label: '商品标题', value: props.data?.name || '' },
//   { label: '上架情况', value: props.data?.status ? '上架中' : '已下架' || '' },
//   { label: '能否排位', value: props.data?.canRank || '' },
//   { label: '实名情况', value: props.data?.realNameStatus || '' },
//   { label: '有无防沉迷', value: props.data?.hasAddiction || '' },
//   { label: '英雄角色数', value: props.data?.heroCount || '' },
//   { label: '炫金武器数', value: props.data?.goldWeaponCount || '' },
//   { label: '王者武器数', value: props.data?.kingWeaponCount || '' },
// ];

const accountData = computed(() => {
  // 初始化数据
  const baseData = [
    { label: "商品标题", value: props.data?.name || "" },
    { label: "上架情况", value: props.data?.status ? "上架中" : "已下架" || "" },
  ]

  // 获取categories里面的数据
  const categoriesData = props.data?.categories.map(item => {
    
    if(item.type !== "val"){
      item.val = item.vals.map(k=> k.val).join(",")
    }

    return {
      label: item.name,
      value: item.val
    }
  })

  // 合并数据
  return [...baseData,...categoriesData]

})
</script>

<template>
  <div class="account-data">
    <table class="data-table">
      <tbody>
        <tr v-for="(item, index) in accountData" :key="index">
          <td class="label">{{ item.label }}</td>
          <td class="value">{{ item.value }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
.account-data {
  width: 100%;
  height: 100%;
  background: #fff;
  position: relative;
  display: flex;
  flex-direction: column;

  /* 移动端样式 */
  @media screen and (max-width: 767px) {
    padding: 10px 20px 10px 10px;
  }

  /* PC 端样式 */
  @media screen and (min-width: 768px) {
    padding: 10px;
  }

}

.data-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #eee;
  
  tr {
    border-bottom: 1px solid #eee;
    &:last-child {
      border-bottom: none;
    }
  }

  td {
    padding: 12px 15px;
    font-size: 14px;
    border: 1px solid #eee;
    
    &.label {
      width: 50%;
      color: #333;
      background: #fff;
      border-right: 1px solid #eee;
    }

    &.value {
      width: 50%;
      color: #333;
      background: #fff;
    }
  }
}
</style>
