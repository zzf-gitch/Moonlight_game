<script setup>
import { ref, computed, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/modules/user";
import HomeHeader from "./components/home-header.vue";
import NavBar from "@/components/NavBar.vue";
import TabBar from "@/components/TabBar.vue";
import Good from "./components/home-good.vue";
import test from "@/assets/test.jpg";
import { removeToken, removeUserInfo } from "@/utils/token-util";
import { GetHomeList } from "@/api/home.js";
import Search from "@/components/Search.vue";
import { fetchWarInfo } from '@/api/home'
const router = useRouter();
const userStore = useUserStore();

// 下拉弹框偏移量
const offsetX = computed(() => {
	const bodyWidth = document.body.offsetWidth;
	const clientWidth = window.innerWidth;

	if (bodyWidth === clientWidth) {
		return 8;
	}

	return (clientWidth - bodyWidth) / 2 + 8;
});

/** 头像下拉框 */
const showPopover = ref(false);
const actions = ref([
	{ text: "个人中心", icon: "user-o" },
	// { text: "上传商品", icon: "plus" },
	{ text: "我的号源", icon: "cart-o" },
	// { text: "全部号源", icon: "shopping-cart-o" },
	{ text: "退出登录", icon: "replay" },
]);
const toggTab = (action) => {
	switch (action.text) {
		case "个人中心":
			router.push({ name: "User" });
			break;
		case "上传商品":
			router.push({ name: "GoodUpload" });
			break;
		case "我的号源":
			router.push({ name: "MyGoodList" });
			break;
		case "全部号源":
			router.push({ name: "GoodList" });
			break;
		case "退出登录":
			removeToken();
			removeUserInfo();
			window.location.reload();
			break;
	}
};

// 搜索商品关键词
const handleSearchGoods = ({ keyword, min, max }) => {
	goodQuery.value.words = keyword.split(" ");
	goodQuery.value.page = 1;
	list.value = [];
	finished.value = false;
	getGoodList();
};

// 更多筛选
const handleCategorize = (val) => {
	console.log("handleCategorize", val);
	// goodQuery.value.categories = val.length === 0 ? null : val;
	// goodQuery.value.page = 1;
	// list.value = [];
	// finished.value = false;
	// getGoodList();
};

// 综合排序
const sort = (val) => {
	goodQuery.value.orderType = val; // 0 综合排序 1 发布时间最晚 2 发布时间最早 3 价格由高到低 4 价格由低到高
	goodQuery.value.page = 1;
	list.value = [];
	finished.value = false;
	getGoodList();
};

// 游戏区服筛选
const onWarnInfo = (val) => {
	goodQuery.value.gameAreaId = val; // 游戏区服id
	goodQuery.value.page = 1;
	list.value = [];
	finished.value = false;
	getGoodList();
}

// 游戏区服
const WarnInfoList = async (goods) => {
	const res = await fetchWarInfo()
	return goods.map(item => {
		res.forEach(row => {
			row.children.forEach(val => {
				if (item.gameAreaId === val.id) {
					item.game_name = row.f_name + ' | ' + val.c_name
				}
			})
		})
		return item
	})
}

/** 商品列表 */
const list = ref([]);
const loading = ref(false);
const goodQuery = ref({
	words: [], // 关键字
	gameAreaId: null, // 游戏区服id
	orderType: 0, // 0 综合排序 1 发布时间最晚 2 发布时间最早 3 价格由高到低 4 价格由低到高
	page: 1, // 当前页码
	limit: 10, // 每页显示条数
	categories: [], // 更多筛选
	maxPrice: Infinity, // 更多筛选最大值
	minPrice: 0, // 更多筛选最小值
});
const finished = ref(false);
const refreshing = ref(false);
const ImageUrl = ref();

// 获取商品列表 上拉加载
const getGoodList = async () => {
	loading.value = true;
	try {
		const resp = await GetHomeList(goodQuery.value);
		const { total, goods, imgUrl } = resp;
		ImageUrl.value = imgUrl;
		if (goods.length > 0) {
			// 等待 WarnInfoList 执行完成
			const processedGoods = await WarnInfoList(goods);
			list.value = [...list.value, ...processedGoods];
			// 判断是否加载完所有数据
			if (goodQuery.value.page * goodQuery.value.limit >= total) {
				finished.value = true;
			} else {
				goodQuery.value.page += 1;
			}
		} else {
			finished.value = true;
		}
		setTimeout(() => {
			if (refreshing.value) {
				refreshing.value = false;
			}
			loading.value = false;
		}, 2000)
	} catch (e) {
		console.error(e, "getGoodList");
		loading.value = false;
		finished.value = true;
	}
};

// 跳转商品详情
const handleGoodDetail = (item) => {
	router.push({ name: "GoodDetail", params: { id: item.id, game_name: item.game_name } });
};

// 下拉刷新
const onRefresh = () => {
	// 重置查询条件和分页参数
	goodQuery.value = {
		words: [],
		gameAreaId: null,
		orderType: 0,
		page: 1,
		limit: 10,
		categories: [],
		maxPrice: Infinity,
		minPrice: 0
	};

	// 清空列表数据
	list.value = [];
	finished.value = false;
	refreshing.value = true;

	// 重新加载数据
	getGoodList();
};

</script>

<template>
	<div class="page-container">
		<!-- <NavBar :showLeft="false" :showRight="true">
			<template #right>
				<div class="login" v-if="!userStore.isLogin" @click="router.push({ name: 'Login' })">
					登录
				</div>
				<van-popover v-else v-model:show="showPopover" :actions="actions" :offset="[offsetX, 10]"
					placement="bottom-end" @select="toggTab">
					<template #reference>
						<img class="avatar" :src="test" />
					</template>
</van-popover>
</template>
</NavBar> -->
		<van-sticky>
			<search @search="handleSearchGoods">
				<template #left>
					<div class="login" v-if="!userStore.isLogin" @click="router.push({ name: 'Login' })">
						登录
					</div>
					<van-popover v-else v-model:show="showPopover" :actions="actions" :offset="[offsetX, 10]"
						placement="bottom-start" @select="toggTab">
						<template #reference>
							<img class="avatar" :src="test" />
						</template>
					</van-popover>
				</template>
			</search>
		</van-sticky>
		<van-sticky :offset-top="70">
			<home-header @search="handleSearchGoods" @handleCategorize="handleCategorize" @sort="sort"
				@onWarnInfo="onWarnInfo"></home-header>
		</van-sticky>

		<!-- 商品列表 -->
		<van-pull-refresh v-model="refreshing" @refresh="onRefresh">
			<van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="getGoodList">
				<template v-for="item in list" :key="item.id">
					<good :home-info="item" :ImageUrl="ImageUrl" @click="handleGoodDetail(item)"></good>
				</template>
			</van-list>
		</van-pull-refresh>

		<van-back-top right="15vw" bottom="1vh" />
		<!-- <TabBar /> -->
	</div>
</template>

<style lang="scss" scoped>
.page-container {
	// padding-top: $navbar-height;
	// padding-bottom: $tabbar-height;
}

.login {
	font-weight: 600;
	font-size: 14px;
}

:deep(.van-popover__wrapper) {
	display: flex;
}

.avatar {
	width: 28px;
	height: 28px;
	border-radius: 50%;
	background-color: #ccc;
}
</style>
