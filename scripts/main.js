function sortAndDownloadColors() {
  const colors = sortColors();
  let hex = [];
  let rgb = [];
  let hsl = [];

  colors.forEach(elem => {
    hex.push(elem.hex);
    rgb.push(elem.rgb);
    hsl.push(elem.hsl);
  });

  const result = {
    colorObjects: colors,
    hexArray: hex,
    rgbArray: rgb,
    hslArray: hsl
  }

  const downloadFile = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result));
  const downloadLink = document.createElement('a');
  downloadLink.setAttribute("href", downloadFile);
  downloadLink.setAttribute("download", "sorted-colors.json");
  downloadLink.click();
  downloadLink.remove();

  console.log(result);
}

function sortColors() {
  const swatchContainer = document.getElementById('swatch-container');
  const input = document.getElementById('color-input');

  const sort = document.getElementById('sort-option').value;
  const sortMethod = getSortMethod(sort);
  const reverse = document.getElementById('reverse').checked;
  const format = document.getElementById('format-option').value;

  const hexValues = input.value.match(/#[A-F0-9]{6}|#[A-F0-9]{3}/gi) || [];
  const rgbValues = input.value.match(/rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)/gi) || [];
  const hslValues = input.value.match(/hsl\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*\)/gi) || [];
  const colors = createColorArray(hexValues, rgbValues, hslValues).sort(sortMethod);
  if (reverse) {
    colors.reverse();
  }

  const boxSize = determineSwatchSize(colors.length);
  const colorElements = colors.map(elem => {
    return `<div class="swatch" style="background: ${elem.hex}; width: ${boxSize[0]}%; height: ${boxSize[1]}vh" title="${elem[format]}"></div>`
  }).join('');

  swatchContainer.innerHTML = colorElements;
  input.value = colors.map(el => {
    return el[format]
  }).join(', ');

  return colors;
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

function getSortMethod(sort) {
  const split = sort.split('-');
  return (e1, e2) => {
    return e1[split[0]] - e2[split[0]] || e1[split[1]] - e2[split[1]] || e1[split[2]] - e2[split[2]]
  };
}

function createColorArray(hex, rgb, hsl) {
  let result = [];

  hex.forEach(elem => {
    result.push(createColorFromHex(elem));
  });

  rgb.forEach(elem => {
    result.push(createColorFromRgb(elem));
  });

  hsl.forEach(elem => {
    result.push(createColorFromHsl(elem));
  });

  return result;
}

document.getElementById('sort-button').onclick = () => {
  sortColors();
  return false;
}

document.getElementById('download-button').onclick = () => {
  sortAndDownloadColors();
  return false;
}
