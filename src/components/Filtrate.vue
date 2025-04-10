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
					<div class="filter-content">
						<div v-for="item in filterList" :key="item.id" class="filter-item">
							<div class="filter-title">{{ item.name }}<span style="font-size: 12px;color:#c2c3c4;"
									v-if="item.type === 'check'">(多选)</span></div>
							<!-- 单选 -->
							<van-radio-group v-model="item.value" direction="horizontal" v-if="item.type === 'radio'"
								class="filter-options">
								<van-radio v-for="option in item.options" :key="option.id" :name="option.id"
									:style="{ background: item.value === option.id ? '#ffe0e0' : '#f5f5f5', color: item.value === option.id ? '#ff0000' : '#333' }">
									<span :style="{ color: item.value === option.id ? '#ff0000' : '#333' }">{{
										option.val }}</span>
								</van-radio>
							</van-radio-group>
							<!-- 复选 -->
							<van-checkbox-group v-model="item.value" direction="horizontal" v-if="item.type === 'check'"
								class="filter-options">
								<van-checkbox v-for="option in item.options" :key="option.id" :name="option.id"
									:style="{ background: item.value.includes(option.id) ? '#ffe0e0' : '#f5f5f5', color: item.value.includes(option.id) ? '#ff0000' : '#333' }">
									<span :style="{ color: item.value.includes(option.id) ? '#ff0000' : '#333' }">{{
										option.val }}</span>
								</van-checkbox>
							</van-checkbox-group>
							<!-- 范围输入 -->
							<div v-if="item.type === 'val'" class="filter-range">
								<van-field v-model="item.value[0]" type="number" placeholder="最小值" />
								<span class="range-separator"></span>
								<van-field v-model="item.value[1]" type="number" placeholder="最大值" />
							</div>
						</div>
					</div>
					<div class="filter-buttons">
						<van-button type="default" block round @click="resetFilter" style="flex: 1;">
							清空
						</van-button>
						<van-button type="danger" block round @click="confirmFilter" style="flex: 1;margin-left: 10px;">
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
import { fetchWarInfo, GetCategoriesByH5 } from '@/api/home'
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
	show.value = true
	nextTick(() => {
		duration.value = 0
		overlay.value = false
	})
}

const closeSelect = () => {
	show.value = false
	overlay.value = true
	duration.value = 0.2
	nextTick(() => {
		menuRef.value.close()
	})
}

const activeId = ref();
const activeIndex = ref();
const items = ref([])

// 获取游戏区服
const WarInfoList = async () => {
	const res = await fetchWarInfo()
	items.value = res.map(item => {
		let children = []
		children = item.children.map(row => {
			return {
				text: row.c_name,
				id: row.id
			}
		})
		return {
			text: item.f_name,
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

// 获取更多筛选数据
const filterList = ref([])

const getMoreData = async () => {
	const res = await GetCategoriesByH5()
	if (res && Array.isArray(res)) {
		// 按权重排序
		filterList.value = res.sort((a, b) => {
			if (a.weight === b.weight) {
				return new Date(a.createTime) - new Date(b.createTime)
			}
			return b.weight - a.weight
		}).map(item => ({
			...item,
			value: item.type === 'val' ? ['', ''] : item.type === 'check' ? [] : ''
		}))
	}
};

const resetFilter = () => {
	filterList.value.forEach(item => {
		item.value = item.type === 'val' ? ['', ''] : item.type === 'check' ? [] : ''
	})
}

// 确认筛选
const confirmFilter = () => {
	// 处理筛选条件
	// 在这个reduce函数中：acc是累加器（accumulator），它是每次迭代的结果，会被传递到下一次迭代中；
	// cur是当前正在处理的数组元素，代表filterList.value中的每一项；[]是初始值，表示acc的初始值是一个空数组。
	// 这个reduce函数的作用是将筛选条件转换为特定格式的数组，每次迭代时根据条件将处理后的数据添加到acc中。
	const filterData = filterList.value.reduce((acc, cur) => {
		if (cur.value) {
			if (cur.type === 'check' || cur.type === 'radio') {
				const options = Array.isArray(cur.value) ? cur.value : [cur.value];
				if (options.length > 0) {
					acc.push({
						type: cur.type,
						id: cur.id,
						options: options
					});
				}
			} else if (cur.type === 'val') {
				// 处理价格范围的边界情况
				const min = cur.value[0] === '' && cur.value[1] !== '' ? 0 : Number(cur.value[0]);
				const max = cur.value[1] === '' && cur.value[0] !== '' ? Infinity : Number(cur.value[1]);

				// 只要有一个值不为空，就添加到筛选条件中
				if (cur.value[0] !== '' || cur.value[1] !== '') {
					acc.push({
						type: cur.type,
						id: cur.id,
						min,
						max
					});
				}
			}
		}
		return acc;
	}, []);

	emit('handleCategorize', filterData);
	show.value = false;
	duration.value = 0.2;
	overlay.value = true;
	nextTick(() => {
		menuRef.value.close();
	});
};

getMoreData()
</script>

<style lang="scss" scoped>
.filtrate-container {
	width: 100%;
	height: 50px;
	background: #fff;

	:deep(.van-dropdown-menu) {
		background: transparent;
	}

	:deep(.van-dropdown-menu__item) {
		background: transparent;
	}
}

.filter-content {
	padding: 15px;
	max-height: 450px;
	overflow: hidden;
	overflow-y: scroll;
}

.filter-item {
	margin-bottom: 20px;

	&:last-child {
		margin-bottom: 0;
	}
}

.filter-title {
	font-size: 16px;
	font-weight: bold;
	color: #333;
	margin-bottom: 12px;
}

.filter-options {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 12px;

	:deep(.van-radio),
	:deep(.van-checkbox) {
		margin: 0;
		padding: 12px 12px;
		background: #f5f5f5;
		border-radius: 16px;
		transition: all 0.3s ease;
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;

		.van-radio__icon,
		.van-checkbox__icon {
			display: none;
		}

		.van-radio__label,
		.van-checkbox__label {
			color: #333;
			font-size: 13px;
			margin-left: 0;
			text-align: center;
		}

	}
}

.filter-range {
	display: flex;
	align-items: center;
	gap: 8px;

	:deep(.van-field) {
		flex: 1;
		background: #f7f8fa;
		border-radius: 4px;
		padding: 0;

		.van-field__control {
			height: 40px;
			text-align: center;
			font-size: 14px;
			color: #333;
		}

		&::placeholder {
			color: #999;
		}
	}

	.range-separator {
		width: 25px;
		height: 3px;
		background: #999;
		border-radius: 1.5px;
		color: #999;
		font-size: 14px;
	}
}

.filter-buttons {
	padding: 15px;
	display: flex;
	gap: 10px;

	.van-button {
		height: 40px;
		font-size: 14px;
	}
}
</style>
