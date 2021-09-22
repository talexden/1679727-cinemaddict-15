
import CardsView from '../view/card';
import CatalogListView from '../view/catalog-list';
import CommentView from '../view/comment';
import PopupFilmDetailsView from '../view/popup-film-details';
import PopupFilmCommentsView from '../view/popup-film-comments';
import {getMostCommentedSort, getRatingSort} from '../filters';
import {isEscEvent, render, RenderPosition} from '../utils';
import PopupTemplate from '../view/popup';
import CatalogListContainerView from '../view/catalog-list-container';

const MAIN_LIST_TITLE = 'All movies. Upcoming';
const MAIN_LIST_TITLE_NO_MOVIES = 'There are no movies in our database';
const MAIN_LIST_SIZE = 5;
const TOP_LIST_TITLE = 'Top rated';
const MOST_COMMENTED_LIST_TITLE = 'Most commented';
const EXTRA_LIST_SIZE = 2;

export default class Movie {
  constructor(bodyNode, catalogFilmsNode) {

    this._ratingFilms = null;
    this._mostCommentedFilms = null;
    this._showMoreButtonNode = null;

    this._bodyNode = bodyNode;
    this._catalogFilmsNode = catalogFilmsNode;
    this._filmsListNode = null;

    this._renderMainListCard = null;
    this._shownFilmsCount = 0;

    this._handleShowMorButton = this._handleShowMorButton.bind(this);
    this._onCardClickEvent = this._onCardClickEvent.bind(this);
    this._closePopup = this._closePopup.bind(this);
    this._onEscPopup = this._onEscPopup.bind(this);
    this._onPopupWatchlistButton = this._onPopupWatchlistButton.bind(this);
    this._onPopupWatchedButton = this._onPopupWatchedButton.bind(this);
    this._onPopupFavoriteButton = this._onPopupFavoriteButton.bind(this);
  }

  init(films, comments) {
    this._currentFilms = films.slice();
    this._comments = comments;
    this._getSortedFilms();
    this._renderMovie();
  }

  _renderFilmListContainer(){
    this._filmsListNode = this._catalogFilmsNode.querySelector('.films-list');
    render(this._filmsListNode, new CatalogListContainerView().getElement(), RenderPosition.BEFOREEND);
  }

  _renderMovie() {
    let mainListTitle = MAIN_LIST_TITLE_NO_MOVIES;
    let mainListClass = '';

    if (this._currentFilms.length > 0) {
      render(this._catalogFilmsNode, new CatalogListView(MOST_COMMENTED_LIST_TITLE, 'films-list--extra').getElement(), RenderPosition.AFTERBEGIN);
      this._renderCatalogListContainer();
      this._renderCards(0, Math.min(this._mostCommentedFilms.length, EXTRA_LIST_SIZE), this._mostCommentedFilms);

      render(this._catalogFilmsNode, new CatalogListView(TOP_LIST_TITLE, 'films-list--extra').getElement(), RenderPosition.AFTERBEGIN);
      this._renderCatalogListContainer();
      this._renderCards(0, Math.min(this._ratingFilms.length, EXTRA_LIST_SIZE), this._ratingFilms);

      mainListTitle = MAIN_LIST_TITLE;
      mainListClass = 'visually-hidden';
    }

    render(this._catalogFilmsNode, new CatalogListView(mainListTitle, '', mainListClass).getElement(), RenderPosition.AFTERBEGIN);
    
    this._renderCards(catalogFilmsContainerNode, this._currentFilms, MAIN_LIST_SIZE, true);

    if (this._currentFilms.length > 5) {
      this._renderShowMorButton();
    }

    window.addEventListener('click', this._onCardClickEvent);
  }

  _getSortedFilms() {
    this._ratingFilms = getRatingSort(this._currentFilms);
    this._mostCommentedFilms = getMostCommentedSort(this._currentFilms);
  }

  _renderMainList() {
    this._renderCards(0, Math.min(this._boardTasks.length, MAIN_LIST_SIZE));
    this._renderCards(0, Math.min(this._boardTasks.length, MAIN_LIST_SIZE));

    const startFilmsCount = Math.min(this._currentFilms.length, MAIN_LIST_SIZE);
    this._renderCards(0, startFilmsCount);
    this._shownFilmsCount = startFilmsCount;

    if (this._boardTasks.length > MAIN_LIST_SIZE) {
      this._renderLoadMoreButton();
    }
  }

  _renderCards(from, to, filmsData) {
    const filmsListContainerNode = this._filmsListNode.querySelector('.films-list .films-list__container');
    filmsData
      .slice(from, to)
      .forEach((filmCard) => render(filmsListContainerNode, new CardsView(filmCard), RenderPosition.BEFOREEND));
  }


