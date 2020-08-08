import ColorThief from '../../node_modules/colorthief/dist/color-thief.mjs';

export default (editor, opts = {}) => {
    const colorthief = new ColorThief();
    const {
        commandId,
        labelColors,
        labelApply,
        paletteIcon,
        onAdd
    } = opts;

    // Update image component toolbar
    const domc = editor.DomComponents;
    const typeImage = domc.getType('image').model;
    domc.addType('image', {
        model: {
            initToolbar() {
                typeImage.prototype.initToolbar.apply(this, arguments);
                const tb = this.get('toolbar');
                const tbExists = tb.some(item => item.command === commandId);

                if (!tbExists) {
                    tb.unshift({
                        command: commandId,
                        label: paletteIcon,
                    });
                    this.set('toolbar', tb);
                }
            }
        }
    });

    // Add the palette add command
    editor.Commands.add(commandId, {
        run(ed, s, options = {}) {
            const {
                id
            } = this;

            this.editor = ed;
            this.target = options.target || ed.getSelected();
            const colorArr = colorthief.getColor(this.target.getEl());
            this.color = colorArr ? `rgb(${colorArr[0]},${colorArr[1]},${colorArr[2]})` : 'rgba(0,0,0)';
            const paletteArr = colorthief.getPalette(this.target.getEl(), 9);
            this.palette = paletteArr ? this.generateColorsFromArray(paletteArr) : ['rgba(0,0,0)'];
            const content = this.createContent(this.color, this.palette);
            const title = labelColors;
            const btn = content.children[1];
            ed.Modal.open({
                    title,
                    content
                })
                .getModel().once('change:open', () => ed.stopCommand(id));
            btn.onclick = () => this.addPalette();
            opts.addPalette(btn);
        },

        stop(ed) {
            //clear modal
            ed.Modal.close();
        },

        createContent(color, palette) {
            const content = document.createElement('div');
            let paletteSwatches = '';
            palette.forEach(col => paletteSwatches += `<div class="swatch" style="background-color: ${col}"></div>`);
            const colorOutput = `
            <div class="color-thief-output" style="display: block;">
                <div class="output-layout">
                    <div class="function get-color">
                        <h3 class="function-title">Dominant Color</h3>
                        <div class="swatches">
                            <div class="swatch" style="background-color: ${color}"></div>
                        </div>
                    </div>
                    <div class="function get-palette">
                        <h3 class="function-title">Palette</h3>
                        <div class="function-output">
                            <div class="swatches">
                                ${paletteSwatches}
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
            content.style = 'position: relative';
            content.innerHTML = `
                <div>${colorOutput}</div>
                <button class="tui-image-editor__apply-btn" style="
                position: absolute;
                top: 0; right: 0;
                margin: 10px;
                background-color: #fff;
                font-size: 1rem;
                border-radius: 3px;
                border: none;
                padding: 10px 20px;
                cursor: pointer
                ">
                ${labelApply}
                </botton>
            `;

            return content;
        },

        addPalette() {
            const {
                target,
                editor
            } = this;
            const sm = editor.StyleManager;

            !editor.Config.colorPicker && (editor.Config.colorPicker = {
                palette: []
            });
            let pickerPalette = editor.Config.colorPicker.palette;

            if (onAdd) {
                onAdd(target);
            } else {
                //add to colorpicker palette
                !(pickerPalette && pickerPalette.push(this.palette));
                opts.refreshPalette.forEach(input => this.refreshPickerPalette(sm, input));
                editor.stopCommand(commandId);
            }
        },

        /**
         * Refresh an input field i.e color so that the palette updates
         * @param {Object} sm StyleManager reference
         * @param {Object} input Info about input to refresh
         * @returns void
         */
        refreshPickerPalette(sm, input) {
            const coll = sm.getProperties(input.sector).models;
            const at = coll.indexOf(sm.getProperty(input.sector, input.property));
            sm.removeProperty(input.sector, input.property)
            sm.addProperty(input.sector, input, {
                at
            });
        },

        /**
         * Return rgb values for dominant color
         * @param {HTMLElement} img image element
         * @returns {Array} [Number, Number, Number]
         * @private
         */
        getDominantColor(img) {
            colorthief.getColor(img)
                .then(color => {
                    return color;
                })
                .catch(err => {
                    console.log(err)
                });
        },

        /**
         * Returns array rgb values for color palette
         * @param {HTMLElement} img image element
         * @returns {Array} [[Number, Number, Number], ...]
         * @private
         */
        getPaletteArray(img) {
            colorthief.getPalette(img, 9)
                .then(palette => {
                    return palette;
                })
                .catch(err => {
                    console.log(err)
                });
        },

        /**
         * convert palette values to colors
         * @param {Array} arr [[Number, Number, Number], ...]
         * @returns {Array} ['rgb(Number,Number,Number)', ...]
         * @private
         */
        generateColorsFromArray(arr) {
            const cols = [];
            arr.forEach(col => cols.push(`rgb(${col[0]},${col[1]},${col[2]})`));
            return cols;
        }
        //return/set color palette
    });
}