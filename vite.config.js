// 导入必要的Node.js内置模块和Vite插件
import { fileURLToPath, URL } from 'node:url'
import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// 自动导入组件的插件
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
// 用于将px单位转换为rem的PostCSS插件
import postCssPxToRem from 'postcss-pxtorem'

// 定义路径解析函数
const resolve = (dir) => path.resolve(__dirname, dir)

// Vite配置文件
export default defineConfig(({ command }) => {
  // 打印当前执行的命令（serve用于开发，build用于生产）
  console.log("当前命令:" + command)

  // 根据当前命令设置基础公共路径
  // 开发环境使用相对路径，生产环境使用/dist/
  let base = command === 'serve' ? './' : './'

  // 生产环境特殊处理，设置不同的基础路径
  if (command === 'build') {
    base = './'
  }

  // 配置路径别名，方便模块导入
  const alias = {
    '@/': resolve('src') + '/',
    // 解决vue-i18n警告
    'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
  };

  return {
    plugins: [
      // Vue3单文件组件支持
      vue(),
      // 自动导入组件配置
      Components({
        dts: false, // 禁用TypeScript声明文件生成
        // Vant组件按需引入配置，关闭自动样式导入（已全局导入）
        resolvers: [VantResolver({ importStyle: false })]
      })
    ],
    // 路径别名配置
    resolve: { alias },
    // 部署基础路径配置
    base: base,
    // 开发服务器配置
    server:{
      port: 443, // 指定开发服务器端口号
      strictPort: false, // 端口被占用时是否尝试其他端口
      cors: true, // 开启CORS跨域支持
    },
    // CSS相关配置
    css: {
      // SCSS预处理器配置
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          // 全局引入scss变量文件
          additionalData: '@use "@/assets/style/variables.scss" as *;',
          javascriptEnabled: true
        }
      },
      // PostCSS配置
      postcss: {
        plugins: [
          // px转rem配置（已注释，可根据需要启用）
          // postCssPxToRem({
          //   // rootValue根据设计稿宽度调整，一般设计稿宽度/10
          //   // vant组件库基于375px设计，自定义组件基于750px设计
          //   rootValue({ file }) {
          //     return file.indexOf('vant') !== -1 ? 37.5 : 37.5
          //   },
          //   mediaQuery: false, // 禁止媒体查询中转换px
          //   propList: ["*"] // 所有属性都转换
          // })
        ]
      }
    }
  }
})
