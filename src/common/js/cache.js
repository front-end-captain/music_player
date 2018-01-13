import storage from 'good-storage'

const SEARCH_KEY = '__search__';
const SEARCH_MAX_LEHGTH = 15;

const PLAY_KEY = '__play__'
const PLAY_MAX_LENGTH = 200;


/**
 *@description 向数组中插入元素
 * @param {String} item 待插入的元素
 * @param {Array} array 将要插入的数组
 * @param {Function} compare findIndex 方法的测试函数
 * @param {number} maxLength 数组最大长度 为 15
 */
function insertItemToArray( item, array, compare, maxLength ) {

  // 检查待插入的项是否已经在数组中存在
  let index = array.findIndex( compare );

  if ( index === 0 ) {
    return array;
  }

  if ( index > 0 ) {
    array.splice( index, 1 );
  }
  // 将待插入的元素放在数组开头
  array.unshift( item );

  // 检查数组是否已满 弹出最后一项
  if ( maxLength && array.length > maxLength ) {
    array.pop();
  }

  return array;
}


/**
 * @description 删除数组中的指定的某一项
 * @param {Array} array
 * @param {Function} compare
 */
function deleteItemFromArray( array, compare ) {
  let index = array.findIndex( compare );
  if ( index > -1 ) {
    array.splice( index, 1 );
  }
  return array;
}


/**
 * @description 将搜索关键词存入搜索历史记录
 * @param {String} query
 */
export const saveSearchEntry = ( query ) => {
  let searches = storage.get( SEARCH_KEY );

  searches = searches || [];

  let newSearches = insertItemToArray( query, searches, ( item ) => {
    return item === query;
  }, SEARCH_MAX_LEHGTH);

  storage.set( SEARCH_KEY, newSearches );

  return newSearches;
}


/**
 * @description 从本地存储中读取用户搜索历史记录
 */
export const loadSearchHistory = () => {
  return storage.get( SEARCH_KEY, [] );
}


/**
 * @description 从搜索历史记录中删除某一条搜索条目
 * @param {String} query
 */
export const deleteSearchEntry = ( query ) => {
  let searches = storage.get( SEARCH_KEY );
  let newSearches = deleteItemFromArray( searches, ( item ) => {
    return item === query;
  });
  storage.set( SEARCH_KEY, newSearches );
  return newSearches;
}


/**
 * @description 清空用户搜索历史记录
 */
export const clearSearchEntries = () => {
  storage.remove( SEARCH_KEY );
  return [];
}



export const savePlayHistoryEntry = ( entry ) => {
  let histories = storage.get( PLAY_KEY, [] );

  histories = histories || [];

  let newHistories = insertItemToArray( entry, histories, ( item ) => {
    return item.id === entry.id;
  })

  storage.set( PLAY_KEY, newHistories );
  return newHistories;
}


export const loadPlayHistory = () => {
  return storage.get( PLAY_KEY, [] );
}
