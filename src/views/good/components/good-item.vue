<script setup>
import { computed } from "vue";

const props = defineProps({
	goodInfo: {
		type: Object,
	},
	goodIndex: {
		type: Number
	},
	ImageUrl: {
		type: String,
	}
});

// 商品图片
const goodPic = computed(() => {
	return props?.ImageUrl + props.goodInfo?.mainImage;
});

// 格式化时间
const formatTime = computed(() => {
	if (!props.goodInfo?.createTime) return '';
	const date = new Date(props.goodInfo?.createTime);
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
});

</script>

<template>
	<div class="good-item-container" :class="{ 'margin-top': goodIndex > 0 }">
		<div class="container flex_cbc">
			<div class="info-container flex_vss">
				<div class="cover">
					<img :src="goodPic" />
					<span class="tag" :class="goodInfo?.status ? 'success' : 'danger'">{{ goodInfo?.status ? '上架中' :
						'已下架' }}</span>
				</div>

				<div class="desc-container flex_cbc">
					<div class="desc">
						{{ goodInfo?.desc }}
					</div>
					<!-- <div class="category flex_vse">
						<van-tag
							color="#ef5350"
							size="medium"
							v-for="(item, index) in goodInfo?.tags"
							:key="`tags-${index}`"
						>
							{{ item }}
						</van-tag>
					</div> -->
				</div>
			</div>
			<div class="other-container flex_vbc">
				<div>
					<div class="author">
						<!-- <van-icon
							name="user-o"
							color="#181818"
							size="16"
						/> -->
						<span>上传者&nbsp;|&nbsp;编号：</span>
						<span>{{ goodInfo?.keyword }}</span>
					</div>
					<div style="font-size: 14px;margin-top:5px;">
						<span>标题：{{ goodInfo?.name }}</span>
					</div>
					<div class="time">
						<!-- <van-icon
							name="clock-o"
							color="#ababab"
							size="14"
						/> -->
						<span>{{ formatTime }}</span>
					</div>
				</div>
				<div>
					<div class="price">
						<span style="font-size: 16px; vertical-align: 2px;">售</span>
						￥{{ Number(goodInfo?.price).toFixed(2) }}
					</div>
					<div class="peer-price">
						<span style="font-size: 14px; vertical-align: 2px">拿</span>
						￥{{ Number(goodInfo?.othersPrice).toFixed(2) }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.good-item-container {
	width: 100%;
	height: 193px;
	background: #fff;
	padding: 10px;
	overflow: auto;
}

.container {
	width: 100%;
	height: 100%;
}

.margin-top {
	margin-top: 10px;
}

.info-container {
	width: 100%;
	height: 120px;

	.cover {
		width: 153px;
		height: 100%;
		border-radius: 6px;
		overflow: hidden;
		position: relative;

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		.tag {
			position: absolute;
			top: 0px;
			left: 0px;
			width: 60px;
			height: 25px;
			line-height: 25px;
			font-size: 13px;
			font-weight: 800;
			color: #fff;
			text-align: center;
			border-bottom-right-radius: 6px;
		}

		.success {
			background: rgba($color: #07c160, $alpha: 0.8);
		}

		.danger {
			background: rgba($color: #ee0a24, $alpha: 0.8);
		}
	}

	.desc-container {
		margin-left: 5px;
		width: 280px;
		align-self: stretch;

		.desc {
			width: 100%;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 5;
			/* 限制文本的行数 */
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.category {
			// height: 30px;
			align-self: stretch;
		}
	}
}

.other-container {
	margin-top: 5px;
	width: 100%;
	flex: 1;

	.time {
		color: #ababab;
		margin-top: 5px;
		font-size: 14px;
	}

	.author {
		color: #181818;
	}

	.price {
		font-size: 20px;
		color: red;
		font-weight: bold;
		text-align: right;
		margin-right: 10px;
	}

	.peer-price {
		font-size: 18px;
		color: blue;
		font-weight: bold;
		text-align: right;
		margin-right: 10px;
	}
}

:deep(.van-tag) {
	margin-right: 5px;
}
</style>
