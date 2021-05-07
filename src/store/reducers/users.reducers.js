const initState = {};
const usersReducer = (state = initState, action) => {
  switch (action.type) {
    case "LOAD_COMMUNITY_USERS": // Successful login, user extra details were verified from user profiles //
      console.log(`Loaded users of ${action.id} community`);
      return {
        ...state,
        [`users@${action.id}`]: action.data,
      };
    case "LOAD_USER_DETAILS": // Successful login, user extra details were verified from user profiles //
      console.log(`Loaded details of ${action.id} user`);
      return {
        ...state,
        [`userDetails@${action.id}`]: action.data,
      };
    default:
      return state;
  }
};
export default usersReducer;
