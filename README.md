# Grapesjs Plugin Toolbox

Nice to have features

### HTML
```html
<link href="https://unpkg.com/grapesjs/dist/css/grapes.min.css" rel="stylesheet">
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

* Plugin name: `grapesjs-plugin-toolbox`
* Components
    * `component-id-1`
    * `component-id-2`
    * ...
* Blocks
    * `block-id-1`
    * `block-id-2`
    * ...



## Options

| Option | Description | Default |
|-|-|-
| `option1` | Description option | `default value` |



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
