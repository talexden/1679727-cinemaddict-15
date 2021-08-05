import {createCatalogTemplate} from './view/catalog.js';
import {createCatalogListTemplate} from './view/catalog-list.js';
import {createCardTemplate} from './view/card.js';
import {createShowMoreButtonTemplate} from './view/show-more-button.js';
import {createPopupTemplate} from './view/popup.js';
import {createPopupTopContainer} from './view/popup-top-container.js';
import {createFilmDetalesRow} from './view/film-detales-row.js';
import {createPopupBottomContainer} from './view/popup-bottom-container.js';
import {CreateCommetnTemplate} from './view/commetn.js';
import {render} from './utils.js';

const MAIN_LIST_TITLE = 'All movies. Upcoming';
const MAIN_LIST_SIZE = 5;
const TOP_LIST_TITLE = 'Top rated';
const TOP_LIST_SIZE = 2;
const MOST_COMMENTED_LIST_TITLE = 'Most commented';
const MOST_COMMENTED_LIST_SIZE = 2;
const FILM_DETAILES_COUNT = 7;

const body = document.querySelector('body');
const main = body.querySelector('.main');
const footer = body.querySelector('.footer');


render(main, createCatalogTemplate(), 'beforeend');


const getMultiplyStrings = (string, number) => {
  let multiplyStrings = '';
  for (let i = 0; i < number; i++) {
    multiplyStrings += string;
  }
  return multiplyStrings;
};


const catalog = main.querySelector('.films');
let catalogList;

const renderCatalogList =(listTitle, listSize, modifier) => {
  render(catalog, createCatalogListTemplate(listTitle, modifier), 'afterbegin');
  catalogList = catalog.querySelector('.films-list__container');
  render(catalogList, getMultiplyStrings(createCardTemplate(), listSize), 'beforeend');
};


renderCatalogList(MOST_COMMENTED_LIST_TITLE, MOST_COMMENTED_LIST_SIZE,'films-list--extra');
renderCatalogList(TOP_LIST_TITLE, TOP_LIST_SIZE,'films-list--extra');
renderCatalogList(MAIN_LIST_TITLE, MAIN_LIST_SIZE);
render(catalogList, createShowMoreButtonTemplate(), 'beforeend');


render(footer, createPopupTemplate(), 'afterend');
const filmDetailsInner = document.querySelector('.film-details__inner');
render(filmDetailsInner, createPopupTopContainer(), 'beforeend');
const filmDetailsTable = filmDetailsInner.querySelector('.film-details__table');
render(filmDetailsTable, getMultiplyStrings(createFilmDetalesRow(), FILM_DETAILES_COUNT), 'beforeend');
render(filmDetailsInner, createPopupBottomContainer(), 'beforeend');
const filmDetailsCommentsList = filmDetailsInner.querySelector('.film-details__comments-list');
render(filmDetailsCommentsList, getMultiplyStrings(CreateCommetnTemplate(), 1), 'beforeend');
