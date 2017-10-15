import tinycolor from 'tinycolor2';

function ColorSort(text) {
  let collection = text.match(/(rgba?\(.*?\))|(hsla?\(.*?\))|(#[A-F0-9]{3,8})/gi);
  collection = collection.reduce((accum, elem) => {
    elem = tinycolor(elem);
    if (elem.isValid()) {
      accum.push(elem);
    }
    return accum;
  }, []);

  this.collection = collection;
  return this;
}

ColorSort.prototype.sort = function() {
  this.collection = this.collection.sort((elem1, elem2) => {
    return elem1._r - elem2._r;
  });

  return this;
};

ColorSort.prototype.formattedValues = function(format = 'hex6') {
  return this.collection.map(elem => {
    return elem.toString(format);
  });
};

module.exports = ColorSort;
