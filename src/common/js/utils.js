function getRandomNumber ( min, max ) {
  return Math.floor( Math.random() * ( max - min + 1 ) + min );
}

// 打乱数组
export function shuffle( array ) {
  for ( let i = 0; i < array.length; i++ ) {
    let randomIndex = getRandomNumber( 0, i );
    let item = array[i];
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];

    // array[i] = array[randomIndex];
    // array[randomIndex] = item;
  }
  return array;
}

/**
 * @description 防抖
 * @param {Function} func 延时执行函数
 * @param {Number} delay 延时
 */
export function debounce( func, delay ) {
  let timer = null;

  return function ( ...args ) {
    if ( timer ) {
      window.clearTimeout( timer );
    }
    timer = window.setTimeout( () => {
      func.apply( this, args );
    }, delay )
  }
}
