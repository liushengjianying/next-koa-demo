export const user = {
  username: "jocky"
};

export default function userReducer(state = user, action) {
  switch (action.type) {
    case "UPDATE_USERNAME":
      return {
        ...state,
        username: action.name
      };
    default:
      return state;
  }
}
