import request from '@/utils/request';

/**
 * 游戏分类
 */
export function fetchGameCategoryList() {
  return request.post('/api/gamePersonality/gameType')
}

/**
 * 特殊标签列表
 */
export function fetchGamePersonalityTagList(data) {
  return request.post('/api/gamePersonality/personalityList', data)
}

/**
 * 添加上级标签
 */
export function fetchAddGamePersonalityTag(data) {
  return request.post('/api/gamePersonality/addHigherTag', data)
}

/**
 * 删除上级标签
 */
export function fetchDeleteGamePersonalityTag(data) {
  return request.post('/api/gamePersonality/delHigherTag', data)
}

/**
 * 添加下级标签
*/
export function fetchAddGamePersonalityTagChild(data) {
  return request.post('/api/gamePersonality/addLowerTag', data)
}

/**
 * 删除下级标签
 */
export function fetchDeleteGamePersonalityTagChild(data) {
  return request.post('/api/gamePersonality/delLowerTag', data)
}