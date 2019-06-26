
export const actionTypes = {
    UPDATE_USER: 'UPDATE_USER',
    LOGOUT: 'LOGOUT'
}

export function updateUser(userInfo) {
    return {
        type: actionTypes.UPDATE_USER,
        userInfo
    }
}

export function logout() {
    return {
        type: actionTypes.LOGOUT
    }
}