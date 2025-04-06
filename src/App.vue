<script setup>
import { ref } from "vue";
import { RouterLink, RouterView, useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/modules/user";

const screenHeight = ref(667 + "px"); // 页面高度

// 重新设置页面 size
const resetPageMinSize = () => {
	screenHeight.value = window.innerHeight + "px";
};

window.addEventListener("resize", resetPageMinSize);
window.addEventListener("DOMContentLoaded", resetPageMinSize);

// 获取用户信息
const userStore = useUserStore();
userStore.fetchUserInfo();

const router = useRouter();
const go = () => {
	router.go(-1);
};
</script>

<template>
	<RouterView :style="{ height: screenHeight }" />
	<div
		class="button"
		@click="go"
	>
		<svg
			t="1734350642613"
			class="icon"
			viewBox="0 0 1024 1024"
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
			p-id="4277"
			width="16"
			height="16"
		>
			<path
				d="M287.400151 531.261693l421.193855 421.190785c-0.001023-0.071631 0.005117-0.151449 0.004093-0.224104 3.868097 4.548596 9.623171 7.442506 16.063861 7.442506 11.650341 0 21.094434-9.444093 21.094434-21.095457 0-6.640234-3.075035-12.555967-7.872295-16.423041l0.031722-0.021489L344.339977 528.555048c-13.616112-18.107403 0.182149-33.409924 0.292666-33.534767l392.724453-392.724453-0.190335-0.146333c5.024433-3.855818 8.277524-9.903557 8.277524-16.726963 0-11.651364-9.444093-21.094434-21.094434-21.094434-5.350868 0-10.221806 2.007727-13.9405 5.291516l0-0.023536-0.272199 0.272199c-0.466628 0.426719-0.914836 0.873903-1.341554 1.340531L284.65769 495.351831l0.107447 0.14224c-4.036943 4.380774-6.523577 10.213619-6.523577 16.638959C278.24156 519.866155 281.819039 526.756075 287.400151 531.261693z"
				p-id="4278"
				fill="#1296db"
			></path>
		</svg>
	</div>
</template>

<style scoped>
.button {
	position: fixed;
	z-index: 1000;
	width: 40px;
	height: 40px;
	border-radius: 50%;
	background: white;
	bottom: 120px;
	right: 30px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 18px;
	box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08),
		0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
}
</style>
