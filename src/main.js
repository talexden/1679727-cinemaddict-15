import {createCatalogTemplate} from './view/catalog.js';
import {createCatalogListTemplate} from './view/catalog-list.js';
import {createCardTemplate} from './view/card.js';
import {createShowMoreButtonTemplate} from './view/show-more-button.js';
import {createCatalogSortingTemplate} from './view/catalog-sorting.js';
import {createFooterStatisticTemplate} from './view/footer-statistic.js';
import {createUserProfile} from './view/userProfile.js';
import {createPopupTemplate} from './view/popup.js';
import {createPopupTopContainer} from './view/popup-top-container.js';
import {createPopupBottomContainer} from './view/popup-bottom-container.js';
import {createCommetnTemplate} from './view/comment.js';
import {fillArrayBy, getComments, getFilmCard} from './mock/create-mock.js';
import {getStringMultiply, render} from './utils.js';
import {getFavoritFilms, getMostCommentedSort, getRatingSort, getWatchedFilms, getWatchlistFilms} from './filters.js';

const MAIN_LIST_TITLE = 'All movies. Upcoming';
const MAIN_LIST_SIZE = 5;
const TOP_LIST_TITLE = 'Top rated';
const TOP_LIST_SIZE = 2;
const MOST_COMMENTED_LIST_TITLE = 'Most commented';
const MOST_COMMENTED_LIST_SIZE = 2;

const films = fillArrayBy(28, getFilmCard);

const filters = document.querySelectorAll('.main-navigation__item span');

filters[0].textContent = getWatchlistFilms(films).length;
filters[1].textContent = getWatchedFilms(films).length;
filters[2].textContent = getFavoritFilms(films).length;


const header = document.querySelector('.header');
render(header, createUserProfile(),'beforeend');

const main = document.querySelector('.main');
render(main, createCatalogSortingTemplate(), 'beforeend');
render(main, createCatalogTemplate(), 'beforeend');


const catalog = main.querySelector('.films');

const getCatalogList = (filmsData, listTitle, listSize, listModifier, listTitleClass) => {
  const cards = getStringMultiply(listSize, createCardTemplate, filmsData);
  return createCatalogListTemplate(listTitle, cards,listModifier, listTitleClass);
};


render(catalog, getCatalogList(films, MAIN_LIST_TITLE, MAIN_LIST_SIZE, '', 'visually-hidden'), 'beforeend');
render(catalog, getCatalogList(getRatingSort(films), TOP_LIST_TITLE, TOP_LIST_SIZE, 'films-list--extra'), 'beforeend');
render(catalog, getCatalogList(getMostCommentedSort(films), MOST_COMMENTED_LIST_TITLE, MOST_COMMENTED_LIST_SIZE, 'films-list--extra'), 'beforeend');

const filmList = catalog.querySelector('.films-list');
render(filmList, createShowMoreButtonTemplate(), 'beforeend');


let shownFilms = MAIN_LIST_SIZE;

const getFilmCatalogList = (filmsData, showNumber, idx) => {
  let string = '';
  const hiddenFilms = filmsData.length - idx;
  const counter = hiddenFilms < showNumber ? hiddenFilms : showNumber;
  for (let i = 0; i < counter; i++) {
    string += createCardTemplate(filmsData[shownFilms]);
    shownFilms++;
  }
  return string;
};


const filmsListContainer = filmList.querySelector('.films-list__container');
const showMoreButton = filmList.querySelector('.films-list__show-more');
showMoreButton.addEventListener('click', () => {
  const filmsList = getFilmCatalogList(films, MAIN_LIST_SIZE, shownFilms);
  render (filmsListContainer, filmsList, 'beforeend');
  if (films.length === shownFilms) {
    showMoreButton.remove();
  }
});


const footer = document.querySelector('.footer');
render(footer, createFooterStatisticTemplate(films.length),'beforeend');


render(footer, createPopupTemplate(), 'afterend');

const filmDetailsInner = document.querySelector('.film-details__inner');
render(filmDetailsInner, createPopupTopContainer(films[0]), 'beforeend');
render(filmDetailsInner, createPopupBottomContainer(films[0]), 'beforeend');

const body = document.querySelector('body');
body.classList.add('hide-overflow');

const getPopupComments = (filmComments, comments) => {
  let popupComments = '';
  filmComments.forEach((item) => {
    popupComments += createCommetnTemplate(comments[item]);
  });
  return popupComments;
};

const filmDetailsCommentsList = filmDetailsInner.querySelector('.film-details__comments-list');
render(filmDetailsCommentsList, getPopupComments(films[0].comments, getComments()), 'beforeend');

const popup = document.querySelector('.film-details');
const popupCloseButton = document.querySelector('.film-details__close-btn');


popupCloseButton.addEventListener('click', () => {
  body.classList.remove('hide-overflow');
  popup.remove();
});
