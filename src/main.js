import Catalog from './view/catalog.js';
import CatalogList from './view/catalog-list.js';
import Cards from './view/card.js';
import ShowMoreButton from './view/show-more-button.js';
import CatalogSorting from './view/catalog-sorting.js';
import FooterStatistic from './view/footer-statistic.js';
import UserProfile from './view/user-profile.js';
import PopupTemplate from './view/popup.js';
import PopupFilmDetails from './view/popup-film-details.js';
import PopupFilmComments from './view/popup-film-comments.js';
import Comment from './view/comment.js';
import Navigation from './view/navigation.js';
import {renderElement, RenderPosition} from './utils.js';
import {getMostCommentedSort, getRatingSort} from './filters.js';
import {createFilmCards} from './mock/create-film-cards';
import {getComments} from './mock/create-comments';

const MAIN_LIST_TITLE = 'All movies. Upcoming';
const MAIN_LIST_SIZE = 5;
const TOP_LIST_TITLE = 'Top rated';
const MOST_COMMENTED_LIST_TITLE = 'Most commented';
const EXTRA_LIST_SIZE = 2;
const FILMS_CATALOG_SIZE = 37;

const films = createFilmCards(FILMS_CATALOG_SIZE);
const filmsLength = films.length;

const main = document.querySelector('.main');
renderElement(main, new Navigation(films).getElement(), RenderPosition.BEFOREEND);

const header = document.querySelector('.header');
renderElement(header, new UserProfile().getElement(), RenderPosition.BEFOREEND);


renderElement(main, new CatalogSorting().getElement(), RenderPosition.BEFOREEND);
renderElement(main, new Catalog().getElement(), RenderPosition.BEFOREEND);


let shownFilmsIdx = 0;

const renderCards = (place, filmsData, cardsCount, startIdx = 0) => {
  const hiddenFilms = filmsData.length - shownFilmsIdx;
  const count = hiddenFilms < cardsCount ? hiddenFilms : cardsCount;
  for (let i = startIdx; i < startIdx + count; i++) {
    renderElement(place, new Cards(filmsData[i]).getElement(), RenderPosition.BEFOREEND);
    shownFilmsIdx++;
  }
};


const catalogFilmsNode = main.querySelector('.films');

renderElement(catalogFilmsNode, new CatalogList(MOST_COMMENTED_LIST_TITLE, 'films-list--extra').getElement(), RenderPosition.AFTERBEGIN);
let catalogFilmsContainerNode = catalogFilmsNode.querySelector('.films-list .films-list__container');
renderCards(catalogFilmsContainerNode, getMostCommentedSort(films), EXTRA_LIST_SIZE);

renderElement(catalogFilmsNode, new CatalogList(TOP_LIST_TITLE, 'films-list--extra').getElement(), RenderPosition.AFTERBEGIN);
catalogFilmsContainerNode = catalogFilmsNode.querySelector('.films-list .films-list__container');
renderCards(catalogFilmsContainerNode, getRatingSort(films), EXTRA_LIST_SIZE);

renderElement(catalogFilmsNode, new CatalogList(MAIN_LIST_TITLE, '', 'visually-hidden').getElement(), RenderPosition.AFTERBEGIN);
catalogFilmsContainerNode = catalogFilmsNode.querySelector('.films-list .films-list__container');
renderCards(catalogFilmsContainerNode, films, MAIN_LIST_SIZE);


const filmsListNode = catalogFilmsNode.querySelector('.films-list');
renderElement(filmsListNode, new ShowMoreButton().getElement(), RenderPosition.BEFOREEND);


const showMoreButton = filmsListNode.querySelector('.films-list__show-more');

showMoreButton.addEventListener('click', () => {
  renderCards(catalogFilmsContainerNode, films, MAIN_LIST_SIZE);
  if (filmsLength === shownFilmsIdx) {
    showMoreButton.remove();
  }
});


const footerNode = document.querySelector('.footer');
renderElement(footerNode, new FooterStatistic(filmsLength).getElement(), RenderPosition.BEFOREEND);
renderElement(footerNode, new PopupTemplate().getElement(), RenderPosition.AFTEREND);

const filmDetailsInner = document.querySelector('.film-details__inner');
renderElement(filmDetailsInner, new PopupFilmDetails(films[0]).getElement(), RenderPosition.BEFOREEND);
renderElement(filmDetailsInner, new PopupFilmComments(films[0]).getElement(), RenderPosition.BEFOREEND);

const bodyNode = document.querySelector('body');
bodyNode.classList.add('hide-overflow');


const renderPopupComments = (container, filmCommentIds) => {
  const comments = getComments();
  filmCommentIds.forEach((commentId) => {
    renderElement(container, new Comment(comments[commentId]).getElement(), RenderPosition.BEFOREEND);
  });
};


const filmDetailsCommentsListNode = filmDetailsInner.querySelector('.film-details__comments-list');
renderPopupComments(filmDetailsCommentsListNode, films[0].comments);

const popupNode = document.querySelector('.film-details');
const popupCloseButton = document.querySelector('.film-details__close-btn');


popupCloseButton.addEventListener('click', () => {
  bodyNode.classList.remove('hide-overflow');
  popupNode.remove();
});
