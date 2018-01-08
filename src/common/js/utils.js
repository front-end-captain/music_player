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
