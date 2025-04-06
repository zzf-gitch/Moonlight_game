<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Push from "@/assets/push.png";
import AllShop from "@/assets/allshop.png";
import MyShop from "@/assets/myshop.png";
import Tag from "@/assets/tag.png";
import { useUserStore } from "@/store/modules/user";

const router = useRouter();
const userStore = useUserStore();
// 功能列表
const featureList = ref([]);

// 设置功能区数据
const setFeatureListData = () => {
	const list = [];
	list.push({
		icon: Push,
		name: "上传商品",
		routeName: "GoodUpload",
	});

	list.push({
		icon: AllShop,
		name: "全部号源",
		routeName: "GoodList",
	});

	list.push({
		icon: MyShop,
		name: "我的商品",
		routeName: "MyGoodList",
	});

	if (userStore.info.name === "系统管理员") {
		list.push({
			icon: Tag,
			name: "标签管理",
			routeName: "TagManager",
		});
	}

	featureList.value = list;
};

setFeatureListData();
</script>

<template>
	<div class="feature" @click="router.push({ name: 'MyGoodList' })">
		<p class="mylist">我的号源</p>
		<img class="img" src="../../../assets/right.png" alt="">
	</div>
	<!-- <van-grid
		class="feature"
		:column-num="featureList.length"
	>
		<van-grid-item
			v-for="item in featureList"
			:key="item.name"
			@click="router.push({ name: item.routeName })"
		>
			<div class="item flex_ccc">
				<img :src="item.icon" />
				<span>{{ item.name }}</span>
			</div>
		</van-grid-item>
	</van-grid> -->
</template>

<style lang="scss" scoped>
.feature {
	width: 100%;
	height: 60px;
	margin-top: 20px;
	background: #ffffff;
	border-radius: 15px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	.mylist{
		margin-left: 10px;
		font-size: 18px;
	}
	.img{
		width: 20px;
		height: 20px;
		margin-right: 10px;
	}
}

.item {
	img {
		width: 40px;
		height: 40px;
	}

	span {
		margin-top: 5px;
		font-size: 13px;
	}
}
</style>
