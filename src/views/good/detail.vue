<script setup name="GoodDetail">
import NavBar from "@/components/NavBar.vue";
import DetailHeader from "./components/detail-header.vue";
import AccountData from "./components/account-data.vue";
import GameImg from "./components/game-img.vue";
import BackTop from '@/components/BackTop.vue'
import { showSuccessToast } from 'vant';
import {reactive,ref,markRaw} from "vue";
import {GetHome} from '@/api/home.js'
import { useRoute } from 'vue-router'
const { params } = useRoute()

const detailObj = ref({})
const detailArr = ref([])
const GetDetail = async () => {
  try {
    const res = await GetHome({id:params.id});
    // detailArr.value = res.detailsImages.map(item => {
    //   return `${import.meta.env.VITE_API_URL}/showImg?id=${
    //       item
    //   }`
    // })
    console.log(res,'res')
    detailObj.value = res.goods
  } catch (e) {
    console.error(e, "GoodDetail");
  }
}

GetDetail()

const container = ref(null)
const scrollTop = ref(0) //默认距离顶部的距离
const isShow = ref(false) //控制返回顶部按钮的显隐
const scrollTrigger = ref(false) //默认初始值

// 监听滚动条
const ScrollTop = (e) => {
  let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
  let scrollTop = e.target.scrollTop;
  if (scrollTop > clientHeight) {
    isShow.value = true;
  } else {
    isShow.value = false;
  }
}

const scrollTriggerChange = (val) => {
  scrollTrigger.value = val;
}

const scrollTopChange = (val) => {
  scrollTop.value = val;
}

const containerChange = (val) => {
  container.value.scrollTop = val;
}

const TabArr = ref([
	{
		name: "游戏截图",
		active: 1,
    Comp: markRaw(GameImg),
	},
	{
		name: "账号数据",
		active: 2,
    Comp: markRaw(AccountData),
	},
])

const currentIndex = ref(1)

const onTabClick = (item) => {
	currentIndex.value = item.active
  componentId.TabComp = item.Comp
}

const componentId = reactive({
  TabComp: TabArr.value[0].Comp,
});

</script>

<template>
	<div class="only-nav-page-container" ref="container" @scroll="ScrollTop">
    <NavBar
        :showLeft="true"
        :showRight="true"
    >
    </NavBar>

    <DetailHeader :data="detailObj"/>

    <!-- 标签搜索 -->
    <div class="testTab">
      <div v-for="item in TabArr" class="Tab" :class="{lineActive:item.active === currentIndex}" @click="onTabClick(item)">
        <p>{{ item.name }}</p>
      </div>
    </div>

    <keep-alive>
      <transition mode="in-out" name="slide-right" appear>
        <component :is="componentId.TabComp"></component>
      </transition>
    </keep-alive>
    
    <!-- <DetailCard :data="detailObj"/> -->
    <!-- <DetailFooter :data="detailObj" :detailArr="detailArr"/> -->

    <BackTop :container="container" :scrollTop="scrollTop" :scrollTrigger="scrollTrigger" v-show="isShow"
             @scrollTriggerChange="scrollTriggerChange" @scrollTopChange="scrollTopChange" @containerChange="containerChange"/>
	</div>
</template>

<style lang="scss" scoped>
.only-nav-page-container{
  scroll-behavior: smooth;
}
:deep(.van-nav-bar__right) {
  padding-right: 5px;
}

.testTab{
	display: flex;
	padding: 0 10px;
  margin: 10px 10px 10px 5px;
	height: 40px;
}

.Tab{
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: all 0.3s;
	p{
		line-height: 30px;
		font-size: 16px;
		color: #666;
		text-align: center;
		font-family: Arial, Helvetica, sans-serif;
	}
}

.lineActive{
	transition: all 0.3s;
	background-color: #fff;
	border-radius: 10px;
	box-shadow: 0px 5px 5px 1px #d3d3e7;
	p{
		color: #000;
	}
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.slide-right-enter-active {
  transition: all 0.2s ease;
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.slide-right-leave-active {
  transition: all 0.2s ease;
}
</style>
