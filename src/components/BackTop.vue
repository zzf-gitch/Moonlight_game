<script setup>
const emit = defineEmits([
	"scrollTriggerChange",
	"scrollTopChange",
	"containerChange",
]);
const props = defineProps({
	scrollTrigger: {
		type: Boolean,
	},
	scrollTop: {
		type: Number,
	},
});

// 返回顶部事件
const BackTop = () => {
	if (props.scrollTrigger) {
		return;
	}
	let steep = props.scrollTop / 2000;
	let timer = setInterval(() => {
		emit("scrollTriggerChange", true);
		emit("scrollTopChange", steep);
		steep += 20;
		if (props.scrollTop <= 0) {
			clearInterval(timer);
			emit("scrollTriggerChange", false);
		}
		emit("containerChange", props.scrollTop);
	}, 100);
};
</script>

<template>
	<div
		class="back-top"
		@click="BackTop"
	>
		<svg
			t="1734255365569"
			class="icon"
			viewBox="0 0 1024 1024"
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
			p-id="4282"
			width="16"
			height="16"
		>
			<path
				d="M966.4 668.8l-435.2-432c-9.6-9.6-25.6-9.6-35.2 0l-441.6 432c-9.6 9.6-9.6 25.6 0 35.2 9.6 9.6 25.6 9.6 35.2 0l425.6-416 416 416c9.6 9.6 25.6 9.6 35.2 0S976 678.4 966.4 668.8z"
				p-id="4283"
				fill="#1296db"
			></path>
		</svg>
	</div>
</template>

<style scoped lang="scss">
.back-top {
	position: fixed;
	z-index: 1000;
	width: 40px;
	height: 40px;
	border-radius: 50%;
	background: white;
	bottom: 60px;
	right: 30px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 18px;
	box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08),
		0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
}
</style>
