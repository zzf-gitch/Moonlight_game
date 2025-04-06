<script setup>
import {ref} from "vue";

const props = defineProps({
  data:Object
})

</script>

<template>
<div class="account-data">
  账号数据
</div>
</template>

<style scoped lang="scss">
.account-data{
  width: 100%;
  height: auto;
  background: #fff;
  padding: 10px;
  margin-top: 10px;
}
</style>
