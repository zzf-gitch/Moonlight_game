// 导入全局样式
import './assets/style/index.scss'
import './assets/main.css'

import { createApp } from 'vue'
import store from './stores';
import 'amfe-flexible'
import Vant from 'vant';
import './assets/fonts/iconfont.css'
// 引入vant组件库的css样式
import 'vant/lib/index.css';
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(store)
app.use(router)
app.use(Vant)

app.mount('#app')
