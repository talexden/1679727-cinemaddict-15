import AbstractView from './abstract.js';

const navigationTemplate = (films) => {
  let [watchlistCount, historyCount, favoritesCount] = [0, 0, 0];

  for (const film of films) {
    if (film.watchlist) {watchlistCount++;}
    if (film.alreadyWatched) {historyCount++;}
    if (film.favorite) {favoritesCount++;}
  }

  return (
    `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchlistCount}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${historyCount}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favoritesCount}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`
  );
};


export default class Navigation extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return navigationTemplate(this._films);
  }
}
