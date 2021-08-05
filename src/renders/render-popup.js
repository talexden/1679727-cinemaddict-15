import {
  FILM_DETAILES_COUNT, CreateCommetnTemplate
} from '../';

import {
  render,
  getMultiplyStrings,
  createPopupTemplate,
  createFilmDetalesRow,
  createPopupTopContainer,
  createPopupBottomContainer
} from '../';

import {footer} from '../';

const renderPopup = () => {
  render(footer, createPopupTemplate(), 'afterend');
  const filmDetailsInner = document.querySelector('.film-details__inner');
  render(filmDetailsInner, createPopupTopContainer(), 'beforeend');
  const filmDetailsTable = filmDetailsInner.querySelector('.film-details__table');
  render(filmDetailsTable, getMultiplyStrings(createFilmDetalesRow(), FILM_DETAILES_COUNT), 'beforeend');
  render(filmDetailsInner, createPopupBottomContainer(), 'beforeend');
  const filmDetailsCommentsList = filmDetailsInner.querySelector('.film-details__comments-list');
  render(filmDetailsCommentsList, getMultiplyStrings(CreateCommetnTemplate(), 1), 'beforeend');
};

export {renderPopup};
