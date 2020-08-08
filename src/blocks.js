export default (editor, opts = {}) => {
  const bm = editor.BlockManager;

  bm.add('MY-BLOCK', {
    label: 'My block',
    category: 'Extra',
    attributes: {
      class: 'fa fa-cube'
    },
    content: {
      type: 'MY-COMPONENT'
    },
    // media: '<svg>...</svg>',
  });
}