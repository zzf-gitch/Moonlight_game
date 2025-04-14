<script setup name="MyGoodList">
import { ref, computed, onMounted, watch, nextTick } from "vue";
import NavBar from "@/components/NavBar.vue";
import Search from "@/components/Search.vue";
import Filtrate from "@/components/Filtrate.vue";
import GoodItem from "./components/good-item.vue";
import { GetMyList, EditStatus, DeleteMyList } from "@/api/good";
import { showSuccessToast } from "vant";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import { fetchWarInfo } from '@/api/home'

const router = useRouter();

const userStore = useUserStore();
const list = ref([]);
const info = computed(() => userStore.info ?? {})

// 确保在组件挂载时获取用户信息
// onMounted(async () => {
// 	if (!userStore.info) {
// 		await userStore.fetchUserInfo();
// 	} else {
// 		// 如果已有用户信息，直接设置ID并获取列表
// 		goodQuery.value.id = userStore.info.id;
// 		getGoodList();
// 	}
// });

// 监听用户信息变化
// watch(info, (newInfo) => {
// 	if (newInfo?.id && goodQuery.value.id !== newInfo.id) {
// 		goodQuery.value.id = newInfo.id;
// 		// 重置列表并获取数据
// 		list.value = [];
// 		finished.value = false;
// 		getGoodList();
// 	}
// }, { immediate: false }); // 移除immediate: true，避免初始化时重复调用

// 搜索
const handleSearch = ({ keyword, min, max }) => {
	goodQuery.value.words = keyword.trim().split(/\s+/);
	goodQuery.value.page = 1;
	list.value = [];
	finished.value = false;
	getGoodList();
};

const goodQuery = ref({
	id: info.value.id, // 用户id
	page: 1, // 当前页码
	limit: 10, // 每页显示条数
	words: [] // 关键字
});

const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const ImageUrl = ref();

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

// 获取我的号源 上拉加载
const getGoodList = async () => {
	loading.value = true;
	try {
		const resp = await GetMyList(goodQuery.value);
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

// 下拉刷新
const onRefresh = () => {
	// 重置查询条件和分页参数
	goodQuery.value = {
		page: 1,
		limit: 10,
		id: info.value.id,
		words: []
	};

	// 清空列表数据
	list.value = [];
	finished.value = false;
	refreshing.value = true;

	// 重新加载数据
	getGoodList();
};

// 跳转商品详情
const handleGoodDetail = (item) => {
	router.push({ name: "GoodDetail", params: { id: item.id, game_name: item.game_name } });
};

// 商品操作
const showActionSheet = ref(false);
const pressTimer = ref(null);

// 长按开始
const current = ref(null)
const startLongPress = (e, item) => {
	// 检查事件源是否为商品图片区域
	const coverElement = e.target.closest('.cover');
	if (!coverElement) return;

	if (e.type === 'mousedown' && e.button !== 0) return; // 仅响应左键

	// 添加contextmenu事件监听器
	const preventContextMenu = (e) => {
		e.preventDefault();
		document.removeEventListener('contextmenu', preventContextMenu);
	};

	pressTimer.value = setTimeout(() => {
		// 在长按触发时添加contextmenu事件监听器
		document.addEventListener('contextmenu', preventContextMenu);
		showActionSheet.value = true;
		current.value = item ?? null;
		pressTimer.value = null;
	}, 600);
};

// 长按结束
const endLongPress = (e) => {
	clearTimeout(pressTimer.value);
};

// 判断设备类型
const isMobileDevice = () => {
	const userAgent = navigator.userAgent.toLowerCase();
	const mobileKeywords = [
		'android', 'iphone', 'ipod', 'ipad', 'windows phone', 'blackberry', 'webos',
		'opera mini', 'iemobile', 'mobile'
	];
	return mobileKeywords.some(keyword => userAgent.includes(keyword));
};

// ActionSheet 配置项
const actions = [
	{ name: '上架/下架商品' },
	{ name: '删除商品', color: '#ee0a24' }
];

// 处理选项点击
const onSelect = async (action) => {
	if (action.name === '上架/下架商品') {
		try {
			const res = await EditStatus({
				id: current.value.id,
				info: { status: current.value.status ? false : true }
			});
			showSuccessToast(res);
			showActionSheet.value = false
			goodQuery.value.page = 1;
			list.value = [];
			finished.value = false;
			getGoodList();
		} catch (e) {
			console.error(e, "handleGoodOperate");
		}
	} else {
		try {
			const res = await DeleteMyList({
				ids: [current.value.id],
			});
			showSuccessToast(res);
			showActionSheet.value = false
			goodQuery.value.page = 1;
			list.value = [];
			finished.value = false;
			getGoodList();
		} catch (e) {
			console.error(e, "handleGoodOperate");
		}
	}
};

</script>

<template>
	<div class="only-nav-page-container">
		<nav-bar></nav-bar>
		<van-sticky>
			<search @search="handleSearch"></search>
		</van-sticky>
		<!-- <van-sticky :offset-top="70">
			<filtrate
				:is-show-more="false"
				@sortPrice="handleSortPrice"
				@sortTime="handleSortTime"
			></filtrate>
		</van-sticky> -->
		<!-- 商品列表 -->
		<van-pull-refresh v-model="refreshing" @refresh="onRefresh">
			<van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="getGoodList">
				<van-swipe-cell v-for="(item, index) in list" :key="item.id">
					<div class="good-item-wrapper" 
						@touchstart="isMobileDevice() ? startLongPress($event, item) : null"
						@touchend="isMobileDevice() ? endLongPress() : null"
						@mousedown="!isMobileDevice() ? startLongPress($event, item) : null"
						@mouseup="!isMobileDevice() ? endLongPress() : null"
						@mouseleave="!isMobileDevice() ? endLongPress() : null" 
						@click.stop="handleGoodDetail(item)">
						<good-item :good-info="item" :ImageUrl="ImageUrl" :good-index="index"></good-item>
					</div>
				</van-swipe-cell>
			</van-list>
		</van-pull-refresh>

		<van-back-top right="15vw" bottom="6vh" />

		<!-- ActionSheet 组件 -->
		<van-action-sheet v-model:show="showActionSheet" :actions="actions" @select="onSelect" />
	</div>
</template>

<style lang="scss" scoped>
.operate-button {
	height: 100%;
}

.good-item-wrapper {
	width: 100%;
	cursor: pointer;
}
</style>
