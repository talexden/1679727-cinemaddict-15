export const createCardTemplate = (filmData) => {
  const {comments, filmInfo, userDetails} = filmData;
  const {title, totalRating, release, runtime, genres, poster, description} = filmInfo;
  const {watchlist, alreadyWatched, favorite} = userDetails;
  const dateFullYear = release.date.getFullYear();
  const duration = `${Math.floor(runtime/60)}h ${runtime%60}m`;
  const getCardDescription = () => {
    let string = description;
    if (description.length > 140) {
      string = `${description.slice(0, 139)}...`;

    }
    return string;
  };

  const getButtonClass = (Boolean) => Boolean ? 'film-card__controls-item--active ': '';

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
      <p class="film-card__description">${getCardDescription()}</p>
      <a class="film-card__comments">${comments.length} comments</a>
      <div class="film-card__controls">
        <button class="film-card__controls-item ${getButtonClass(watchlist)}film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
        <button class="film-card__controls-item ${getButtonClass(alreadyWatched)}film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
        <button class="film-card__controls-item ${getButtonClass(favorite)}film-card__controls-item--favorite" type="button">Mark as favorite</button>
      </div>
    </article>`
  );
};
