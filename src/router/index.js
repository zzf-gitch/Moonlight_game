import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/modules/user';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home',
      children: [
        {
          path: '/home',
          name: 'Home',
          component: () => import('../views/home/index.vue'),
          meta: {
            title: "月关网游选号网",
          }
        },
        {
          path: '/user',
          name: 'User',
          component: () => import('../views/user/index.vue'),
          meta: {
            title: "个人中心",
          }
        },
        {
          path: '/login',
          name: 'Login',
          component: () => import('../views/login/index.vue'),
          meta: {
            title: "登录",
          }
        },
        {
          path: '/tagmanager',
          name: 'TagManager',
          component: () => import('../views/user/tag-manager.vue'),
          meta: {
            title: "标签管理",
          }
        },
        {
          path: '/tagdetail',
          name: 'TagDetail',
          component: () => import('../views/user/tag-detail.vue'),
          meta: {
            title: "标签管理",
          }
        },
        {
          path: '/good',
          redirect: { name: "GoodList" },
          children: [
            {
              path: 'list',
              name: 'GoodList',
              component: () => import('../views/good/list.vue'),
              meta: {
                title: "全部号源",
              }
            },
            {
              path: 'mylist',
              name: 'MyGoodList',
              component: () => import('../views/good/my-list.vue'),
              meta: {
                title: "我的号源",
              }
            },
            {
              path: 'detail/:id/:game_name',
              name: 'GoodDetail',
              component: () => import('../views/good/detail.vue'),
              meta: {
                title: "商品详情",
              }
            },
            {
              path: 'edit/:id',
              name: 'GoodEdit',
              component: () => import('../views/good/edit.vue'),
              meta: {
                title: "编辑商品",
              }
            },
            {
              path: 'upload',
              name: 'GoodUpload',
              component: () => import('../views/good/upload.vue'),
              meta: {
                title: "上传商品",
              }
            },
          ]
        }
      ]
    },
  ],
})

/**
 * 路由守卫 实时获取用户信息
 */
router.beforeEach(async (to) => {
  const userStore = useUserStore();
  // 需要用户信息的页面路由
  const authRoutes = ['MyGoodList', 'User', 'GoodUpload', 'TagManager'];
  
  if (authRoutes.includes(to.name)) {
    try {
      // 等待用户信息加载完成
      await userStore.fetchUserInfo();
      
      // 如果用户未登录，跳转到登录页
      if (!userStore.isLogin) {
        return { name: 'Login' };
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      return { name: 'Login' };
    }
  }
});

export default router
