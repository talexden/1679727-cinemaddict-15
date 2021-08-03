export const getMultiplyStrings = (string, number) => {
  let multiplyStrings = '';
  for (let i = 0; i < number; i++) {
    multiplyStrings += string;
  }
  return multiplyStrings;
};
