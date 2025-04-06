<script setup name="GoodUpload">
import { ref } from "vue";
import NavBar from "@/components/NavBar.vue";
import {
	fetchUploadImage,
	fetchGameCategoryList,
	fetchGoodInfoSubmit,
} from "@/api/good";
import { showLoadingToast, closeToast, showSuccessToast } from "vant";
import { useRouter } from "vue-router";

const router = useRouter();

const goodData = ref({
	name: "",
	sellPrice: "", // 出售价
	purchasePrice: "", // 进货价
	coverImage: "", // 主图
	version: "", // 商品描述
	gameCategoryId: "", // 游戏分类 id
	lowerTagIds: [], // 其他标签 id
	detailsImages: [], // 详情图
});

// 商品主图
const goodMainPic = ref([]);
// 商品详情
const goodDetailPics = ref([]);

/**
 * 处理并发上传图片
 * @param files 图片数组
 * @param maxCount 最大并发数
 */
const handleConcurUploadImage = (files, maxCount = 3) => {
	if (files.length === 0) return Promise.resolve([]);

	return new Promise((resolve) => {
		let index = 0; // 当前上传图片下标
		const result = []; // 结果数组
		let complateCount = 0; // 完成数量

		const _request = async () => {
			let file = files[index];
			let i = index;
			index++;
			try {
				const formData = new FormData();
				formData.append(`file`, file.file);
				const resp = await fetchUploadImage(formData);
				result[i] = resp;
			} catch (e) {
				result[i] = e;
				console.error(e, "fetchUploadImage");
			} finally {
				complateCount++;

				if (complateCount >= files.length) {
					resolve(result);
				}
				if (index < files.length) {
					_request();
				}
			}
		};

		for (let i = 0; i < Math.min(maxCount, files.length); i++) {
			_request();
		}
	});
};

// 提交商品
const handleSubmit = async (values) => {
	showLoadingToast({
		forbidClick: true,
		duration: 0,
	});

	// 上传所有图片
	const allPicFiles = [goodMainPic.value[0], ...goodDetailPics.value];

	try {
		// 获取所有图片 id
		const picIds = await handleConcurUploadImage(allPicFiles);
		goodData.value.coverImage = picIds[0];
		goodData.value.detailsImages = picIds.slice(1);

		await fetchGoodInfoSubmit(goodData.value);

		showSuccessToast({
			message: "提交成功",
			duration: 2000,
			onClose: () => {
				// TODO: 跳转
				router.back();
			},
		});
	} catch (e) {
		console.error(e, "handleSubmit");
	}
};

/** 游戏分类 */
const categoryList = ref([]); // 网络数据
const categoryResult = ref("");
const showCategoryPicker = ref(false);
const showCategoryPickerData = ref([]);
let currentFirstCategoryIndex = 0; // 当前第一项分类下标

// 处理分类确定
const handleCategoryConfirm = ({ selectedOptions }) => {
	var resultText = ""; // 展示的文字
	var tagIds = []; // 标签 id
	selectedOptions.forEach((option, index) => {
		resultText += option.text + " ";
		if (index === 0) {
			// 第一项为游戏分类
			goodData.value.gameCategoryId = option.categoryId;
		} else {
			tagIds.push(option.id);
		}
	});
	const selectData = selectedOptions[0];
	categoryResult.value = resultText;
	goodData.value.gameCategoryId = selectData.categoryId;
	goodData.value.lowerTagIds = tagIds;
	showCategoryPicker.value = false;
};

// 处理分类切换
const handleCategoryChange = ({ selectedIndexes, columnIndex }) => {
	if (columnIndex === 0) {
		// 当改变第一项的时候,需要重新获取数据
		currentFirstCategoryIndex = selectedIndexes[0];
		// 配置子分类
		handleConfigSubCategoryData();
	}
};

