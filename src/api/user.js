import request from "@/utils/request";

/**
 * 
 * @returns 
 * @description 登录人信息
 */
export async function UserInfo() {
  const res = await request.get('/userInfo');
  if (res.data.status === 200) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 
 * @returns 
 * @description 客服验证
 */
export async function UserVerifyCts(params) {
  const res = await request.get(`/verifyCts/${params}`);
  if (res.data.status === 200) {
    return res.data.isTruthy;
  }
  return Promise.reject(new Error(res.data.msg));
}
