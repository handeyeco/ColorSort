import tinycolor from 'tinycolor2';

// Augment TinyColor's prototype for ease of sorting
const proto = tinycolor.prototype;
proto.red         = function red() { return this._r; };
proto.green       = function green() { return this._g; };
proto.blue        = function blue() { return this._b; };
proto.alpha       = function alpha() { return this._a; };
proto.hue         = function hue() { return Math.round(this.toHsl().h); };
proto.saturation  = function saturation() { return Math.round(this.toHsl().s * 100); };
proto.lightness   = function lightness() { return Math.round(this.toHsl().l * 100); };

/**
 * Initialize ColorSort options
 * @constructor
 * @param {string} text - text to parse for colors
 * @returns {Object.<ColorSort>} - returns new instance of ColorSort object
 */
function ColorSort(text = '') {
  // Parse text for pieces that might be rgba?, hsla?, or hex colors
  let entries = text.match(/(rgba?\(.*?\))|(hsla?\(.*?\))|(#[A-F0-9]{3,8})/gi) || [];
  // Create new array from findings
  entries = entries.reduce((accum, elem) => {
    // Convert color to TinyColor object
    const color = tinycolor(elem);
    if (color.isValid()) {
      // If it's a valid color, add methods we need for sorting and add object to array
      accum.push(color);
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
ColorSort.prototype.sort = function sort(options = [{ sort: 'red' }, { sort: 'green' }, { sort: 'blue' }]) {
  let opt;
  // Convert string input to array format
  if (typeof options === 'string') {
    opt = [{ sort: options }];
  } else {
    opt = options.slice();
  }

  this.entries = this.entries.sort((elem1, elem2) => {
    let result = 0;

    // Iterate through sort criteria
    for (let i = 0; i < opt.length && !result; i++) {
      // Check for valid options
      if (elem1[opt[i].sort] && elem2[opt[i].sort]) {
        // Sort either ascending or descending
        result = opt[i].asc ?
          elem1[opt[i].sort]() - elem2[opt[i].sort]() :
          elem2[opt[i].sort]() - elem1[opt[i].sort]();
        // Break when we've found something to sort by
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
ColorSort.prototype.formattedValues = function formattedValues(format = 'hex6') {
  return this.entries.map(elem => elem.toString(format));
};



/**
 * Creates a new ColorSort object with duplicate values removed
 * @returns {Object.<ColorSort>} - returns new ColorSort object
 */
ColorSort.prototype.removeDuplicates = function removeDuplicates() {
  // Convert array of hex values to a set
  const set = new Set(this.formattedValues('hex8'));
  // Convert back to array then string
  const input = Array.from(set).join();

  // Create new ColorSort object from string
  return new ColorSort(input);
};

module.exports = ColorSort;
