import {isEscEvent} from '../utils/common.js';
import CardsView from '../view/card.js';
import CommentView from '../view/comment.js';
import PopupTemplateView from '../view/popup.js';
import PopupFilmDetailsView from '../view/popup-film-details.js';
import PopupFilmCommentsView from '../view/popup-film-comments.js';
import {remove, render, RenderPosition} from '../utils/render.js';

export default class Card {
  constructor(changeData) {
    this._popupTemplateViewComponent = new PopupTemplateView();
    this._popupFilmDetailsViewComponent = null;
    this._popupFilmCommentsViewComponent = null;
    this._curentFilmCard = null;
    this._changeData = changeData;

    this._filmCatalogNode = null;
    this._filmData = null;
    this._comments = null;

    this._bodyNode = document.querySelector('body');


    this._onCardClickEvent = this._onCardClickEvent.bind(this);
    this._closePopup = this._closePopup.bind(this);
    this._onEscPopup = this._onEscPopup.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleArchiveClick = this._handleArchiveClick.bind(this);
  }

  init(filmCatalogNode, filmData, commentsData) {
    this._filmCatalogNode = filmCatalogNode;
    this._filmData = filmData;
    this._comments = commentsData;
    this._popupFilmDetailsViewComponent =  new PopupFilmDetailsView(filmData);
    this._popupFilmCommentsViewComponent = new PopupFilmCommentsView(filmData);
    this._renderCard();
  }

  destroy() {
    remove(this._curentFilmCard);
  }

  _renderCard() {
    this._curentFilmCard = new CardsView(this._filmData);
    this._curentFilmCard.setClickHandler(this._onCardClickEvent);
    render(this._filmCatalogNode, this._curentFilmCard, RenderPosition.BEFOREEND);
  }

  _onCardClickEvent(evt) {
    const target = evt.target;

    evt.preventDefault();

    switch (true) {
      case target.classList.contains('film-card__poster'):
      case target.classList.contains('film-card__title'):
      case target.classList.contains('film-card__comments'):
        this._renderPopup(this._filmData);
        break;
      case target.classList.contains('film-card__controls-item--add-to-watchlist'):
        break;
      case target.classList.contains('film-card__controls-item--mark-as-watched'):
        break;
      case target.classList.contains('film-card__controls-item--favorite'):
        break;
    }
  }


  _renderPopup(filmData) {
    render(this._bodyNode, this._popupTemplateViewComponent, RenderPosition.BEFOREEND);
    const filmDetailsInnerNode = document.querySelector('.film-details__inner');
    render(filmDetailsInnerNode, this._popupFilmDetailsViewComponent, RenderPosition.BEFOREEND);
    render(filmDetailsInnerNode, this._popupFilmCommentsViewComponent, RenderPosition.BEFOREEND);

    const filmDetailsCommentsListNode = filmDetailsInnerNode.querySelector('.film-details__comments-list');
    this._renderPopupComments(filmDetailsCommentsListNode, filmData.comments);

    this._popupFilmDetailsViewComponent.setClickHandler(this._closePopup);

    this._bodyNode.classList.add('hide-overflow');
    window.addEventListener('keydown', this._onEscPopup);
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
  }

  _onEscPopup(evt) {
    if (isEscEvent(evt)) {
      this._closePopup();
    }
  }
}


