import AbstractView from './abstract.js';

const catalogTemplate = () => '<section class="films"></section>';

export default class Catalog extends AbstractView {
  getTemplate() {
    return catalogTemplate();
  }
}
