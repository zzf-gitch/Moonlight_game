import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import postCssPxToRem from 'postcss-pxtorem'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {

  return {
    plugins: [
      // 解析单文件组件的插件
      vue(),
      // 自动导入的插件，解析器可以是 vant element and-vue
      Components({
        dts: false,
        // 原因：Toast Confirm 这类组件的样式还是需要单独引入，样式全局引入了，关闭自动引入
        resolvers: [VantResolver({ importStyle: false })]
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server:{
      port: 443, //指定开发服务器端口
      strictPort: false, //设为 true 时若端口已被占用则会直接退出，而不是尝试下一个可用端口
      cors: true, //为开发服务器配置 CORS。默认启用并允许任何源，传递一个 选项对象 来调整行为或设为 false 表示禁用
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler', // or 'modern'
          additionalData: '@use "@/assets/style/variables.scss" as *;',
          javascriptEnabled: true
        }
      },
      postcss: {
        plugins: [
          // postCssPxToRem({
          //   // 配置在将px转化为rem时 1rem等于多少px(因为我们搭配使用了amfe-flexible插件 此处我们需要设置的值应是UI设计稿全屏基准宽度的十分之一)
          //   // 当UI设计稿的全屏基准宽度是750px时 此处设置的值为75 但项目中使用了vant组件库 vant的设计稿总宽度是375px 其十分之一应是37.5(需要区分设置)
          //   rootValue({ file }) {
          //     return file.indexOf('vant') !== -1 ? 37.5 : 37.5
          //   },
          //   // rootValue: 16, // 根元素字体大小,
          //   mediaQuery: false,
          //   // 所有px均转化为rem
          //   propList: ["*"]
          //   // 若想设置部分样式不转化 可以在配置项中写出
          //   // eg: 除 border和font-size外 所有px均转化为rem
          //   // propList: ["*", "!border","!font-size"],
          // })
        ]
      }
    }
  }
})
