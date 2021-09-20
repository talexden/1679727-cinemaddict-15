
import CardsView from '../view/card';
import CatalogListView from '../view/catalog-list';
import ShowMoreButtonView from '../view/show-more-button';
import FooterStatisticView from '../view/footer-statistic';
import CommentView from '../view/comment';
import PopupFilmDetailsView from '../view/popup-film-details';
import PopupFilmCommentsView from '../view/popup-film-comments';
import {getMostCommentedSort, getRatingSort} from '../filters';
import {isEscEvent, render, RenderPosition} from '../utils';
import PopupTemplate from '../view/popup';
import PopupFilmDetails from '../view/popup-film-details';
import PopupFilmComments from '../view/popup-film-comments';

const MAIN_LIST_TITLE = 'All movies. Upcoming';
const MAIN_LIST_TITLE_NO_MOVIES = 'There are no movies in our database';
const MAIN_LIST_SIZE = 5;
const TOP_LIST_TITLE = 'Top rated';
const MOST_COMMENTED_LIST_TITLE = 'Most commented';
const EXTRA_LIST_SIZE = 2;

export default class Movie {
  constructor(bodyNode, catalogFilmsNode) {
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._footerStatisticComponent = new FooterStatisticView();
    this._popupFilmDetailsComponent = new PopupFilmDetailsView();
    this._popupFilmCommentsComponent = new PopupFilmCommentsView();

    this._ratingFilms = null;
    this._mostCommentedFilms = null;
    this._showMoreButtonNode = null;

    this._bodyNode = bodyNode;
    this._catalogFilmsNode = catalogFilmsNode;

    this._renderMainListCard = null;

    this._handleShowMorButton = this._handleShowMorButton.bind(this);
    this._onCardClickEvent = this._onCardClickEvent.bind(this);
    this._closePopup = this._closePopup.bind(this);
    this._onEscPopup = this._onEscPopup.bind(this);
    this._onPopupWatchlistButton = this._onPopupWatchlistButton.bind(this);
    this._onPopupWatchedButton = this._onPopupWatchedButton.bind(this);
    this._onPopupFavoriteButton = this._onPopupFavoriteButton.bind(this);
  }

  init(films, comments) {
    this._currentFilms = [...films];
    this._comments = comments;
    this._getSortedFilms();
    this._renderMovie();
  }

  _renderMovie() {
    let catalogFilmsContainerNode = '';
    let mainListTitle = MAIN_LIST_TITLE_NO_MOVIES;
    let mainListClass = '';

    if (this._currentFilms.length > 0) {
      render(this._catalogFilmsNode, new CatalogListView(MOST_COMMENTED_LIST_TITLE, 'films-list--extra').getElement(), RenderPosition.AFTERBEGIN);
      catalogFilmsContainerNode = this._catalogFilmsNode.querySelector('.films-list .films-list__container');
      const renderMostListCard = this._renderCards(catalogFilmsContainerNode, this._mostCommentedFilms, EXTRA_LIST_SIZE);
      renderMostListCard();

      render(this._catalogFilmsNode, new CatalogListView(TOP_LIST_TITLE, 'films-list--extra').getElement(), RenderPosition.AFTERBEGIN);
      catalogFilmsContainerNode = this._catalogFilmsNode.querySelector('.films-list .films-list__container');
      const renderTopListCard = this._renderCards(catalogFilmsContainerNode, this._ratingFilms, EXTRA_LIST_SIZE);
      renderTopListCard();

      mainListTitle = MAIN_LIST_TITLE;
      mainListClass = 'visually-hidden';
    }

    render(this._catalogFilmsNode, new CatalogListView(mainListTitle, '', mainListClass).getElement(), RenderPosition.AFTERBEGIN);
    catalogFilmsContainerNode = this._catalogFilmsNode.querySelector('.films-list .films-list__container');
    this._renderMainListCard = this._renderCards(catalogFilmsContainerNode, this._currentFilms, MAIN_LIST_SIZE);
    this._renderMainListCard();

    if (this._currentFilms.length > 5) {
      this._renderShowMorButton();
    }

    window.addEventListener('click', this._onCardClickEvent);
  }

  _getSortedFilms() {
    this._ratingFilms = getRatingSort(this._currentFilms);
    this._mostCommentedFilms = getMostCommentedSort(this._currentFilms);
  }

  _renderCards(place, filmsData, cardsCount) {
    let shownFilmsIdx = 0;
    return () => {
      const hiddenFilms = filmsData.length - shownFilmsIdx;
      const count = hiddenFilms < cardsCount ? hiddenFilms + shownFilmsIdx: cardsCount + shownFilmsIdx;
      for (let i = shownFilmsIdx; i < count; i++) {
        render(place, new CardsView( filmsData[i], i).getElement(), RenderPosition.BEFOREEND);
        shownFilmsIdx++;
      }
      return shownFilmsIdx;
    };
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
    render(filmDetailsInnerNode, new PopupFilmDetails(filmData).getElement(), RenderPosition.BEFOREEND);
    render(filmDetailsInnerNode, new PopupFilmComments(filmData).getElement(), RenderPosition.BEFOREEND);

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

