let sortButton = document.getElementById('sort-button');
let downloadButton = document.getElementById('download-button');
let colors;

sortButton.addEventListener('click', sort);
downloadButton.addEventListener('click', download);

function sort() {
  const fe = document.getElementById('input-form').elements;
  const input = fe['color-input'].value;
  const format = fe['format-option'].value;
  const swatchContainer = document.getElementById('swatch-container');

  const criteria = [
    { sort: fe['primary-sort'].value, asc: fe['primary-asc'].checked },
    { sort: fe['secondary-sort'].value, asc: fe['secondary-asc'].checked },
    { sort: fe['tertiary-sort'].value, asc: fe['tertiary-asc'].checked }
  ];

  colors = fe['dedup'].checked
    ? new ColorSort(input).removeDuplicates().sort(criteria)
    : new ColorSort(input).sort(criteria);

  fe['color-input'].value = colors.formattedValues(format).join(', ').toUpperCase();

  const boxSize = determineSwatchSize(colors.entries.length);
  const colorElements = colors.entries.map(elem => {
    return `<div class="swatch" style="background: ${elem.toHexString()}; width: ${boxSize[0]}%; height: ${boxSize[1]}vh" title="${elem.toString(format).toUpperCase()}"></div>`
  }).join('');

  swatchContainer.innerHTML = colorElements;
}

function download() {
  sort();
  let result = {};
  result.colors = colors.entries.map(elem => {
    return {
      rgb: elem.toRgbString,
      hsl: elem.toHslString,
      hex: elem.toHexString,
      red: elem.red(),
      green: elem.green(),
      blue: elem.blue(),
      alpha: elem.alpha(),
      hue: elem.hue(),
      saturation: elem.saturation(),
      lightness: elem.lightness(),
    }
  });

  result.hexArray = colors.formattedValues('hex6');
  result.rgbArray = colors.formattedValues('rgb');
  result.hslArray = colors.formattedValues('hsl');

  const downloadFile = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result));
  const downloadLink = document.createElement('a');
  downloadLink.setAttribute("href", downloadFile);
  downloadLink.setAttribute("download", "sorted-colors.json");
  downloadLink.click();
  downloadLink.remove();
}

function determineSwatchSize(count) {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  let size = windowWidth;
  let cubePerLine = 1;

  while (size * (count / cubePerLine) > windowHeight) {
    cubePerLine++;
    size = windowWidth / cubePerLine - 10;
  }

  return [
    100 / cubePerLine,
    100 / Math.ceil(count / cubePerLine)
  ];
}
