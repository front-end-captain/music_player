import { playmode } from 'common/js/config.js';

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  mode: playmode.sequence,
  currentIndex: -1
}

export default state;

