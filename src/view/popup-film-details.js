import {filmDetailsTemplate} from './film-details-template.js';
import dayjs from 'dayjs';
import AbstractView from './abstract.js';
const MINUTES_PER_HOUR = 60;

const  popupFilmDetailsTemplate = (film) => {
  const {title, alternativeTitle, totalRating, ageRating, director, writers, actors, runtime, date, country, genres, poster, description, watchlist, alreadyWatched, favorite} = film;
  const releaseDate = dayjs(date).format('DD MMMM YYYY');
  const duration = `${Math.floor(runtime/MINUTES_PER_HOUR)}h ${runtime%MINUTES_PER_HOUR}m`;
  const getButtonClass = (Boolean) => Boolean ? 'film-details__control-button--active ': '';
  const popupWriters = writers.length > 1 ? 'Writers' : 'Writer';
  const popupGenres = writers.length > 1 ? 'Genres' : 'Genre';

  return (
    `<div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="">

          <p class="film-details__age">${ageRating}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">${alternativeTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${totalRating}</p>
            </div>
          </div>

          <table class="film-details__table">
            ${filmDetailsTemplate('Director', director)}
            ${filmDetailsTemplate(popupWriters, writers.join(', '))}
            ${filmDetailsTemplate('Actors', actors.join(', '))}
            ${filmDetailsTemplate('Release Date', releaseDate)}
            ${filmDetailsTemplate('Runtime', duration)}
            ${filmDetailsTemplate('Country', country)}
            ${filmDetailsTemplate(popupGenres, genres.join(', '))}
          </table>

          <p class="film-details__film-description">
            ${description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <button type="button" class="film-details__control-button ${getButtonClass(watchlist)}film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button ${getButtonClass(alreadyWatched)}film-details__control-button--watched" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button ${getButtonClass(favorite)}film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>`
  );
};

export default class PopupFilmDetails extends AbstractView {
  constructor(film) {
    super();
    this._film = film;
    this._clickHandler = this._clickHandler.bind(this);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._clickHandler);
  }

  getTemplate() {
    return  popupFilmDetailsTemplate(this._film);
  }
}
