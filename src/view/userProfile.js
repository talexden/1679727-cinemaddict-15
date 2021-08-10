export const createUserProfile = (name = 'access as a Guest', avatar = '#') => {
  const size = avatar === '#' ? 0 : 35;

  return (
    `<section class="header__profile profile">
    <p class="profile__rating">${name}</p>
    <img class="profile__avatar" src=${avatar} alt="" width="${size}" height="${size}">
  </section>`
  );
};
