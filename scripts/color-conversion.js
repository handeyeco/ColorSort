function createColorFromHex(h) {
  const hex = normalizeHex(h);
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.red, rgb.green, rgb.blue);

  return Object.assign({
    hex,
    rgb: `rgb(${rgb.red}, ${rgb.green}, ${rgb.blue})`,
    hsl: `hsl(${hsl.hue}, ${hsl.saturation}%, ${hsl.lightness}%)`
  }, rgb, hsl);
}

function createColorFromRgb(r) {
  const split = /rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/i.exec(r);
  const rgb = {
    red: split[1],
    green: split[2],
    blue: split[3]
  };
  const hex = rgbToHex(rgb.red, rgb.green, rgb.blue);
  const hsl = rgbToHsl(rgb.red, rgb.green, rgb.blue);
  return Object.assign({
    rgb: `rgb(${rgb.red}, ${rgb.green}, ${rgb.blue})`,
    hsl: `hsl(${hsl.hue}, ${hsl.saturation}%, ${hsl.lightness}%)`
  }, rgb, hex, hsl);
}

function createColorFromHsl(h) {
  const split = /hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)/i.exec(h);
  const hsl = {
    hue: split[1],
    saturation: split[2],
    lightness: split[3]
  };
  const rgb = hslToRgb(hsl.hue, hsl.saturation, hsl.lightness);
  const hex = rgbToHex(rgb.red, rgb.green, rgb.blue);
  return Object.assign({
    rgb: `rgb(${rgb.red}, ${rgb.green}, ${rgb.blue})`,
    hsl: `hsl(${hsl.hue}, ${hsl.saturation}%, ${hsl.lightness}%)`
  }, rgb, hex, hsl);
}

function normalizeHex(hex) {
  return (hex.length === 4 ? hex.replace(/([A-F0-9])/gi, '$1$1') : hex).toUpperCase();
}

function hexToRgb(hex) {
  const split = /^#?([A-F0-9]{2})([A-F0-9]{2})([A-F0-9]{2})$/i.exec(hex);

  return {
    red: parseInt(split[1], 16),
    green: parseInt(split[2], 16),
    blue: parseInt(split[3], 16)
  }
}

function rgbToHex(red, green, blue) {
  return {hex: "#" + ((1 << 24) + (parseInt(red) << 16) + (parseInt(green) << 8) + parseInt(blue)).toString(16).toUpperCase().slice(1) };
}

function rgbToHsl(red, green, blue) {
  red /= 255;
  green /= 255;
  blue /= 255;

  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;
  const delta = max - min;
  let hue;
  let saturation;


  if (max == min) {
    hue = saturation = 0;
  } else {
    saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case red:
        hue = (green - blue) / delta + (green < blue ? 6 : 0);
        break;
      case green:
        hue = (blue - red) / delta + 2;
        break;
      case blue:
        hue = (red - green) / delta + 4;
        break;
    }

    hue /= 6;
  }

  return {
    hue: Math.round(hue * 360),
    saturation: Math.round(saturation * 100),
    lightness: Math.round(lightness * 100)
  };
};

function hslToRgb(hue, saturation, lightness){
  hue /= 360;
  saturation /= 100;
  lightness /= 100;

  let red, green, blue;

  if (saturation == 0) {
    red = green = blue = lightness; // achromatic
  } else {
    let q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
    let p = 2 * lightness - q;
    red = hue2rgb(p, q, hue + 1 / 3);
    green = hue2rgb(p, q, hue);
    blue = hue2rgb(p, q, hue - 1 / 3);
  }

  return {
    red: Math.round(red * 255),
    green: Math.round(green * 255),
    blue: Math.round(blue * 255)
  };
}

function hue2rgb(p, q, t){
  if(t < 0) t += 1;
  if(t > 1) t -= 1;
  if(t < 1/6) return p + (q - p) * 6 * t;
  if(t < 1/2) return q;
  if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
  return p;
}
