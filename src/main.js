import Catalog from './view/catalog.js';
import CatalogSorting from './view/catalog-sorting.js';
import FooterStatistic from './view/footer-statistic.js';
import UserProfile from './view/user-profile.js';
import Navigation from './view/navigation.js';
import {createFilmCards} from './mock/create-film-cards';
import MoviePresenter from './presenter/movie';
import {getComments} from './mock/create-comments';
import DataModel from './model/data.js';
import Api from './api.js';
import {getAlphaNumericRandom, getRandomInt} from './mock/utils.js';
import {render, RenderPosition} from './utils/render';

const FILMS_CATALOG_SIZE = 8;


const AUTHORIZATION = `Basic ${getAlphaNumericRandom(getRandomInt(1, 64))}`;
const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict';


const mainNode = document.querySelector('.main');

const movies = createFilmCards(FILMS_CATALOG_SIZE);
let films = {};

const api = new Api(END_POINT, AUTHORIZATION);

api
  .getMovies()
  .then((moviesData) => {
    films = moviesData;
    console.log(films);
    // Есть проблема: cтруктура объекта похожа, но некоторые ключи называются иначе,
    // а ещё на сервере используется snake_case, а у нас camelCase.
    // Можно, конечно, переписать часть нашего клиентского приложения, но зачем?
    // Есть вариант получше - паттерн "Адаптер"
  });


api
  .getComments(movies[7])
  .then((comments) => {
    console.log(comments);
    // Есть проблема: cтруктура объекта похожа, но некоторые ключи называются иначе,
    // а ещё на сервере используется snake_case, а у нас camelCase.
    // Можно, конечно, переписать часть нашего клиентского приложения, но зачем?
    // Есть вариант получше - паттерн "Адаптер"
  });

const moviesModel = new DataModel();
moviesModel.setData(movies);

const commentsModel = new DataModel();
commentsModel.setData(getComments());


render(mainNode, new Navigation(movies), RenderPosition.BEFOREEND);
const headerNode = document.querySelector('.header');
render(headerNode, new UserProfile(), RenderPosition.BEFOREEND);


render(mainNode, new CatalogSorting(), RenderPosition.BEFOREEND);
render(mainNode, new Catalog(), RenderPosition.BEFOREEND);

const catalogFilmsNode = mainNode.querySelector('.films');
const moviePresenter = new MoviePresenter(catalogFilmsNode, moviesModel);
moviePresenter.init(movies, getComments());

const footerNode = document.querySelector('.footer');
render(footerNode, new FooterStatistic(movies.length), RenderPosition.BEFOREEND);
