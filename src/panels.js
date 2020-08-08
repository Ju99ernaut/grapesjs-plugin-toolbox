import {
    cmdSave
} from './consts';

export default (editor, config) => {
    const cm = editor.Commands;
    const pn = editor.Panels;
    const um = editor.UndoManager;

    cm.add(cmdSave, e => {
        editor.store(res => {
            console.log("Saved...")
        });
    });

    const pnOptions = pn.getPanel('options');
    pnOptions.get('buttons').add([{
        id: 'undo',
        className: 'fa fa-undo', //reply
        attributes: {
            title: 'undo',
        },
        command: e => e.runCommand('core:undo'),
    }, {
        id: 'redo',
        className: 'fa fa-repeat', //share
        attributes: {
            title: 'redo',
        },
        command: e => e.runCommand('core:redo'),
    }, {
        id: cmdSave,
        className: 'fa fa-floppy-o',
        attributes: {
            title: 'save',
        },
        command: e => e.runCommand(cmdSave),
    }]);

    const undoBtn = pn.getButton('options', 'undo');
    const redoBtn = pn.getButton('options', 'redo');
    const saveBtn = pn.getButton('options', cmdSave);

    editor.on('component:update', () => {
        um.hasUndo() ? undoBtn.set('className', 'font-aqua fa fa-undo') : undoBtn.set('className', 'fa fa-undo');
        um.hasRedo() ? redoBtn.set('className', 'font-aqua fa fa-repeat') : redoBtn.set('className', 'fa fa-repeat');
        editor.getDirtyCount() > 0 ? saveBtn.set('className', 'font-green fa fa-floppy-o') : saveBtn.set('className', 'fa fa-floppy-o');
    });
}