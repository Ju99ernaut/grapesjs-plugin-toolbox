// Based on https://github.com/sdras/cssgridgenerator

export default (editor, opts = {}) => {
    const { $ } = editor;
    const pfx = editor.Config.stylePrefix;

    return {
        gridEl(store) {
            const { width, height, top } = this.dimensions();
            const el = $(`<div id="${pfx}grid-main" style="display:${this.visible ? 'block' : 'none'};width:${width - 6}px;height:${height - 6}px">
                <div id="${pfx}gridcontainer">
                </div>
            </div>`);
            const gridcontainer = el.find(`#${pfx}gridcontainer`);
            el.prepend(this.gridColUnits(store, width, height, top));
            el.prepend(this.gridRowUnits(store));
            gridcontainer.append(this.gridCanvas(store));
            gridcontainer.append(this.gridCanvasChildren(store));
            return el;
        },
        gridColUnits(store, width, height, top) {
            const colunits = $(`<section
                style="width:${width - 6}px;top:${top < 40 ? height : -40}px;grid-template-columns:${store.getters.colTemplate(store.state)};grid-template-rows:50px;
                grid-column-gap:${store.state.columngap + 'px'};grid-row-gap:${store.state.rowgap + 'px'}"
                class="${pfx}colunits"
                >
                    ${store.state.colArr.map((col, i) => `<div data-key="${i}">
                        <input
                        value="${col.unit}"
                        data-key="${i}"
                        data-direction="col"
                        class="${store.state.columns > 8 ? this.widthfull : this.widthhalf}"
                        aria-label="Grid Template Column Measurements"
                        >
                    </div>`).join("")}
                </section>`);

            const inputscol = colunits.find('input');
            inputscol.on('change', e => this.validateunit(e));

            return colunits
        },
        gridRowUnits(store) {
            const rowunits = $(`<section
                style="grid-template-columns:50px;grid-template-rows:${store.getters.rowTemplate(store.state)};
                    grid-column-gap:${store.state.columngap + 'px'};grid-row-gap:${store.state.rowgap + 'px'}"
                class="${pfx}rowunits"
                >
                    ${store.state.rowArr.map((row, i) => `<div data-key="${i}">
                        <input
                        value="${row.unit}"
                        data-key="${i}"
                        data-direction="row"
                        class="${this.widthfull}"
                        aria-label="Grid Template Row Measurements"
                        >
                    </div>`).join("")}
                </section>`);

            const inputsrow = rowunits.find('input');
            inputsrow.on('change', e => this.validateunit(e));

            return rowunits;
        },
        gridCanvas(store) {
            const gridsection = $(`<section
                class="${pfx}grid ${pfx}gridcanvas"
                style="grid-template-columns:${store.getters.colTemplate(store.state)};grid-template-rows:${store.getters.rowTemplate(store.state)};
                    grid-column-gap:${store.state.columngap + 'px'};grid-row-gap:${store.state.rowgap + 'px'}"
                >
                ${Array(store.getters.divNum(store.state)).fill().map((item, i) => `<div
                    data-key="${i}"
                    class="box${i}"
                    >
                </div>`).join("")}
            </section>`);
            gridsection.on('ontouchstart', e => {
                e.preventDefault();
                this.delegatedTouchPlaceChild(e);
            });
            gridsection.on('ontouchend', e => {
                e.preventDefault();
                this.delegatedTouchPlaceChild(e);
            });
            const place = gridsection.find('div');
            place.on('mousedown', e => this.placeChild(e, 's'));
            place.on('mouseup', e => this.placeChild(e, 'e'));

            return gridsection;
        },
        gridCanvasChildren(store) {
            const gridchild = $(`<section
                class="${pfx}grid ${pfx}gridchild"
                style="grid-template-columns:${store.getters.colTemplate(store.state)};grid-template-rows:${store.getters.rowTemplate(store.state)}; 
                    grid-column-gap:${store.state.columngap + 'px'};grid-row-gap:${store.state.rowgap + 'px'}"
                >
                ${store.state.childarea.map((child, i) => `<div
                    class="child${i}"
                    style="grid-area: ${child}"
                    >
                    <button data-key="${i}">&times;</button>
                </div>`).join("")}
            </section>`);
            const del = gridchild.find('button');
            del.on('click', e => this.removeChild(e));

            return gridchild;
        },
        render(cont, store) {
            if (!this.el) {
                this.el = this.gridEl(store);
                this.container = $(cont);
                this.container.append(this.el);
                editor.on('styleManager:change:height run:smoothresize run:resize', () => {
                    const st = editor.getSelected().get('store');
                    st && editor.Grid.visible && editor.Grid.update(st);
                });
            }
        },
        getEl() {
            return this.el.get(0);
        },
        select(selected) {
            this.selected = selected;
        },
        update(store) {
            this.el = this.gridEl(store);
            $(`#${pfx}grid-main`).replaceWith(this.el);
        },
        updateRows(store) {
            $(`.${pfx}rowunits`).replaceWith(this.gridRowUnits(store));
        },
        updateCols(store) {
            const { width, height, top } = this.dimensions();
            $(`.${pfx}colunits`).replaceWith(this.gridRowUnits(store, width, height, top));
        },
        updateCanvas(store) {
            $(`.${pfx}gridcanvas`).replaceWith(this.gridCanvas(store));
        },
        updateChildren(store) {
            $(`.${pfx}gridchild`).replaceWith(this.gridCanvasChildren(store));
        },
        child: {},
        widthfull: `${pfx}widthfull`,
        widthhalf: `${pfx}widthhalf`,
        errors: { col: [], row: [] },
        visible: false,
        dimensions() {
            return (this.selected && editor.Canvas.getElementPos(this.selected.getEl())) || {
                width: 100,
                height: 100
            }
        },
        validateunit(e) {
            const unit = e.target.value;
            const i = e.target.getAttribute('data-key');
            const direction = e.target.getAttribute('data-direction');
            const check =
                /fr$/.test(unit) ||
                /px$/.test(unit) ||
                /%$/.test(unit) ||
                /em$/.test(unit) ||
                /rem$/.test(unit) ||
                /vw$/.test(unit) ||
                /vh$/.test(unit) ||
                /vmin$/.test(unit) ||
                /q$/.test(unit) ||
                /mm$/.test(unit) ||
                /cm$/.test(unit) ||
                /in$/.test(unit) ||
                /pt$/.test(unit) ||
                /pc$/.test(unit) ||
                /ex$/.test(unit) ||
                /ch$/.test(unit) ||
                /minmax/.test(unit) || ["auto", "min-content", "max-content"].includes(unit) ||
                parseInt(unit, 10) === 0; // allow 0 as a valid value without a unit
            if (!check) {
                this.errors[direction].push(i);
            } else {
                const store = this.selected.get('store');
                this.errors[direction].splice(this.errors[direction].indexOf(i), 1);
                if (direction === 'col') {
                    store.state.colArr[i].unit = unit;
                    this.selected.addStyle({
                        'grid-template-columns': store.getters.colTemplate(store.state)
                    });
                } else {
                    store.state.rowArr[i].unit = unit;
                    this.selected.addStyle({
                        'grid-template-rows': store.getters.rowTemplate(store.state)
                    });
                }
                this.update(store);
            }
        },
        delegatedTouchPlaceChild(ev) {
            const target = document.elementFromPoint(
                ev.changedTouches[0].clientX,
                ev.changedTouches[0].clientY
            );
            const startend = ev.type === "touchstart" ? "s" : "e";
            this.placeChild(target.dataset.id, startend);
        },
        placeChild(ev, startend) {
            const store = this.selected.get('store');
            const item = parseInt(ev.target.getAttribute('data-key')) + 1;
            //built an object first because I might use this for something else
            this.child[`${startend}row`] = Math.ceil(item / store.state.columns);
            this.child[`${startend}col`] =
                item - (this.child[`${startend}row`] - 1) * store.state.columns;
            //create the children css units as a string
            if (startend === "e") {
                // flip starts and ends if dragged in the opposite direction
                let [startRow, endRow] =
                    this.child.srow <= this.child.erow ? [this.child.srow, this.child.erow] : [this.child.erow, this.child.srow];
                let [startCol, endCol] =
                    this.child.scol <= this.child.ecol ? [this.child.scol, this.child.ecol] : [this.child.ecol, this.child.scol];
                let childstring = `${startRow} / ${startCol} / ${endRow +
                    1} / ${endCol + 1}`;
                store.mutations.addChildren(store.state, childstring);
            }
            this.updateChildren(store);
        },
        removeChild(ev) {
            const store = this.selected.get('store');
            const index = ev.target.getAttribute('data-key');
            store.mutations.removeChildren(store.state, index);
            this.updateChildren(store);
        }
    }
};