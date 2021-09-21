export const getDateSort = (films) => [...films].sort((a, b) => a.release.date > b.release.date ? -1 : 1);
export const getRatingSort = (films) => [...films].sort((a, b) =>  a.totalRating > b.totalRating ? -1 : 1);
export const getMostCommentedSort = (films) => [...films].sort((a, b) => a.comments.length > b.comments.length ? -1 : 1);

