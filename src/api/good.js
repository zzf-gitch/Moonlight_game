import request from "@/utils/request";

/**
 * 上传图片
 * @param {*} data 
 * @returns 
 */
export function fetchUploadImage(data) {
  return request({
    url: "/api/gameAccount/uploadFile",
    method: "post",
    data,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
}

/**
 * 账号游戏分类
 * @returns 
 */
export function fetchGameCategoryList(data) {
  return request.post("/api/gameAccount/category", data);
}

/**
 * 账号信息提交
 */
export function fetchGoodInfoSubmit(data) {
  return request.post("/api/gameAccount/submit", data);
}

/**
 * 所有号源列表
 */
export function fetchAllGoodList(data) {
  return request.post("/api/gameAccount/allPageList", data);
}

/**
 * 
 * @param {id} data 
 * @returns 
 * @description 我的号源列表数据
 */
export async function GetMyList(data) {
  const res = await request.post('/goods/byUser', data);
  if (res.data.status === 200) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 调整上/下架
 */
export async function EditStatus(data) {
  const res = await request.post('/goods/changeInfo', data);
  if (res.data.status === 200) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 我的号源删除商品
 */
export async function DeleteMyList(data) {
  const res = await request.delete('/goods', { data });
  if (res.data.status === 200) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.msg));
}