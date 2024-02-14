export const initialState = {
  user: null,
  isAuth:false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      console.log(action)
      return {
        ...state,
        user: action.user,
      };
      case "SET_AUTH":
        return {
          ...state,
          isAuth: action.isAuth,
        };
    default:
      return state;
  }
};

export default reducer;
