
/**
 * @description 判断一个元素是否是一个 DOM 元素
 * @param {Node} element
 * @returns {Boolean} 若是 DOM 节点 返回 true 反之返回 false
 */
export function isDOMNode ( element ) {
  return element.nodeType === 1
}

/**
 * @description 判断一个元素是否带有某一个类名
 * @param {Node} element
 * @param {String} className
 * @throws {TypeError} maybe throw a TypeError: element is not a element node
 */
export function hasClass ( element, className ) {
  if ( !isDOMNode( element ) ) {
    throw new TypeError( `The ${element} is not a element node` )
  }

  let reg = new RegExp( '(^|\\s)' + className + '(\\s|$)' )
  return reg.test( element.className )
}

/**
 *@description 给 DOM 元素添加类名
 * @param {Node} element
 * @param {String} className
 */
export function addClass ( element, className ) {
  if ( !isDOMNode( element ) ) {
    throw new TypeError( `The ${element} is not a element node` )
  }

  if ( hasClass( element, className ) ) {
    return
  }

  let classNameArray = element.className.split( ' ' );
  classNameArray.push( className.trim() );
  element.className = classNameArray.join( ' ' );
}
