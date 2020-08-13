import {
  gridCompId,
  gridChildId
} from './consts';

export default (editor, opts = {}) => {
  const domc = editor.DomComponents;
  const {
    gridComponent,
    cellComponent
  } = opts;

  const idTrait = {
    name: 'id',
    label: 'Id'
  }

  const titleTrait = {
    name: 'title',
    label: 'Title'
  }

  const addColumnTrait = {
    name: 'addColumn',
    label: 'Column',
    type: 'button',
    full: true,
    text: 'Add',
    command: editor => {
      const comp = editor.getSelected();
      comp && comp.set('columns', parseInt(comp.get('columns')) + 1);
    }
  }

  const addRowTrait = {
    name: 'addRow',
    label: 'Row',
    type: 'button',
    full: true,
    text: 'Add',
    command: editor => {
      const comp = editor.getSelected();
      comp && comp.set('rows', parseInt(comp.get('rows')) + 1);
    }
  }

  const columnsTrait = {
    name: 'columns',
    label: 'Columns',
    type: 'number',
    changeProp: 1,
    placeholder: '1',
    default: 3,
    min: 1,
  }

  const rowsTrait = {
    name: 'rows',
    label: 'Rows',
    type: 'number',
    changeProp: 1,
    placeholder: '1',
    default: 3,
    min: 1,
  }

  domc.addType(gridChildId, {
    model: {
      defaults: {
        // ...
      },
      ...cellComponent
    }
  })

  domc.addType(gridCompId, {
    model: {
      defaults: {
        // Default props
        traits: [
          idTrait,
          titleTrait,
          columnsTrait,
          addColumnTrait,
          rowsTrait,
          addRowTrait,
        ],
        style: {
          display: 'grid',
          padding: '8px',
          height: '400px',
          'grid-template-rows': '1fr 1fr 1fr',
          'grid-template-columns': '1fr 1fr 1fr'
        },
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
        components: `<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>`,
        rows: 3,
        columns: 3,
      },
      init() {
        this.on("change:rows", this.updateRows);
        this.on("change:columns", this.updateColumns);
      },
      updateRows() {
        const rows = parseInt(this.get('rows'));
        const cols = parseInt(this.get('columns'));
        let templateRows = '';
        let comps = '';
        for (let i = 0; i < rows; i++) templateRows += '1fr ';
        const len = (rows * cols) - this.components().length;
        if (len > 0)
          for (let i = 0; i < len; i++) comps += '<div></div>';
        else
          for (let i = 0; i > len; i--) this.components().pop();
        this.set('style', {
          'grid-template-rows': templateRows
        });
        comps.length && this.components().add(comps);
      },
      updateColumns() {
        const rows = parseInt(this.get('rows'));
        const cols = parseInt(this.get('columns'));
        let templateCols = '';
        let comps = '';
        for (let i = 0; i < cols; i++) templateCols += '1fr ';
        const len = (rows * cols) - this.components().length;
        if (len > 0)
          for (let i = 0; i < len; i++) comps += '<div></div>';
        else
          for (let i = 0; i > len; i--) this.components().pop();
        this.set('style', {
          'grid-template-columns': templateCols
        });
        comps.length && this.components().add(comps);
      },
      ...gridComponent
    },
    //view: {
    //  init() {
    //    this.listenTo(this.model, 'change:rows change:columns', this.render)
    //  }
    //}
  });
};