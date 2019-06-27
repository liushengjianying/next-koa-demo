export const user = {
  
};

export default function userReducer(state = user, action) {
  switch (action.type) {
    case "UPDATE_USER":
      return {
        ...state,
        ...action.userInfo
      }
    case "TO_LOGIN_OUT": 
      return {
        state: {}
      }
    default:
      return state;
  }
}
