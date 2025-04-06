import request from "@/utils/request";

/**
 * 
 * @param {账号密码} data 
 * @returns 
 * @description 登录
 */
export async function UserLogin(data) {
  const res = await request.post('/signIn', data);
  if (res.data.status === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}
