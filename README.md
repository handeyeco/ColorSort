# Color Sorter

Dump text into the input and sort. It uses regular expressions to parse the text, so the input doesn't really need to be in any specific format (or exclusively colors).

## Regex

The site looks for Hex, RGB, and HSL colors values. RGBA and HSLA not supported right now (PRs welcome).

* Hex: ```/#[A-F0-9]{6}|#[A-F0-9]{3}/gi```
* RGB: ```/rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)/gi```
* HSL: ```/hsl\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*\)/gi```

## JSON

JSON output is in this format:

``` JSON
{
    "colors": [{
        "hex": "#BADA55",
        "rgb": "rgb(186, 218, 85)",
        "hsl": "hsl(74, 64%, 59%)",
        "red": 186,
        "green": 218,
        "blue": 85,
        "hue": 74,
        "saturation": 64,
        "lightness": 59
    }],
    "sortInformation": {
        "primarySort": "hue",
        "secondarySort": "saturation",
        "tertiarySort": "lightness",
        "reversed": false
    },
    "hexArray": ["#BADA55"],
    "rgbArray": ["rgb(186, 218, 85)"],
    "hslArray": ["hsl(74, 64%, 59%)"]
}
```

## License

Public domain

## Contributing

PRs welcome