  _handleShowMorButton() {
    const shownFilmsIdx = this._renderMainListCard();
    if (this._currentFilms.length === shownFilmsIdx) {
      this._showMoreButtonNode.remove();
      this._showMoreButtonNode = null;
    }
  }

  _renderShowMorButton() {
    const filmsListNode = this._catalogFilmsNode.querySelector('.films-list');
    render(filmsListNode, this._showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

    this._showMoreButtonNode = this._catalogFilmsNode.querySelector('.films-list__show-more');
    this._showMoreButtonNode.addEventListener('click', this._handleShowMorButton);
  }

  _renderPopupComments(container, filmCommentIds) {
    filmCommentIds.forEach((commentId) => {
      render(container, new CommentView(this._comments[commentId]).getElement(), RenderPosition.BEFOREEND);
    });
  }

  _isTrueFilmList(element, filmListTitle) {
    let listTitleNode = false;
    while(element && !listTitleNode) {
      element = element.parentElement;
      listTitleNode = element.querySelector('h2');
    }

    return listTitleNode.textContent === filmListTitle;
  }

  _onCardClickEvent(evt) {
    const target = evt.target;
    const trueClick =
      target.classList.contains('film-card__poster') ||
      target.classList.contains('film-card__title') ||
      target.classList.contains('film-card__comments');

    if (!trueClick) {
      return;
    }

    evt.preventDefault();

    const filmIdx = target.parentElement.getAttribute('film-id');
    switch (true) {
      case this._isTrueFilmList(target, MAIN_LIST_TITLE):
        this._renderPopup(this._currentFilms[filmIdx]);
        break;
      case this._isTrueFilmList(target, TOP_LIST_TITLE):
        this._renderPopup(this._ratingFilms[filmIdx]);
        break;
      case this._isTrueFilmList(target, MOST_COMMENTED_LIST_TITLE):
        this._renderPopup(this._mostCommentedFilms[filmIdx]);
        break;
    }
  }

  _closePopup() {
    this._bodyNode.removeChild(this._bodyNode.querySelector('.film-details'));
    this._bodyNode.classList.remove('hide-overflow');
    window.addEventListener('click', this._onCardClickEvent);
  }

  _onEscPopup(evt) {
    if (isEscEvent(evt)) {
      this._closePopup();
      window.removeEventListener('keydown', this._onEscPopup);
    }
  }

  _renderPopup(filmData) {
    render(this._bodyNode, new PopupTemplate().getElement(), RenderPosition.BEFOREEND);
    const filmDetailsInnerNode = document.querySelector('.film-details__inner');
    render(filmDetailsInnerNode, new PopupFilmDetailsView(filmData).getElement(), RenderPosition.BEFOREEND);
    render(filmDetailsInnerNode, new PopupFilmCommentsView(filmData).getElement(), RenderPosition.BEFOREEND);

    const filmDetailsCommentsListNode = filmDetailsInnerNode.querySelector('.film-details__comments-list');
    this._renderPopupComments(filmDetailsCommentsListNode, filmData.comments);

    const popupCloseButton = filmDetailsInnerNode.querySelector('.film-details__close-btn');

    popupCloseButton.addEventListener('click', this._closePopup);

    this._bodyNode.classList.add('hide-overflow');
    window.removeEventListener('click', this._onCardClickEvent);
    window.addEventListener('keydown', this._onEscPopup);
    const popupWatchlistButton = filmDetailsInnerNode.querySelector('.film-details__control-button--watchlist');
    const popupWatchedButton = filmDetailsInnerNode.querySelector('.film-details__control-button--watched');
    const popupFavoriteButton = filmDetailsInnerNode.querySelector('.film-details__control-button--favorite');
    popupWatchlistButton.addEventListener('click', this._onPopupWatchlistButton(filmData));
    popupWatchedButton.addEventListener('click', this._onPopupWatchedButton(filmData));
    popupFavoriteButton.addEventListener('click', this._onPopupFavoriteButton(filmData));
  }

  _onPopupWatchlistButton() {

  }

  _onPopupWatchedButton() {

  }

  _onPopupFavoriteButton() {

  }

  _changeAddToWatchlist(Idx) {
    this._currentFilms[Idx].userDetails.watchlist = !this._currentFilms[Idx].userDetails.watchlist;
  }

  _changeAlreadyWatched(Idx) {
    this._currentFilms[Idx].userDetails.alreadyWatched = !this._currentFilms[Idx].userDetails.alreadyWatched;
  }

  _changeAddToFavorite(Idx) {
    this._currentFilms[Idx].userDetails.favorite = !this._currentFilms[Idx].userDetails.favorite;
  }
}

