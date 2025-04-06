<template>
	<div class="game-category-container">
		<div class="container">
			<div class="category-card">
				<div v-for="item in category" :key="item.categoryId" class="card_One">
					<div class="name">{{ item.name }}</div>
					<div class="tag">
						<template v-for="row in item.children">
							<van-radio-group v-model="Ctip">
								<van-radio :name="row.categoryId" @click="handleCategory(row)">
									<template #icon="props">
										<van-button :color="props.checked ? '#f85255' : 'white'">
											<span :style="{ color: props.checked ? 'white' : 'black' }">{{ row.name
												}}</span>
										</van-button>
									</template>
								</van-radio>
							</van-radio-group>
						</template>
					</div>
				</div>
				<div v-for="(item, index) in cateList" :key="index" class="card_Two">
					<div class="name">{{ item.name }}</div>
					<div class="tag">
						<template v-for="row in item.lowerTagOutPuts">
							<van-radio-group v-model="item.tip">
								<van-radio :name="row.id" @click="handleCategoryTwo(row, index)">
									<template #icon="props">
										<van-button :color="props.checked ? '#f85255' : 'white'">
											<span :style="{ color: props.checked ? 'white' : 'black' }">{{ row.name
												}}</span>
										</van-button>
									</template>
								</van-radio>
							</van-radio-group>
						</template>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { nextTick, ref } from "vue";
import { fetchHomeCategory } from "@/api/home.js";

const emit = defineEmits(["handleCategory", "handleCategoryTwo", "categoryId"]);
// 游戏分类categoryId
const handleCategory = (row) => {
	handleTwo(row);
	emit("handleCategory", row.categoryId);
	emit("categoryId", row.categoryId);
};
// 游戏标签以及其他id
const handleCategoryTwoArr = ref([]);
const handleCategoryTwo = (row, i) => {
	handleCategoryTwoArr.value[i] = row.id;
	emit("handleCategoryTwo", handleCategoryTwoArr.value);
};

// 游戏分类切换
const handleTwo = (row) => {
	category.value.forEach((val) => {
		val.children.map((v) => {
			if (v.name === row.name) {
				handleCategoryTwoArr.value = [];
				cateList.value = [];
				if (row.gameTagOutPutList === null) {
					emit("handleCategoryTwo", handleCategoryTwoArr.value);
				}
				nextTick(() => {
					cateList.value =
						row.gameTagOutPutList === null
							? []
							: row.gameTagOutPutList.map((row) => {
								let i = void 0;
								row.lowerTagOutPuts.forEach((tag) => {
									if (tag.tip === 0) {
										handleCategoryTwoArr.value.push(tag.id);
										emit("handleCategoryTwo", handleCategoryTwoArr.value);
										i = tag.tip;
									}
								});
								return {
									name: row.name,
									tip: i,
									lowerTagOutPuts: row.lowerTagOutPuts,
								};
							});
				});
			}
		});
	});
};

// 游戏标签以及其他数组
const cateList = ref([]);
// 游戏分类数组
const category = ref([
	{
		name: "游戏分类",
		children: [],
	},
]);
const Ctip = ref();

//游戏分类数据
const GetCategoryList = async () => {
	try {
		const res = await fetchHomeCategory();
		category.value.forEach((v) => {
			v.children = res.map((item) => {
				if (item.gameTagOutPutList !== null && item.tip === 0) {
					cateList.value = item.gameTagOutPutList.map((row) => {
						let i = void 0;
						row.lowerTagOutPuts.forEach((tag) => {
							if (tag.tip === 0) {
								handleCategoryTwoArr.value.push(tag.id);
								emit("handleCategoryTwo", handleCategoryTwoArr.value);
								i = tag.tip;
							}
						});
						return {
							name: row.name,
							tip: i,
							lowerTagOutPuts: row.lowerTagOutPuts,
						};
					});
				}
				if (item.tip === 0) {
					emit("handleCategory", item.categoryId);
					Ctip.value = item.categoryId;
					emit("categoryId", item.categoryId);
				}
				return {
					categoryId: item.categoryId,
					name: item.name,
					tip: item.tip,
					gameTagOutPutList: item.gameTagOutPutList,
				};
			});
		});
	} catch (e) {
		console.error(e, "GameCategory");
	}
};

GetCategoryList();
</script>

<style lang="scss" scoped>
.game-category-container {
	width: 100%;
	height: auto;
	background-color: $main-background-color;
	padding: 10px;

	.container {
		width: 100%;
		height: 100%;
		background: #fff;
		border-radius: 5px;
		padding: 2px 10px 2px 10px;

		.category-card {
			width: 100%;
			height: auto;
			margin: 5px 0;
			display: flex;
			flex-direction: column;

			.card_One {
				display: flex;
			}

			.card_Two {
				display: flex;
				margin: 5px 0 0 0;
			}

			.name {
				font-size: 14px;
				font-weight: bold;
				padding: 5px;
				margin-right: 3px;
			}

			.tag {
				display: flex;
				flex-wrap: wrap;
				flex: 4;

				.van-radio-group {
					display: flex;
					height: 30px;

					.van-radio {
						display: inline-block;

						.van-button {
							height: 30px;
							font-size: 12px;
							padding: 0 10px;
							display: flex;
						}
					}
				}
			}
		}
	}
}

:deep(.van-button__text) {
	line-height: 1;
}
</style>
