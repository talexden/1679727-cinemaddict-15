export const getWatchlistFilms = (films) => films.filter((element) => element.userDetails.watchlist);
export const getWatchedFilms = (films) => films.filter((element) => element.userDetails.alreadyWatched);
export const getFavoritFilms = (films) => films.filter((element) => element.userDetails.favorite);

export const getDateSort = (films) => [...films].sort((a, b) => {
  console.log(a);
  console.log(b);
  return a.filmInfo.release.date > b.filmInfo.release.date ? -1 : 1;
});
export const getRatingSort = (films) => [...films].sort((a, b) => {
  // console.log(a);
  // console.log(b);
  const boo = a.filmInfo.totalRating > b.filmInfo.totalRating ? -1 : 1;
  // console.log(boo);
  return boo;
});
export const getMostCommentedSort = (films) => [...films].sort((a, b) => a.comments.length > b.comments.length ? -1 : 1);
