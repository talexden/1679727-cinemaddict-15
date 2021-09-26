import AbstractView from './abstract.js';
import {isEnterEvent} from '../utils/common.js';
import dayjs from 'dayjs';


export const commentTemplate = (comments) => {
  const {author, comment, date, emotion} = comments;

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


const joinCommentsTemplate = (comments) => comments.map((comment) => commentTemplate(comment)).join('');

const popupFilmCommentsTemplate = (comments) => (
  `<div class="film-details__bottom-container">
    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

      <ul class="film-details__comments-list">${joinCommentsTemplate(comments)}</ul>

      <div class="film-details__new-comment">
        <div class="film-details__add-emoji-label">
          <img src="images/emoji/smile.png" width="55" height="55" alt="emoji-smile">
        </div>

        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
        </label>

        <div class="film-details__emoji-list">
          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" checked>
          <label class="film-details__emoji-label" for="emoji-smile">
            <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
          <label class="film-details__emoji-label" for="emoji-sleeping">
            <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
          <label class="film-details__emoji-label" for="emoji-puke">
            <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
          <label class="film-details__emoji-label" for="emoji-angry">
            <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
          </label>
        </div>
      </div>
    </section>
  </div>`
);


export default class PopupFilmComments extends AbstractView {
  constructor(comments) {
    super();
    this._comments = comments;
    this._data = PopupFilmComments.parseCommentsToData(comments);
    this._commentSubmitHandler = this._commentSubmitHandler.bind(this);
  }

  getTemplate() {
    return popupFilmCommentsTemplate(this._comments);
  }

  _commentSubmitHandler(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    if (isEnterEvent(evt)) {
      this._callback.commentSubmit(PopupFilmComments.parseDataToComments(this._data));
    }
  }

  setCommentSubmitHandler(callback) {
    this._callback.commentSubmit = callback;
    this.getElement().querySelector('.film-details__comment-input').addEventListener('keydown', this._commentSubmitHandler);
  }

  setEmojytHandler(callback) {
    this._callback.commentSubmit = callback;
    this.getElement().querySelector('.film-details__comment-input').addEventListener('keydown', this._commentSubmitHandler);
  }

  static parseCommentsToData(comments) {
    return Object.assign(
      {},
      comments,
      {
        currentEmojy: '',
        currentComments: '',
      },
    );
  }

  static parseDataToComments(data) {
    data = Object.assign({}, data);

    if (!data.currentEmojy) {
      data.emotion = '';
    }

    if (!data.currentComments) {
      data.comment = '';
    }

    delete data.currentEmojy;
    delete data.currentComments;

    return data;
  }

}
