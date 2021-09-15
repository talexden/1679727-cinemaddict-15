export const getStringMultiply = (number, cb, argument) => {
  let string = '';
  for (let i = 0; i < number; i++) {
    string += cb(argument[i]);
  }
  return string;
};


export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};


export const renderElement = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
    case RenderPosition.AFTEREND:
      container.append(element);
      break;
  }
};


export const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};


export const createElement = (template) => {
  const newElement = document.createElement('div'); // 1
  newElement.innerHTML = template; // 2

  return newElement.firstChild; // 3
};

