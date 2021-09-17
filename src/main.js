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
import {isEscEvent, render, RenderPosition} from './utils.js';
import {getMostCommentedSort, getRatingSort} from './filters.js';
import {createFilmCards} from './mock/create-film-cards';
import {getComments} from './mock/create-comments';

export const MAIN_LIST_TITLE = 'All movies. Upcoming';
export const MAIN_LIST_TITLE_NO_MOVIES = 'There are no movies in our database';
export const MAIN_LIST_SIZE = 5;
export const TOP_LIST_TITLE = 'Top rated';
export const MOST_COMMENTED_LIST_TITLE = 'Most commented';
export const EXTRA_LIST_SIZE = 2;
export const FILMS_CATALOG_SIZE = 8;
export const SHOW_CARDS_COUNT = 5;

const bodyNode = document.querySelector('body');
const mainNode = bodyNode.querySelector('.main');

const films = createFilmCards(FILMS_CATALOG_SIZE);
const filmsLength = films.length;
const ratingFilms = getRatingSort(films);
const mostCommentedFilms = getMostCommentedSort(films);


render(mainNode, new Navigation(films).getElement(), RenderPosition.BEFOREEND);
const headerNode = document.querySelector('.header');
render(headerNode, new UserProfile().getElement(), RenderPosition.BEFOREEND);


render(mainNode, new CatalogSorting().getElement(), RenderPosition.BEFOREEND);
render(mainNode, new Catalog().getElement(), RenderPosition.BEFOREEND);


const renderCards = (place, filmsData, cardsCount = 0) => {
  let shownFilmsIdx = 0;
  return () => {
    const hiddenFilms = filmsData.length - shownFilmsIdx;
    const count = hiddenFilms < cardsCount ? hiddenFilms + shownFilmsIdx: cardsCount + shownFilmsIdx;
    for (let i = shownFilmsIdx; i < count; i++) {
      render(place, new Cards(filmsData[i], i).getElement(), RenderPosition.BEFOREEND);
      shownFilmsIdx++;
    }
    return shownFilmsIdx;
  };
};


const catalogFilmsNode = mainNode.querySelector('.films');
let catalogFilmsContainerNode = '';
let mainListTitle = MAIN_LIST_TITLE_NO_MOVIES;
let mainListClass = '';

if (filmsLength > 0) {
  render(catalogFilmsNode, new CatalogList(MOST_COMMENTED_LIST_TITLE, 'films-list--extra').getElement(), RenderPosition.AFTERBEGIN);
  catalogFilmsContainerNode = catalogFilmsNode.querySelector('.films-list .films-list__container');
  const renderMostListCard = renderCards(catalogFilmsContainerNode, mostCommentedFilms, EXTRA_LIST_SIZE);
  renderMostListCard();

  render(catalogFilmsNode, new CatalogList(TOP_LIST_TITLE, 'films-list--extra').getElement(), RenderPosition.AFTERBEGIN);
  catalogFilmsContainerNode = catalogFilmsNode.querySelector('.films-list .films-list__container');
  const renderTopListCard = renderCards(catalogFilmsContainerNode, ratingFilms, EXTRA_LIST_SIZE);
  renderTopListCard();

  mainListTitle = MAIN_LIST_TITLE;
  mainListClass = 'visually-hidden';
}


render(catalogFilmsNode, new CatalogList(mainListTitle, '', mainListClass).getElement(), RenderPosition.AFTERBEGIN);
catalogFilmsContainerNode = catalogFilmsNode.querySelector('.films-list .films-list__container');
const renderMainListCard = renderCards(catalogFilmsContainerNode, films, MAIN_LIST_SIZE);
renderMainListCard();

if (filmsLength > 5) {
  const filmsListNode = catalogFilmsNode.querySelector('.films-list');
  render(filmsListNode, new ShowMoreButton().getElement(), RenderPosition.BEFOREEND);

  const showMoreButtonNode = filmsListNode.querySelector('.films-list__show-more');

  showMoreButtonNode.addEventListener('click', () => {
    const shownFilmsIdx = renderMainListCard();
    if (filmsLength === shownFilmsIdx) {
      showMoreButtonNode.remove();
    }
  });
}


const footerNode = document.querySelector('.footer');
render(footerNode, new FooterStatistic(filmsLength).getElement(), RenderPosition.BEFOREEND);


const renderPopupComments = (container, filmCommentIds) => {
  const comments = getComments();
  filmCommentIds.forEach((commentId) => {
    render(container, new Comment(comments[commentId]).getElement(), RenderPosition.BEFOREEND);
  });
};


const closePopup  = () => {
  bodyNode.removeChild(bodyNode.querySelector('.film-details'));
  bodyNode.classList.remove('hide-overflow');
};


const onEscPopup = (evt) => {
  if (isEscEvent(evt)) {
    closePopup();
    window.removeEventListener('keydown', onEscPopup);
  }
};


const renderPopup = (filmData) => {
  render(bodyNode, new PopupTemplate().getElement(), RenderPosition.BEFOREEND);
  const filmDetailsInnerNode = document.querySelector('.film-details__inner');
  render(filmDetailsInnerNode, new PopupFilmDetails(filmData).getElement(), RenderPosition.BEFOREEND);
  render(filmDetailsInnerNode, new PopupFilmComments(filmData).getElement(), RenderPosition.BEFOREEND);

  bodyNode.classList.add('hide-overflow');


  const filmDetailsCommentsListNode = filmDetailsInnerNode.querySelector('.film-details__comments-list');
  renderPopupComments(filmDetailsCommentsListNode, filmData.comments);

  const popupCloseButton = document.querySelector('.film-details__close-btn');

  popupCloseButton.addEventListener('click', closePopup);

  window.addEventListener('keydown', onEscPopup);
};


const isTrueFilmList = (element, filmListTitle) => {
  let listTitleNode = false;
  while(element && !listTitleNode) {
    element = element.parentElement;
    listTitleNode = element.querySelector('h2');
  }

  return listTitleNode.textContent === filmListTitle;
};


const onCardClickEvent = (evt) => {
  const target = evt.target;
  const trueClick =
    target.classList.contains('film-card__poster') ||
    target.classList.contains('film-card__title') ||
    target.classList.contains('film-card__comments');

  if (!trueClick) {
    return;
  }

  evt.preventDefault();
  isTrueFilmList(target, MAIN_LIST_TITLE);

  const filmIdx = target.parentElement.getAttribute('film-id');
  switch (true) {
    case isTrueFilmList(target, MAIN_LIST_TITLE):
      renderPopup(films[filmIdx]);
      break;
    case isTrueFilmList(target, TOP_LIST_TITLE):
      renderPopup(ratingFilms[filmIdx]);
      break;
    case isTrueFilmList(target, MOST_COMMENTED_LIST_TITLE):
      renderPopup(mostCommentedFilms[filmIdx]);
      break;
  }
};

window.addEventListener('click', onCardClickEvent);
