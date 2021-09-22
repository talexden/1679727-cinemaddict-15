import Catalog from './view/catalog.js';
import CatalogSorting from './view/catalog-sorting.js';
import FooterStatistic from './view/footer-statistic.js';
import UserProfile from './view/user-profile.js';
import Navigation from './view/navigation.js';
import {render, RenderPosition} from './utils.js';
import {createFilmCards} from './mock/create-film-cards';
import MoviePresenter from './presenter/movie';
import {getComments} from './mock/create-comments';

const FILMS_CATALOG_SIZE = 8;

const mainNode = document.querySelector('.main');

const films = createFilmCards(FILMS_CATALOG_SIZE);

render(mainNode, new Navigation(films).getElement(), RenderPosition.BEFOREEND);
const headerNode = document.querySelector('.header');
render(headerNode, new UserProfile().getElement(), RenderPosition.BEFOREEND);


render(mainNode, new CatalogSorting().getElement(), RenderPosition.BEFOREEND);
render(mainNode, new Catalog().getElement(), RenderPosition.BEFOREEND);

const catalogFilmsNode = mainNode.querySelector('.films');
const moviePresenter = new MoviePresenter(catalogFilmsNode);
moviePresenter.init(films, getComments());

const footerNode = document.querySelector('.footer');
render(footerNode, new FooterStatistic(films.length).getElement(), RenderPosition.BEFOREEND);
