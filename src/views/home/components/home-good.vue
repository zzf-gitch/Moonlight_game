<template>
	<div class="good-container">
		<div class="container">
			<div class="info-container">
				<img :src="goodPic" class="cover" />
				<!-- <div class="imgBackground"></div> -->
			</div>
			<div class="desc-container flex_cbc">
				<div class="desc">
					{{ homeInfo?.desc }}
				</div>
			</div>
			<div class="other-container flex_vbc">
				<div class="time">
					<p style="margin-left: 5px">{{ homeInfo?.game_name }}</p>
					<p style="margin-left: 5px;margin-top: 5px;">编号：{{ homeInfo?.keyword }}</p>
				</div>
				<div class="price" :style="{textDecoration: userStore?.isLogin ? 'line-through' : 'none'}">{{ Number(homeInfo?.price).toFixed(2) }}</div>
				<div class="outher-price" v-if="userStore.isLogin">{{ Number(homeInfo?.othersPrice).toFixed(2) }}</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed } from "vue";
import { useUserStore } from "@/stores/modules/user";
const userStore = useUserStore();

const props = defineProps({
	homeInfo: {
		type: Object,
	},
	ImageUrl: {
		type: String,
	},
});

// 商品图片
const goodPic = computed(() => {
	return props?.ImageUrl + props.homeInfo?.mainImage;
});

</script>

<style scoped lang="scss">
.good-container {
	height: auto;
	margin: 10px 20px 10px 15px;
	border-radius: 5px;
	background: #fff;
}

.container {
	width: 100%;
	height: 100%;
}

.info-container {
	width: 100%;
	height: 150px;
	position: relative;
	margin-bottom: 5px;
	background: #e7e7e7;
	display: inline-block;
	border-top-left-radius: 5px;
	border-top-right-radius: 5px;

	.cover {
		width: 100%;
		height: 100%;
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
		// object-fit: fill;
		object-fit: cover;
		// background-color: #e7e7e7;
		// mix-blend-mode: multiply;
		/* 正片叠底混合模式 */
		// opacity: 0.9;
	}

	.imgBackground {
		position: absolute;
		bottom: 0;
		background-color: #b9b9b9;
		width: 100%;
		height: 50px;
		opacity: 0.6;
	}
}

.desc-container {
	padding: 0 10px 10px 10px;
	width: 100%;
	align-self: stretch;

	.desc {
		font-size: 14px;
		width: 100%;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 5;
		/* 限制文本的行数 */
		overflow: hidden;
		font-weight: bolder;
	}

	.category {
		// height: 30px;
		align-self: stretch;
	}
}

.other-container {
	width: 100%;
	flex: 1;
	padding: 0 10px 10px 10px;
	gap: 10px;

	.time {
		flex: 2;
		font-size: 12px;
		padding-bottom: 5px;
		white-space: nowrap;
	}

	.price {
		flex: 1;
		font-size: 20px;
		color: red;
		font-weight: bold;
		position: relative;
	}

	.price::before {
		content: "¥";
		font-size: 20px;
		font-weight: bold;
		margin-right: 2px;
	}

	/* 如果需要添加删除线价格效果 */
	.original-price {
		flex: 1;
		font-size: 14px;
		color: #999;
		text-decoration: line-through;
		margin-left: 8px;
	}

	.outher-price {
		font-size: 20px;
		color: #3c8cff;
		font-weight: bold;
	}

	.outher-price::before {
		content: "¥";
		font-size: 20px;
		font-weight: bold;
		margin-right: 2px;
	}
}

:deep(.van-tag) {
	margin-right: 5px;
}
</style>
