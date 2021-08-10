import {createFilmDetalesRow} from './film-detales-row.js';
import dayjs from 'dayjs';

export const  createPopupTopContainer = (film) => {
  const {filmInfo, userDetails} = film;
  const {title, alternativeTitle, totalRating, ageRating, director, writers, actors, release, runtime, genres, poster, description} = filmInfo;
  const {watchlist, alreadyWatched, favorite} = userDetails;
  const releaseDate = dayjs(release.date).format('DD MMMM YYYY');
  const duration = `${Math.floor(runtime/60)}h ${runtime%60}m`;
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
            ${createFilmDetalesRow('Director', director)}
            ${createFilmDetalesRow(popupWriters, writers.join(', '))}
            ${createFilmDetalesRow('Actors', actors.join(', '))}
            ${createFilmDetalesRow('Release Date', releaseDate)}
            ${createFilmDetalesRow('Runtime', duration)}
            ${createFilmDetalesRow('Country', release.country)}
            ${createFilmDetalesRow(popupGenres, genres.join(', '))}
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
