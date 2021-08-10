import {
  loremNames,
  loremSurnames,
  posters,
  loremFilmTitles,
  loremDescription,
  emojis,
  loremCommentsPhrase,
  loremCountries,
  loremGenres, loremAge
} from './constants-mock.js';


const getIdx = (startIdx = 0) => {
  let idx = startIdx;
  return () => idx++ ;
};


const getRandomBoolean = () => Math.random() < 0.5;


const fillArrayBy = (count, cb) => {
  const array = [];
  for (let i = 0; i < count; i++) {
    array.push(cb());
  }
  return array;
};

const getRandomInt = (lo, hi) => {
  lo = Math.ceil(lo);
  hi = Math.floor(hi);
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
};


const getRandomItem = (array, beginIdx = 0, endIdx = array.length - 1) => {
  const randomItem = getRandomInt(beginIdx, endIdx);
  return array[randomItem];
};


const getRandomPerson = () => `${getRandomItem(loremNames)} ${getRandomItem(loremSurnames)}`;


const getRandomSet = (lo, hi, size) => {
  const randomSet = new Set();
  if (hi < size) {size = hi;}
  while (randomSet.size < size) {
    randomSet.add(getRandomInt(lo, hi));
  }
  return randomSet;
};


const getRandomPeople = (lo, hi) => {
  const count = getRandomInt (lo, hi);
  const people = fillArrayBy(count, getRandomPerson);
  return people;
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


const createCommentIdx = getIdx();

const getComment  = () => ({
  id: createCommentIdx(),
  author: getRandomPerson(loremNames),
  comment: getRandomListFrom(1, 3, loremCommentsPhrase),
  date: getRandomDate('2012', '2020'),
  emotion: getRandomItem(emojis),
});


const comments = [];


const createComments = () => {
  let idx = 0;
  return () => {
    comments.push(getComment());
    return idx++;
  };
};


const getRating = (lo, hi) => getRandomInt(lo * 10, hi * 10) / 10;


const createFilmComments = createComments();
const getRandomFilmComments = (lo, hi) => {
  const count = getRandomInt(lo, hi);
  const commentIdxArray = [];
  for (let i = 0; i < count; i++) {
    commentIdxArray.push(createFilmComments());
  }
  return commentIdxArray;
};


const getDescription = () => getRandomListFrom(1, 5, loremDescription).join(' ');
const createFilmIdx = getIdx();

const getFilmCard = () => {
  const filmTitle = getRandomItem(loremFilmTitles);

  const getAlternativeTitles = () => {
    let title = filmTitle;
    if (!getRandomInt(0, 5)) {
      title =  getRandomItem(loremFilmTitles);
    }
    return title;
  };

  return {
    id: createFilmIdx(),
    comments: getRandomFilmComments(0, 5),
    filmInfo: {
      title: filmTitle,
      alternativeTitle: getAlternativeTitles(),
      totalRating: getRating(3, 10),
      poster: `./images/posters/${getRandomItem(posters)}`,
      ageRating: getRandomItem(loremAge), // в тех задании есть этот ключ, не понимаю к чему он вообще
      director: getRandomPerson(),
      writers: getRandomPeople(1, 3),
      actors: getRandomPeople(2, 5),
      release: {
        date: getRandomDate('1937', '2010'),
        country: getRandomItem(loremCountries),
      },
      runtime: getRandomInt(38, 190),
      genres: getRandomListFrom(1, 3, loremGenres),
      description: getDescription(),
    },
    userDetails : {
      watchlist: getRandomBoolean(),
      alreadyWatched: getRandomBoolean(),
      watchingDate: getRandomDate('2012', '2020'),
      favorite: getRandomBoolean(),
    },
  };
};


const getComments = () => comments;


export {getIdx, getFilmCard, getComments, fillArrayBy};
