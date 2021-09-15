import dayjs from 'dayjs';
import AbstractView from './abstract.js';

export const commentTemplate = (filmComment) => {
  const {author, comment, date, emotion} = filmComment;

  return (
    `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="images/emoji/${emotion}.png" width="55" height="55" alt="">
    </span>
    <div>
      <p class="film-details__comment-text">${comment}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${dayjs(date).format('YYYY/MM/DD HH:MM')}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`
  );
};


export default class Comment extends AbstractView {
  constructor(filmComment) {
    super();
    this._filmComment = filmComment;
  }

  getTemplate() {
    return commentTemplate(this._filmComment);
  }
}
