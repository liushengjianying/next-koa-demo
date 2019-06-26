export const user = {
  
};

export default function userReducer(state = user, action) {
  switch (action.type) {
    case "UPDATE_USER":
      return {
        ...state,
        ...action.userInfo
      }
    default:
      return state;
  }
}
