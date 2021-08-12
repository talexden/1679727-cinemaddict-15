export const createCatalogListTemplate = (listTitle = '', cards, listModifier = '', listTitleClass = '') => (
  `<section class="films-list ${listModifier}">
    <h2 class="films-list__title ${listTitleClass}">${listTitle}</h2>
    <div class="films-list__container">
        ${cards}
    </div>
  </section>`
);
