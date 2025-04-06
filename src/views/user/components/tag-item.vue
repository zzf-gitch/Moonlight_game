<script setup>
import { ref } from "vue";

defineProps({
	data: {
		type: Object,
	},
});
</script>

<template>
	<div class="container">
		<div class="header flex_vbc">
			<div class="title">{{ data?.tagName }}</div>
			<div
				class="icon flex_vcc"
				@click="$emit('deleteMainTag', data?.id)"
			>
				<van-icon
					name="delete-o"
					size="20"
				/>
			</div>
		</div>
		<div class="content">
			<van-tag
				v-for="item in data?.list"
				:key="item.id"
				closeable
				size="medium"
				type="success"
				@close="$emit('deleteSubTag', item?.id)"
			>
				{{ item?.tagName }}
			</van-tag>
			<van-tag
				size="medium"
				type="primary"
				@click="$emit('addSubTag', data?.id)"
			>
				&nbsp;<van-icon name="plus" />
			</van-tag>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.container {
	width: 100%;
	background: #fff;
	margin-top: 10px;
	padding: 10px 10px 0;
}

.header {
	margin-bottom: 10px;

	.title {
		font-weight: 600;
	}

	.icon {
		width: 30px;
		height: 30px;
	}
}

.add-tag {
	display: inline-block;
	background: #1989fa;
	color: #fff;
	height: 30px;
	// padding: 4px 6px;
}

:deep(.van-tag) {
	margin-right: 10px;
	margin-bottom: 10px;
	height: 30px;
	min-width: 30px;
}

:deep(.van-tag--medium) {
	text-align: center;
	line-height: 1;
	font-weight: 600;
}

:deep(.van-tag--primary) {
	background: #aaa;
}

:deep(.van-tag--success) {
	background: #ef5350;
}
</style>
