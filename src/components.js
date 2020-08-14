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

  const addCellTrait = {
    name: 'addCell',
    //label: 'Add cell',
    type: 'button',
    full: true,
    text: 'Add Cell',
    command: editor => {
      const comp = editor.getSelected();
      comp && comp.components().add(`<div data-gjs-type="${gridChildId}"></div>`);
    }
  }

  const splitCellTrait = {
    name: 'splitCell',
    //label: 'Add cell',
    type: 'button',
    full: true,
    text: 'Split Cell',
    command: editor => {
      const comp = editor.getSelected();
      comp && comp.components().add([{
        tagName: 'div',
        name: 'cell-item',
        resizable: {
          tl: 0,
          tc: 0,
          tr: 0,
          cl: 0,
          cr: 1,
          bl: 0,
          br: 0,
          bc: 0,
          keyWidth: 'flex-basis',
          minDim: 1
        },
        style: {
          'min-height': '75px',
          'flex-grow': 1,
          'flex-basis': '100%'
        }
      }]);
    }
  }

  const copyCellTrait = {
    name: 'copyCell',
    //label: 'Add cell',
    type: 'button',
    full: true,
    text: 'Copy Cell',
    command: editor => {
      const comp = editor.getSelected();
      comp && comp.parent().components().add(comp.clone());
    }
  }

  const cellWidthTrait = {
    name: 'cellWidth',
    label: 'Cell Min',
    type: 'number',
    changeProp: 1,
    placeholder: '1',
    min: 1,
  }

  const cellHeightTrait = {
    name: 'cellHeight',
    label: 'Cell Height',
    type: 'number',
    changeProp: 1,
    placeholder: '1',
    min: 1,
  }

  domc.addType(gridChildId, {
    model: {
      defaults: {
        // ...
        traits: [
          idTrait,
          titleTrait,
          splitCellTrait,
        ],
        style: {
          display: 'flex',
          'justify-content': 'flex-start',
          'align-items': 'stretch',
          padding: '5px'
        },
        components: [{
          tagName: 'div',
          name: 'cell-item',
          traits: [
            idTrait,
            titleTrait,
            copyCellTrait,
          ],
          resizable: {
            tl: 0,
            tc: 0,
            tr: 0,
            cl: 0,
            cr: 1,
            bl: 0,
            br: 0,
            bc: 0,
            keyWidth: 'flex-basis',
            minDim: 1
          },
          style: {
            'min-height': '75px',
            'flex-grow': 1,
            'flex-basis': '100%'
          }
        }]
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
          cellWidthTrait,
          //cellHeightTrait,
          addCellTrait,
        ],
        style: {
          display: 'grid',
          padding: '10px',
          height: '400px',
          //'grid-template-rows': 'repeat(auto-fill, minmax(1fr, 150px))',
          'grid-template-columns': 'repeat(auto-fill, minmax(300px, 1fr))'
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
        components: `<div data-gjs-type="${gridChildId}"></div>
        <div data-gjs-type="${gridChildId}"></div>
        <div data-gjs-type="${gridChildId}"></div>
        <div data-gjs-type="${gridChildId}"></div>
        <div data-gjs-type="${gridChildId}"></div>
        <div data-gjs-type="${gridChildId}"></div>
        <div data-gjs-type="${gridChildId}"></div>
        <div data-gjs-type="${gridChildId}"></div>
        <div data-gjs-type="${gridChildId}"></div>`,
        cellWidth: 300,
        //cellHeight: 150
      },
      init() {
        this.on("change:cellWidth", this.updateCells);
        //this.on("change:cellHeight", this.updateHeight);
      },
      updateCells() {
        const cell = this.get('cellWidth');
        this.set('style', {
          'grid-template-columns': `repeat(auto-fill, minmax(${cell}px, 1fr))`
        });
      },
      updateHeight() {
        const cell = this.get('cellHeight');
        this.set('style', {
          'grid-template-rows': `repeat(auto-fill, minmax(1fr, ${cell}px))`
        });
      },
      ...gridComponent
    }
  });
};