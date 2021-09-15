import AbstractView from './abstract.js';

const userProfileTemplate = (name = 'access as a Guest', avatar = '#') => {
  const size = avatar === '#' ? 0 : 35;

  return (
    `<section class="header__profile profile">
    <p class="profile__rating">${name}</p>
    <img class="profile__avatar" src=${avatar} alt="" width="${size}" height="${size}">
  </section>`
  );
};


export default class UserProfile extends AbstractView {
  constructor(name, avatar) {
    super();
    this._name = name;
    this._avatar = avatar;
  }

  getTemplate() {
    return userProfileTemplate(this._name, this._avatar);
  }
}
