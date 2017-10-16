# ColorSort

ColorSort is a wrapper around the excellent [TinyColor](https://github.com/bgrins/TinyColor) package that allows you to parse arbitrary text for colors and then sort the colors based on several criteria.

## Installation

ColorSort is designed to be friendly with Node and browser environments. You can download `dist/colorsort.js` and add it directly to your webpage or npm install it:

`npm install --save colorsort`

## Usage

Both TinyColor and ColorSort try to be really permissive with input and flexible with outputs.

``` Javascript

const input = `
  ColorSort takes a string and looks for color values:
  RGB: rgb(255, 0, 0), rgb(255, 255, 0), rgb(0%, 0%, 100%)
  HSL: hsl(273, 1, .5), hsl(120, 1, .5), hsl(30, 100%, 50%)
  Hex: #000, #000F, #000000, #000000FF
`;

let cs = new ColorSort(input);
console.log(cs.formattedValues());
// (10) ["#ff0000", "#ffff00", "#0000ff", "#8c00ff", "#00ff00", "#ff8000", "#000000", "#000000", "#000000", "#000000"]

cs = cs.removeDuplicates();
console.log(cs.formattedValues());
// (7) ["#ff0000", "#ffff00", "#0000ff", "#8c00ff", "#00ff00", "#ff8000", "#000000"]

cs.sort('red');
console.log(cs.formattedValues());
// (7) ["#ff0000", "#ffff00", "#ff8000", "#8c00ff", "#0000ff", "#00ff00", "#000000"]

cs.sort();
// (7) ["#ffff00", "#ff8000", "#ff0000", "#8c00ff", "#00ff00", "#0000ff", "#000000"]

cs.sort( [{ sort: 'red', asc: true }, { sort: 'green' }] );
console.log(cs.formattedValues());
// (7) ["#00ff00", "#0000ff", "#000000", "#8c00ff", "#ffff00", "#ff8000", "#ff0000"]

cs.sort('hue');
console.log(cs.formattedValues('hsl'));
// (7) ["hsl(273, 100%, 50%)", "hsl(240, 100%, 50%)", "hsl(120, 100%, 50%)", "hsl(60, 100%, 50%)", "hsl(30, 100%, 50%)", "hsl(0, 0%, 0%)", "hsl(0, 100%, 50%)"]

```

## API

### ColorSort

*ColorSort(text: String) => Object.<ColorSort>*

ColorSort is the only variable added to the global scope (if in a browser environment) or exported (if in a node environment). It is a constructor that should be used with the `new` keyword and given text (as a string) to parse for colors. It returns an `instanceof` a ColorSort object.

``` Javascript

let cs = new ColorSort('#000, #FFF');
console.log(cs instanceof ColorSort); // true

```

### sort

*ColorSort.sort([ options: String | Option[] ]) => Object.<ColorSort>*

Like `Array.sort()`, `ColorSort.sort()` sorts colors in place on `ColorSort.entries`. The default value for the `options` parameter is `[{ sort: 'red' }, { sort: 'green' }, { sort: 'blue' }]`.

Sort can use one of these strings: `red`, `green`, `blue`, `alpha`, `hue`, `saturation`, or `lightness`.

Sort will also accept an array of objects that represent more advanced search criteria. For example `[{ sort: 'blue', asc: true }, { sort: 'red' }]` will tell the sorter to sort by blue (ascending) and where it finds two blue values that are equal, to sort by red (descending).

``` Javascript

let cs = new ColorSort('#0F0, #F00, #F0F');
cs.sort();
console.log(cs.formattedValues());
// ["#ff00ff", "#ff0000", "#00ff00"]

cs.sort('green');
console.log(cs.formattedValues());
// ["#00ff00", "#ff00ff", "#ff0000"]

cs.sort([{ sort: 'blue' }, { sort: 'red', asc: true }]);
console.log(cs.formattedValues());
// ["#ff00ff", "#00ff00", "#ff0000"]

```

### removeDuplicates

*ColorSort.removeDuplicates() => Object.<ColorSort>*

Returns a new ColorSort object with all of the duplicate color values removed.

``` Javascript

let cs = new ColorSort('#000, #000');
console.log(cs.entries.length); // 2
cs = cs.removeDuplicates();
console.log(cs.entries.length); // 1

```

### formattedValues

*ColorSort.formattedValues([format: String]) => String[]*

Returns an array of the sorted colors in the specified format. If no format is specified, `formattedValues` defaults to using `'hex6'`. For more information on the supported formats, check out the docs on `TinyColor.toString()` on [TinyColor GitHub page](https://github.com/bgrins/TinyColor#toString).

``` Javascript

let cs = new ColorSort('#000A');
console.log(cs.formattedValues()); // ["#000000"]
console.log(cs.formattedValues('hex6')); // ["#000000"]
console.log(cs.formattedValues('hsl')); // ["hsla(0, 0%, 0%, 0.67)"]
console.log(cs.formattedValues('rgb')); // ["rgba(0, 0, 0, 0.67)"]

```

## Augmented TinyColor

In order to simplify sorting, I needed to augment the TinyColor objects with additional methods. I personally think this was a bad practice and am working on an alternative solution, but right now the colors are given these methods:

``` Javascript

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

```

So in this version, some extra features are available (and will hopefully be available in some form in future versions):

``` Javascript

let cs = new ColorSort('#000000, #FF00FF, #3A8901, #BADA55');
let result = cs.entries.map(elem => elem.hue());
console.log(result); // [0, 300, 95, 74]

```

## License

MIT

## Contributing

PRs welcome but please file a ticket before submitting new features. We welcome test writers.
