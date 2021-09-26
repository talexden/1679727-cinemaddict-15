
import CatalogListView from '../view/catalog-list.js';
import {getMostCommentedSort, getRatingSort} from '../filters.js';
import CatalogListContainerView from '../view/catalog-list-container.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import CardPresenter from './card.js';
import {remove, render, RenderPosition} from '../utils/render.js';
import {updateItem} from '../utils/common.js';

const MAIN_LIST_TITLE = 'All movies. Upcoming';
const MAIN_LIST_TITLE_NO_MOVIES = 'There are no movies in our database';
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

    this._catalogFilmsNode = catalogFilmsNode;
    this._filmsListNode = null;

    this._shownFilmsCount = 0;

    this._handleCardChange = this._handleCardChange.bind(this);
    this._handleShowMorButton = this._handleShowMorButton.bind(this);
  }

  init(films, comments) {
    this._currentFilms = films.slice();
    this._currentComments = comments.slice();
    this._getSortedFilms();
    this._renderMovie();
  }

  _renderMovie() {
    let mainListTitle = MAIN_LIST_TITLE_NO_MOVIES;
    let mainListClass = '';

    if (this._currentFilms.length > 0) {
      this._renderMostCommentedFilmsList();
      this._renderTopFilmsList();

      mainListTitle = MAIN_LIST_TITLE;
      mainListClass = 'visually-hidden';
    }

    this._renderMainFilmsList(mainListTitle, mainListClass);

    if (this._currentFilms.length > MAIN_LIST_SIZE) {
      this._renderShowMorButton();
    }
  }

  _getSortedFilms() {
    this._ratingFilms = getRatingSort(this._currentFilms);
    this._mostCommentedFilms = getMostCommentedSort(this._currentFilms);
  }

  _renderFilmListContainer() {
    this._filmsListNode = this._catalogFilmsNode.querySelector('.films-list');
    render(this._filmsListNode, new CatalogListContainerView(), RenderPosition.BEFOREEND);
  }

  _renderMostCommentedFilmsList() {
    render(this._catalogFilmsNode, new CatalogListView(MOST_COMMENTED_LIST_TITLE, 'films-list--extra'), RenderPosition.AFTERBEGIN);
    this._renderFilmListContainer();
    this._renderCards(0, this._mostCommentedFilms, EXTRA_LIST_SIZE);
  }

  _renderTopFilmsList() {
    render(this._catalogFilmsNode, new CatalogListView(TOP_LIST_TITLE, 'films-list--extra'), RenderPosition.AFTERBEGIN);
    this._renderFilmListContainer();
    this._renderCards(0, this._ratingFilms, EXTRA_LIST_SIZE);
  }

  _renderMainFilmsList(mainListTitle, mainListClass) {
    render(this._catalogFilmsNode, new CatalogListView(mainListTitle, '', mainListClass), RenderPosition.AFTERBEGIN);
    this._renderFilmListContainer();
    this._renderCards(0, this._currentFilms, MAIN_LIST_SIZE, true);
  }

  _renderCard(filmsListContainerNode, film) {
    const cardPresenter = new CardPresenter(filmsListContainerNode, this._handleCardChange, this._currentComments);
    cardPresenter.init(film);
    this._filmPresenter.set(film.id, cardPresenter);
  }

  _renderCards(from, filmsData, listSize, isMainListCard = false) {
    const filmsListContainerNode = this._filmsListNode.querySelector('.films-list .films-list__container');
    const to = Math.min(filmsData.length - from, listSize);
    const filmsArray = filmsData.slice(from, to + from);
    filmsArray.forEach((filmCard) => this._renderCard(filmsListContainerNode, filmCard));
    if (isMainListCard) {
      this._shownFilmsCount += to;
    }
  }

  _renderShowMorButton() {
    const filmsListNode = this._catalogFilmsNode.querySelector('.films-list');
    render(filmsListNode, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
    this._showMoreButtonComponent.setClickHandler(this._handleShowMorButton);
  }

  _handleShowMorButton() {
    this._renderCards(this._shownFilmsCount, this._currentFilms, MAIN_LIST_SIZE);

    if (!(this._currentFilms.length === this._shownFilmsCount)) {
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

  _handleCardChange(updatedFilm) {
    this._currentFilms = updateItem(this._currentFilms, updatedFilm);
    this._filmPresenter.get(updatedFilm.id).init(updatedFilm);
  }
}
