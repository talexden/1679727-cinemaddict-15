export const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};


export const getStringMultiply = (number, cb, argument) => {
  let string = '';
  for (let i = 0; i < number; i++) {
    string += cb(argument[i]);
  }
  return string;
};
