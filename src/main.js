import Catalog from './view/catalog.js';
import {catalogListTemplate} from './view/catalog-list.js';
import {cardTemplate} from './view/card.js';
import ShowMoreButton from './view/show-more-button.js';
import CatalogSorting from './view/catalog-sorting.js';
import FooterStatistic from './view/footer-statistic.js';
import UserProfile from './view/user-profile.js';
import PopupTemplate from './view/popup.js';
import PopupFilmDetails from './view/popup-film-details.js';
import PopupFilmComments from './view/popup-film-comments.js';
import {commentTemplate} from './view/comment.js';
import Navigation from './view/navigation.js';
import {getStringMultiply, renderTemplate, renderElement, RenderPosition} from './utils.js';
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
renderElement(main, new Navigation(films).getElement(), RenderPosition.BEFOREEND);

const header = document.querySelector('.header');
renderElement(header, new UserProfile().getElement(), RenderPosition.BEFOREEND);


renderElement(main, new CatalogSorting().getElement(), RenderPosition.BEFOREEND);
renderElement(main, new Catalog().getElement(), RenderPosition.BEFOREEND);


const catalogFilmsNode = main.querySelector('.films');

const getCatalogList = (filmsData, listTitle, listSize, listModifier, listTitleClass) => {
  const cards = getStringMultiply(listSize, cardTemplate, filmsData);
  return catalogListTemplate(cards, listTitle, listModifier, listTitleClass);
};


renderTemplate(catalogFilmsNode, getCatalogList(films, MAIN_LIST_TITLE, MAIN_LIST_SIZE, '', 'visually-hidden'), 'beforeend');
renderTemplate(catalogFilmsNode, getCatalogList(getRatingSort(films), TOP_LIST_TITLE, TOP_LIST_SIZE, 'films-list--extra'), 'beforeend');
renderTemplate(catalogFilmsNode, getCatalogList(getMostCommentedSort(films), MOST_COMMENTED_LIST_TITLE, MOST_COMMENTED_LIST_SIZE, 'films-list--extra'), 'beforeend');

const filmsListNode = catalogFilmsNode.querySelector('.films-list');
renderElement(filmsListNode, new ShowMoreButton().getElement(), RenderPosition.BEFOREEND);


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
renderElement(footerNode, new FooterStatistic(films.length).getElement(), RenderPosition.BEFOREEND);
renderElement(footerNode, new PopupTemplate().getElement(), RenderPosition.AFTEREND);

const filmDetailsInner = document.querySelector('.film-details__inner');
renderElement(filmDetailsInner, new PopupFilmDetails(films[0]).getElement(), RenderPosition.BEFOREEND);
renderElement(filmDetailsInner, new PopupFilmComments(films[0]).getElement(), RenderPosition.BEFOREEND);

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
