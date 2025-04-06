<script setup>
import { ref } from "vue";

const keyword = ref("");
const min = ref("");
const max = ref("");
</script>

<template>
	<div class="search-container flex_vcc">
		<div class="container flex_vbc">
			<slot name="left" class="slotImg"></slot>
			<div class="input flex_vbc">
				<input type="text" v-model="keyword" placeholder="输入关键词，多个关键词以空格键分开" class="keyword" />
				<!-- <input
				type="text"
				v-model="min"
				placeholder="最低价"
				class="min"
			/>
			<input
				type="text"
				v-model="max"
				placeholder="最高价"
				class="max"
			/> -->
				<van-icon class="search" name="search" color="#181818" size="25"
					@click="$emit('search', { keyword, min, max })" />
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.search-container {
	width: 100%;
	height: 70px;
	background-color: $main-background-color;
	padding-right: 10px;
}

.container {
	width: 100%;
	height: 100%;
	border-radius: 10px;
	padding: 0 10px;
}

input {
	height: 45px;
	line-height: 45px;
	text-align: center;
	border-bottom: none;
	font-size: 14px;
}

.slotImg {
	flex: 1;
}

.input {
	border: 1px solid #e7e7e7;
	border-radius: 10px;
	flex: 2;
	margin-left: 10px;
	background: #fff;
}

.keyword {
	flex: 1;
}

.min {
	width: 20%;
	margin: 0 18px;
}

.max {
	width: 20%;
	margin-right: 20px;
}

.search {
	width: 45px;
	height: 45px;
	text-align: center;
	line-height: 45px;
}
</style>
