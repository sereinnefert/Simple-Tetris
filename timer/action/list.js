import * as types from './types';
const Color = require("pigment/full");


export function addRandomItem() {

    const item = {
        color: Color.random().tohex()
    };

    return {
        type: types.ADD_ITEM,
        item,
    }
}


export function deleteAllItems() {

    return {
        type: types.DELETE_ALL_ITEMS,
    }
}
