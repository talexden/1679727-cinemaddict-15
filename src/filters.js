export const getDateSort = (films) => [...films].sort((a, b) => a.filmInfo.release.date > b.filmInfo.release.date ? -1 : 1);
export const getRatingSort = (films) => [...films].sort((a, b) =>  a.filmInfo.totalRating > b.filmInfo.totalRating ? -1 : 1);
export const getMostCommentedSort = (films) => [...films].sort((a, b) => a.comments.length > b.comments.length ? -1 : 1);

