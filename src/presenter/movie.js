
import CatalogListView from '../view/catalog-list.js';
import {getMostCommentedSort, getRatingSort} from '../filters.js';
import CatalogListContainerView from '../view/catalog-list-container.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import CardPresenter from './card.js';
import {remove, render, RenderPosition} from '../utils/render.js';
import {UserAction, UpdateType} from '../const.js';

const MAIN_LIST_TITLE = 'All movies. Upcoming';
const MAIN_LIST_TITLE_NO_MOVIES = 'There are no movies in our database';
const MAIN_LIST_TITLE_LOAIDNG = 'Loading...';
const MAIN_LIST_SIZE = 5;
const TOP_LIST_TITLE = 'Top rated';
const MOST_COMMENTED_LIST_TITLE = 'Most commented';
const EXTRA_LIST_SIZE = 2;

export default class Movie {
  constructor(catalogFilmsNode, moviesModel) {
    this._moviesModel = moviesModel;
    this._ratingFilms = null;
    this._mostCommentedFilms = null;
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._filmPresenter = new Map();
    this._isLoading = true;

    this._catalogFilmsNode = catalogFilmsNode;
    this._filmsListNode = null;

    this._shownFilmsCount = 0;

    this._handleShowMorButton = this._handleShowMorButton.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
  }

  init() {
    this._renderMovie();
  }

  _handleModeChange() {
    this._filmPresenter.forEach((presenter) => presenter.resetView());
  }

  _renderLoading() {
    this._loadingFilmsComponent = new CatalogListView(MAIN_LIST_TITLE_LOAIDNG);
    render(this._catalogFilmsNode, this._loadingFilmsComponent, RenderPosition.AFTERBEGIN);
  }

  _renderMovie() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    let mainListTitle = MAIN_LIST_TITLE_NO_MOVIES;
    let mainListClass = '';

    if (this._getMovies().length > 0) {
      this._renderMostCommentedFilmsList();
      this._renderTopFilmsList();

      mainListTitle = MAIN_LIST_TITLE;
      mainListClass = 'visually-hidden';
    }

    this._renderMainFilmsList(mainListTitle, mainListClass);

    if (this._getMovies().length > MAIN_LIST_SIZE) {
      this._renderShowMorButton();
    }
  }

  _getSortedFilms() {
    this._ratingFilms = getRatingSort(this._getMovies());
    this._mostCommentedFilms = getMostCommentedSort(this._getMovies());
  }

  _renderFilmListContainer() {
    this._filmsListNode = this._catalogFilmsNode.querySelector('.films-list');
    render(this._filmsListNode, new CatalogListContainerView(), RenderPosition.BEFOREEND);
  }

  _renderMostCommentedFilmsList() {
    this._mostCommentedFilmListComponent = new CatalogListView(MOST_COMMENTED_LIST_TITLE, 'films-list--extra');
    render(this._catalogFilmsNode, this._mostCommentedFilmListComponent, RenderPosition.AFTERBEGIN);
    this._renderFilmListContainer();
    this._renderCards(0, this._mostCommentedFilms, EXTRA_LIST_SIZE);
  }

  _renderTopFilmsList() {
    this._topFilmListComponent =  new CatalogListView(TOP_LIST_TITLE, 'films-list--extra');
    render(this._catalogFilmsNode, this._topFilmListComponent, RenderPosition.AFTERBEGIN);
    this._renderFilmListContainer();
    this._renderCards(0, this._ratingFilms, EXTRA_LIST_SIZE);
  }

  _renderMainFilmsList(mainListTitle, mainListClass) {
    this._mainFilmListComponent = new CatalogListView(mainListTitle, '', mainListClass);
    render(this._catalogFilmsNode, this._mainFilmListComponent, RenderPosition.AFTERBEGIN);
    this._renderFilmListContainer();
    this._renderCards(0, MAIN_LIST_SIZE, true);
  }

  _renderCard(filmsListContainerNode, film) {
    const cardPresenter = new CardPresenter(filmsListContainerNode, this._handleViewAction, this._handleModeChange);
    cardPresenter.init(film);
    this._filmPresenter.set(film.id, cardPresenter);
  }

  _renderCards(from, listSize, isMainList = false) {
    const films = this._getMovies();
    const filmsListContainerNode = this._filmsListNode.querySelector('.films-list .films-list__container');
    const to = Math.min(films.length - from, listSize);
    const filmsArray = films.slice(from, to + from);
    filmsArray.forEach((film) => this._renderCard(filmsListContainerNode, film));
    if (isMainList) {
      this._shownFilmsCount += to;
    }
  }

  _renderShowMorButton() {
    const filmsListNode = this._catalogFilmsNode.querySelector('.films-list');
    render(filmsListNode, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
    this._showMoreButtonComponent.setClickHandler(this._handleShowMorButton);
  }

  _handleShowMorButton() {
    this._renderCards(this._shownFilmsCount, this._getMovies(), MAIN_LIST_SIZE);

    if (!(this._getMovies().length === this._shownFilmsCount)) {
      remove(this._showMoreButtonComponent);
      this._showMoreButtonNode = null;
    }
  }

  _getMovies() {
    return this._moviesModel.getMovies();
  }

  _clearFilmList() {
    this._filmPresenter.forEach((presenter) => presenter.destroy());
    this._filmPresenter.clear();
    this._shownFilmsCount = 0;
    remove(this._showMoreButtonComponent);
  }

  _handleViewAction(actionType, updateType, update) {
    console.log(actionType, updateType, update);
    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
        this._moviesModel.updateMovie(updateType, update);
        break;
      case UserAction.ADD_MOVIE:
        this._moviesModel.addMovie(updateType, update);
        break;
      case UserAction.DELETE_MOVIE:
        this._moviesModel.deleteMovie(updateType, update);
        break;
    }
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
  }

  _handleModelEvent(updateType, data) {
    console.log(updateType, data);

    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this._filmPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        break;
      case UpdateType.INIT:
        console.log('INIT');
        this._isLoading = false;
        remove(this._loadingFilmsComponent);
        this._renderMovie();
        break;
    }
  }
}
