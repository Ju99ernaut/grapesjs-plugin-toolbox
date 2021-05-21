import { gridCompId } from './consts'

export default (editor, opts = {}) => {
  const bm = editor.BlockManager;
  const { labelGrid, categoryGrid, gridBlock } = opts;

  gridBlock && bm.add(gridCompId, {
    label: labelGrid,
    media: '<svg viewBox="0 0 24 24"><rect fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" x="3" y="3" width="7" height="7"/><rect fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" x="14" y="3" width="7" height="7"/><rect fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" x="14" y="14" width="7" height="7"/><rect fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" x="3" y="14" width="7" height="7"/></svg>',
    category: categoryGrid,
    content: { type: gridCompId },
    ...gridBlock
  });
}