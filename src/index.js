import tinycolor from 'tinycolor2';

/**
 * Initialize ColorSort options
 * @constructor
 * @param {string} text - text to parse for colors
 * @returns {Object.<ColorSort>} - returns new instance of ColorSort object
 */
function ColorSort(text) {
  // Parse text for pieces that might be rgba?, hsla?, or hex colors
  let entries = text.match(/(rgba?\(.*?\))|(hsla?\(.*?\))|(#[A-F0-9]{3,8})/gi) || [];
  // Create new array from findings
  entries = entries.reduce((accum, elem) => {
    // Convert color to TinyColor object
    elem = tinycolor(elem);
    if (elem.isValid()) {
      // If it's a valid color, add methods we need for sorting and add object to array
      accum.push( this._augmentTinyColorMethods(elem) );
    }
    return accum;
  }, []);

  this.entries = entries;
  return this;
}



/**
 * Sort color entries based on a set of criteria
 * @param {(string|array)} options - sorting criteria.
 * If {string} , must be the name of a function in ColorSort.prototype._augmentTinyColorMethods
 * If {array} , must be an array of objects in this format:
 * [{ sort: {string} , asc: {boolean} }]
 * @returns {Object.<ColorSort>} - returns updated instance of ColorSort object
 */
ColorSort.prototype.sort = function(options = [{ sort: 'red' }, { sort: 'green' }, { sort: 'blue' }]) {
  // Convert string input to array format
  if (typeof options === 'string') {
    options = [{ sort: options }]
  }

  this.entries = this.entries.sort((elem1, elem2) => {
    let result = 0;

    // Iterate through sort criteria
    for (let o of options) {
      // Check for valid options
      if (elem1[o.sort] && elem2[o.sort]) {
        // Sort either ascending or descending
        result = o.asc ? elem1[o.sort]() - elem2[o.sort]() : elem2[o.sort]() - elem1[o.sort]();
        // Break when we've found somehting to sort by
        if (result) { break; }
      }
    }

    return result;
  });

  return this;
};



/**
 * Return color entries as an array of strings in given format
 * @param {string} format - format of color output.
 * Formats are determined by TinyColor: https://github.com/bgrins/TinyColor#toString
 * @returns {string[]} - returns array of colors as strings
 */
ColorSort.prototype.formattedValues = function(format = 'hex6') {
  return this.entries.map(elem => {
    return elem.toString(format);
  });
};



/**
 * Creates a new ColorSort object with duplicate values removed
 * @returns {Object.<ColorSort>} - returns new ColorSort object
 */
ColorSort.prototype.removeDuplicates = function() {
  // Convert array of hex values to a set
  const set = new Set(this.formattedValues('hex8'));
  // Convert back to array then string
  const input = Array.from(set).join();

  // Create new ColorSort object from string
  return new ColorSort(input);
};



/**
 * Adds methods to TinyColor objects we'll need for sorting
 * @param {Object.<tinycolor>} color - takes an instance of a TinyColor object
 * @returns {Object.<tinycolor>} - returns TinyColor object with augmented methods
 */
ColorSort.prototype._augmentTinyColorMethods = function(color) {
  color.red         = function () { return this._r; };
  color.green       = function () { return this._g; };
  color.blue        = function () { return this._b; };
  color.alpha       = function () { return this._a; };
  color.hue         = function () { return Math.round(this.toHsl().h); };
  color.saturation  = function () { return Math.round(this.toHsl().s * 100); };
  color.lightness   = function () { return Math.round(this.toHsl().l * 100); };

  return color;
}

module.exports = ColorSort;
