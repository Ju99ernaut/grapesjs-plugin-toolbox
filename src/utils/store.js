import { groupRepeatedUnits, createRepetition } from '../utils/repetition';

export default (editor, opts = {}) => {
    return {
        state: {
            auto: false,
            min: 200,
            columns: 5,
            rows: 5,
            columngap: 0,
            rowgap: 0,
            colArr: [],
            rowArr: [],
            childarea: []
        },
        getters: {
            colTemplate(state) {
                const unitGroups = groupRepeatedUnits(state.colArr);
                return createRepetition(unitGroups, state.min, state.auto);
            },
            rowTemplate(state) {
                const unitGroups = groupRepeatedUnits(state.rowArr);
                return createRepetition(unitGroups, state.min, false);
            },
            divNum(state) {
                return Math.max(state.columns, 0) * Math.max(state.rows, 0);
            }
        },
        mutations: {
            initialArrIndex(state, payload) {
                if (payload !== '') {
                    const queryParams = new URLSearchParams(payload);

                    for (const stateKey in state) {
                        const paramIsValid = queryParams.has(stateKey);
                        const paramType = typeof (state[stateKey]);

                        if (paramIsValid && paramType === 'number') {
                            state[stateKey] = queryParams.get(stateKey);
                        } else if (paramIsValid && paramType === 'object') {
                            state[stateKey] = JSON.parse(queryParams.get(stateKey));
                        }
                    }
                } else {
                    createArr(state.columns, state.colArr);
                    createArr(state.rows, state.rowArr);
                }
            },
            adjustArr(state, payload) {
                let newVal = Math.max(Number(payload.newVal), 0),
                    oldVal = Math.max(Number(payload.oldVal), 0);

                if (newVal < oldVal) {
                    // you'd think that .length would be quicker here, but it doesn't trigger the getter/computed in colTemplate etc.
                    let difference = oldVal - newVal;
                    for (let i = 1; i <= difference; i++) {
                        state[payload.direction].pop();
                    }
                } else {
                    let difference = newVal - oldVal;
                    for (let i = 1; i <= difference; i++) {
                        state[payload.direction].push({ unit: "1fr" });
                    }
                }
            },
            addChildren(state, payload) {
                state.childarea.push(payload);
            },
            removeChildren(state, payload) {
                state.childarea.splice(payload, 1);
            },
            updateAuto(state, payload) {
                state.auto = payload;
            },
            updateMin(state, payload) {
                state.min = payload;
            },
            updateColumns(state, payload) {
                state.columns = payload;
            },
            updateRows(state, payload) {
                state.rows = payload;
            },
            updateColumnGap(state, payload) {
                state.columngap = payload;
            },
            updateRowGap(state, payload) {
                state.rowgap = payload;
            },
            resetGrid(state, payload) {
                state.childarea = [];
            }
        }
    }
};

//we start off with just a few rows and columns filled with 1fr units
const createArr = (direction, arr) => {
    for (let i = 1; i <= direction; i++) {
        arr.push({ unit: "1fr" });
    }
};