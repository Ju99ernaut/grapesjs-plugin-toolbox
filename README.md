# Grapesjs Plugin Toolbox

Tools for `grapesjs`

[DEMO](https://codepen.io/ju99ernaut/pen/Vwaqdpw)

### HTML
```html
<link href="https://unpkg.com/grapesjs/dist/css/grapes.min.css" rel="stylesheet">
<link href="https://unpkg.com/grapesjs-plugin-toolbox/dist/grapesjs-plugin-toolbox.min.css" rel="stylesheet">
<script src="https://unpkg.com/grapesjs"></script>
<script src="https://unpkg.com/grapesjs-plugin-toolbox"></script>

<div id="gjs"></div>
```

### JS
```js
const editor = grapesjs.init({
	container: '#gjs',
  height: '100%',
  fromElement: true,
  storageManager: false,
  plugins: ['grapesjs-plugin-toolbox'],
});
```

### CSS
```css
body, html {
  margin: 0;
  height: 100%;
}
```


## Summary

* Tool in this plugin are 
  * [Css grid layout tool](https://i.imgur.com/jwXI0MS.mp4)
  * [Canvas resizer](https://i.imgur.com/GWBJsmI.mp4)
  * [Palette from image generator](https://i.imgur.com/eeIqyHO.png)
  * Breadcrumbs
  * Layer icon mapper

* Plugin name: `grapesjs-plugin-toolbox`
* Components
    * `css-grid`
    * `grid-cell`
* Blocks
    * `css-grid`
* Commands
    * `add-palette`



## Options

| Option | Description | Default |
|-|-|-
| `panels` | use plugin panels | `false` |
| `resizer` | include canvas resizer | `true` |
| `breadcrumbs` | include breadcrumbs | `true` |
| `labelGrid` | label for grid block  | `Grid` |
| `categoryGrid` | category for grid block | `Basic` |
| `gridBlock` | options to extend grid block | `{}` |
| `gridComponent` | options to extend grid component model | `{}` |
| `gridClass` | class for grid block | `grid` |
| `gridCellClass` | class for grid cell block | `grid-cell` |
| `cellItemClass` | class for cell item block | `cell-item` |
| `labelColors` | label for color palette modal | `Image palette` |
| `labelApply` | label for apply button | `Add` |
| `palleteIcon` | toolbar icon to open palette modal | `<i class="fa fa-paint-brush"></i>` |
| `onAdd` | custom logic when palette is added | `0` |
| `refreshPalette` | color pickers to refresh color palettes | `[{sector: 'typography',name: 'Color',property: 'color',type: 'color',defaults: 'black'},...]` |
| `minScreenSize` | minimum value the screen can be resized | `250` |
| `icons` | icons to map to components | `[{type: 'default', icon:'<i class="fa fa-cube"></i>'},...]` |


## Download

* CDN
  * `https://unpkg.com/grapesjs-plugin-toolbox`
* NPM
  * `npm i grapesjs-plugin-toolbox`
* GIT
  * `git clone https://github.com/Ju99ernaut/grapesjs-plugin-toolbox.git`



## Usage

Directly in the browser
```html
<link href="https://unpkg.com/grapesjs/dist/css/grapes.min.css" rel="stylesheet"/>
<link href="https://unpkg.com/grapesjs-plugin-toolbox/dist/grapesjs-plugin-toolbox.min.css" rel="stylesheet">
<script src="https://unpkg.com/grapesjs"></script>
<script src="path/to/grapesjs-plugin-toolbox.min.js"></script>

<div id="gjs"></div>

<script type="text/javascript">
  var editor = grapesjs.init({
      container: '#gjs',
      // ...
      plugins: ['grapesjs-plugin-toolbox'],
      pluginsOpts: {
        'grapesjs-plugin-toolbox': { /* options */ }
      }
  });
</script>
```

Modern javascript
```js
import grapesjs from 'grapesjs';
import plugin from 'grapesjs-plugin-toolbox';
import 'grapesjs/dist/css/grapes.min.css';
import 'grapesjs-plugin-toolbox/dist/grapesjs-plugin-toolbox.min.css';

const editor = grapesjs.init({
  container : '#gjs',
  // ...
  plugins: [plugin],
  pluginsOpts: {
    [plugin]: { /* options */ }
  }
  // or
  plugins: [
    editor => plugin(editor, { /* options */ }),
  ],
});
```



## Development

Clone the repository

```sh
$ git clone https://github.com/Ju99ernaut/grapesjs-plugin-toolbox.git
$ cd grapesjs-plugin-toolbox
```

Install dependencies

```sh
$ npm i
```

Build css

```sh
$ npm run build:css
```

Start the dev server

```sh
$ npm start
```

Build the source

```sh
$ npm run build
```



## License

MIT
