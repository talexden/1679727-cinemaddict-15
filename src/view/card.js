import AbstractView from './abstract.js';

const MAX_DESCRIPTION_LENGTH = 140;


const cardTemplate = (filmData, cardIdx) => {
  const {comments, title, totalRating, release, runtime, genres, poster, description, watchlist, alreadyWatched, favorite} = filmData;
  const dateFullYear = release.date.getFullYear();
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
    `<article class="film-card" film-id="${cardIdx}">
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
  constructor(filmsData, idx) {
    super();
    this._filmData = filmsData;
    this._idx = idx;
  }

  getTemplate() {
    return cardTemplate(this._filmData, this._idx);
  }
}
