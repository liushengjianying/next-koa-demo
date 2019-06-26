export const initialState = {
  count: 0
};

export default function countReducer(state = initialState, action) {

  switch (action.type) {
    case "ADD":
      return { count: state.count + (action.num || 1) };
    default:
      return state;
  }
}
