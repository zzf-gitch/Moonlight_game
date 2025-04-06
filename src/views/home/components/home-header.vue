<script setup>
import { nextTick, ref } from "vue";
// import Search from "@/components/Search.vue";
import Notice from "@/components/notice.vue";
import Swiper from "@/components/swiper.vue";
import GameCategory from "./game-category.vue";
import Filtrate from "@/components/Filtrate.vue";

const cateID = ref(void 0);
const categoryId = (val) => {
	nextTick(() => {
		cateID.value = val;
	});
};
</script>

<template>
	<div class="home-header">
		<!-- <search @search="$emit('search', $event)"></search> -->
		<!-- <notice></notice> -->
		<!-- <swiper></swiper> -->
		<!-- <game-category
			@categoryId="categoryId"
			@handleCategory="$emit('handleCategory', $event)"
			@handleCategoryTwo="$emit('handleCategoryTwo', $event)"
		></game-category> -->
		<!-- <filtrate @submit="$emit('submit', $event)" @onWarnInfo="$emit('onWarnInfo', $event)"
			@sort="$emit('sort', $event)" :categoryId="cateID"></filtrate> -->
		<filtrate @submit="$emit('submit', $event)" @onWarnInfo="$emit('onWarnInfo', $event)"
			@sort="$emit('sort', $event)" @handleCategorize="$emit('handleCategorize', $event)"></filtrate>
	</div>
</template>

<style lang="scss" scoped>
.home-header {
	width: 100%;
}
</style>
