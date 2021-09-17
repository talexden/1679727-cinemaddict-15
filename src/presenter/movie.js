import NavigationView from '../view/navigation';
import UserProfileView from '../view/user-profile';
import CatalogSortingView from '../view/catalog-sorting';
import CatalogView from '../view/catalog';
import CardsView from '../view/card';
import CatalogListView from '../view/catalog-list';
import ShowMoreButtonView from '../view/show-more-button';
import FooterStatisticView from '../view/footer-statistic';
import CommentView from '../view/comment';
import PopupFilmDetailsView from '../view/popup-film-details';
import PopupFilmCommentsView from '../view/popup-film-comments';
import {createFilmCards} from '../mock/create-film-cards';
import {getMostCommentedSort, getRatingSort} from '../filters';
import {render, RenderPosition} from '../utils';
import UserProfile from '../view/user-profile';

import {
  MAIN_LIST_TITLE,
  MAIN_LIST_TITLE_NO_MOVIES,
  MAIN_LIST_SIZE,
  TOP_LIST_TITLE,
  MOST_COMMENTED_LIST_TITLE,
  EXTRA_LIST_SIZE,
  FILMS_CATALOG_SIZE,
  SHOW_CARDS_COUNT
} from '../main.js';

export default class Movie {
  constructor(place) {
    this._navigationComponent = new NavigationView();
    this._userproFileComponent = new UserProfileView();
    this._catalogSortingComponent = new CatalogSortingView();
    this._catalogComponent = new CatalogView();
    this._cardsComponent = new CardsView();
    this._catalogListComponent = new CatalogListView();
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._footerStatisticComponent = new FooterStatisticView();
    this._commentComponent = new CommentView();
    this._popupFilmDetailsComponent = new PopupFilmDetailsView();
    this._popupFilmCommentsComponent = new PopupFilmCommentsView();

    this._place = place;
    this._films = null;
    this._films.length = null;
  }

  init() {
    this._getFilmsData();
    render(this._place, this._navigationComponent(this._films).getElement(), RenderPosition.BEFOREEND);
    const headerNode = document.querySelector('.header');
    render(headerNode, new UserProfile().getElement(), RenderPosition.BEFOREEND);
  }

  _getFilmsData() {
    this._films = createFilmCards(FILMS_CATALOG_SIZE);
    this._filmsLength = this._films.length;
    this._ratingFilms = getRatingSort(this._films);
    this._mostCommentedFilms = getMostCommentedSort(this._films);
  }

  _renderNavigation() {
    render(this._place, this._navigationComponent.getElement(), RenderPosition.BEFOREEND);
  }

  _renderUerProfile() {
    render(this._place, this._userproFileComponent.getElement(), RenderPosition.BEFOREEND);
  }

  _renderCatalogSort() {
    render(this._place, this._catalogSortingComponent.getElement(), RenderPosition.BEFOREEND);
  }

  _renderCatalog() {
    render(this._place, this._catalogComponent.getElement(), RenderPosition.BEFOREEND);
  }

  _renderCards(place, filmsData, cardsCount) {
    let shownFilmsIdx = 0;
    return () => {
      const hiddenFilms = filmsData.length - shownFilmsIdx;
      const count = hiddenFilms < cardsCount ? hiddenFilms + shownFilmsIdx: cardsCount + shownFilmsIdx;
      for (let i = shownFilmsIdx; i < count; i++) {
        render(this._place, this._cardsComponent(filmsData[i], i).getElement(), RenderPosition.BEFOREEND);
        shownFilmsIdx++;
      }
      return shownFilmsIdx;
    };
  }

  _renderFilmsCatalogList(listTitle, listModifier, listTitleClass) {
    render(this._place, this._catalogListComponent(listTitle, listModifier, listTitleClass).getElement(), RenderPosition.AFTERBEGIN);
  }

  _renderShowMorButton() {

  }

  _getFilmData() {

  }

  _renderPopup() {

  }

  _renderPopupComments() {

  }

  _openPopup() {

  }

  _closePopup() {

  }


}
