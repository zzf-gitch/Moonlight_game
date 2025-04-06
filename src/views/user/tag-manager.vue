<script setup name="TagManager">
import { ref } from "vue";
import NavBar from "@/components/NavBar.vue";
import { fetchGameCategoryList } from "@/api/tag";
import { useRouter } from "vue-router";
const router = useRouter();

const list = ref([]);
const loading = ref(false);
const finished = ref(false);

const getGameCategoryListData = async () => {
	try {
		const resp = await fetchGameCategoryList();
		list.value = resp;
		loading.value = false;
		finished.value = true;
	} catch (e) {
		console.error(e, "getGameCategoryListData");
	}
};
</script>

<template>
	<div class="only-nav-page-container">
		<NavBar />
		<van-list
			v-model:loading="loading"
			:finished="finished"
			@load="getGameCategoryListData"
		>
			<div
				class="category-item flex_vcc"
				v-for="item in list"
				:key="item.id"
				@click="router.push({ name: 'TagDetail', query: { id: item.id } })"
			>
				<span>{{ item.tagName }}</span>
				<van-icon name="arrow" />
			</div>
		</van-list>
	</div>
</template>

<style lang="scss" scoped>
.only-nav-page-container {
	padding: 56px 10px 0;
}

.category-item {
	width: 100%;
	height: 80px;
	background: white;
	border-radius: 7px;
	margin-bottom: 10px;
	padding: 0 20px;
	justify-content: space-between;
	font-size: 16px;
	font-weight: 600;
}
</style>
