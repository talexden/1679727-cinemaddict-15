import {AGE, COUNTRIES, DESCRIPTION, FILM_TITLES, GENRES, POSTERS} from './constants';
import {
  getIdx,
  getRandomInt,
  getRandomArrayElement,
  getRandomListFrom,
  getRandomPerson,
  getRandomBoolean,
  getRandomDate
} from './utils';
import {createComments} from './create-comments';


const createFilmComments = createComments();

const getRandomFilmComments = (lo, hi) => {
  const count = getRandomInt(lo, hi);
  const commentIdxArray = [];
  for (let i = 0; i < count; i++) {
    commentIdxArray.push(createFilmComments());
  }
  return commentIdxArray;
};


const getRating = (lo, hi) => getRandomInt(lo * 10, hi * 10) / 10;


const getRandomPeople = (lo, hi) => {
  const count = getRandomInt(lo, hi);
  return new Array(count).fill({}).map(getRandomPerson);
};

const getDescription = () => getRandomListFrom(1, 5, DESCRIPTION).join(' ');
const createFilmIdx = getIdx();


const getFilmCard = () => {
  const filmTitle = getRandomArrayElement(FILM_TITLES);

  const getAlternativeTitles = () => {
    let title = filmTitle;
    if (!getRandomInt(0, 5)) {
      title = getRandomArrayElement(FILM_TITLES);
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
      poster: `./images/posters/${getRandomArrayElement(POSTERS)}`,
      ageRating: getRandomArrayElement(AGE), // в тех задании есть этот ключ, не понимаю к чему он вообще
      director: getRandomPerson(),
      writers: getRandomPeople(1, 3),
      actors: getRandomPeople(2, 5),
      release: {
        date: getRandomDate('1937', '2010'),
        country: getRandomArrayElement(COUNTRIES),
      },
      runtime: getRandomInt(38, 190),
      genres: getRandomListFrom(1, 3, GENRES),
      description: getDescription(),
    },
    userDetails: {
      watchlist: getRandomBoolean(),
      alreadyWatched: getRandomBoolean(),
      watchingDate: getRandomDate('2012', '2020'),
      favorite: getRandomBoolean(),
    },
  };
};


const createFilmCards = (filmsCount) => new Array(filmsCount).fill({}).map(getFilmCard);
export {createFilmCards};
