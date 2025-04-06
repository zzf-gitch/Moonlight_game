<template>
	<!-- 右侧弹出 -->
	<van-popup
		:show="modelValue"
		position="right"
		:style="{ width: '60%', height: '100%' }"
		@close="close(false)"
	>
		<div class="popup-game">
			<div class="popup-game-main">
				<div
					class="popup-game-card"
					v-for="item in tagArr"
				>
					<div class="name">{{ item.gameName }}</div>
					<div
						class="popup-game-card"
						v-for="row in item.list"
					>
						<div class="names">{{ row.tagName }}</div>
						<div class="tag">
							<template v-for="tag in row.list">
								<van-checkbox
									v-model="tag.checked"
									@change="
										(val) => {
											handleChange(val, tag);
										}
									"
									class="van-checkbox"
								>
									<template #icon="props">
										<van-button
											:color="props.checked === false ? '#ababab' : '#de868f'"
											>{{ tag.tagName }}</van-button
										>
									</template>
								</van-checkbox>
							</template>
						</div>
					</div>
				</div>
			</div>

			<div class="popup-game-bottom">
				<van-button
					color="#ababab"
					size="normal"
					@click="reset"
					>重置</van-button
				>
				<van-button
					type="primary"
					size="normal"
					@click="submit"
					>确认</van-button
				>
			</div>
		</div>
	</van-popup>
</template>

<script setup>
import { ref, inject, onMounted } from "vue";
import { fetchGamePersonalityTagList } from "@/api/tag.js";
const emit = defineEmits(["update:modelValue", "submit"]);
const props = defineProps({
	/** 弹窗是否打开 */
	modelValue: Boolean,
	/** 修改回显的数据 */
});
/** 更新modelValue */
const close = (value) => {
	emit("update:modelValue", value);
};

const newTestArr = ref([]);
const handleChange = (val, tag) => {
	if (tag.checked) {
		newTestArr.value.push(tag.id);
	} else {
		const i = newTestArr.value.indexOf(tag.id);
		if (i > -1) {
			newTestArr.value.splice(i, 1);
		}
	}
};

const reset = () => {
	tagArr.value.map((item) => {
		item.list.forEach((row) => {
			row.list.forEach((tag) => {
				tag.checked = false;
			});
		});
	});
};

const submit = () => {
	close(false);
	emit("submit", newTestArr.value);
};

const tagList = async (val) => {
	try {
		const res = await fetchGamePersonalityTagList({ id: val });
		tagArr.value = res.map((item) => {
			item.list.map((row) => {
				row.list.map((tag) => {
					tag.checked = false;
				});
			});
			return item;
		});
	} catch (e) {
		console.error(e, "tagList");
	}
};

defineExpose({ tagList });

const tagArr = ref([]);
</script>

<style scoped lang="scss">
.popup-game {
	width: 100%;
	height: 100%;
	.popup-game-main {
		width: 100%;
		height: calc(100% - 50px);
		padding: 10px;
		overflow: hidden;
		overflow-y: scroll;
		.popup-game-card {
			width: 100%;
			height: auto;
			.name {
				font-size: 18px;
				font-weight: bold;
				margin: 0 0 0 5px;
			}
			.names {
				font-size: 16px;
				margin: 5px 0 0 5px;
			}
			.tag {
				width: 100%;
				display: flex;
				flex-wrap: wrap;
				margin: 5px 0 0 0;
				.van-checkbox {
					display: inline-block;
					height: 40px;
					margin-left: 5px;
					.van-button {
						height: 30px;
					}
				}
			}
		}
	}
	.popup-game-bottom {
		width: 100%;
		height: 50px;
		position: fixed;
		bottom: 0;
		display: flex;
		justify-content: space-around;
		.van-button:nth-child(1) {
			width: 70px;
			height: 40px;
			font-size: 16px;
			margin: 0 0 0 5px;
		}
		.van-button:nth-child(2) {
			width: 130px;
			height: 40px;
			font-size: 16px;
		}
	}
}
</style>
