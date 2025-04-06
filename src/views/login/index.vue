<script setup name="Login">
import { ref } from "vue";
import NavBar from "@/components/NavBar.vue";
import { UserLogin } from "@/api/login.js";
import { setToken , setUserInfo } from "@/utils/token-util";
import { useUserStore } from "@/stores/modules/user";
import { showSuccessToast } from "vant";
import { useRouter } from "vue-router";

const loginData = ref({
	passport: "",
	password: "",
});
const userStore = useUserStore();
const router = useRouter();

const handleLogin = async () => {
	try {
		const resp = await UserLogin(loginData.value);
		showSuccessToast("登录成功");
		setToken(resp.access_token, true);
		// setUserInfo(resp.user, true)
		userStore.fetchUserInfo(); // 获取用户信息
		// 返回个人中心
		router.push({ name: "User" });
	} catch (e) {
		console.error(e, "handleLogin");
	}
};
</script>

<template>
	<div class="only-nav-page-container flex_csc">
		<NavBar />
		<div class="banner">
			<img
				src="@/assets/test.jpg"
				alt=""
			/>
		</div>
		<van-form @submit="handleLogin">
			<van-cell-group class="input-item">
				<van-field
					v-model="loginData.passport"
					name="用户名"
					label="用户名"
					placeholder="请输入用户名"
					:rules="[{ required: true, message: '仅授权商户可登录' }]"
				/>
			</van-cell-group>
			<van-cell-group class="input-item">
				<van-field
					v-model="loginData.password"
					name="密码"
					label="密码"
					placeholder="请输入密码"
					type="password"
					:rules="[{ required: true, message: '请输入密码' }]"
				/>
			</van-cell-group>
			<van-button
				block
				class="login-button"
				type="primary"
				size="large"
				color="#ef5350"
				native-type="submit"
			>
				登 录
			</van-button>
		</van-form>
	</div>
</template>

<style lang="scss" scoped>
.only-nav-page-container {
	padding: 40px 30px;
}

.banner {
	width: 100%;
	height: 150px;
	margin-top: 40px;
	margin-bottom: 40px;
	border-radius: 7px;
	overflow: hidden;

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
}

:deep(.van-form) {
	width: 100%;
}

.input-item {
	width: 100%;
	border-radius: 5px;
	overflow: hidden;
	margin-bottom: 10px;
}

.login-button {
	margin-top: 150px;
	height: 47px;
}
</style>
