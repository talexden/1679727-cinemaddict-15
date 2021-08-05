import {
  MAIN_LIST_TITLE,
  MAIN_LIST_SIZE,
  MOST_COMMENTED_LIST_TITLE,
  TOP_LIST_SIZE,
  TOP_LIST_TITLE,
  MOST_COMMENTED_LIST_SIZE} from '../';

import {
  render,
  getMultiplyStrings,
  createCatalogTemplate,
  createCatalogListTemplate,
  createCardTemplate,
  createShowMoreButtonTemplate
} from '../';

import {main} from '../';


const renderPage = () => {
  render(main, createCatalogTemplate(), 'beforeend');
  const catalog = main.querySelector('.films');
  let catalogList;

  const renderCatalogList =(listTitle, listSize, modifier) => {
    render(catalog, createCatalogListTemplate(listTitle, modifier), 'afterbegin');
    catalogList = catalog.querySelector('.films-list__container');
    render(catalogList, getMultiplyStrings(createCardTemplate(), listSize), 'beforeend');
  };

  renderCatalogList(MOST_COMMENTED_LIST_TITLE, MOST_COMMENTED_LIST_SIZE,'films-list--extra');
  renderCatalogList(TOP_LIST_TITLE, TOP_LIST_SIZE,'films-list--extra');
  renderCatalogList(MAIN_LIST_TITLE, MAIN_LIST_SIZE);
  render(catalogList, createShowMoreButtonTemplate(), 'beforeend');
};

export {renderPage};
