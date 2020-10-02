import {
    store
} from './utils';

export default (editor, opts = {}) => {
    const {
        state,
        getters,
        mutations
    } = store(opts);
    const {
        $
    } = editor;

    return {
        state,
        getters,
        mutations,
        gridEl() {
            const el = $(`<div id="main">
                <section
                style="grid-template-columns:${this.getters.colTemplate(this.state)};grid-template-rows:50px;
                grid-column-gap:${this.state.columngap + 'px'};grid-row-gap:${this.state.rowgap + 'px'}"
                class="colunits"
                >
                    ${this.state.colArr.map((col, i) => `<div data-key="${i}">
                        <input
                        value="${col.unit}"
                        data-key="${i}"
                        data-direction="col"
                        class="${this.state.columns > 8 ? this.widthfull : ''}"
                        aria-label="Grid Template Column Measurements"
                        >
                    </div>`).join("")}
                </section>
        
                <section
                style="grid-template-columns:50px;grid-template-rows:${this.getters.rowTemplate(this.state)};
                    grid-column-gap:${this.state.columngap + 'px'};grid-row-gap:${this.state.rowgap + 'px' }"
                class="rowunits"
                >
                    ${this.state.rowArr.map((row, i) => `<div data-key="${i}">
                        <input
                        value="${row.unit}"
                        data-key="${i}"
                        data-direction="row"
                        aria-label="Grid Template Row Measurements"
                        >
                    </div>`).join("")}
                </section>
        
                <div id="gridcontainer">
                </div>
                <!--gridcontainer-->
            </div>`);
            const inputs = el.find('input');
            inputs.on('change', e => {
                this.validateunit(e)
            });
            const gridcontainer = el.find('#gridcontainer');
            const gridsection = $(`<section
                class="grid"
                style="grid-template-columns:${this.getters.colTemplate(this.state)};grid-template-rows:${this.getters.rowTemplate(this.state)};
                    grid-column-gap:${this.state.columngap + 'px'};grid-row-gap:${this.state.rowgap + 'px' }"
                >
                ${Array(this.getters.divNum(this.state)).fill().map((item, i) => `<div
                    data-key="${i}"
                    class="box${i}"
                    >
                </div>`).join("")}
            </section>`);
            gridsection.on('ontouchstart.prevent', e => this.delegatedTouchPlaceChild(e));
            gridsection.on('ontouchend.prevent', e => this.delegatedTouchPlaceChild(e));
            const place = gridsection.find('div');
            place.on('mousedown', e => this.placeChild(e, 's'));
            place.on('mouseup', e => this.placeChild(e, 'e'));
            const gridchild = $(`<section
                class="grid gridchild"
                style="grid-template-columns:${this.getters.colTemplate(this.state)};grid-template-rows:${this.getters.rowTemplate(this.state)}; 
                    grid-column-gap:${this.state.columngap + 'px'};grid-row-gap:${this.state.rowgap + 'px' }"
                >
                ${this.state.childarea.map((child, i) => `<div
                    class="child${i}"
                    style="grid-area: ${child}"
                    >
                    <button data-key="${i}">&times;</button>
                </div>`).join("")}
            </section>`);
            const del = gridchild.find('button');
            del.on('click', e => this.removeChild(e));
            gridcontainer.append(gridsection);
            gridcontainer.append(gridchild);
            return el;
        },
        render(cont) {
            if (!this.el) {
                this.mutations.initialArrIndex(this.state, '')
                if (typeof cont === 'string') {
                    this.el = this.gridEl();
                    this.container = $(cont)
                    this.container.append(this.el);
                } else {
                    this.el = this.gridEl();
                    this.container = container;
                    cont.appendChild(this.el);
                }
            }
        },
        getEl() {
            return this.el.get(0);
        },
        update() {
            //Refresh the grid
            this.el = this.gridEl();
            this.container.html ? this.container.html('') : (this.container.innerHTML = '');
            this.container.append ? this.container.append(this.el) : this.container.appendChild(this.el);
        },
        child: {},
        widthfull: "widthfull",
        errors: {
            col: [],
            row: []
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
                this.errors[direction].splice(this.errors[direction].indexOf(i), 1);
                if (direction === 'col') this.state.colArr[i].unit = unit;
                else this.state.rowArr[i].unit = unit;
                this.update();
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
            const item = parseInt(ev.target.getAttribute('data-key')) + 1;
            //built an object first because I might use this for something else
            this.child[`${startend}row`] = Math.ceil(item / this.state.columns);
            this.child[`${startend}col`] =
                item - (this.child[`${startend}row`] - 1) * this.state.columns;
            //create the children css units as a string
            if (startend === "e") {
                // flip starts and ends if dragged in the opposite direction
                let [startRow, endRow] =
                this.child.srow <= this.child.erow ? [this.child.srow, this.child.erow] : [this.child.erow, this.child.srow];
                let [startCol, endCol] =
                this.child.scol <= this.child.ecol ? [this.child.scol, this.child.ecol] : [this.child.ecol, this.child.scol];
                let childstring = `${startRow} / ${startCol} / ${endRow +
                1} / ${endCol + 1}`;
                this.mutations.addChildren(this.state, childstring);
            }
            this.update();
        },
        removeChild(ev) {
            const index = ev.target.getAttribute('data-key');
            this.mutations.removeChildren(this.state, index);
            this.update();
        }
    }
};