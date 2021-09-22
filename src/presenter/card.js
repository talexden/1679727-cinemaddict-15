import {render, RenderPosition} from '../utils';
import CardsView from '../view/card';

export default class Cards {
  constructor() {
    this._filmCatalogNode = null;
    this._filmData = null;
  }

  init(filmCatalogNode, filmData) {
    this._filmCatalogNode = filmCatalogNode;
    this._filmData = filmData;
    this._renderCard();
  }

  _renderCard() {
    const filmCard = new CardsView(this._filmData);
    render(this._filmCatalogNode, filmCard.getElement(), RenderPosition.BEFOREEND);
    this._filmCatalog.addEventListener('click', this._onCardClickEvent);
  }

  _onCardClickEvent(evt) {
    const target = evt.target;

    evt.preventDefault();

    switch (true) {
      case target.classList.contains('film-card__poster'):
      case target.classList.contains('film-card__title'):
      case target.classList.contains('film-card__comments'):
        // render popup
        break;
      case target.classList.contains('film-card__controls-item--add-to-watchlist'):
        break;
      case target.classList.contains('film-card__controls-item--mark-as-watched'):
        break;
      case target.classList.contains('film-card__controls-item--favorite'):
        break;
    }
  }

  _handleArchiveClick() {
    this._changeData(
      Object.assign(
        {}, this._task, {
          isArchive: !this._task.isArchive,
        },
      ),
    );
  }
}
