import {isEscEvent} from '../utils/common.js';
import CardsView from '../view/card.js';
import PopupTemplateView from '../view/popup.js';
import PopupFilmDetailsView from '../view/popup-film-details.js';
import PopupFilmCommentsView from '../view/popup-film-comments.js';
import {remove, render, RenderPosition, replace} from '../utils/render.js';

const Mode = {
  CLOSED: 'CLOSED',
  OPENED: 'OPENED',
};

export default class Card {
  constructor(filmCatalogNode, changeData, commentsData, changeMode) {
    this._filmCatalogNode = filmCatalogNode;
    this._changeData = changeData;
    this._mockComments = commentsData;
    this._changeMode = changeMode;
    this._cardComponent = null;
    this._popupFilmDetailsViewComponent = null;
    this._popupFilmCommentsViewComponent = null;
    this._popupMode = Mode.CLOSED;
    this._popupComponent = null;


    this._bodyNode = document.querySelector('body');


    this._onCardClickEvent = this._onCardClickEvent.bind(this);
    this._handleRemovePopup = this._handleRemovePopup.bind(this);
    this._onEscPopup = this._onEscPopup.bind(this);
    this._handleWachlistClick = this._handleWachlistClick.bind(this);
    this._handleWachedClick = this._handleWachedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);

  }

  init(film) {
    this._film = film;
    this._comments = [];
    this._film.comments.forEach((commentId) => this._comments.push(this._mockComments[commentId]));
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
      this._renderPopup();
    }

    remove(prevCardComponent);
  }

  destroy() {
    remove(this._cardComponent);
    remove(this._popupFilmDetailsViewComponent);
    remove(this._popupFilmCommentsViewComponent);
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
    this._popupFilmCommentsViewComponent = new PopupFilmCommentsView(this._comments);

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
    if (this._popupMode !== Mode.CLOSED) {
      this._handleRemovePopup();
    }
  }

  _onCardClickEvent() {
    this._renderPopup();
  }

  _handleRemovePopup() {
    remove(this._popupComponent);
    this._bodyNode.classList.remove('hide-overflow');
    window.removeEventListener('keydown', this._onEscPopup);
    this._popupMode = Mode.CLOSED;
  }

  _onEscPopup(evt) {
    if (isEscEvent(evt)) {
      this._handleRemovePopup();
    }
  }

  _handleFavoriteClick() {
    this._changeData(
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
      Object.assign(
        {},
        this._film,
        {
          alreadyWatched: !this._film.alreadyWatched,
        },
      ),
    );
  }
}


