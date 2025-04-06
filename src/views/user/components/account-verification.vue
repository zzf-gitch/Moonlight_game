<script setup>
import { showToast } from "vant";
import { ref } from "vue";
import { UserVerifyCts } from '@/api/user'

const value = ref("");

const handleAccountVerification = async() => {
	const text = value.value;
	if (text.length === 0) {
		showToast("请输入客服账号");
		return;
	}

	const res = await UserVerifyCts(text)
	showToast(res ? '客服验证成功' : '客服验证失败')
	// showToast("当前输入的帐号是 " + text);
};
</script>

<template>
	<div class="container flex_vbc">
		<img src="@/assets/qq.png" class="icon" />
		<img src="@/assets/weixin.png" class="icon" />

		<input v-model="value" type="text" placeholder="请输入客服账号" class="input"/>

		<button class="signout-button" @click="handleAccountVerification">验证</button>
	</div>
</template>

<style lang="scss" scoped>
.container {
	width: 100%;
	margin-top: 20px;
	height: 54px;
	border-radius: 15px;
	padding: 0 5px;
	background: #fff;
}

.input {
	margin-left: 5px;
	margin-right: 8px;
	height: 80%;
	padding: 0 10px;
	// border-left: 1px solid #eeeeee;
	border: 1px solid #ececee;
	border-radius: 10px;
}

.signout-button {
	width: 80%;
	background: #ef5350;
	height: 40px;
	border-radius: 5px;
	color: #fff;
	font-weight: 600;
}
</style>
