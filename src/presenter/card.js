import {isEscEvent} from '../utils/common.js';
import CardsView from '../view/card.js';
import PopupTemplateView from '../view/popup.js';
import PopupFilmDetailsView from '../view/popup-film-details.js';
import PopupFilmCommentsView from '../view/popup-film-comments.js';
import {remove, render, RenderPosition, replace} from '../utils/render.js';
import CommentsModel from '../model/comments.js';
import {getComments} from '../mock/create-comments';
import {UserAction, UpdateType} from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  OPENED: 'OPENED',
};
export default class Card {
  constructor(filmCatalogNode, changeData, changeMode, api) {
    this._api = api;
    this._filmCatalogNode = filmCatalogNode;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._cardComponent = null;
    this._popupFilmDetailsViewComponent = null;
    this._popupFilmCommentsViewComponent = null;
    this._popupMode = Mode.DEFAULT;
    this._popupComponent = null;
    this._commentsModel = new CommentsModel();
    this._mockComments = getComments();

    this._bodyNode = document.querySelector('body');


    this._onCardClickEvent = this._onCardClickEvent.bind(this);
    this._handleRemovePopup = this._handleRemovePopup.bind(this);
    this._onEscPopup = this._onEscPopup.bind(this);
    this._handleWachlistClick = this._handleWachlistClick.bind(this);
    this._handleWachedClick = this._handleWachedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleCommentsModelEvent = this._handleCommentsModelEvent.bind(this);
  }

  init(film) {
    this._commentsModel.addObserver(this._handleCommentsModelEvent);
    const filmComments = [];
    film.comments.map((comment) => filmComments.push(this._mockComments[comment]));

    this._film = film;
    const prevCardComponent = this._cardComponent;

    this._cardComponent = new CardsView(this._film);

    this._cardComponent.setWachlistClickHandler(this._handleWachlistClick);
    this._cardComponent.setWachedClickHandler(this._handleWachedClick);
    this._cardComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._cardComponent.setClickHandler(this._onCardClickEvent);

    if (prevCardComponent === null) {
      render(this._filmCatalogNode, this._cardComponent, RenderPosition.BEFOREEND);
      return;
    } else {
      replace(this._cardComponent, prevCardComponent);
    }

    remove(prevCardComponent);
  }

  destroy() {
    remove(this._cardComponent);
    remove(this._popupFilmDetailsViewComponent);
    remove(this._popupFilmCommentsViewComponent);
  }

  _openPopup() {
    this._api
      .getComments(this._film)
      .then((commentsData) => {
        this._commentsModel.setComments(UpdateType.INIT, commentsData);
      });
  }

  _renderPopup() {
    if (this._popupComponent) {
      this._handleRemovePopup();
    }

    if (this._popupComponent !== null) {
      this._popupComponent = null;
    }

    this._popupComponent = new PopupTemplateView();
    this._popupFilmDetailsViewComponent =  new PopupFilmDetailsView(this._film );
    this._popupFilmCommentsViewComponent = new PopupFilmCommentsView(this._getComments());

    render(this._bodyNode, this._popupComponent, RenderPosition.BEFOREEND);
    const filmDetailsInnerNode = document.querySelector('.film-details__inner');
    render(filmDetailsInnerNode, this._popupFilmDetailsViewComponent, RenderPosition.BEFOREEND);
    render(filmDetailsInnerNode, this._popupFilmCommentsViewComponent, RenderPosition.BEFOREEND);

    this._popupFilmDetailsViewComponent.setClosePopupClickHandler(this._handleRemovePopup);
    this._popupFilmDetailsViewComponent.setWachlistClickHandler(this._handleWachlistClick);
    this._popupFilmDetailsViewComponent.setWachedClickHandler(this._handleWachedClick);
    this._popupFilmDetailsViewComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    this._bodyNode.classList.add('hide-overflow');
    window.addEventListener('keydown', this._onEscPopup);
    this._changeMode();
    this._popupMode = Mode.OPENED;
  }

  resetView() {
    if (this._popupMode !== Mode.DEFAULT) {
      this._handleRemovePopup();
    }
  }

  _getComments() {
    return this._commentsModel.getComments();
  }

  _onCardClickEvent() {
    this._openPopup();
  }

  _handleRemovePopup() {
    remove(this._popupComponent);
    this._bodyNode.classList.remove('hide-overflow');
    window.removeEventListener('keydown', this._onEscPopup);
    this._popupMode = Mode.DEFAULT;
  }

  _onEscPopup(evt) {
    if (isEscEvent(evt)) {
      this._handleRemovePopup();
    }
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._film,
        {
          favorite: !this._film.favorite,
        },
      ),
    );
  }

  _handleWachlistClick() {
    this._changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._film,
        {
          watchlist: !this._film.watchlist,
        },
      ),
    );
  }

  _handleWachedClick() {
    this._changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._film,
        {
          alreadyWatched: !this._film.alreadyWatched,
        },
      ),
    );
  }

  _handleCommentsModelEvent(updateType) {
    switch (updateType) {
      case UpdateType.INIT:
        this._renderPopup();
        break;
    }
  }
}


