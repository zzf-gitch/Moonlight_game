<script setup name="TagDetail">
import { ref } from "vue";
import NavBar from "@/components/NavBar.vue";
import TagItem from "./components/tag-item.vue";
import { useRoute } from "vue-router";
import {
	fetchGamePersonalityTagList,
	fetchAddGamePersonalityTag,
	fetchDeleteGamePersonalityTag,
	fetchAddGamePersonalityTagChild,
	fetchDeleteGamePersonalityTagChild,
} from "@/api/tag";
import { showLoadingToast, closeToast, showSuccessToast } from "vant";

const route = useRoute();

const list = ref([]);
const showMainTagDialog = ref(false);
const tagTitle = ref("");
const needAddTagId = ref(null); // 需要添加子标签的主标签id
const showSubTagDialog = ref(false);
const subTagValue = ref("");

const getGamePersonalityTagList = async () => {
	try {
		const resp = await fetchGamePersonalityTagList({ id: route.query.id });
		if (resp && resp.length > 0) {
			list.value = resp[0].list;
		}
		closeToast();
	} catch (e) {
		console.error(e, "getGamePersonalityTagList");
	}
};

// 添加标签主标题
const hanldeAddTagTitle = async () => {
	if (tagTitle.value.trim() === "") {
		return;
	}

	showLoadingToast({
		forbidClick: true,
		duration: 0,
	});

	try {
		await fetchAddGamePersonalityTag({
			tagName: tagTitle.value.trim(),
			id: route.query.id,
		});

		showSuccessToast("添加成功");
		handleCancel();
		getGamePersonalityTagList();
	} catch (e) {
		console.error(e, "hanldeAddTagTitle");
	}
};

// 取消弹框
const handleCancel = () => {
	showMainTagDialog.value = false;
	tagTitle.value = "";
};

// 删除主标签
const handleDeleteMainTag = async (id) => {
	showLoadingToast({
		forbidClick: true,
		duration: 0,
	});

	try {
		await fetchDeleteGamePersonalityTag({ id });
		showSuccessToast("删除成功");
		getGamePersonalityTagList();
	} catch (e) {
		console.error(e, "handleDeleteMainTag");
	}
};

// 点击添加子标签
const handleAddSubTag = async (id) => {
	needAddTagId.value = id;
	showSubTagDialog.value = true;
};

// 删除子标签
const handleDeleteSubTag = async (id) => {
	showLoadingToast({
		forbidClick: true,
		duration: 0,
	});
	try {
		await fetchDeleteGamePersonalityTagChild({ id });
		getGamePersonalityTagList();
		closeToast();
	} catch (e) {
		console.error(e, "handleDeleteSubTag");
	}
};

// 添加子标签确定
const handleAddSubTagConfirm = async () => {
	if (subTagValue.value.trim() === "") {
		return;
	}

	showLoadingToast({
		forbidClick: true,
		duration: 0,
	});
	try {
		await fetchAddGamePersonalityTagChild({
			tagName: subTagValue.value.trim(),
			id: needAddTagId.value,
		});
		showSuccessToast("添加成功");
		handleCancelSubTag();
		getGamePersonalityTagList();
	} catch (e) {
		console.error(e, "handleAddSubTagConfirm");
	}
};

// 添加子标签取消
const handleCancelSubTag = () => {
	needAddTagId.value = null;
	showSubTagDialog.value = false;
	subTagValue.value = "";
};

showLoadingToast({
	forbidClick: true,
	duration: 0,
});
getGamePersonalityTagList();
</script>

<template>
	<div class="only-nav-page-container">
		<NavBar />
		<van-empty
			v-if="!list.length"
			description="暂无标签"
		/>
		<div v-else>
			<tag-item
				v-for="item in list"
				:key="item.id"
				:data="item"
				@deleteMainTag="handleDeleteMainTag"
				@deleteSubTag="handleDeleteSubTag"
				@addSubTag="handleAddSubTag"
			></tag-item>
		</div>
		<div class="add-tag-container flex_vcs">
			<van-button
				class="add-button"
				@click="showMainTagDialog = true"
				>添加标签</van-button
			>
		</div>
		<van-dialog
			v-model:show="showMainTagDialog"
			title="标签主标题"
			show-cancel-button
			@confirm="hanldeAddTagTitle"
			@cancel="handleCancel"
		>
			<input
				type="text"
				v-model="tagTitle"
				placeholder="请输入标签主标题"
			/>
		</van-dialog>
		<van-dialog
			v-model:show="showSubTagDialog"
			title="添加子标签"
			show-cancel-button
			@confirm="handleAddSubTagConfirm"
			@cancel="handleCancelSubTag"
		>
			<input
				type="text"
				v-model="subTagValue"
				placeholder="请输入子标签"
			/>
		</van-dialog>
	</div>
</template>

<style lang="scss" scoped>
$add-tag-height: 80px;

.only-nav-page-container {
	padding-bottom: calc($add-tag-height + 10px);
}

.add-tag-container {
	height: $add-tag-height;
	background: $main-background-color;
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;

	.add-button {
		margin-top: 15px;
		width: 80%;
		height: 46px;
		background: #ef5350;
		color: #fff;
		font-size: 16px;
	}
}

input {
	width: 80%;
	height: 44px;
	margin: 20px 30px;
	text-align: center;
	border: 1px solid #eee;
}
</style>
