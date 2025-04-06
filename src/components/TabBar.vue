<template>
	<van-tabbar
		class="tabbar-container"
		v-model="active"
		route
		active-color="#ef5350"
	>
		<van-tabbar-item
			name="home"
			icon="home-o"
			to="/home"
			>首页</van-tabbar-item
		>
		<van-tabbar-item
			v-show="userStore.isLogin"
			name="upload"
			icon="plus"
			to="/good/upload"
			>上传商品</van-tabbar-item
		>
		<van-tabbar-item
			name="info"
			icon="user-o"
			to="/user"
			>个人中心</van-tabbar-item
		>
	</van-tabbar>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/modules/user";

const userStore = useUserStore();
const { push, currentRoute } = useRouter();
const active = ref("home");

onMounted(() => {
	resetPageMinSize();
});

const resetPageMinSize = () => {
	const dom = document.querySelector(".tabbar-container");
	let bodyWidth = document.body.offsetWidth;
	if (bodyWidth < 375) {
		bodyWidth = 375;
	}
	dom.style.width = bodyWidth + "px";
};

window.addEventListener("resize", resetPageMinSize);
window.addEventListener("DOMContentLoaded", resetPageMinSize);
</script>

<style lang="scss" scoped>
.tabbar-container {
	left: 50%;
	transform: translateX(-50%);
}
</style>
