import {isEscEvent} from '../utils/common.js';
import CardsView from '../view/card.js';
import CommentView from '../view/comment.js';
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
    this._popupTemplateViewComponent = new PopupTemplateView();
    this._cardComponent = null;
    this._popupFilmDetailsViewComponent = null;
    this._popupFilmCommentsViewComponent = null;
    this._popupMode = Mode.CLOSED;


    this._bodyNode = document.querySelector('body');


    this._onCardClickEvent = this._onCardClickEvent.bind(this);
    this._closePopup = this._closePopup.bind(this);
    this._onEscPopup = this._onEscPopup.bind(this);
    this._handleWachlistClick = this._handleWachlistClick.bind(this);
    this._handleWachedClick = this._handleWachedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);

  }

  init(film) {
    this._film = film;
    this._comments = this._mockComments;
    const prevCardComponent = this._cardComponent;
    const prevPopupDetailsComponent = this._popupFilmDetailsViewComponent;

    this._cardComponent = new CardsView(this._film);
    this._popupFilmDetailsViewComponent =  new PopupFilmDetailsView(film);
    this._popupFilmCommentsViewComponent = new PopupFilmCommentsView(film);

    this._cardComponent.setWachlistClickHandler(this._handleWachlistClick);
    this._cardComponent.setWachedClickHandler(this._handleWachedClick);
    this._cardComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._cardComponent.setClickHandler(this._onCardClickEvent);

    if (prevCardComponent === null) {
      render(this._filmCatalogNode, this._cardComponent, RenderPosition.BEFOREEND);
    } else {
      replace(this._cardComponent, prevCardComponent);
      // replace(this._popupFilmDetailsViewComponent, prevPopupDetailsComponent);
    }

    if (this._popupMode !== Mode.CLOSED) {
      replace(this._popupFilmDetailsViewComponent, prevPopupDetailsComponent);
      this._renderPopup(this._film);
    }

    // не работает ремув, говорит, что prevCardComponent не порождение абстракции.
    // remove(prevCardComponent);
  }

  destroy() {
    remove(this._cardComponent);
    remove(this._popupFilmDetailsViewComponent);
    remove(this._popupFilmCommentsViewComponent);
  }

  resetView(flag) {
    this._popupMode = flag;
  }

  _onCardClickEvent() {
    if (this._popupMode === Mode.CLOSED) {
      this._renderPopup(this._film);
    }
  }


  _renderPopup(filmData) {
    remove(this._popupTemplateViewComponent);
    render(this._bodyNode, this._popupTemplateViewComponent, RenderPosition.BEFOREEND);
    const filmDetailsInnerNode = document.querySelector('.film-details__inner');
    render(filmDetailsInnerNode, this._popupFilmDetailsViewComponent, RenderPosition.BEFOREEND);
    render(filmDetailsInnerNode, this._popupFilmCommentsViewComponent, RenderPosition.BEFOREEND);

    const filmDetailsCommentsListNode = filmDetailsInnerNode.querySelector('.film-details__comments-list');
    this._renderPopupComments(filmDetailsCommentsListNode, filmData.comments);

    this._popupFilmDetailsViewComponent.setClosePopupClickHandler(this._closePopup);
    this._popupFilmDetailsViewComponent.setWachlistClickHandler(this._handleWachlistClick);
    this._popupFilmDetailsViewComponent.setWachedClickHandler(this._handleWachedClick);
    this._popupFilmDetailsViewComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    this._bodyNode.classList.add('hide-overflow');
    window.addEventListener('keydown', this._onEscPopup);
    this._changeMode(Mode.OPENED);
  }

  _renderPopupComments(container, filmCommentIds) {
    filmCommentIds.forEach((commentId) => {
      render(container, new CommentView(this._comments[commentId]), RenderPosition.BEFOREEND);
    });
  }

  _closePopup() {
    remove(this._popupTemplateViewComponent);
    this._bodyNode.classList.remove('hide-overflow');
    window.removeEventListener('keydown', this._onEscPopup);
    this._changeMode(Mode.CLOSED);
  }

  _onEscPopup(evt) {
    if (isEscEvent(evt)) {
      this._closePopup();
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


