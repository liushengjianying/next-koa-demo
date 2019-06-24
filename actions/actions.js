
export const actionTypes = {
    ADD: 'ADD',
    ASYNC_ADD: 'ASYNC_ADD',
    UPDATE_USERNAME: 'UPDATE_USERNAME'
}

export function add(num) {
    return {
        type: actionTypes.ADD,
        num
    }
}

export function asyncAdd(num) {
    return {
        type: actionTypes.ASYNC_ADD,
        num
    }
}

export function rename(name) {
    return {
        type: actionTypes.UPDATE_USERNAME,
        name
    }
}