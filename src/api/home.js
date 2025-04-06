import request from "@/utils/request";
const BASE_URL = import.meta.env.BASE_URL;

/**
 * 首页游戏分类标签数据
 */
export function fetchHomeCategory(data) {
    return request.post("/api/gameAccount/homeCategory", data);
}

/**
 * 
 * @param {列表参数} data 
 * @returns 
 * @description 首页列表数据
 */
export async function GetHomeList(data) {
    const res = await request.post('/goods/listByH5', data);
    if (res.data.status === 200) {
      return res.data.data;
    }
    return Promise.reject(new Error(res.data.msg));
}


/**
 * 
 * @param {id} data 
 * @returns 
 * @description 首页列表查看详情
 */
export async function GetHome(params) {
    const res = await request.get('/goods/byIdOrkeyword', { params });
    if (res.data.status === 200) {
      return res.data.data;
    }
    return Promise.reject(new Error(res.data.msg));
}


/**
 * 首页游戏区服
 */
export async function fetchWarInfo() {
    const res = await request.get('/goods/gameAreas');
    if (res.data.status === 200) {
        return res.data.data;
    }
    return Promise.reject(new Error('获取游戏区服失败'));
}
// export async function fetchWarInfo() {
//     const res = await request.get(BASE_URL + 'json/regions.json', {
//         baseURL: ''
//     });
//     if (res.data.status === 200) {
//         return res.data.data;
//     }
//     return Promise.reject(new Error('获取游戏区服失败'));
// }

