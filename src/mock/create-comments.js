import {COMMENTS_PHRASE, EMOJIS, NAMES} from './constants';
import {getIdx, getRandomDate, getRandomArrayElement, getRandomListFrom, getRandomPerson} from './utils';


const createCommentIdx = getIdx();

const getComment = () => ({
  id: createCommentIdx(),
  author: getRandomPerson(NAMES),
  comment: getRandomListFrom(1, 3, COMMENTS_PHRASE).join(' '),
  date: getRandomDate('2012', '2020'),
  emotion: getRandomArrayElement(EMOJIS),
});


const comments = [];

const createComments = () => {
  let idx = 0;
  return () => {
    comments.push(getComment());
    return idx++;
  };
};


const getComments = () => comments;


export {getComments, createComments};
