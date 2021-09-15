import AbstractView from './abstract.js';

const popupTemplate = () => (
  `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
    </form>
  </section>`
);


export default class PopupTemplate extends AbstractView {
  getTemplate() {
    return popupTemplate();
  }
}
