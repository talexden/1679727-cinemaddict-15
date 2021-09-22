import AbstractView from './abstract.js';


const catalogListContainerTemplate = () => (
  '<div class="films-list__container"></div>'
);


export default class CatalogListContainer extends AbstractView {

  getTemplate() {
    return catalogListContainerTemplate();
  }
}
