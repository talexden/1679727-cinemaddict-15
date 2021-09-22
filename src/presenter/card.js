import {isEscEvent, render, RenderPosition} from '../utils';
import CardsView from '../view/card';
import CommentView from '../view/comment';
import PopupTemplateView from '../view/popup';
import PopupFilmDetailsView from '../view/popup-film-details';
import PopupFilmCommentsView from '../view/popup-film-comments';

export default class Card {
  constructor() {
    this._popupTemplateViewComponent = new PopupTemplateView().getElement();
    this._popupFilmDetailsViewComponent = null;
    this._popupFilmCommentsViewComponent = null;
    this._curentFilmCard = null;

    this._filmCatalogNode = null;
    this._filmData = null;
    this._comments = null;

    this._bodyNode = document.querySelector('body');


    this._onCardClickEvent = this._onCardClickEvent.bind(this);
    this._closePopup = this._closePopup.bind(this);
    this._onEscPopup = this._onEscPopup.bind(this);
  }

  init(filmCatalogNode, filmData, commentsData) {
    this._filmCatalogNode = filmCatalogNode;
    this._filmData = filmData;
    this._comments = commentsData;
    this._popupFilmDetailsViewComponent =  new PopupFilmDetailsView(filmData).getElement();
    this._popupFilmCommentsViewComponent = new PopupFilmCommentsView(filmData).getElement();
    this._renderCard();
  }

  _renderCard() {
    this._curentFilmCard = new CardsView(this._filmData).getElement();
    this._curentFilmCard.addEventListener('click', this._onCardClickEvent);
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

    const popupCloseButton = filmDetailsInnerNode.querySelector('.film-details__close-btn');

    popupCloseButton.addEventListener('click', this._closePopup);
    this._curentFilmCard.removeEventListener('click', this._onCardClickEvent);

    this._bodyNode.classList.add('hide-overflow');
    window.removeEventListener('click', this._onCardClickEvent);
    window.addEventListener('keydown', this._onEscPopup);
    // const popupWatchlistButton = filmDetailsInnerNode.querySelector('.film-details__control-button--watchlist');
    // const popupWatchedButton = filmDetailsInnerNode.querySelector('.film-details__control-button--watched');
    // const popupFavoriteButton = filmDetailsInnerNode.querySelector('.film-details__control-button--favorite');
  }

  _renderPopupComments(container, filmCommentIds) {
    filmCommentIds.forEach((commentId) => {
      render(container, new CommentView(this._comments[commentId]).getElement(), RenderPosition.BEFOREEND);
    });
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

  // _handleWatchlistClick() {
  //   this._changeData(
  //     Object.assign(
  //       {}, this._filmData, {
  //         watchlist: !this._filmData.watchlist,
  //       },
  //     ),
  //   );
  // }
  //
  // _handleAlreadyWatchedClick() {
  //   this._changeData(
  //     Object.assign(
  //       {}, this._filmData, {
  //         alreadyWatched: !this._filmData.alreadyWatched,
  //       },
  //     ),
  //   );
  // }
  //
  // _handleFavoriteClick() {
  //   this._changeData(
  //     Object.assign(
  //       {}, this._filmData, {
  //         favorite: !this._filmData.favorite,
  //       },
  //     ),
  //   );
  // }
}


