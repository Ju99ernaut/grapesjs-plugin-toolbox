import loadComponents from './components';
import loadBlocks from './blocks';
import loadPanels from './panels';
import breadcrumbs from './utils/breadcrumbs';
import palette from './utils/palette';
import en from './locale/en';

export default (editor, opts = {}) => {
  const options = {
    ...{
      i18n: {},
      // default options
      // add palette command
      commandId: 'add-palette',
      // add palette modal label
      labelColors: 'Image palette',
      // add palette button text
      labelApply: 'Add',
      // add palette toolbar icon
      paletteIcon: '<i class="fa fa-paint-brush"></i>',
      // custom onAdd
      // onAdd: (color, palette) => {
      //     Custom stuff
      // } 
      onAdd: 0,
      // The add button (HTMLElement) will be passed as an argument to this function, once created.
      // This will allow you a higher customization.
      addPalette: () => {},
      // Refresh inputs on palette update
      refreshPalette: [{
        sector: 'typography',
        name: 'Color',
        property: 'color',
        type: 'color',
        defaults: 'black'
      }, {
        sector: 'decorations',
        name: 'Background color',
        property: 'background-color',
        type: 'color'
      }]
    },
    ...opts
  };

  // Add components
  loadComponents(editor, options);
  // Add blocks
  loadBlocks(editor, options);
  // Add panels
  loadPanels(editor, options);
  // Add breadcrumbs
  breadcrumbs(editor, options);
  // Add palette
  palette(editor, options);
  // Load i18n files
  editor.I18n && editor.I18n.addMessages({
    en,
    ...options.i18n,
  });

  editor.on('load', () => {
    const $ = grapesjs.$;
    const pn = editor.Panels;

    //? Map layer icons to components
    editor.Components.componentTypes.forEach(type => {
      switch (type.id) {
        case 'body':
          type.model.prototype.defaults.icon = '<i class="fa fa-cubes"></i>';
          break;
        case 'wrapper':
          type.model.prototype.defaults.icon = '<i class="fa fa-cubes"></i>';
          break;
        case 'custom-code':
          type.model.prototype.defaults.icon = '<i class="fa fa-code"></i>';
          break;
        case 'script':
          type.model.prototype.defaults.icon = '<i class="fa fa-file-code-o"></i>';
          break;
        case 'comment':
          type.model.prototype.defaults.icon = '<i class="fa fa-commenting-o"></i>';
          break;
        case 'text':
          type.model.prototype.defaults.icon = '<i class="fa fa-i-cursor"></i>';
          break;
        case 'textnode':
          type.model.prototype.defaults.icon = '<i class="fa fa-i-cursor"></i>';
          break;
        case 'header':
          type.model.prototype.defaults.icon = '<i class="fa fa-header"></i>';
          break;
        case 'box':
          type.model.prototype.defaults.icon = '<i class="fa fa-square-o"></i>';
          break;
        case 'section':
          type.model.prototype.defaults.icon = '<i class="fa fa-object-group"></i>';
          break;
        case 'link':
          type.model.prototype.defaults.icon = '<i class="fa fa-link"></i>';
          break;
        case 'footer':
          type.model.prototype.defaults.icon = '<i class="fa fa-long-arrow-down"></i>'; //!type.model.prototype.defaults.icon
          break;
        case 'input':
          type.model.prototype.defaults.icon = '<i class="fa fa-keyboard-o"></i>';
          break;
        case 'button':
          type.model.prototype.defaults.icon = '<i class="fa fa-square"></i>'; //!type.model.prototype.defaults.icon
          break;
        case 'image':
          type.model.prototype.defaults.icon = '<i class="fa fa-file-image-o"></i>';
          break;
        case 'video':
          type.model.prototype.defaults.icon = '<i class="fa fa-file-video-o"></i>';
          break;
        case 'row':
          type.model.prototype.defaults.icon = '<i class="fa fa-ellipsis-h"></i>';
          break;
        case 'cell':
          type.model.prototype.defaults.icon = '<i class="fa fa-ellipsis-v"></i>';
          break;
        case 'table':
          type.model.prototype.defaults.icon = '<i class="fa fa-table"></i>';
          break;
        case 'thead':
          type.model.prototype.defaults.icon = '<i class="fa fa-header"></i>'; //!type.model.prototype.defaults.icon
          break;
        case 'tbody':
          type.model.prototype.defaults.icon = '<i class="fa fa-book"></i>'; //!type.model.prototype.defaults.icon
          break;
        case 'tfoot':
          type.model.prototype.defaults.icon = '<i class="fa fa-anchor"></i>'; //!type.model.prototype.defaults.icon
          break;
        case 'column':
          type.model.prototype.defaults.icon = '<i class="fa fa-ellipsis-v"></i>';
          break;
        case 'map':
          type.model.prototype.defaults.icon = '<i class="fa fa-map-o"></i>';
          break;
        case 'label':
          type.model.prototype.defaults.icon = '<i class="fa fa-tag"></i>';
          break;
        case 'checkbox':
          type.model.prototype.defaults.icon = '<i class="fa fa-check-square-o"></i>';
          break;
        case 'textarea':
          type.model.prototype.defaults.icon = '<i class="fa fa-align-left"></i>';
          break;
        case 'select':
          type.model.prototype.defaults.icon = '<i class="fa fa-caret-square-o-down"></i>';
          break;
        case 'radio':
          type.model.prototype.defaults.icon = '<i class="fa fa-dot-circle-o"></i>';
          break;
        case 'form':
          type.model.prototype.defaults.icon = '<i class="fa fa-address-card-o"></i>'; //!type.model.prototype.defaults.icon
          break;
        case 'svg':
          type.model.prototype.defaults.icon = '<i class="fa fa-diamond"></i>';
          break;
        case 'svg-in':
          type.model.prototype.defaults.icon = '<i class="fa fa-diamond"></i>';
          break;
        case 'nav':
          type.model.prototype.defaults.icon = '<i class="fa fa-location-arrow"></i>';
          break;
        case 'navbar':
          type.model.prototype.defaults.icon = '<i class="fa fa-map-signs"></i>';
          break;
        case 'navbar-container':
          type.model.prototype.defaults.icon = '<i class="fa fa-object-group"></i>';
          break;
        case 'navbar-menu':
          type.model.prototype.defaults.icon = '<i class="fa fa-bars"></i>';
          break;
        case 'burger-menu':
          type.model.prototype.defaults.icon = '<i class="fa fa-bars"></i>';
          break;
        case 'burger-line':
          type.model.prototype.defaults.icon = '<i class="fa fa-bars"></i>';
          break;
        case 'span':
          type.model.prototype.defaults.icon = '<i class="fa fa-columns"></i>';
          break;
        case 'countdown':
          type.model.prototype.defaults.icon = '<i class="fa fa-clock-o"></i>';
          break;
        case 'twitch':
          type.model.prototype.defaults.icon = '<i class="fa fa-twitch"></i>';
          break;
        case 'tooltip':
          type.model.prototype.defaults.icon = '<i class="fa fa-comment-o"></i>';
          break;
        case 'tabs':
          type.model.prototype.defaults.icon = '<i class="fa fa-list-alt"></i>';
          break;
        case 'tab':
          type.model.prototype.defaults.icon = '<i class="fa fa-long-arrow-right"></i>';
          break;
        case 'tab-container':
          type.model.prototype.defaults.icon = '<i class="fa fa-object-group"></i>';
          break;
        case 'tab-content':
          type.model.prototype.defaults.icon = '<i class="fa fa-align-center"></i>';
          break;
        case 'lory-slider':
          type.model.prototype.defaults.icon = '<i class="fa fa-sliders"></i>';
          break;
        case 'lory-frame':
          type.model.prototype.defaults.icon = '<i class="fa fa-window-maximize"></i>';
          break;
        case 'lory-slides':
          type.model.prototype.defaults.icon = '<i class="fa fa-file-powerpoint-o"></i>';
          break;
        case 'lory-slide':
          type.model.prototype.defaults.icon = '<i class="fa fa-play-circle-o"></i>';
          break;
        case 'lory-prev':
          type.model.prototype.defaults.icon = '<i class="fa fa-caret-square-o-left"></i>';
          break;
        case 'lory-next':
          type.model.prototype.defaults.icon = '<i class="fa fa-caret-square-o-right"></i>';
          break;
        case 'typed':
          type.model.prototype.defaults.icon = '<i class="fa fa-text-height"></i>';
          break;
        default:
          type.model.prototype.defaults.icon = '<i class="fa fa-cube"></i>';
      }
    });

    // Load and show settings and style manager
    const openTmBtn = pn.getButton('views', 'open-tm');
    openTmBtn && openTmBtn.set('active', 1);
    const openSm = pn.getButton('views', 'open-sm');
    openSm && openSm.set('active', 1);

    // Add Settings Sector
    let traitsSector = $(`<div class="gjs-sm-sector no-select">
      <div class="gjs-sm-title"><span class="icon-settings fa fa-cog"></span> Settings</div>
      <div class="gjs-sm-properties" style="display: none;"></div></div>`);
    const traitsProps = traitsSector.find('.gjs-sm-properties');
    traitsProps.append($('.gjs-trt-traits'));
    $('.gjs-sm-sectors').before(traitsSector);
    traitsSector.find('.gjs-sm-title').on('click', function () {
      let traitStyle = traitsProps.get(0).style;
      let hidden = traitStyle.display == 'none';
      if (hidden) {
        traitStyle.display = 'block';
      } else {
        traitStyle.display = 'none';
      }
    });

    // Body icon
    const openLm = pn.getButton('views', 'open-layers');
    openLm && openLm.set('active', 1);
    $('.gjs-layer-name')[0].innerHTML = '<i class="fa fa-cubes"></i> Body';

    // Open block manager
    const openBlocksBtn = pn.getButton('views', 'open-blocks');
    openBlocksBtn && openBlocksBtn.set('active', 1);

    editor.addComponents(
      `<div style="margin:100px; padding:25px;">
            Content loaded from the plugin
        </div>`, {
        at: 0
      }
    )
  });
};