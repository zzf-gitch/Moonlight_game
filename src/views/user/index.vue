<script setup name="User">
import NavBar from "@/components/NavBar.vue";
import TabBar from "@/components/TabBar.vue";
import UserHeader from "./components/user-header.vue";
import AccountVerification from "./components/account-verification.vue";
import Feature from "./components/feature.vue";
import { removeToken , removeUserInfo } from "@/utils/token-util";
import { useUserStore } from "@/stores/modules/user";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

const handleLogout = () => {
	removeToken();
	removeUserInfo();
	window.location.reload();
};

const handleLogin = () => {
	if (!userStore.isLogin) {
		router.push({ name: "Login" });
	}
};
</script>

<template>
	<div class="page-container flex_csc">
		<NavBar
			:show-left="true"
			title="个人中心"
		></NavBar>
		<user-header></user-header>
		<account-verification v-if="!userStore.isLogin"></account-verification>
		<feature v-else></feature>
		<button
			class="signout-button"
			v-if="userStore.isLogin"
			@click="handleLogout"
		>
			退出登录
		</button>
		<button
			class="signout-button"
			v-else
			@click="handleLogin"
		>
			登录
		</button>
		<!-- <TabBar></TabBar> -->
	</div>
</template>

<style lang="scss" scoped>
.page-container {
	padding: calc($navbar-height + 20px) 10px calc($tabbar-height + 20px);
	background: #fafafa;
}

.signout-button {
	width: 80%;
	margin-top: auto;
	background: #ef5350;
	height: 47px;
	border-radius: 5px;
	color: #fff;
	font-weight: 600;
}
</style>
