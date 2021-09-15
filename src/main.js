import {catalogTemplate} from './view/catalog.js';
import {catalogListTemplate} from './view/catalog-list.js';
import {cardTemplate} from './view/card.js';
import {showMoreButtonTemplate} from './view/show-more-button.js';
import {catalogSortingTemplate} from './view/catalog-sorting.js';
import {footerStatisticTemplate} from './view/footer-statistic.js';
import {userProfileTemplate} from './view/user-profile.js';
import {popupTemplate} from './view/popup.js';
import {popupFilmDetailsTemplate} from './view/popup-film-details.js';
import {popupFilmCommentsTemplate} from './view/popup-film-comments.js';
import {commentTemplate} from './view/comment.js';
import {navigationTemplate} from './view/navigation.js';
import {getStringMultiply, renderTemplate} from './utils.js';
import {getMostCommentedSort, getRatingSort} from './filters.js';
import {createFilmCards} from './mock/create-film-cards';
import {getComments} from './mock/create-comments';

const MAIN_LIST_TITLE = 'All movies. Upcoming';
const MAIN_LIST_SIZE = 5;
const TOP_LIST_TITLE = 'Top rated';
const TOP_LIST_SIZE = 2;
const MOST_COMMENTED_LIST_TITLE = 'Most commented';
const MOST_COMMENTED_LIST_SIZE = 2;
const FILMS_CATALOG_SIZE = 37;

const films = createFilmCards(FILMS_CATALOG_SIZE);

const main = document.querySelector('.main');
renderTemplate(main, navigationTemplate(films), 'beforeend');


const header = document.querySelector('.header');
renderTemplate(header, userProfileTemplate(),'beforeend');


renderTemplate(main, catalogSortingTemplate(), 'beforeend');
renderTemplate(main, catalogTemplate(), 'beforeend');


const catalogFilmsNode = main.querySelector('.films');

const getCatalogList = (filmsData, listTitle, listSize, listModifier, listTitleClass) => {
  const cards = getStringMultiply(listSize, cardTemplate, filmsData);
  return catalogListTemplate(cards, listTitle, listModifier, listTitleClass);
};


renderTemplate(catalogFilmsNode, getCatalogList(films, MAIN_LIST_TITLE, MAIN_LIST_SIZE, '', 'visually-hidden'), 'beforeend');
renderTemplate(catalogFilmsNode, getCatalogList(getRatingSort(films), TOP_LIST_TITLE, TOP_LIST_SIZE, 'films-list--extra'), 'beforeend');
renderTemplate(catalogFilmsNode, getCatalogList(getMostCommentedSort(films), MOST_COMMENTED_LIST_TITLE, MOST_COMMENTED_LIST_SIZE, 'films-list--extra'), 'beforeend');

const filmsListNode = catalogFilmsNode.querySelector('.films-list');
renderTemplate(filmsListNode, showMoreButtonTemplate(), 'beforeend');


let shownFilms = MAIN_LIST_SIZE;

const getFilmCatalogList = (filmsData, showNumber, idx) => {
  let string = '';
  const hiddenFilms = filmsData.length - idx;
  const counter = hiddenFilms < showNumber ? hiddenFilms : showNumber;
  for (let i = 0; i < counter; i++) {
    string += cardTemplate(filmsData[shownFilms]);
    shownFilms++;
  }
  return string;
};


const filmsListContainer = filmsListNode.querySelector('.films-list__container');
const showMoreButton = filmsListNode.querySelector('.films-list__show-more');
showMoreButton.addEventListener('click', () => {
  const filmsList = getFilmCatalogList(films, MAIN_LIST_SIZE, shownFilms);
  renderTemplate(filmsListContainer, filmsList, 'beforeend');
  if (films.length === shownFilms) {
    showMoreButton.remove();
  }
});


const footerNode = document.querySelector('.footer');
renderTemplate(footerNode, footerStatisticTemplate(films.length),'beforeend');


renderTemplate(footerNode, popupTemplate(), 'afterend');

const filmDetailsInner = document.querySelector('.film-details__inner');
renderTemplate(filmDetailsInner, popupFilmDetailsTemplate(films[0]), 'beforeend');
renderTemplate(filmDetailsInner, popupFilmCommentsTemplate(films[0]), 'beforeend');

const bodyNode = document.querySelector('body');
bodyNode.classList.add('hide-overflow');


const renderPopupComments = (container, filmCommentIds, place) => {
  const comments = getComments();
  filmCommentIds.forEach((commentId) => {
    renderTemplate(container, commentTemplate(comments[commentId]), place);
  });
};


const filmDetailsCommentsListNode = filmDetailsInner.querySelector('.film-details__comments-list');
renderPopupComments(filmDetailsCommentsListNode, films[0].comments, 'beforeend');

const popupNode = document.querySelector('.film-details');
const popupCloseButton = document.querySelector('.film-details__close-btn');


popupCloseButton.addEventListener('click', () => {
  bodyNode.classList.remove('hide-overflow');
  popupNode.remove();
});
