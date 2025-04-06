<script setup name="GoodList">
import { ref } from "vue";
import NavBar from "@/components/NavBar.vue";
import Search from "@/components/Search.vue";
import Filtrate from "@/components/Filtrate.vue";
import GoodItem from "./components/good-item.vue";
import { fetchAllGoodList } from "@/api/good";
import { useRouter } from "vue-router";

const router = useRouter();

const list = ref([]);
const goodQuery = ref({
	likeKey: null, // 关键字
	highPrice: null, // 最高价
	lowPrice: null, // 最低价
	priceSort: 0, // 价格排序 0：升序 1：降序
	dateSort: 0, // 日期排序 0：升序 1：降序
	moreFilter: null, // 特殊标签id集合
	page: 1, // 当前页码
	rows: 10, // 每页显示条数
});
const loading = ref(false);
const finished = ref(false);

const getGoodList = async () => {
	loading.value = true;
	try {
		const resp = await fetchAllGoodList(goodQuery.value);
		loading.value = false;
		const { total, rows } = resp;
		if (rows.length > 0) {
			list.value = [...list.value, ...rows];
		}
		if (goodQuery.value.page === total || rows.length === 0) {
			finished.value = true;
		}
	} catch (e) {
		console.error(e, "getGoodList");
	}
};

// 搜索
const handleSearch = ({ keyword, min, max }) => {
	goodQuery.value.likeKey = keyword;
	goodQuery.value.lowPrice = min;
	goodQuery.value.highPrice = max;
	goodQuery.value.page = 1;
	list.value = [];
	finished.value = false;
	getGoodList();
};

// 价格排序
const handleSortPrice = (type) => {
	goodQuery.value.priceSort = type;
	goodQuery.value.page = 1;
	list.value = [];
	finished.value = false;
	getGoodList();
};

// 时间排序
const handleSortTime = (type) => {
	goodQuery.value.dateSort = type;
	goodQuery.value.page = 1;
	list.value = [];
	finished.value = false;
	getGoodList();
};
</script>

<template>
	<div class="only-nav-page-container">
		<nav-bar></nav-bar>
		<search @search="handleSearch"></search>
		<van-sticky :offset-top="46">
			<filtrate
				:is-show-more="false"
				@sortPrice="handleSortPrice"
				@sortTime="handleSortTime"
			></filtrate>
		</van-sticky>
		<!-- 商品列表 -->
		<van-list
			v-model:loading="loading"
			:finished="finished"
			finished-text="没有更多了"
			@load="getGoodList"
		>
			<van-swipe-cell
				v-for="item in list"
				:key="item.id"
			>
				<good-item
					:good-info="item"
					@click="router.push(`/good/detail/${item.id}`)"
				></good-item>
			</van-swipe-cell>
		</van-list>
	</div>
</template>

<style lang="scss" scoped>
.operate-button {
	height: 100%;
}
</style>
