import tinycolor from 'tinycolor2';

function colorsort(text) {
  let collection = text.match(/(rgba?\(.*?\))|(hsla?\(.*?\))|(#[A-F0-9]{3,8})/gi);
  collection = collection.reduce((accum, elem) => {
    elem = tinycolor(elem);
    if (elem.isValid()) {
      accum.push(elem);
    }
    return accum;
  }, []);

  return collection;
}

module.exports = colorsort;