// 配置游戏分类展示数据
const configGameCategoryShowData = () => {
	if (categoryList.value.length === 0) {
		return;
	}

	const result = categoryList.value.map((item) => {
		let obj = {
			text: item.name,
			categoryId: item.categoryId,
			value: item.categoryId,
		};
		return obj;
	});
	// 配置游戏分类
	showCategoryPickerData.value = [result];
	// 配置子分类
	handleConfigSubCategoryData();
};

// 配置所有子项数据
const handleConfigSubCategoryData = () => {
	// 拿到第一项分类选择的下标
	const target = categoryList.value[currentFirstCategoryIndex];

	const result = [showCategoryPickerData.value[0]];

	// 遍历所有子分类数据
	target.gameTagOutPutList.forEach((element) => {
		const temp = element.lowerTagOutPuts.map((i) => {
			return {
				text: i.name,
				id: i.id,
				value: i.id,
			};
		});
		result.push(temp);
	});

	showCategoryPickerData.value = result;
};

// 游戏分类
const getGameCategoryList = async () => {
	try {
		const res = await fetchGameCategoryList({ id: null });
		categoryList.value = res;
		configGameCategoryShowData();
	} catch (e) {
		console.error(e, "getGameCategoryList");
	}
};

// 获取游戏分类
getGameCategoryList();
</script>

<template>
	<div class="only-nav-page-container">
		<NavBar />
		<van-form @submit="handleSubmit">
			<van-cell-group>
				<van-field
					v-model="goodData.name"
					name="商品名称"
					label="商品名称"
					placeholder="请输入商品名称"
					:rules="[{ required: false, message: '请输入商品名称' }]"
				/>
			</van-cell-group>
			<van-cell-group>
				<van-field
					v-model="goodData.sellPrice"
					name="出售价格"
					label="出售价格"
					placeholder="请输入出售价格"
					type="number"
					:rules="[{ required: false, message: '请输入出售价格' }]"
				/>
			</van-cell-group>
			<van-cell-group>
				<van-field
					v-model="goodData.purchasePrice"
					name="同行价格"
					label="同行价格"
					placeholder="请输入同行拿货价格"
					type="number"
					:rules="[{ required: false, message: '请输入同行拿货价格' }]"
				/>
			</van-cell-group>
			<van-cell-group>
				<van-field
					v-model="categoryResult"
					is-link
					readonly
					name="picker"
					label="游戏分类"
					placeholder="点击选择游戏分类"
					@click="showCategoryPicker = true"
					:rules="[{ required: false, message: '请选择游戏分类' }]"
				/>
				<van-popup
					v-model:show="showCategoryPicker"
					position="bottom"
				>
					<van-picker
						:columns="showCategoryPickerData"
						@change="handleCategoryChange"
						@confirm="handleCategoryConfirm"
						@cancel="showCategoryPicker = true"
					/>
				</van-popup>
			</van-cell-group>
			<van-cell-group>
				<van-field
					name="uploader"
					label="商品主图"
					:rules="[{ required: false, message: '请上传商品主图' }]"
				>
					<template #input>
						<van-uploader
							v-model="goodMainPic"
							accept="image/*"
							max-count="1"
						/>
					</template>
				</van-field>
			</van-cell-group>
			<van-cell-group>
				<van-field
					v-model="goodData.version"
					rows="5"
					autosize
					label="商品描述"
					type="textarea"
					placeholder="请输入商品描述"
					:rules="[{ required: false, message: '请输入商品描述' }]"
				/>
			</van-cell-group>
			<van-cell-group>
				<van-field
					name="uploader"
					label="商品详情"
					:rules="[{ required: false, message: '请上传商品详情图' }]"
				>
					<template #input>
						<van-uploader
							v-model="goodDetailPics"
							accept="image/*"
							multiple
						/>
					</template>
				</van-field>
			</van-cell-group>

			<div style="margin: 16px">
				<van-button
					block
					type="success"
					native-type="submit"
				>
					上传商品
				</van-button>
			</div>
		</van-form>
	</div>
</template>

<style lang="scss" scoped>
:deep(.van-cell-group) {
	margin-top: 10px;
}
</style>
