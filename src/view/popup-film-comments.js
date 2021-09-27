import SmartView from './smart.js';
import {isEnterEvent} from '../utils/common.js';
import dayjs from 'dayjs';

const EMOTIONS = ['smile', 'sleeping', 'puke', 'angry'];


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

const createInputEmojiTamplate = (emotion, checkedEmotion) => `<input class="film-details__emoji-item visually-hidden"
name="comment-emoji" type="radio" id="emoji-${emotion}" value="${emotion}"
${checkedEmotion === emotion ? 'checked' : ''}>
  <label class="film-details__emoji-label" for="emoji-${emotion}">
    <img src="./images/emoji/${emotion}.png" alt="emoji" width="30" height="30">
      </label>`;

const createEmojiListTemplate = (emotions, checkedEmotion) => emotions
  .map((emotion) => createInputEmojiTamplate(emotion, checkedEmotion))
  .join('');

const joinCommentsTemplate = (comments) => comments.map((comment) => commentTemplate(comment)).join('');

const popupFilmCommentsTemplate = (data, comments) => {
  const {checkedEmotion, textComment} = data;
  return (
    `<div class="film-details__bottom-container">
    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

      <ul class="film-details__comments-list">${joinCommentsTemplate(comments)}</ul>

      <div class="film-details__new-comment">
        <div class="film-details__add-emoji-label">
          <img src="images/emoji/${checkedEmotion}.png" width="55" height="55" alt="emoji-smile">
        </div>

        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${textComment ? textComment : ''}</textarea>
        </label>

        <div class="film-details__emoji-list">${createEmojiListTemplate(EMOTIONS, checkedEmotion)}</div>
      </div>
    </section>
  </div>`
  );
};


export default class PopupFilmComments extends SmartView {
  constructor(comments) {
    super();
    this._comments = comments;
    this._data = PopupFilmComments.parseCommentsToData(comments);
    this._commentSubmitHandler = this._commentSubmitHandler.bind(this);
    this._setTextareaHandler = this._setTextareaHandler.bind(this);
    this._emotionInputHandler =this._emotionInputHandler.bind(this);
    this._setInnerHandlers();
  }

  getTemplate() {
    return popupFilmCommentsTemplate(this._data, this._comments);
  }

  _commentSubmitHandler(evt) {
    if (isEnterEvent(evt)) {
      evt.preventDefault();

      const textArea = this.getElement().querySelector('.film-details__comment-input');
      const emojiInputs = this.getElement().querySelectorAll('.film-details__emoji-item');
      this._callback.commentSubmit(this._data, textArea, emojiInputs);
      document.removeEventListener('keydown', this._commentSubmitHandler);
    }

  }

  setCommentSubmitHandler(callback) {
    this._callback.commentSubmit = callback;
    this.getElement().querySelector('.film-details__comment-input').addEventListener('keydown', this._commentSubmitHandler);
  }

  _setTextareaHandler(evt) {
    evt.preventDefault();
    this.updateData({
      textComment: (evt.target.value),
    }, true);
  }

  _emotionInputHandler(evt) {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    evt.preventDefault();
    this.updateData({
      checkedEmotion: evt.target.value,
    });
  }


  restoreHandlers() {
    this._setInnerHandlers();
  }

  _setPresenterHandlers() {
    this.setDeleteCommentClickHandler(this._callback.deleteClick);
    this.setSubmitCommentHandler(this._callback.commentSubmit);
  }

  _setInnerHandlers() {
    if (this.getElement().querySelector('.film-details__comment-input')) {
      this.getElement()
        .querySelector('.film-details__comment-input').addEventListener('input', this._setTextareaHandler);
      this.getElement()
        .querySelector('.film-details__emoji-list').addEventListener('click', this._emotionInputHandler);
    }
  }

  static parseCommentsToData(comments) {
    return Object.assign(
      {},
      comments,
      {
        textComment: '',
        checkedEmotion : 'smile',
      },
    );
  }

}
