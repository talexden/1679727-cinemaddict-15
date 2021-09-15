import AbstractView from './abstract.js';

const footerStatisticTemplate = (filmCount = 0) => (
  `<section class="footer__statistics">
    <p>${filmCount} movies inside</p>
  </section>`
);


export default class FooterStatistic extends AbstractView {
  constructor(filmCount) {
    super();
    this._filmCount = filmCount;
  }

  getTemplate() {
    return footerStatisticTemplate(this._filmCount);
  }
}
