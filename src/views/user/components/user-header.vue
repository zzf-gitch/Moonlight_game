<script setup>
import { useUserStore } from "@/store/modules/user";
import { useRouter } from "vue-router";
import test from '@/assets/test.jpg'

const userStore = useUserStore();
const router = useRouter();

</script>

<template>
	<div class="user-header-container flex_vsc">
		<!-- <img src="@/assets/test.jpg" class="avatar" @click="handleLogin" v-if="userStore.isLogin"/> -->
		<div class="info-container" v-if="userStore?.isLogin">
			<p class="name">昵称: {{ userStore.info?.username }}</p>
			<p class="role"><span style="color: #b4b4b5;">等级: {{ userStore.info?.role === 1 ? '管理员' : '号商' }}</span><span style="color: #b4b4b5;margin-left: 20px;">标识: {{ userStore.info.keyword }}</span></p>
		</div>
 
		<img :src="test" alt="" v-if="!userStore?.isLogin">
	</div>
</template>

<style lang="scss" scoped>
.user-header-container {
	width: 100%;
	height: 150px;
	background: #edeef0;
	border-radius: 15px;
	img{
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 15px;
	}
}

.avatar {
	width: 90px;
	height: 90px;
	border-radius: 50%;
	margin-left: 20px;
	border: 2px solid #fff;
}

.info-container {
	margin-left: 30px;
	.name{
		font-size: 25px;
		font-weight: 600;
	}
	.role{
		margin-top: 15px;
	}
}
</style>
