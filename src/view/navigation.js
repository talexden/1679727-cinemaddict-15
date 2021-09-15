export const navigationTemplate = (films) => {
  let [watchlistCount, historyCount, favoritesCount] = [0, 0, 0];

  for (const film of films) {
    if (film.userDetails.watchlist) {watchlistCount++;}
    if (film.userDetails.alreadyWatched) {historyCount++;}
    if (film.userDetails.favorite) {favoritesCount++;}
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
