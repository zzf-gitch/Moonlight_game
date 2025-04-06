<template>
	<div class="filtrate-container">
		<van-dropdown-menu ref="menuRef" :overlay="overlay" :duration="duration">
			<van-dropdown-item title="游戏区服" ref="itemRef">
				<van-tree-select v-model:active-id="activeId" v-model:main-active-index="activeIndex" :items="items" />
				<div style="padding: 10px 15px;display: flex;">
					<van-button type="default" block round @click="onWarnInfoAll" style="flex: 2;">
						全部服务器
					</van-button>
					<van-button type="danger" block round @click="onWarnInfo" style="flex: 1;margin-left: 10px;">
						筛选
					</van-button>
				</div>
			</van-dropdown-item>
			<van-dropdown-item v-model="value" :options="options" @change="sort" />
			<van-dropdown-item title="筛选" ref="itemRef" @open="openSelect">
				<van-action-sheet v-model:show="show" title="筛选" @close="closeSelect">	
					<div style="padding: 10px 15px;display: flex;">
						<van-button type="default" block round @click="onConfirm" style="flex: 1;">
							清空
						</van-button>
						<van-button type="danger" block round @click="onConfirm" style="flex: 1;margin-left: 10px;">
							筛选
						</van-button>
					</div>
				</van-action-sheet>
			</van-dropdown-item>
		</van-dropdown-menu>
	</div>

	<!-- <Popup
		ref="popup"
		v-if="showPopup"
		v-model="showPopup"
		@submit="submit"
	/> -->
</template>

<script setup>
import { ref, reactive, nextTick } from "vue";
import { fetchWarInfo } from '@/api/home'
import Popup from "./popup.vue";
const emit = defineEmits(["submit", "sort", "onWarnInfo", "handleCategorize"]);
const submit = (val) => {
	emit("submit", val);
};
const props = defineProps({
	categoryId: {
		type: Number,
	},
	// 显示更多筛选
	isShowMore: {
		type: Boolean,
		default: true,
	},
});

const showPopup = ref(false);
const popup = ref(null);
const ShowPopup = () => {
	showPopup.value = true;
	nextTick(() => {
		popup.value.tagList(props.categoryId);
	});
};

const show = ref(false)
const overlay = ref(true)
const duration = ref(0.2)
const menuRef = ref(null);
const itemRef = ref(null);
const value = ref(0);
const switch1 = ref(false);
const switch2 = ref(false);
const options = [
	{ text: '综合排序', value: 0 },
	{ text: '发布时间最晚', value: 1 },
	{ text: '发布时间最早', value: 2 },
	{ text: '价格由高到低', value: 3 },
	{ text: '价格由低到高', value: 4 },
];

// 综合排序
const sort = (val) => {
	emit('sort', val)
}

// 筛选
const openSelect = () => {
	duration.value = 0
	overlay.value = false
	nextTick(() => {
		show.value = true
	})
}

const closeSelect = () => {
	show.value = false
	duration.value = 0.2
	overlay.value = true
	nextTick(() => {
		menuRef.value.close();
	})
}

const onConfirm = () => {
	// itemRef.value.toggle();
	// 或者
	emit('handleCategorize', '分类筛选')
	show.value = false
	duration.value = 0.2
	overlay.value = true
	nextTick(() => {
		menuRef.value.close();
	})
};

const activeId = ref();
const activeIndex = ref();
const items = ref([])

const WarInfoList = async () => {
	const res = await fetchWarInfo()
	items.value = res.map(item => {
		let children = []
		children = item.children.map(row => {
			return {
				text:row.c_name,
				id:row.id
			}
		})
		return {
			text:item.f_name,
			children: children
		}
	})
	activeId.value = res[0].children[0].id
}

WarInfoList()

// 游戏区服筛选
const onWarnInfo = (e) => {
	emit('onWarnInfo', activeId.value)
	menuRef.value.close();
}

// 游戏区服全部服务器
const onWarnInfoAll = (e) => {
	emit('onWarnInfo', null)
	activeId.value = items.value[0].children[0].id
	activeIndex.value = void 0
	menuRef.value.close();
}

// const items = ref([
// 	{
// 		text: '东部战区',
// 		children: [
// 			{ text: '福建一区', id: 1 },
// 			{ text: '浙江一区', id: 2 },
// 			{ text: '教育大区', id: 3 },
// 			{ text: '安徽一区', id: 4 },
// 			{ text: '上海一区', id: 5 },
// 			{ text: '浙江二区', id: 6 },
// 			{ text: '江苏一区', id: 7 },
// 			{ text: '移动专区', id: 8 },
// 			{ text: '上海二区', id: 9 },
// 			{ text: '江苏二区', id: 10 },
// 		],
// 	},
// 	{
// 		text: '南部战区',
// 		children: [
// 			{ text: '江西一区', id: 11 },
// 			{ text: '湖北一区', id: 12 },
// 			{ text: '广东二区', id: 13 },
// 			{ text: '南方大区', id: 14 },
// 			{ text: '湖北二区', id: 15 },
// 			{ text: '广东三区', id: 16 },
// 			{ text: '湖南一区', id: 17 },
// 			{ text: '广东一区', id: 18 },
// 			{ text: '广东四区', id: 19 },
// 			{ text: '湖南二区', id: 20 },
// 			{ text: '广西一区', id: 21 },
// 		],
// 	},
// 	{
// 		text: '西部战区',
// 		children: [
// 			{ text: '四川一区', id: 22 },
// 			{ text: '四川二区', id: 23 },
// 			{ text: '重庆一区', id: 24 },
// 			{ text: '云南一区', id: 25 },
// 			{ text: '陕西一区', id: 26 },
// 		],
// 	},
// 	{
// 		text: '北部战区',
// 		children: [
// 			{ text: '河北一区', id: 27 },
// 			{ text: '山东一区', id: 28 },
// 			{ text: '北京一区', id: 29 },
// 			{ text: '北京三区', id: 30 },
// 			{ text: '辽宁一区', id: 31 },
// 			{ text: '辽宁三区', id: 32 },
// 			{ text: '辽宁二区', id: 33 },
// 			{ text: '山东二区', id: 34 },
// 			{ text: '河南一区', id: 35 },
// 			{ text: '河南二区', id: 36 },
// 			{ text: '北京二区', id: 37 },
// 			{ text: '北方大区', id: 38 },
// 			{ text: '山西一区', id: 39 },
// 			{ text: '北京四区', id: 40 },
// 			{ text: '吉林一区', id: 41 },
// 			{ text: '黑龙江一区', id: 42 },
// 		],
// 	},
// ])
</script>

<style lang="scss" scoped>
.filtrate-container {
	width: 100%;
	height: 50px;
	background: #fff;
}
</style>
