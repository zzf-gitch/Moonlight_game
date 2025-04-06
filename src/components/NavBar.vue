<script setup>
import { useRoute, useRouter } from "vue-router";
import { onMounted } from "vue";

defineProps({
	// 显示左边插槽
	showLeft: {
		type: Boolean,
		default: true,
	},
	// 显示右边插槽
	showRight: {
		type: Boolean,
		default: false,
	},
});

const meta = useRoute().meta;
const title = meta.title;
const router = useRouter();

onMounted(() => {
	resetPageMinSize();
});

// 返回
const handleReturn = () => {
	if (window.history.length <= 1) {
		// 没有上一页可回退则跳转首页
		router.push({ name: "Home" });
	} else {
		router.back();
	}
};

const resetPageMinSize = () => {
	const dom = document.querySelector(".nav-bar-container");
	let bodyWidth = document.body.offsetWidth;
	if (bodyWidth < 375) {
		bodyWidth = 375;
	}
	dom.style.width = bodyWidth + "px";
};

window.addEventListener("resize", resetPageMinSize);
window.addEventListener("DOMContentLoaded", resetPageMinSize);
</script>

<template>
	<van-nav-bar
		class="nav-bar-container"
		fixed
		:title="title"
		@click-left="handleReturn"
	>
		<template
			#left
			v-if="showLeft"
		>
			<van-icon
				name="arrow-left"
				size="20"
				color="#181818"
			/>
		</template>
		<template
			#right
			v-if="showRight"
		>
			<!-- 暴露组件的具名插槽 -->
			<slot name="right"></slot>
		</template>
	</van-nav-bar>
</template>

<style lang="scss" scoped>
.nav-bar-container {
	left: 50%;
	transform: translateX(-50%);
}

.avatar {
	width: 20px;
	height: 20px;
	background-color: #f00;
}
</style>
