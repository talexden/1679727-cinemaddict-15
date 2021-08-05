export const createCatalogListTemplate = (listTitle = '', modifier = '') => (
  `<section class="films-list ${modifier}">
    <h2 class="films-list__title">${listTitle}</h2>
    <div class="films-list__container">
    </div>
  </section>`
);
