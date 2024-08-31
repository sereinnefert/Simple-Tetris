import createReducer from "./createReducers";
import * as types from "../action/types";


export const list = createReducer([], {

    [types.ADD_ITEM](state, action) {
        return [...state, action.item];
    },

    [types.DELETE_ALL_ITEMS](state, action) {

        return [];
    },
});


export const listSize = createReducer(0, {
    [types.ADD_ITEM](state, action) {

        return ++state;
    },

    [types.DELETE_ALL_ITEMS](state, action) {
        return 0;
    }
});