import {
  gridCompId,
  gridChildId
} from './consts';
import {
  store
} from './utils';

export default (editor, opts = {}) => {
  const domc = editor.DomComponents;
  const pfx = editor.Config.stylePrefix;
  const {
    gridComponent,
    cellComponent,
    gridClass,
    gridCellClass,
    cellItemClass
  } = opts;

  const idTrait = {
    name: 'id',
    label: 'Id'
  }

  const titleTrait = {
    name: 'title',
    label: 'Title'
  }

  const privateCls = [`.${gridClass}`, `.${cellItemClass}`, `.${gridCellClass}`];
  editor.on(
    'selector:add',
    selector =>
    privateCls.indexOf(selector.getFullName()) >= 0 &&
    selector.set('private', 1)
  );

  const addCellTrait = {
    name: 'addCell',
    type: 'button',
    full: true,
    text: 'Add Cell',
    command: editor => {
      const comp = editor.getSelected();
      comp && comp.components().add(`<div data-${pfx}name="cell-item" class="${cellItemClass}" 
        data-${pfx}resizable='${JSON.stringify({
          tl: 0,
          tc: 0,
          tr: 0,
          cl: 0,
          cr: 1,
          bl: 0,
          br: 0,
          bc: 0,
          keyWidth: 'flex-basis',
          minDim: 1,
          step: 0.2,
          currentUnit: 1
        })}'></div>`);
      const cc = editor.Css;
      cc.getRule(`.${cellItemClass}`) || cc.setRule(`.${cellItemClass}`, {
        'min-height': '75px',
        'flex-grow': 1,
        'flex-basis': '100%'
      });
    }
  }

  const autoTrait = {
    name: 'auto',
    label: 'Auto Fill',
    type: 'checkbox',
    changeProp: 1,
  }

  const columnsTrait = {
    name: 'columns',
    label: 'Columns',
    type: 'number',
    changeProp: 1,
    placeholder: '6',
    min: 1,
  }

  const rowsTrait = {
    name: 'rows',
    label: 'Rows',
    type: 'number',
    changeProp: 1,
    placeholder: '6',
    min: 1,
  }

  const columnGapTrait = {
    name: 'columngap',
    label: 'Column Gap(px)',
    type: 'number',
    changeProp: 1,
    placeholder: '0',
    min: 0,
  }

  const rowGapTrait = {
    name: 'rowgap',
    label: 'Row Gap(px)',
    type: 'number',
    changeProp: 1,
    placeholder: '0',
    min: 0,
  }

  const minTrait = {
    name: 'min',
    label: 'Min(px)',
    type: 'number',
    changeProp: 1,
    placeholder: '0',
    min: 1,
  }

  const resetTrait = {
    name: 'reset',
    type: 'button',
    full: true,
    text: 'Reset',
    command: editor => {
      const store = editor.Grid.selected.get('store');
      store.mutations.resetGrid(store.state);
      editor.Grid.updateChildren(store);
    }
  }

  const updateTrait = {
    name: 'update',
    type: 'button',
    full: true,
    text: 'Update',
    command: editor => {
      //Generate html and css
      const sel = editor.getSelected();
      const {
        state,
        getters
      } = sel.get('store');
      let grid = state.auto ? Array(state.rows * state.columns).fill().map(i => {
          return `<div data-${pfx}type="${gridChildId}"></div>`
        }).join("") :
        state.childarea.map((area, i) => {
          return `<div data-${pfx}type="${gridChildId}" class="${sel.getId() + '-div' + i}"></div>
            <style>.${sel.getId() + '-div' + i}{grid-area:${area}}</style>`
        }).join("");
      const css = state.childarea.map((area, i) => {
        return `.${sel.getId() + '-div' + i}{grid-area:${area}}`
      }).join("");
      sel.components().length > 0 ? sel.components().add(`<style>${generateMedia(css)}</style>`) :
        sel.components().reset(grid);
      (editor.Grid.visible = false) || (editor.Grid.getEl().style.display = 'none');
      sel.addStyle({
        'grid-template-columns': getters.colTemplate(state)
      });
    }
  }

  const generateMedia = (css) => {
    const device = editor.Devices.get(editor.getDevice());
    if (device !== '' || device !== 'Desktop') {
      return `@media (max-width: ${device.get('widthMedia')}){
        ${css}
      }`
    } else {
      return css
    }
  }

  domc.addType(gridChildId, {
    model: {
      defaults: {
        icon: '<i class="fa fa-square-o"></i>',
        traits: [
          idTrait,
          titleTrait,
          addCellTrait,
        ],
      },
      init() {
        const cc = editor.Css;
        this.get('classes').pluck('name').indexOf(gridCellClass) < 0 && this.addClass(gridCellClass);
        cc.getRule(`.${gridCellClass}`) || cc.setRule(`.${gridCellClass}`, {
          display: 'flex',
          'justify-content': 'flex-start',
          'align-items': 'stretch',
          padding: '5px'
        });
      },
      ...cellComponent
    }
  });

  const toolbar = [{
    attributes: {
      class: 'fa fa-table'
    },
    command: e => {
      if (!e.getSelected().get('auto')) {
        e.Grid.visible = !e.Grid.visible;
        e.Grid.update(e.Grid.selected.get('store'));
      }
    }
  }, {
    attributes: {
      class: 'fa fa-arrow-up'
    },
    command: e => e.runCommand('core:component-exit', {
      force: 1
    })
  }, {
    attributes: {
      class: 'fa fa-arrows gjs-no-touch-actions',
      draggable: true
    },
    command: 'tlb-move'
  }, {
    attributes: {
      class: 'fa fa-clone'
    },
    command: 'tlb-clone'
  }, {
    attributes: {
      class: 'fa fa-trash-o'
    },
    command: 'tlb-delete'
  }]

  domc.addType(gridCompId, {
    model: {
      defaults: {
        // Default props
        icon: '<i class="fa fa-table"></i>',
        toolbar,
        traits: [
          idTrait,
          titleTrait,
          autoTrait,
          minTrait,
          columnsTrait,
          rowsTrait,
          columnGapTrait,
          rowGapTrait,
          resetTrait,
          updateTrait
        ],
        resizable: {
          tl: 0,
          tc: 0,
          tr: 0,
          cl: 0,
          cr: 0,
          bl: 0,
          br: 0,
          minDim: 5
        },
        min: 200,
        auto: false
      },
      init() {
        const cc = editor.Css;
        const st = store(opts);
        st.mutations.initialArrIndex(st.state, '');
        this.set('rows', st.state.rows);
        this.set('columns', st.state.columns);
        this.set('rowgap', st.state.rowgap);
        this.set('columngap', st.state.columngap);
        this.set('store', st);
        this.addStyle({
          'grid-template-rows': st.getters.rowTemplate(st.state),
          'grid-template-columns': st.getters.colTemplate(st.state),
        });
        this.get('classes').pluck('name').indexOf(gridClass) < 0 && this.addClass(gridClass);
        cc.getRule(`.${gridClass}`) || cc.setRule(`.${gridClass}`, {
          display: 'grid',
          padding: '10px',
          height: '95%',
          width: '100%',
        });
        if (!editor.Grid.container || !editor.Grid.el) editor.Grid.render(`#${pfx}tools`, st);
        editor.Grid.update(st);
        this.on("change:auto", this.updateAuto);
        this.on("change:rows", this.updateRows);
        this.on("change:columns", this.updateColumns);
        this.on("change:rowgap", this.updateRowgap);
        this.on("change:columngap", this.updateColumngap);
        this.on("change:min", this.updateMin);
        this.on("change:status", this.onStatusChange);
      },
      updateRows() {
        const rows = parseInt(this.get('rows'));
        const store = this.get('store');
        const payload = {
          newVal: rows,
          oldVal: store.state.rows,
          direction: "rowArr"
        };
        store.mutations.updateRows(store.state, rows);
        store.mutations.adjustArr(store.state, payload);
        editor.Grid.update(store);
        this.addStyle({
          'grid-template-rows': store.getters.rowTemplate(store.state)
        });
      },
      updateColumns() {
        const columns = parseInt(this.get('columns'));
        const store = this.get('store');
        const payload = {
          newVal: columns,
          oldVal: store.state.columns,
          direction: "colArr"
        };
        store.mutations.updateColumns(store.state, columns);
        store.mutations.adjustArr(store.state, payload);
        editor.Grid.update(store);
        this.addStyle({
          'grid-template-columns': store.getters.colTemplate(store.state)
        });
      },
      updateRowgap() {
        const rowgap = this.get('rowgap');
        const store = this.get('store');
        store.mutations.updateRowGap(store.state, parseInt(rowgap));
        editor.Grid.updateChildren(store);
        this.addStyle({
          'grid-row-gap': `${rowgap}px`
        });
      },
      updateColumngap() {
        const columngap = this.get('columngap');
        const store = this.get('store');
        store.mutations.updateColumnGap(store.state, parseInt(columngap));
        editor.Grid.updateChildren(store);
        this.addStyle({
          'grid-column-gap': `${columngap}px`
        });
      },
      updateMin() {
        const min = parseInt(this.get('min'));
        const store = this.get('store');
        store.mutations.updateMin(store.state, min);
      },
      updateAuto() {
        const auto = !!this.get('auto');
        const store = this.get('store');
        store.mutations.updateAuto(store.state, auto);
        if (auto)(editor.Grid.visible = false) || (editor.Grid.getEl().style.display = 'none');
      },
      onStatusChange() {
        const status = this.get('status');
        if (status === 'selected') editor.Grid.select(editor.getSelected());
        else(editor.Grid.visible = false) || (editor.Grid.getEl().style.display = 'none');
      },
      ...gridComponent
    }
  });
};