const initState = {
  authSuccess: null,
  authError: null,
};
const authReducer = (state = initState, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS": // Successful login, user extra details were verified from user profiles //
      console.log("You have logged in successfully");
      return {
        ...state,
        authSuccess: "You have logged in successfully",
        authError: null,
      };
    case "LOGIN_ERROR": // Unsuccessful login, user did not provide valid details //
      console.error(action.error.message);
      return { ...state, authSuccess: null, authError: action.error.message };
    case "LOGOUT_SUCCESS": // Successful logout, valid user logged out //
      console.log("You have logged out successfully");
      return {
        ...state,
        authSuccess: "You have logged out successfully",
        authError: null,
      };
    case "LOGOUT_ERROR": // Unsuccessful logout, user was not logged out //
      console.error(action.error.message);
      return { ...state, authSuccess: null, authError: action.error.message };
    default:
      // Default case //
      return state;
  }
};
export default authReducer;
