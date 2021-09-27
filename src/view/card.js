import AbstractView from './abstract.js';

const MAX_DESCRIPTION_LENGTH = 140;


const cardTemplate = (film) => {
  const {comments, title, totalRating, date, runtime, genres, poster, description, watchlist, alreadyWatched, favorite} = film;
  const dateFullYear = date;
  const duration = `${Math.floor(runtime/60)}h ${runtime%60}m`;
  const getCardDescription = (cardDescription) => {
    let string = cardDescription;
    if (string.length > MAX_DESCRIPTION_LENGTH) {
      string = `${description.slice(0, MAX_DESCRIPTION_LENGTH - 1)}...`;

    }
    return string;
  };

  const getButtonClass = (isActive) => isActive ? 'film-card__controls-item--active ': '';

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${dateFullYear}</span>
        <span class="film-card__duration">${duration}</span>
        <span class="film-card__genre">${genres.join(', ')}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${getCardDescription(description)}</p>
      <a class="film-card__comments">${comments.length} comments</a>
      <div class="film-card__controls">
        <button class="film-card__controls-item ${getButtonClass(watchlist)}film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
        <button class="film-card__controls-item ${getButtonClass(alreadyWatched)}film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
        <button class="film-card__controls-item ${getButtonClass(favorite)}film-card__controls-item--favorite" type="button">Mark as favorite</button>
      </div>
    </article>`
  );
};


export default class Cards extends AbstractView {
  constructor(film) {
    super();
    this._film = film;
    this._clickHandler = this._clickHandler.bind(this);
    this._wachlistClickHandler = this._wachlistClickHandler.bind(this);
    this._wachedClickHandler = this._wachedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return cardTemplate(this._film);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.openPopupClick();
  }

  _wachlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.wachlistClick();
  }

  _wachedClickHandler(evt) {
    evt.preventDefault();
    this._callback.wachedClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();

  }

  setClickHandler(callback) {
    this._callback.openPopupClick = callback;
    this.getElement().querySelector('.film-card__poster').addEventListener('click', this._clickHandler);
    this.getElement().querySelector('.film-card__title').addEventListener('click', this._clickHandler);
    this.getElement().querySelector('.film-card__comments').addEventListener('click', this._clickHandler);
  }

  setWachlistClickHandler(callback) {
    this._callback.wachlistClick = callback;
    this.getElement().querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this._wachlistClickHandler);
  }

  setWachedClickHandler(callback) {
    this._callback.wachedClick = callback;
    this.getElement().querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this._wachedClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.film-card__controls-item--favorite').addEventListener('click', this._favoriteClickHandler);
  }
}
