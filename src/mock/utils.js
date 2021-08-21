import {NAMES, SURNAMES} from './constants.js';


const getIdx = (startIdx = 0) => {
  let idx = startIdx;
  return () => idx++ ;
};


const getRandomBoolean = () => Math.random() < 0.5;


const getRandomInt = (lo, hi) => {
  lo = Math.ceil(lo);
  hi = Math.floor(hi);
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
};


const getRandomArrayElement = (array, beginIdx = 0, endIdx = array.length - 1) => {
  const randomItem = getRandomInt(beginIdx, endIdx);
  return array[randomItem];
};


const getRandomPerson = () => `${getRandomArrayElement(NAMES)} ${getRandomArrayElement(SURNAMES)}`;


const getRandomSet = (lo, hi, size) => {
  const randomSet = new Set();
  if (hi < size) {size = hi;}
  while (randomSet.size < size) {
    randomSet.add(getRandomInt(lo, hi));
  }
  return randomSet;
};


const getRandomListFrom = (lo, hi, array) => {
  const randomArray = [];
  const idxSet = getRandomSet(0, array.length - 1, getRandomInt(lo, hi));
  for (const item of idxSet) {
    randomArray.push(array[item]);
  }
  return randomArray;
};


const getRandomDate = (date1, date2) => {
  date1  = new Date(date1).getTime();
  date2 = new Date(date2).getTime();
  return new Date(getRandomInt(date1, date2));
};


export {
  getIdx,
  getRandomBoolean,
  getRandomDate,
  getRandomArrayElement,
  getRandomInt,
  getRandomPerson,
  getRandomListFrom
};
