/**
 * token操作封装
 */
import { TOKEN_CACHE_NAME } from '@/config/setting';

/**
 * 获取缓存的token
 */
export function getToken() {
  const token = localStorage.getItem(TOKEN_CACHE_NAME);
  if (!token) {
    return sessionStorage.getItem(TOKEN_CACHE_NAME);
  }
  return token;
}

/**
 * 获取缓存的用户信息
 */
export function getUserInfo() {
  const UserInfo = localStorage.getItem('UserInfo');
  if (!UserInfo) {
    return sessionStorage.getItem('UserInfo');
  }
  return UserInfo;
}


/**
 * @param token token
 * @param remember 是否永久存储
 * @description 缓存token
 */
export function setToken(token, remember) {
  removeToken();
  if (token) {
    if (remember) {
      localStorage.setItem(TOKEN_CACHE_NAME, token);
    } else {
      sessionStorage.setItem(TOKEN_CACHE_NAME, token);
    }
  }
}


/**
 * @param setUserInfo 用户信息
 * @param remember 是否永久存储
 * @description 缓存用户信息
 */
export function setUserInfo(setUserInfo, remember) {
  removeUserInfo();
  if (setUserInfo) {
    if (remember) {
      localStorage.setItem('UserInfo', JSON.stringify(setUserInfo));
    } else {
      sessionStorage.setItem('UserInfo', JSON.stringify(setUserInfo));
    }
  }
}


/**
 * 移除token
 */
export function removeToken() {
  localStorage.removeItem(TOKEN_CACHE_NAME);
  sessionStorage.removeItem(TOKEN_CACHE_NAME);
}

/**
 * 移除用户信息
 */
export function removeUserInfo() {
  localStorage.removeItem('UserInfo');
  sessionStorage.removeItem('UserInfo');
}

