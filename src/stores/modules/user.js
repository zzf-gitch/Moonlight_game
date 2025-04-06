import { defineStore } from 'pinia'
import { UserInfo } from '@/api/user';
import { getUserInfo, getToken } from '@/utils/token-util';

export const useUserStore = defineStore('user', {
  state: () => ({
    /** 当前登录用户的信息 */
    info: null
  }),
  getters: {
    // 是否登录
    isLogin: (state) => {
      return state.info && state.info.id !== 0;
    }
  },
  actions: {
    async fetchUserInfo() {
      if (getToken()) {
          const result = await UserInfo().catch((e) => console.error(e));
          if (!result) {
            return {};
          }
          // 用户信息
          this.setInfo(result);
        }
    },
    /**
     * 更新用户信息
     */
    setInfo(value) {
      this.info = value;
    },
  },
})