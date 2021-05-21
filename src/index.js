import loadComponents from './components';
import loadBlocks from './blocks';
import loadPanels from './panels';
import grid from './grid';
import { breadcrumbs, palette, resizer } from './utils';

export default (editor, opts = {}) => {
  const options = {
    ...{
      // use plugin panels
      panels: 0,
      // show canvas resizer
      resizer: 1,
      // show breadcrumbs
      breadcrumbs: 1,
      // label for grid block
      labelGrid: 'Grid',
      // category for grid block
      categoryGrid: 'Basic',
      // options to extend grid block
      gridBlock: {},
      // options to extend grid component model
      gridComponent: {},
      // options to extend cell component model
      cellComponent: {},
      // grid class name
      gridClass: 'grid',
      // grid cell class name
      gridCellClass: 'grid-cell',
      // cell item class name
      cellItemClass: 'cell-item',
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
      addPalette: () => { },
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
      }],
      // Minimum value the screen can be resized
      minScreenSize: 250,
      // Dampen the drag speed
      dragDampen: 1,
      // Hide if zoom is not 100
      hideOnZoom: 1,
      // Add settings to style manager
      traitsInSm: 1,
      // Icons Map
      icons: [{
        type: 'body',
        icon: '<i class="fa fa-cubes"></i>'
      },
      {
        type: 'wrapper',
        icon: '<i class="fa fa-cubes"></i>'
      },
      {
        type: 'custom-code',
        icon: '<i class="fa fa-code"></i>'
      },
      {
        type: 'script',
        icon: '<i class="fa fa-file-code-o"></i>'
      },
      {
        type: 'comment',
        icon: '<i class="fa fa-commenting-o"></i>'
      },
      {
        type: 'text',
        icon: '<i class="fa fa-i-cursor"></i>'
      },
      {
        type: 'textnode',
        icon: '<i class="fa fa-i-cursor"></i>'
      },
      {
        type: 'header',
        icon: '<i class="fa fa-header"></i>'
      },
      {
        type: 'box',
        icon: '<i class="fa fa-square-o"></i>'
      },
      {
        type: 'section',
        icon: '<i class="fa fa-object-group"></i>'
      },
      {
        type: 'link',
        icon: '<i class="fa fa-link"></i>'
      },
      {
        type: 'footer',
        icon: '<i class="fa fa-long-arrow-down"></i>'
      },
      {
        type: 'input',
        icon: '<i class="fa fa-keyboard-o"></i>'
      },
      {
        type: 'button',
        icon: '<i class="fa fa-square"></i>'
      },
      {
        type: 'image',
        icon: '<i class="fa fa-file-image-o"></i>'
      },
      {
        type: 'video',
        icon: '<i class="fa fa-file-video-o"></i>'
      },
      {
        type: 'row',
        icon: '<i class="fa fa-ellipsis-h"></i>'
      },
      {
        type: 'cell',
        icon: '<i class="fa fa-ellipsis-v"></i>'
      },
      {
        type: 'table',
        icon: '<i class="fa fa-table"></i>'
      },
      {
        type: 'thead',
        icon: '<i class="fa fa-header"></i>'
      },
      {
        type: 'tbody',
        icon: '<i class="fa fa-book"></i>'
      },
      {
        type: 'tfoot',
        icon: '<i class="fa fa-anchor"></i>'
      },
      {
        type: 'column',
        icon: '<i class="fa fa-ellipsis-v"></i>'
      },
      {
        type: 'map',
        icon: '<i class="fa fa-map-o"></i>'
      },
      {
        type: 'label',
        icon: '<i class="fa fa-tag"></i>'
      },
      {
        type: 'checkbox',
        icon: '<i class="fa fa-check-square-o"></i>'
      },
      {
        type: 'textarea',
        icon: '<i class="fa fa-align-left"></i>'
      },
      {
        type: 'select',
        icon: '<i class="fa fa-caret-square-o-down"></i>'
      },
      {
        type: 'radio',
        icon: '<i class="fa fa-dot-circle-o"></i>'
      },
      {
        type: 'form',
        icon: '<i class="fa fa-address-card-o"></i>'
      },
      {
        type: 'svg',
        icon: '<i class="fa fa-diamond"></i>'
      },
      {
        type: 'svg-in',
        icon: '<i class="fa fa-diamond"></i>'
      },
      {
        type: 'nav',
        icon: '<i class="fa fa-location-arrow"></i>'
      },
      {
        type: 'navbar',
        icon: '<i class="fa fa-map-signs"></i>'
      },
      {
        type: 'navbar-container',
        icon: '<i class="fa fa-object-group"></i>'
      },
      {
        type: 'navbar-menu',
        icon: '<i class="fa fa-bars"></i>'
      },
      {
        type: 'burger-menu',
        icon: '<i class="fa fa-bars"></i>'
      },
      {
        type: 'burger-line',
        icon: '<i class="fa fa-bars"></i>'
      },
      {
        type: 'span',
        icon: '<i class="fa fa-columns"></i>'
      },
      {
        type: 'countdown',
        icon: '<i class="fa fa-clock-o"></i>'
      },
      {
        type: 'twitch',
        icon: '<i class="fa fa-twitch"></i>'
      },
      {
        type: 'tooltip',
        icon: '<i class="fa fa-comment-o"></i>'
      },
      {
        type: 'tabs',
        icon: '<i class="fa fa-list-alt"></i>'
      },
      {
        type: 'tab',
        icon: '<i class="fa fa-long-arrow-right"></i>'
      },
      {
        type: 'tab-container',
        icon: '<i class="fa fa-object-group"></i>'
      },
      {
        type: 'tab-content',
        icon: '<i class="fa fa-align-center"></i>'
      },
      {
        type: 'lory-slider',
        icon: '<i class="fa fa-sliders"></i>'
      },
      {
        type: 'lory-frame',
        icon: '<i class="fa fa-window-maximize"></i>'
      },
      {
        type: 'lory-slides',
        icon: '<i class="fa fa-file-powerpoint-o"></i>'
      },
      {
        type: 'lory-slide',
        icon: '<i class="fa fa-play-circle-o"></i>'
      },
      {
        type: 'lory-prev',
        icon: '<i class="fa fa-caret-square-o-left"></i>'
      },
      {
        type: 'lory-next',
        icon: '<i class="fa fa-caret-square-o-right"></i>'
      },
      {
        type: 'typed',
        icon: '<i class="fa fa-text-height"></i>'
      },
      {
        type: 'default',
        icon: '<i class="fa fa-cube"></i>'
      }
      ]
    },
    ...opts
  };

  // Add components
  loadComponents(editor, options);
  // Add blocks
  loadBlocks(editor, options);
  // Add panels
  options.panels && loadPanels(editor, options);
  // Add breadcrumbs
  options.breadcrumbs && breadcrumbs(editor, options);
  // Add palette
  palette(editor, options);
  // Load resizer
  options.resizer && resizer(editor, options);
  // Load grid
  editor.Grid = grid(editor, options);

  editor.on('load', () => {
    const $ = editor.$;
    const pn = editor.Panels;
    const pfx = editor.Config.stylePrefix;
    const cmp = editor.Components;

    //? Map layer icons to components
    options.icons.forEach(icon => {
      try {
        cmp.getType(icon.type).model.prototype.defaults.icon = icon.icon;
      } catch (error) { }
    });

    // Load and show settings and style manager
    const openTmBtn = pn.getButton('views', 'open-tm');
    openTmBtn && openTmBtn.set('active', 1);
    const openSm = pn.getButton('views', 'open-sm');
    openSm && openSm.set('active', 1);

    // Add Settings Sector
    if (options.traitsInSm) {
      let traitsSector = $(`<div class="${pfx}sm-sector no-select">
      <div class="${pfx}sm-title"><span class="icon-settings fa fa-cog"></span> Settings</div>
      <div class="${pfx}sm-properties" style="display: none;"></div></div>`);
      const traitsProps = traitsSector.find(`.${pfx}sm-properties`);
      traitsProps.append($(`.${pfx}trt-traits`));
      $(`.${pfx}sm-sectors`).before(traitsSector);
      traitsSector.find(`.${pfx}sm-title`).on('click', function () {
        let traitStyle = traitsProps.get(0).style;
        let hidden = traitStyle.display == 'none';
        if (hidden) {
          traitStyle.display = 'block';
        } else {
          traitStyle.display = 'none';
        }
      });
      pn.removeButton('views', 'open-tm');
      $(`.${pfx}pn-views .${pfx}pn-btn`).css('width', `${100 / pn.getPanel('views').buttons.length}%`);
    }

    // Body icon
    const openLm = pn.getButton('views', 'open-layers');
    openLm && openLm.set('active', 1);
    $(`.${pfx}layer-name`)[0].innerHTML = '<i class="fa fa-cubes"></i> Body';
    openSm && openSm.set('active', 1);
  });
};